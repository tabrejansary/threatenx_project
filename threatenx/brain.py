"""AgentBrain — the reusable, SDK-agnostic reasoning core for every Threatenx agent.

The same brain runs in both modes:
  * LIVE: wrapped by ``ThreatenxAdapter`` (live.py) and driven by Band's WebSocket.
  * MOCK/SIMULATE: driven by ``MockMesh`` (mock_mesh.py) entirely in-process.

It never imports the Band SDK. It receives an incoming message + room history and
a ``send`` callback, decides what to publish, and grounds the LLM on the seeded
forensic facts of the *active scenario* so output stays faithful. If the LLM is
unavailable it falls back to that scenario's canned narrative.

Scenario selection:
  * Fixed scenario passed to the constructor (mock/simulate, and bridge runs).
  * None -> the brain detects the scenario from a ``[[scn:<id>]]`` marker in the
    room history (live mode, where one generic worker handles any scenario),
    defaulting to the canonical scenario.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from typing import Awaitable, Callable

from . import scenario as scenarios
from .config import SECURITY_OFFICER, AgentProfile
from .llm import LLMUnavailable, complete
from .prompts import system_prompt
from .scenario import Scenario

logger = logging.getLogger("threatenx.brain")

COMMANDER_HANDLE = "incident-commander"

# Type alias: send(content, mentions, *, message_type, payload, is_dossier)
SendFn = Callable[..., Awaitable[None]]


@dataclass
class Turn:
    """One message in the Band room transcript."""
    sender: str
    content: str


class AgentBrain:
    """Specialized reasoning for one agent, selected by its profile/handle.

    The brain is stateless between calls — it reads the full room history on
    every invocation to determine context and dependency status.
    """

    def __init__(self, profile: AgentProfile, scenario: Scenario | None = None):
        self.profile = profile
        self.handle = profile.handle
        self.name = profile.name
        self._fixed_scenario = scenario  # None => detect per message (live mode)

    # ── Public entrypoint ────────────────────────────────────────────────────

    async def process(self, incoming: Turn, history: list[Turn], send: SendFn) -> bool:
        """Process one inbound message. Returns True if the agent published.

        Agents with unmet dependencies (e.g. Risk waits on Malware, Commander
        waits on Compliance+PR) hold and return False until their prerequisites
        have reported — this keeps the cascade in PRD §4 order even though
        several agents may be mentioned simultaneously.
        """
        scenario = self._resolve_scenario(incoming, history)
        if not self._dependencies_met(incoming, history):
            missing = self._missing_dependencies(incoming, history)
            logger.info("[%s] waiting for: %s", self.name, ", ".join(sorted(missing)))
            return False

        if self.handle == COMMANDER_HANDLE:
            return await self._handle_commander(incoming, history, send, scenario)
        return await self._handle_worker(incoming, history, send, scenario)

    # ── Scenario resolution ──────────────────────────────────────────────────

    def _resolve_scenario(self, incoming: Turn, history: list[Turn]) -> Scenario:
        if self._fixed_scenario is not None:
            return self._fixed_scenario
        # Live mode: detect from the [[scn:<id>]] marker embedded in the room.
        text = " ".join([incoming.content, *(t.content for t in history)])
        return scenarios.get_scenario(scenarios.detect_scenario_id(text))

    # ── Dependency checking ──────────────────────────────────────────────────

    def _missing_dependencies(self, incoming: Turn, history: list[Turn]) -> set[str]:
        senders = {t.sender for t in history} | {incoming.sender}
        return set(self.profile.requires) - senders

    def _dependencies_met(self, incoming: Turn, history: list[Turn]) -> bool:
        return not self._missing_dependencies(incoming, history)

    # ── Worker agents (Gemini) ───────────────────────────────────────────────

    async def _handle_worker(
        self, incoming: Turn, history: list[Turn], send: SendFn, scenario: Scenario
    ) -> bool:
        finding = scenario.findings[self.handle]
        payload = finding["payload"]
        narrative = self._narrate(incoming, history, payload, scenario)

        envelope = {
            "from_agent": self.name,
            "to_agent": ", ".join(self.profile.mentions) or "all",
            "incident_id": scenario.incident_id,
            "message_type": finding["message_type"],
            "content": payload,
        }
        await send(
            narrative,
            self.profile.mentions,
            message_type=finding["message_type"],
            payload=envelope,
        )
        return True

    # ── Incident Commander (Groq / Llama 3) ──────────────────────────────────

    async def _handle_commander(
        self, incoming: Turn, history: list[Turn], send: SendFn, scenario: Scenario
    ) -> bool:
        dossier = scenario.build_dossier()
        narrative = self._narrate(
            incoming, history, dossier.model_dump(mode="json"), scenario
        )
        await send(
            narrative,
            [SECURITY_OFFICER],
            message_type="recommendation",
            payload=dossier.model_dump(mode="json"),
            is_dossier=True,
        )
        return True

    # ── LLM narration with canned fallback ───────────────────────────────────

    def _narrate(
        self, incoming: Turn, history: list[Turn], facts: dict, scenario: Scenario
    ) -> str:
        """Generate the public message body; fall back to the canned narrative."""
        user_prompt = self._build_user_prompt(incoming, history, facts)
        try:
            text = complete(self.profile, system_prompt(self.handle), user_prompt)
            logger.info("[%s] LLM (%s) generated narrative", self.name, self.profile.llm)
            return text
        except LLMUnavailable as exc:
            logger.warning("[%s] LLM fallback: %s", self.name, exc)
            return scenario.fallback_narrative[self.handle]

    @staticmethod
    def _build_user_prompt(incoming: Turn, history: list[Turn], facts: dict) -> str:
        transcript = "\n".join(f"[{t.sender}]: {t.content}" for t in history) or "(none yet)"
        facts_block = json.dumps(facts, indent=2)
        return (
            f"INCIDENT ROOM TRANSCRIPT SO FAR:\n{transcript}\n\n"
            f"MESSAGE THAT ACTIVATED YOU (from {incoming.sender}):\n{incoming.content}\n\n"
            f"YOUR GROUNDED FINDINGS (report these; do not contradict them):\n{facts_block}\n\n"
            "Write your incident-room message now."
        )
