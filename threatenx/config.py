"""Static configuration for the Threatenx agent federation.

Defines the 7 agent profiles: their Band handle (the key in ``agent_config.yaml``),
their display name (used for @mentions in the room), which LLM backend they use,
and the deterministic downstream agents they tag — the choreography from
PRD_Part1 §4. Routing is fixed by spec for reliable, in-order collaboration; the
LLMs generate the *content* of each message, not the wiring.
"""

from __future__ import annotations

from dataclasses import dataclass, field

# ── Model identifiers — "Mix and Match" strategy (PRD §3.4 / README) ─────────
# Gemini 2.5 Flash for fast, structured worker output.
# Groq Llama-3-70B for the Incident Commander's high-level reasoning.
GEMINI_MODEL = "gemini-2.5-flash"
GROQ_MODEL = "llama-3.3-70b-versatile"

# LLM backend constants
LLM_GEMINI = "gemini"
LLM_GROQ = "groq"

# The human participant the Commander addresses in the final message.
SECURITY_OFFICER = "Security Officer"


@dataclass(frozen=True)
class AgentProfile:
    """Everything needed to run one Threatenx agent in live or simulate mode."""

    handle: str          # Band handle / key in agent_config.yaml
    name: str            # Display name used for @mentions
    llm: str             # LLM_GEMINI or LLM_GROQ
    role: str = ""       # Short human-readable description
    mentions: list[str] = field(default_factory=list)   # Downstream agents to tag
    requires: list[str] = field(default_factory=list)   # Must report before we act

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.name} (@{self.handle})"


# ── The 7 agents in choreography order ────────────────────────────────────────
# PRD_Part1 §4 specifies the exact cascade:
#   ThreatDetection  -> Log + Risk
#   Log              -> Malware
#   Malware          -> Risk
#   Risk             -> Compliance + PR
#   Compliance       -> Commander
#   PR               -> Commander
#   Commander        -> Security Officer (terminal: dossier to dashboard)

THREAT_DETECTION = AgentProfile(
    handle="threat-detection-agent",
    name="Threat Detection Agent",
    llm=LLM_GEMINI,
    role="Monitors telemetry, identifies IoCs, bootstraps the incident room.",
    mentions=["Log Analysis Agent", "Risk Assessment Agent"],
)

LOG_ANALYSIS = AgentProfile(
    handle="log-analysis-agent",
    name="Log Analysis Agent",
    llm=LLM_GEMINI,
    role="Traces access paths, lateral movement, and exfiltration in the logs.",
    mentions=["Malware Analysis Agent"],
)

MALWARE_ANALYSIS = AgentProfile(
    handle="malware-analysis-agent",
    name="Malware Analysis Agent",
    llm=LLM_GEMINI,
    role="Classifies suspicious files and processes via signatures and sandboxing.",
    mentions=["Risk Assessment Agent"],
)

RISK_ASSESSMENT = AgentProfile(
    handle="risk-assessment-agent",
    name="Risk Assessment Agent",
    llm=LLM_GEMINI,
    role="Maps assets to business impact and assigns incident severity.",
    mentions=["Compliance Agent", "PR Agent"],
    requires=["Malware Analysis Agent"],  # Must wait for malware verdict before rating severity
)

COMPLIANCE = AgentProfile(
    handle="compliance-agent",
    name="Compliance Agent",
    llm=LLM_GEMINI,
    role="Maps the breach to regulations (GDPR, HIPAA, CCPA) and notification deadlines.",
    mentions=["Incident Commander"],
)

PR_COMMS = AgentProfile(
    handle="pr-agent",
    name="PR Agent",
    llm=LLM_GEMINI,
    role="Drafts internal, customer, and public crisis communications.",
    mentions=["Incident Commander"],
)

INCIDENT_COMMANDER = AgentProfile(
    handle="incident-commander",
    name="Incident Commander",
    llm=LLM_GROQ,
    role="Synthesizes all findings into the incident dossier and containment playbook.",
    mentions=[SECURITY_OFFICER],
    requires=["Compliance Agent", "PR Agent"],  # Synthesize only after legal + PR ready
)

# Registry keyed by handle (matches agent_config.yaml keys).
AGENTS: dict[str, AgentProfile] = {
    p.handle: p
    for p in (
        THREAT_DETECTION,
        LOG_ANALYSIS,
        MALWARE_ANALYSIS,
        RISK_ASSESSMENT,
        COMPLIANCE,
        PR_COMMS,
        INCIDENT_COMMANDER,
    )
}

# Reverse lookup by display name (used when routing @mentions in the mock mesh).
AGENTS_BY_NAME: dict[str, AgentProfile] = {p.name: p for p in AGENTS.values()}


def get_profile(handle: str) -> AgentProfile:
    """Return the profile for a Band handle, or raise a clear KeyError."""
    try:
        return AGENTS[handle]
    except KeyError:
        raise KeyError(
            f"Unknown agent handle {handle!r}. "
            f"Valid handles: {', '.join(AGENTS)}"
        ) from None
