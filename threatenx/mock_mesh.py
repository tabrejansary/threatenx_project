"""MockMesh — in-process simulation driver for the Threatenx agent federation.

Drives all 7 agent brains through the complete incident choreography without
requiring a live Band mesh. Uses the same AgentBrain logic as live mode — the
only difference is the transport: instead of WebSockets to Band.ai, messages
are routed in-process via Python async calls.

Usage:
    mesh = MockMesh(brains, on_event=my_callback)
    await mesh.run(
        seed_target="Threat Detection Agent",
        seed=Turn("EDR Telemetry", scenario.seed_message()),
    )
"""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from typing import Any, Awaitable, Callable

from .brain import AgentBrain, Turn
from .config import AGENTS_BY_NAME, SECURITY_OFFICER

logger = logging.getLogger("threatenx.mock_mesh")

# Max rounds to prevent infinite loops in case of an agent dependency cycle.
MAX_ROUNDS = 20


@dataclass
class _QueuedMessage:
    """A message queued for delivery to a set of target agents."""
    sender: str
    content: str
    targets: list[str]  # agent display names
    message_type: str = "alert"
    payload: Any = None
    is_dossier: bool = False


class MockMesh:
    """Routes messages between AgentBrain instances entirely in-process.

    The mesh maintains a shared room history (as a list of :class:`Turn` objects)
    and a pending queue. On each round it delivers queued messages to the target
    agents, which may publish new messages that extend the queue.
    """

    def __init__(
        self,
        brains: list[AgentBrain],
        on_event: Callable[[dict], Awaitable[None]] | None = None,
    ) -> None:
        self._brains: dict[str, AgentBrain] = {b.name: b for b in brains}
        self._on_event = on_event or (lambda e: asyncio.sleep(0))
        self._history: list[Turn] = []
        self._queue: list[_QueuedMessage] = []

    async def run(self, seed_target: str, seed: Turn) -> None:
        """Run the full incident cascade starting from the seed message."""
        logger.info("MockMesh: starting simulation")

        # Emit the seed (EDR telemetry) event for the UI.
        await self._emit_event(
            from_agent="EDR Telemetry",
            handle="system",
            content=seed.content,
            mentions=[seed_target],
            message_type="alert",
            payload=None,
            is_dossier=False,
        )

        # Queue the seed for the Threat Detection Agent.
        self._queue.append(_QueuedMessage(
            sender=seed.sender,
            content=seed.content,
            targets=[seed_target],
        ))

        for round_num in range(MAX_ROUNDS):
            if not self._queue:
                logger.info("MockMesh: queue empty — simulation complete (%d rounds)", round_num)
                break

            batch = list(self._queue)
            self._queue.clear()

            for msg in batch:
                incoming = Turn(sender=msg.sender, content=msg.content)
                for target_name in msg.targets:
                    if target_name == SECURITY_OFFICER:
                        continue  # Human — no brain to invoke
                    brain = self._brains.get(target_name)
                    if brain is None:
                        logger.warning("No brain for target %r", target_name)
                        continue
                    await self._deliver(brain, incoming)
        else:
            logger.warning("MockMesh: hit MAX_ROUNDS (%d) — stopping", MAX_ROUNDS)

    async def _deliver(self, brain: AgentBrain, incoming: Turn) -> None:
        """Deliver a message to one brain and enqueue its response."""
        published = False

        async def send(
            content: str,
            mentions: list[str],
            *,
            message_type: str = "finding",
            payload: Any = None,
            is_dossier: bool = False,
        ) -> None:
            nonlocal published
            published = True
            turn = Turn(sender=brain.name, content=content)
            self._history.append(turn)
            await self._emit_event(
                from_agent=brain.name,
                handle=brain.handle,
                content=content,
                mentions=mentions,
                message_type=message_type,
                payload=payload,
                is_dossier=is_dossier,
            )
            self._queue.append(_QueuedMessage(
                sender=brain.name,
                content=content,
                targets=mentions,
                message_type=message_type,
                payload=payload,
                is_dossier=is_dossier,
            ))

        processed = await brain.process(incoming, list(self._history), send)
        if not processed:
            # Re-queue incoming for this brain on the next round (dependency wait).
            self._queue.append(_QueuedMessage(
                sender=incoming.sender,
                content=incoming.content,
                targets=[brain.name],
            ))

    async def _emit_event(
        self,
        from_agent: str,
        handle: str,
        content: str,
        mentions: list[str],
        message_type: str,
        payload: Any,
        is_dossier: bool,
    ) -> None:
        record = {
            "from_agent": from_agent,
            "handle": handle,
            "content": content,
            "mentions": mentions,
            "message_type": message_type,
            "payload": payload,
            "is_dossier": is_dossier,
        }
        await self._on_event(record)
