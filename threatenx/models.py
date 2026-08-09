"""Pydantic data models for the Threatenx platform.

Implements the formal JSON schemas specified in SRS Part 2 §6:
  - §6.1  SecurityLogEvent       — raw telemetry event from SIEM/EDR
  - §6.2  ThreatDetectionOutput  — Threat Detection Agent's bootstrap payload
  - §6.3  AgentMessage           — all inter-agent messages in the Band room
  - §6.4  IncidentDossierRecommendation — Incident Commander's final synthesis

These models are shared by agents, the mock mesh, the bridge, and the dashboard.
"""

from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


# ── Enumerations ──────────────────────────────────────────────────────────────

class Severity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class EventType(str, Enum):
    LOGIN = "login"
    FILE_ACCESS = "file_access"
    NETWORK_REQUEST = "network_request"
    PROCESS_CREATION = "process_creation"


class ThreatType(str, Enum):
    BRUTE_FORCE = "brute_force"
    RANSOMWARE = "ransomware"
    DATA_EXFILTRATION = "data_exfiltration"
    GEOGRAPHIC_ANOMALY = "geographic_anomaly"
    CRYPTOJACKING = "cryptojacking"


class MessageType(str, Enum):
    FINDING = "finding"
    ALERT = "alert"
    RECOMMENDATION = "recommendation"
    QUERY = "query"


class ActionType(str, Enum):
    BLOCK_IP = "block_ip"
    LOCK_USER = "lock_user"
    ISOLATE_HOST = "isolate_host"
    PASSWORD_RESET = "password_reset"
    REVOKE_KEY = "revoke_key"
    TERMINATE_INSTANCES = "terminate_instances"
    QUARANTINE_FILE = "quarantine_file"


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class LoginStatus(str, Enum):
    SUCCESS = "success"
    FAILED = "failed"


# ── SRS §6.1 — Security Log Event ────────────────────────────────────────────

class SecurityLogEvent(BaseModel):
    """Raw telemetry event ingested from SIEM/EDR systems."""
    timestamp: str = Field(..., description="ISO-8601 formatted timestamp of the log event.")
    log_id: str = Field(..., description="Unique identifier of the log entry.")
    source_ip: str = Field(..., description="Source IP address of the initiator.")
    destination_ip: str = Field(..., description="Destination IP address of the interaction.")
    event_type: EventType = Field(..., description="Categorization of the log activity.")
    severity: Severity = Field(..., description="Initial severity score from the telemetry system.")
    user_id: str = Field(..., description="User account identifier associated with the log.")
    location: str = Field(..., description="Geographical location of the source IP address.")
    status: LoginStatus = Field(..., description="Outcome of the logged action.")
    metadata: dict[str, Any] = Field(default_factory=dict, description="Flexible log-specific attributes.")


# ── SRS §6.2 — Threat Detection Output ───────────────────────────────────────

class ThreatDetectionOutput(BaseModel):
    """Emitted by the Threat Detection Agent to bootstrap an investigation room."""
    detection_id: str = Field(..., description="Unique identifier for this specific threat discovery.")
    linked_logs: list[str] = Field(..., description="Reference IDs of logs that corroborate this threat.")
    threat_type: str = Field(..., description="The category of security threat identified.")
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Model confidence in threat identification.")
    severity: Severity = Field(..., description="The dynamic severity rating of the threat.")
    agent: str = Field(..., description="Agent declaring the threat.")
    summary: str = Field(..., description="Human-readable summary of the detection.")


# ── SRS §6.3 — Agent Message ──────────────────────────────────────────────────

class AgentMessage(BaseModel):
    """Schema for all messages exchanged inside the Band incident room."""
    from_agent: str = Field(..., description="Name of the agent sending the message.")
    to_agent: str = Field(..., description="Name of the target agent or 'all' for broadcast.")
    incident_id: str = Field(..., description="The unique incident identifier.")
    message_type: MessageType = Field(..., description="Operational intent of the message.")
    content: dict[str, Any] = Field(..., description="Variable payload content containing analysis findings.")
    timestamp: str = Field(..., description="ISO-8601 timestamp of when the message was sent.")


# ── SRS §6.4 — Incident Dossier Recommendation ───────────────────────────────

class TimelineEntry(BaseModel):
    """One event in the incident's chronological timeline."""
    time: str
    event: str
    source: str


class ComplianceFlags(BaseModel):
    """Regulatory compliance obligations triggered by the incident."""
    regulation_active: list[str] = Field(default_factory=list)
    reporting_deadline_hours: int = 0


class Communications(BaseModel):
    """Crisis communications drafted by the PR Agent."""
    customer_alert_draft: str = ""
    press_release_draft: str = ""


class ProposedAction(BaseModel):
    """A containment action proposed by the Incident Commander, awaiting human approval."""
    action_id: str
    action_type: str
    target: str
    description: str
    risk_level: str


class IncidentDossierRecommendation(BaseModel):
    """The complete incident dossier generated by the Incident Commander Agent.

    Sent directly to the dashboard for Human Security Officer review and approval.
    """
    incident_id: str
    severity: str
    timeline: list[TimelineEntry] = Field(default_factory=list)
    compliance_flags: ComplianceFlags = Field(default_factory=ComplianceFlags)
    communications: Communications = Field(default_factory=Communications)
    proposed_actions: list[ProposedAction] = Field(default_factory=list)
