"""Band API client — manages incident rooms on the live Band.ai mesh.

Provides helpers to create rooms, invite agents, post bootstrap messages,
and poll the room transcript for the dashboard bridge in live mode.
"""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from datetime import datetime

from .config import AGENTS
from .scenario import Scenario, make_marker, strip_marker

logger = logging.getLogger("threatenx.incident_room")

BAND_API_BASE = "https://api.band.ai/v1"


@dataclass
class BandMessage:
    """One message from a Band room transcript."""
    id: str
    sender: str
    content: str
    timestamp: str


def make_client() -> "BandClient":
    """Create a Band REST client from environment variables."""
    api_key = os.getenv("BAND_MASTER_KEY")
    if not api_key:
        raise RuntimeError(
            "BAND_MASTER_KEY not set. "
            "Add it to your .env file to use live mode."
        )
    return BandClient(api_key=api_key)


class BandClient:
    """Async-compatible REST client for the Band.ai API."""

    def __init__(self, api_key: str) -> None:
        self._api_key = api_key
        self._base = BAND_API_BASE

    def _headers(self) -> dict:
        return {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json",
        }

    async def post(self, endpoint: str, body: dict) -> dict:
        import aiohttp
        url = f"{self._base}{endpoint}"
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=body, headers=self._headers()) as resp:
                resp.raise_for_status()
                return await resp.json()

    async def get(self, endpoint: str) -> dict:
        import aiohttp
        url = f"{self._base}{endpoint}"
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=self._headers()) as resp:
                resp.raise_for_status()
                return await resp.json()


async def open_incident(client: BandClient, scenario: Scenario) -> str:
    """Create a Band room for the incident and invite all 7 agents.

    Returns the room_id for polling.
    """
    logger.info("Creating Band room for scenario: %s", scenario.id)
    room_resp = await client.post("/rooms", {
        "title": scenario.room_title,
        "description": f"Threatenx incident room — {scenario.name}",
    })
    room_id = room_resp["room_id"]
    logger.info("Band room created: %s", room_id)

    # Invite all 7 registered agents.
    for handle in AGENTS:
        try:
            await client.post(f"/rooms/{room_id}/invite", {"agent_handle": handle})
        except Exception as exc:  # noqa: BLE001
            logger.warning("Failed to invite %s: %s", handle, exc)

    # Post the bootstrap message (includes the scenario marker so workers know which scenario).
    bootstrap = (
        f"{scenario.seed_message()}\n\n"
        f"{make_marker(scenario.id)}"
    )
    await post_message(client, room_id, bootstrap)
    return room_id


async def post_message(client: BandClient, room_id: str, content: str) -> None:
    """Post a message into a Band room."""
    await client.post(f"/rooms/{room_id}/messages", {"content": content})


async def fetch_transcript(client: BandClient, room_id: str) -> list[BandMessage]:
    """Fetch the full message transcript for a Band room."""
    data = await client.get(f"/rooms/{room_id}/messages")
    messages = data.get("messages", [])
    return [
        BandMessage(
            id=m["message_id"],
            sender=m.get("sender_name", "unknown"),
            content=strip_marker(m.get("content", "")),
            timestamp=m.get("created_at", ""),
        )
        for m in messages
    ]


def message_to_entry(msg: BandMessage, seq: int) -> dict:
    """Convert a BandMessage into the feed entry format expected by the dashboard."""
    try:
        dt = datetime.fromisoformat(msg.timestamp.replace("Z", "+00:00"))
        clock = dt.strftime("%H:%M:%S")
    except Exception:  # noqa: BLE001
        clock = msg.timestamp[:8] or "—"

    return {
        "seq": seq,
        "id": msg.id,
        "clock": clock,
        "from_agent": msg.sender,
        "handle": msg.sender.lower().replace(" ", "-"),
        "llm": None,
        "content": msg.content,
        "mentions": [],
        "message_type": "finding",
        "is_dossier": False,
        "payload": None,
    }
