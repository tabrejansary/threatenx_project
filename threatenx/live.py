"""Band SDK adapter — connects AgentBrain to the live Band.ai WebSocket mesh.

Each agent runs as an independent long-lived process. This module wraps the
Band ``SimpleAdapter`` so the same AgentBrain logic used in simulate mode
works transparently against the real Band.ai mesh.

Usage (from any agent entry-point):
    import asyncio
    from threatenx.live import run_agent_live
    asyncio.run(run_agent_live("threat-detection-agent"))
"""

from __future__ import annotations

import logging
import os

from dotenv import load_dotenv

from .brain import AgentBrain, Turn
from .config import get_profile

logger = logging.getLogger("threatenx.live")


async def run_agent_live(handle: str) -> None:
    """Entry point for a live Band-connected Threatenx agent.

    Loads credentials from ``agent_config.yaml`` (via the Band SDK), connects
    to the Band.ai WebSocket mesh, and processes incoming @mentions by
    invoking the AgentBrain. Scenario is resolved from the room history
    (the ``[[scn:<id>]]`` marker embedded by the bridge).
    """
    load_dotenv()
    profile = get_profile(handle)
    brain = AgentBrain(profile, scenario=None)  # None => detect per-message

    logger.info("Starting live agent: %s (%s)", profile.name, handle)

    try:
        from band import Agent, SimpleAdapter, load_agent_config
    except ImportError:
        logger.error(
            "band-sdk is not installed. Run: pip install band-sdk>=1.0.0\n"
            "For simulate mode (no Band), use: python scripts/simulate_incident.py"
        )
        return

    config = load_agent_config("agent_config.yaml")
    agent_config = config.get(handle, {})
    agent_id = agent_config.get("agent_id") or os.getenv("BAND_AGENT_ID")
    api_key = agent_config.get("api_key") or os.getenv("BAND_API_KEY")

    if not agent_id or not api_key:
        logger.error(
            "Missing Band credentials for handle %r. "
            "Set agent_id/api_key in agent_config.yaml or via env vars.",
            handle,
        )
        return

    class _Adapter(SimpleAdapter):
        """Routes Band on_message events to the AgentBrain."""

        async def on_message(self, room_id: str, history: list[dict], message: dict) -> None:
            sender = message.get("sender_name", "unknown")
            content = message.get("content", "")
            incoming = Turn(sender=sender, content=content)

            history_turns = [
                Turn(sender=m.get("sender_name", ""), content=m.get("content", ""))
                for m in history
            ]

            async def send(
                text: str,
                mentions: list[str],
                *,
                message_type: str = "finding",
                payload: dict | None = None,
                is_dossier: bool = False,
            ) -> None:
                await self.send_message(room_id, text, mentions=mentions)

            await brain.process(incoming, history_turns, send)

    adapter = _Adapter(agent_id=agent_id, api_key=api_key)
    logger.info("[%s] Connecting to Band mesh…", profile.name)
    await adapter.run()
