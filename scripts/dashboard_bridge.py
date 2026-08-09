#!/usr/bin/env python
"""Threatenx dashboard bridge — streams any incident scenario to the UI over WebSocket.

Architecture:  Browser  ⇄ (WebSocket)  ⇄  this bridge  ⇄ (agents / Band) ⇄  mesh

The dashboard tells the bridge which scenario to run (POST /api/trigger); the
bridge spins it up and streams each agent message over the WebSocket as the
cascade unfolds. Band keys stay server-side.

Modes (THREATENX_BRIDGE_MODE):
  * simulate (default) — run the 7 agent brains for the chosen scenario in-process
    (real Gemini/Groq calls, with graceful fallback) and stream messages live.
    Reliable, no live-mesh dependency: the recommended demo path.
  * live — create a real Band room for the scenario, post the bootstrap, then poll
    the live transcript and stream it. Requires the 7 workers (start_agents.sh).

Endpoints (aiohttp, CORS-open):
  GET  /health              -> {ok, mode, active_scenario, room_id}
  GET  /scenarios           -> [scenario.to_public(), ...]
  POST /api/trigger {scenario_id} -> reset + run the scenario; returns {room_id}
  POST /message {content}   -> post an operator message into the room
  WS   /ws                  -> snapshot, then {type: reset|message|dossier} events

    python scripts/dashboard_bridge.py                        # simulate (default)
    THREATENX_BRIDGE_MODE=live python scripts/dashboard_bridge.py
"""

from __future__ import annotations

import asyncio
import contextlib
import json
import logging
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from aiohttp import WSMsgType, web
from dotenv import load_dotenv

from threatenx.brain import AgentBrain, Turn
from threatenx.config import AGENTS
from threatenx.mock_mesh import MockMesh
from threatenx.scenario import DEFAULT_SCENARIO_ID, get_scenario, list_scenarios

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("threatenx.bridge")

MODE = os.getenv("THREATENX_BRIDGE_MODE", "simulate").lower()
PORT = int(os.getenv("PORT", os.getenv("THREATENX_BRIDGE_PORT", "8787")))
POLL_SECONDS = float(os.getenv("THREATENX_POLL_SECONDS", "1.5"))
PACE_SECONDS = float(os.getenv("THREATENX_PACE_SECONDS", "0.7"))

_LLM_BY_NAME = {p.name: p.llm for p in AGENTS.values()}


class Bridge:
    """Holds incident state and fans messages out to all connected dashboards."""

    def __init__(self) -> None:
        self.mode = MODE
        self.active_scenario_id = DEFAULT_SCENARIO_ID
        self.room_id: str | None = None
        self.feed: list[dict] = []
        self.dossier: dict | None = None
        self.clients: set[web.WebSocketResponse] = set()
        self._seen: set[str] = set()
        self._task: asyncio.Task | None = None
        self._poller: asyncio.Task | None = None
        self._client = None  # Band REST client (live mode only)

    # ── Fan-out to all connected WS clients ──────────────────────────────────

    async def broadcast(self, payload: dict) -> None:
        for ws in list(self.clients):
            try:
                await ws.send_json(payload)
            except Exception:  # noqa: BLE001
                self.clients.discard(ws)

    async def add_entry(self, entry: dict) -> None:
        self.feed.append(entry)
        await self.broadcast({"type": "message", "entry": entry})
        if entry.get("is_dossier") and self.dossier is None:
            self.dossier = entry.get("payload") or get_scenario(
                self.active_scenario_id
            ).build_dossier().model_dump(mode="json")
            await self.broadcast({"type": "dossier", "dossier": self.dossier})

    def snapshot(self) -> dict:
        return {
            "type": "snapshot",
            "mode": self.mode,
            "active_scenario": self.active_scenario_id,
            "room_id": self.room_id,
            "feed": self.feed,
            "dossier": self.dossier,
        }

    # ── Trigger ───────────────────────────────────────────────────────────────

    async def trigger(self, scenario_id: str) -> dict:
        scenario = get_scenario(scenario_id)
        await self._cancel_task()
        self.feed.clear()
        self.dossier = None
        self._seen.clear()
        self.room_id = None
        self.active_scenario_id = scenario.id
        await self.broadcast({
            "type": "reset",
            "scenario_id": scenario.id,
            "mode": self.mode,
        })
        logger.info("Trigger '%s' (%s mode)", scenario.name, self.mode)

        if self.mode == "live":
            from threatenx.incident_room import make_client, open_incident
            if self._client is None:
                self._client = make_client()
            self.room_id = await open_incident(self._client, scenario)
            if self._poller is None:
                self._poller = asyncio.create_task(self._poll_live())
        else:
            self.room_id = scenario.incident_id
            self._task = asyncio.create_task(self._run_simulate(scenario))

        return {"room_id": self.room_id, "scenario_id": scenario.id, "mode": self.mode}

    async def _cancel_task(self) -> None:
        if self._task and not self._task.done():
            self._task.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await self._task
        self._task = None

    # ── Simulate mode (real agent brains, in-process) ────────────────────────

    async def _run_simulate(self, scenario) -> None:
        brains = [AgentBrain(profile, scenario) for profile in AGENTS.values()]
        mesh = MockMesh(brains, on_event=self._on_sim_event)
        try:
            await mesh.run(
                seed_target="Threat Detection Agent",
                seed=Turn("EDR Telemetry", scenario.seed_message()),
            )
            logger.info("Simulate complete: %d messages", len(self.feed))
        except asyncio.CancelledError:
            raise
        except Exception as exc:  # noqa: BLE001
            logger.error("Simulate error: %s", exc)

    async def _on_sim_event(self, record: dict) -> None:
        body = (
            record["content"].split("\n")[0]
            if record["handle"] == "system"
            else record["content"]
        )
        entry = {
            "seq": len(self.feed),
            "id": f"sim-{len(self.feed)}",
            "clock": datetime.now().strftime("%H:%M:%S"),
            "from_agent": record["from_agent"],
            "handle": record["handle"],
            "llm": _LLM_BY_NAME.get(record["from_agent"]),
            "content": body,
            "mentions": record["mentions"],
            "message_type": record["message_type"],
            "is_dossier": record["is_dossier"],
            "payload": record["payload"],
        }
        await self.add_entry(entry)
        await asyncio.sleep(PACE_SECONDS)

    # ── Live mode (real Band room) ────────────────────────────────────────────

    async def _poll_live(self) -> None:
        from threatenx.incident_room import fetch_transcript, message_to_entry
        while True:
            try:
                if self.room_id and self._client is not None:
                    for msg in await fetch_transcript(self._client, self.room_id):
                        if msg.id in self._seen:
                            continue
                        self._seen.add(msg.id)
                        await self.add_entry(message_to_entry(msg, len(self.feed)))
            except Exception as exc:  # noqa: BLE001
                logger.warning("Poll error: %s", exc)
            await asyncio.sleep(POLL_SECONDS)

    async def post_human(self, content: str) -> None:
        if self.mode == "live" and self.room_id and self._client is not None:
            from threatenx.incident_room import post_message
            await post_message(self._client, self.room_id, content)
        else:
            await self.add_entry({
                "seq": len(self.feed),
                "id": f"op-{len(self.feed)}",
                "clock": datetime.now().strftime("%H:%M:%S"),
                "from_agent": "Security Officer",
                "handle": "officer",
                "llm": None,
                "content": content,
                "mentions": [],
                "message_type": "query",
                "is_dossier": False,
                "payload": None,
            })


bridge = Bridge()


# ── HTTP / WebSocket handlers ─────────────────────────────────────────────────

@web.middleware
async def cors_middleware(request: web.Request, handler) -> web.Response:
    if request.method == "OPTIONS":
        resp = web.Response()
    else:
        resp = await handler(request)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return resp


async def health(_req: web.Request) -> web.Response:
    return web.json_response({
        "ok": True,
        "mode": bridge.mode,
        "active_scenario": bridge.active_scenario_id,
        "room_id": bridge.room_id,
    })


async def scenarios_handler(_req: web.Request) -> web.Response:
    return web.json_response([s.to_public() for s in list_scenarios()])


async def trigger_handler(req: web.Request) -> web.Response:
    body = await req.json() if req.can_read_body else {}
    scenario_id = (body or {}).get("scenario_id", DEFAULT_SCENARIO_ID)
    result = await bridge.trigger(scenario_id)
    return web.json_response({"ok": True, **result})


async def message_handler(req: web.Request) -> web.Response:
    body = await req.json()
    content = (body or {}).get("content", "").strip()
    if not content:
        return web.json_response({"ok": False, "error": "empty content"}, status=400)
    await bridge.post_human(content)
    return web.json_response({"ok": True})


async def ws_handler(req: web.Request) -> web.WebSocketResponse:
    ws = web.WebSocketResponse(heartbeat=30)
    await ws.prepare(req)
    bridge.clients.add(ws)
    await ws.send_json(bridge.snapshot())
    logger.info("Dashboard connected (%d client(s))", len(bridge.clients))
    try:
        async for msg in ws:
            if msg.type == WSMsgType.TEXT:
                with contextlib.suppress(Exception):
                    data = json.loads(msg.data)
                    if data.get("type") == "trigger" and data.get("scenario_id"):
                        await bridge.trigger(data["scenario_id"])
                    elif data.get("type") == "message" and data.get("content"):
                        await bridge.post_human(data["content"])
            elif msg.type == WSMsgType.ERROR:
                break
    finally:
        bridge.clients.discard(ws)
        logger.info("Dashboard disconnected (%d client(s))", len(bridge.clients))
    return ws


async def on_cleanup(app: web.Application) -> None:
    await bridge._cancel_task()
    if bridge._poller:
        bridge._poller.cancel()


def build_app() -> web.Application:
    load_dotenv()
    app = web.Application(middlewares=[cors_middleware])
    app.add_routes([
        web.get("/health", health),
        web.get("/scenarios", scenarios_handler),
        web.post("/api/trigger", trigger_handler),
        web.post("/message", message_handler),
        web.get("/ws", ws_handler),
        web.options("/{tail:.*}", lambda r: web.Response()),
    ])
    app.on_cleanup.append(on_cleanup)
    return app


if __name__ == "__main__":
    logger.info("Threatenx bridge starting in %s mode on port %d", bridge.mode, PORT)
    web.run_app(build_app(), host="0.0.0.0", port=PORT, print=None)
