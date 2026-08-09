"""Seeded incident scenarios — Threatenx's "mock data pipeline".

Exports a registry of :class:`Scenario` objects, each a fixed set of forensic
facts so the platform can demonstrate handling several distinct attack types
reliably without live SIEM/EDR credentials.

Per scenario:
  * Structured agent *payloads* (each AgentMessage.content) are ground truth.
  * Each agent's *narrative* is written live by its LLM (grounded on these facts),
    with ``fallback_narrative`` as a canned safety net if the LLM is unavailable.

Scenarios:
  1. romanian-pii        — Geographic anomaly → PII data exfiltration (GDPR).
  2. ransomware-lateral  — Malicious PDF → ransomware lateral movement to HR share.
  3. aws-cryptojacking   — Leaked IAM key → rogue GPU EC2 cryptomining (no PII).
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field

from .models import (
    Communications,
    ComplianceFlags,
    IncidentDossierRecommendation,
    ProposedAction,
    TimelineEntry,
)

# Live-mode marker so generic Band workers know which scenario a room is for.
_MARKER_RE = re.compile(r"\[\[scn:([a-z0-9-]+)\]\]")


def make_marker(scenario_id: str) -> str:
    return f"[[scn:{scenario_id}]]"


def detect_scenario_id(text: str) -> str | None:
    m = _MARKER_RE.search(text or "")
    return m.group(1) if m else None


def strip_marker(text: str) -> str:
    return _MARKER_RE.sub("", text or "").strip()


@dataclass(frozen=True)
class Scenario:
    """One self-contained incident the agent federation can investigate."""

    id: str
    name: str
    category: str                  # Short label for the selector chip
    description: str               # One-paragraph context for the UI
    incident_id: str
    room_title: str
    threat_type: str
    dossier_severity: str
    facts: dict
    context: list[dict]            # [{label, value}] highlights for the context UI
    seed_summary: str              # Human-readable EDR alert line
    seed_log_event: dict           # SRS §6.1 raw alert (shown as JSON in the UI)
    detection: dict                # SRS §6.2 threat-detection payload
    findings: dict                 # handle -> {message_type, payload}
    fallback_narrative: dict       # handle -> str (canned narrative safety net)
    timeline: list                 # [{time, event, source}]
    compliance_flags: dict         # {regulation_active, reporting_deadline_hours}
    communications: dict           # {customer_alert_draft, press_release_draft}
    proposed_actions: list         # [{action_id, action_type, target, ...}]

    def seed_message(self) -> str:
        return f"{self.seed_summary}\nRaw event:\n{json.dumps(self.seed_log_event, indent=2)}"

    def build_dossier(self) -> IncidentDossierRecommendation:
        return IncidentDossierRecommendation(
            incident_id=self.incident_id,
            severity=self.dossier_severity,
            timeline=[TimelineEntry(**t) for t in self.timeline],
            compliance_flags=ComplianceFlags(**self.compliance_flags),
            communications=Communications(**self.communications),
            proposed_actions=[ProposedAction(**a) for a in self.proposed_actions],
        )

    def to_public(self) -> dict:
        """JSON-serializable bundle for the dashboard / scenarios.json."""
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "incident_id": self.incident_id,
            "room_title": self.room_title,
            "threat_type": self.threat_type,
            "severity": self.dossier_severity,
            "context": self.context,
            "seed_summary": self.seed_summary,
            "seed_event": self.seed_log_event,
            "detection": self.detection,
            "timeline": self.timeline,
            "compliance_flags": self.compliance_flags,
            "communications": self.communications,
            "proposed_actions": self.proposed_actions,
            "dossier": self.build_dossier().model_dump(mode="json"),
        }


# ════════════════════════════════════════════════════════════════════════════
# Scenario 1 — Romanian geographic anomaly & PII data breach
# ════════════════════════════════════════════════════════════════════════════
_ROMANIAN_FACTS = {
    "user": "jsmith@company.com",
    "romania_ip": "185.112.144.12",
    "internal_ip": "192.168.12.9",
    "prev_location": "Chicago, USA",
    "prev_time": "06:12 UTC",
    "login_location": "Romania",
    "login_time": "10:15 UTC",
    "auth_method": "MFA_Token",
    "db_server": "DB-Prod-09",
    "query": "SELECT * FROM Customers",
    "exfil_volume": "4.2 GB",
    "exfil_url": "https://exfil-server-romania.com/incoming",
    "c2_domain": "exfil-server-romania.com",
    "file_name": "dump_pii.py",
    "file_path": r"C:\Users\jsmith\AppData\Local\Temp\dump_pii.py",
    "md5": "e99a18c428cb38d5f260853678922e03",
    "sha256": "3b7c9f1e2a4d6b8c0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d",
    "affected_count": 150_000,
    "data_types": ["Names", "Emails", "Hashed Passwords"],
}

ROMANIAN_PII = Scenario(
    id="romanian-pii",
    name="Romanian PII Breach",
    category="Data Exfiltration",
    description=(
        "A valid MFA session for jsmith@company.com logs in from Romania just four "
        "hours after a Chicago login. The session bulk-downloads the customer "
        "database and exfiltrates 4.2 GB of PII to an external host — a textbook "
        "credential-abuse data breach with GDPR implications."
    ),
    incident_id="incident-2026-06-14-geo",
    room_title="#incident-2026-06-14-geo",
    threat_type="geographic_anomaly",
    dossier_severity="critical",
    facts=_ROMANIAN_FACTS,
    context=[
        {"label": "Compromised user", "value": "jsmith@company.com"},
        {"label": "Source IP", "value": "185.112.144.12 (Romania)"},
        {"label": "Prior login", "value": "Chicago, USA — 4h earlier"},
        {"label": "Target asset", "value": "DB-Prod-09 (Customer DB)"},
        {"label": "Exfiltrated", "value": "4.2 GB PII — ~150,000 EU residents"},
        {"label": "Dropped file", "value": "dump_pii.py"},
    ],
    seed_summary=(
        "EDR ALERT log-ad-99812: successful login for jsmith@company.com from "
        "185.112.144.12 (Romania) at 10:15 UTC via MFA_Token. Prior login Chicago, "
        "USA at 06:12 UTC."
    ),
    seed_log_event={
        "timestamp": "2026-06-14T10:15:00Z",
        "log_id": "log-ad-99812",
        "source_ip": "185.112.144.12",
        "destination_ip": "192.168.12.9",
        "event_type": "login",
        "severity": "medium",
        "user_id": "jsmith@company.com",
        "location": "Romania",
        "status": "success",
        "metadata": {
            "auth_method": "MFA_Token",
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
    },
    detection={
        "detection_id": "det-2026-614-01",
        "linked_logs": ["log-ad-99812"],
        "threat_type": "geographic_anomaly",
        "confidence_score": 0.95,
        "severity": "high",
        "agent": "ThreatDetectionAgent",
        "summary": (
            "Successful login for jsmith@company.com from a Romanian IP while a "
            "Chicago login was active 4 hours prior."
        ),
    },
    findings={
        "threat-detection-agent": {"message_type": "alert", "payload": None},
        "log-analysis-agent": {
            "message_type": "finding",
            "payload": {
                "compromised_user": "jsmith@company.com",
                "accessed_server": "DB-Prod-09",
                "query_executed": "SELECT * FROM Customers",
                "exfiltration_volume": "4.2 GB",
                "exfiltration_destination": "185.112.144.12",
                "exfiltration_url": "https://exfil-server-romania.com/incoming",
                "suspicious_file": "dump_pii.py",
                "file_path": r"C:\Users\jsmith\AppData\Local\Temp\dump_pii.py",
                "md5_hash": "e99a18c428cb38d5f260853678922e03",
            },
        },
        "malware-analysis-agent": {
            "message_type": "finding",
            "payload": {
                "file_name": "dump_pii.py",
                "sha256": _ROMANIAN_FACTS["sha256"],
                "classification": "Trojan (data-exfiltration framework)",
                "confidence": 0.97,
                "behaviors": [
                    "Embedded obfuscated exfiltration routines",
                    "Hardcoded C2 domain: exfil-server-romania.com",
                    "Disables local audit logging (EventLog-Security)",
                    "Modifies registry keys to evade detection",
                ],
                "c2_indicators": ["exfil-server-romania.com", "185.112.144.12"],
            },
        },
        "risk-assessment-agent": {
            "message_type": "alert",
            "payload": {
                "severity": "critical",
                "risk_score": 9.6,
                "compromised_asset": "DB-Prod-09",
                "asset_classification": "Active Customer Database (Tier-1)",
                "data_exposed": ["Names", "Emails", "Hashed Passwords"],
                "affected_records": 150_000,
                "regulatory_scope": ["GDPR"],
                "business_impact": (
                    "Confirmed exfiltration of PII for ~150,000 EU residents from the "
                    "primary customer database. Reputational and regulatory exposure."
                ),
            },
        },
        "compliance-agent": {
            "message_type": "recommendation",
            "payload": {
                "regulation": "GDPR",
                "article": "Article 33",
                "breach_confirmed": True,
                "reporting_deadline_hours": 72,
                "notification_targets": [
                    "Lead Supervisory Authority (DPA)",
                    "Affected data subjects (EU residents)",
                ],
                "document": "GDPR_Breach_Report_Incident_2026.pdf",
            },
        },
        "pr-agent": {
            "message_type": "recommendation",
            "payload": {
                "customer_alert_draft": (
                    "Subject: Important Security Notice — Please Reset Your Password\n\n"
                    "We recently detected unauthorized access affecting some customer "
                    "account data. As a precaution we are requiring a password reset."
                ),
                "press_release_draft": (
                    "FOR IMMEDIATE RELEASE: We identified and contained a security "
                    "incident involving unauthorized access to a customer database."
                ),
                "internal_memo_draft": (
                    "EXECUTIVE BRIEFING: Confirmed PII breach (DB-Prod-09). GDPR "
                    "72-hour clock active. Containment staged for approval."
                ),
                "recommended_tone": "transparent, reassuring, safety-first",
            },
        },
    },
    fallback_narrative={
        "threat-detection-agent": (
            "Anomaly Detected: User jsmith@company.com logged in from IP "
            "185.112.144.12 (Romania) at 10:15 UTC. Last known location was Chicago, "
            "USA at 06:12 UTC. Log Analysis and Risk Assessment, please investigate."
        ),
        "log-analysis-agent": (
            "Investigation results: session executed SELECT * FROM Customers on "
            "DB-Prod-09. 4.2 GB transferred to external host 185.112.144.12. "
            r"Suspicious file dump_pii.py left in C:\Users\jsmith\AppData\Local\Temp. "
            "Malware Analysis Agent, please analyze this file."
        ),
        "malware-analysis-agent": (
            "Analysis of dump_pii.py: an exfiltration script disguised as a backup "
            "tool. Disables local audit logs and beacons to exfil-server-romania.com. "
            "Signature matches a Trojan framework. Risk Assessment Agent, please update incident severity."
        ),
        "risk-assessment-agent": (
            "Risk Profile Updated: Severity CRITICAL. Compromised asset DB-Prod-09 "
            "(active customer database) holding PII for ~150,000 EU residents. GDPR "
            "scope confirmed. Compliance Agent and PR Agent, action required immediately."
        ),
        "compliance-agent": (
            "Regulatory alert: confirmed PII breach under GDPR Article 33. 72-hour "
            "reporting clock started. Draft notification prepared: "
            "GDPR_Breach_Report_Incident_2026.pdf."
        ),
        "pr-agent": (
            "Draft communications completed: customer password-reset alert, internal "
            "executive briefing, and public press release ready. Recommended tone: "
            "transparent, reassuring, safety-first."
        ),
        "incident-commander": (
            "Synthesis complete. Dossier finalized. Severity: CRITICAL. Kill chain: "
            "credential theft via geographic anomaly → bulk PII exfiltration → Trojan "
            "dropper. Recommendation: immediate account lockdown, IP blacklist, host "
            "isolation, and system-wide credential reset. Submitting to the Human "
            "Security Officer on the dashboard for approval."
        ),
    },
    timeline=[
        {"time": "10:15:00", "event": "Anomaly detected: Login from Romania", "source": "Threat Detection Agent"},
        {"time": "10:15:30", "event": "DB-Prod-09 accessed; 4.2 GB exfiltrated", "source": "Log Analysis Agent"},
        {"time": "10:16:00", "event": "dump_pii.py confirmed as Trojan script", "source": "Malware Analysis Agent"},
        {"time": "10:16:30", "event": "Severity CRITICAL; GDPR scope (PII of 150k EU residents)", "source": "Risk Assessment Agent"},
        {"time": "10:17:00", "event": "GDPR 72-hour reporting clock started", "source": "Compliance Agent"},
        {"time": "10:17:30", "event": "Customer / press / internal communications drafted", "source": "PR Agent"},
    ],
    compliance_flags={"regulation_active": ["GDPR"], "reporting_deadline_hours": 72},
    communications={
        "customer_alert_draft": (
            "Subject: Important Security Notice — Please Reset Your Password\n\n"
            "We recently detected unauthorized access affecting some customer account "
            "data. As a precaution we are requiring a password reset. Your security is "
            "our priority and we are taking immediate action."
        ),
        "press_release_draft": (
            "FOR IMMEDIATE RELEASE: We identified and contained a security incident "
            "involving unauthorized access to a customer database. We have engaged "
            "regulators, notified affected users, and implemented additional safeguards."
        ),
    },
    proposed_actions=[
        {"action_id": "act-01", "action_type": "block_ip", "target": "185.112.144.12", "description": "Block Romanian exfiltration destination IP at the firewall.", "risk_level": "low"},
        {"action_id": "act-02", "action_type": "lock_user", "target": "jsmith@company.com", "description": "Revoke active AD sessions and disable logins for jsmith.", "risk_level": "medium"},
        {"action_id": "act-03", "action_type": "isolate_host", "target": "DB-Prod-09", "description": "Restrict inbound queries to DB-Prod-09 pending forensics.", "risk_level": "medium"},
        {"action_id": "act-04", "action_type": "password_reset", "target": "all-affected-customers", "description": "Trigger a system-wide password reset for affected accounts.", "risk_level": "low"},
    ],
)
ROMANIAN_PII.findings["threat-detection-agent"]["payload"] = ROMANIAN_PII.detection


# ════════════════════════════════════════════════════════════════════════════
# Scenario 2 — Ransomware lateral movement (malicious PDF → HR file share)
# ════════════════════════════════════════════════════════════════════════════
RANSOMWARE_LATERAL = Scenario(
    id="ransomware-lateral",
    name="Ransomware Lateral Movement",
    category="Ransomware",
    description=(
        "A marketing employee opens a malicious 'Q3 invoice' PDF. EDR detects rapid "
        "file encryption on the laptop, then the strain spreads over SMB to the HR "
        "file share and begins encrypting 38,000 files including employee PII. The "
        "dropper is confirmed as the BlackForge (LockBit-family) ransomware."
    ),
    incident_id="incident-2026-06-17-rw",
    room_title="#incident-2026-06-17-rw",
    threat_type="ransomware",
    dossier_severity="critical",
    facts={
        "user": "mwilson@company.com",
        "host": "LT-MKT-214",
        "dropper": "Q3_Invoice.pdf.exe",
        "share": "FS-HR-01",
        "variant": "BlackForge (LockBit family)",
        "extension": ".forge",
        "files_encrypted": 38_000,
        "ransom_note": "README_RESTORE.txt",
        "c2_ip": "91.219.236.18",
        "affected_employees": 12_000,
        "data_types": ["Employee SSNs", "Salaries", "Performance reviews"],
        "sha256": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    },
    context=[
        {"label": "Compromised user", "value": "mwilson@company.com (Marketing)"},
        {"label": "Patient zero", "value": "LT-MKT-214 (laptop)"},
        {"label": "Dropper", "value": "Q3_Invoice.pdf.exe"},
        {"label": "Lateral target", "value": "FS-HR-01 (HR file share)"},
        {"label": "Encrypted", "value": "~38,000 files (.forge extension)"},
        {"label": "At risk", "value": "SSNs / salaries — ~12,000 employees"},
    ],
    seed_summary=(
        "EDR ALERT log-edr-44120: rapid file encryption on LT-MKT-214 (~1,450 "
        "files/min, .forge) after mwilson@company.com executed Q3_Invoice.pdf.exe at "
        "14:02 UTC. Ransom note README_RESTORE.txt dropped."
    ),
    seed_log_event={
        "timestamp": "2026-06-17T14:02:00Z",
        "log_id": "log-edr-44120",
        "source_ip": "10.20.4.214",
        "destination_ip": "10.20.9.10",
        "event_type": "file_access",
        "severity": "high",
        "user_id": "mwilson@company.com",
        "location": "HQ-Marketing-Floor3",
        "status": "success",
        "metadata": {
            "process": "Q3_Invoice.pdf.exe",
            "files_encrypted_per_min": 1450,
            "encrypted_extension": ".forge",
            "ransom_note": "README_RESTORE.txt",
        },
    },
    detection={
        "detection_id": "det-2026-617-rw",
        "linked_logs": ["log-edr-44120"],
        "threat_type": "ransomware",
        "confidence_score": 0.93,
        "severity": "high",
        "agent": "ThreatDetectionAgent",
        "summary": (
            "Rapid mass file-encryption on LT-MKT-214 (mwilson@company.com) following "
            "execution of Q3_Invoice.pdf.exe."
        ),
    },
    findings={
        "threat-detection-agent": {"message_type": "alert", "payload": None},
        "log-analysis-agent": {
            "message_type": "finding",
            "payload": {
                "patient_zero": "LT-MKT-214",
                "compromised_user": "mwilson@company.com",
                "lateral_target": "FS-HR-01 (HR file share)",
                "protocol": "SMB / 445",
                "files_encrypted": 38_000,
                "ransom_note": "README_RESTORE.txt",
                "dropper": "Q3_Invoice.pdf.exe",
                "spread_method": "credential reuse + SMB share enumeration",
            },
        },
        "malware-analysis-agent": {
            "message_type": "finding",
            "payload": {
                "file_name": "Q3_Invoice.pdf.exe",
                "sha256": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
                "classification": "BlackForge ransomware (LockBit family)",
                "confidence": 0.96,
                "behaviors": [
                    "AES-256 file encryption (.forge extension)",
                    "Deletes Volume Shadow Copies (vssadmin)",
                    "Disables Windows Defender real-time protection",
                    "Spreads laterally over SMB",
                    "Drops ransom note README_RESTORE.txt",
                ],
                "c2_indicators": ["91.219.236.18"],
            },
        },
        "risk-assessment-agent": {
            "message_type": "alert",
            "payload": {
                "severity": "critical",
                "risk_score": 9.4,
                "compromised_asset": "FS-HR-01",
                "asset_classification": "HR File Share (Tier-1)",
                "data_exposed": ["Employee SSNs", "Salaries", "Performance reviews"],
                "affected_records": 12_000,
                "regulatory_scope": ["GDPR", "CCPA"],
                "business_impact": (
                    "Active encryption of the HR file share: operational outage plus "
                    "exposure of PII for ~12,000 employees."
                ),
            },
        },
        "compliance-agent": {
            "message_type": "recommendation",
            "payload": {
                "regulation": "GDPR / CCPA",
                "breach_confirmed": True,
                "reporting_deadline_hours": 72,
                "notification_targets": [
                    "Lead Supervisory Authority (DPA)",
                    "Affected employees",
                ],
                "document": "Ransomware_Breach_Report_2026.pdf",
            },
        },
        "pr-agent": {
            "message_type": "recommendation",
            "payload": {
                "internal_memo_draft": (
                    "URGENT — ALL STAFF: Disconnect your laptop from the network NOW "
                    "(unplug Ethernet, disable Wi-Fi). Do not shut down. Await IT instructions."
                ),
                "customer_alert_draft": (
                    "We are managing an internal security incident. Customer-facing "
                    "services are unaffected; we will share updates as needed."
                ),
                "press_release_draft": (
                    "Holding statement: We are responding to a contained internal "
                    "security incident and have engaged our incident-response process."
                ),
                "recommended_tone": "urgent, directive, calm",
            },
        },
    },
    fallback_narrative={
        "threat-detection-agent": (
            "Ransomware indicators on LT-MKT-214: mass file encryption (~1,450 "
            "files/min, .forge extension) began after mwilson@company.com opened "
            "Q3_Invoice.pdf.exe. Immediate containment investigation required."
        ),
        "log-analysis-agent": (
            "The infection spread from LT-MKT-214 over SMB to the HR file share "
            "FS-HR-01, encrypting ~38,000 files. Ransom note README_RESTORE.txt "
            "was dropped. Malware Analysis Agent, please analyze Q3_Invoice.pdf.exe."
        ),
        "malware-analysis-agent": (
            "Q3_Invoice.pdf.exe is BlackForge ransomware (LockBit family): AES-256 "
            "encryption, deletes shadow copies, disables Defender, and spreads via "
            "SMB. Risk Assessment Agent, please elevate incident severity."
        ),
        "risk-assessment-agent": (
            "Severity CRITICAL. The HR file share FS-HR-01 (SSNs, salaries, reviews "
            "for ~12,000 employees) is actively encrypting — operational outage plus "
            "employee-PII exposure. Compliance and PR action required immediately."
        ),
        "compliance-agent": (
            "Confirmed personal-data breach (employee PII) under GDPR/CCPA. 72-hour "
            "notification clock started. Draft prepared: Ransomware_Breach_Report_2026.pdf."
        ),
        "pr-agent": (
            "Drafted an URGENT internal directive to disconnect all laptops from the "
            "network, plus an employee notification and holding statement. Tone: "
            "urgent, directive, calm."
        ),
        "incident-commander": (
            "Synthesis complete: CRITICAL ransomware (BlackForge/LockBit) actively "
            "encrypting the HR file share. Kill chain: malicious PDF → LT-MKT-214 "
            "patient zero → SMB lateral spread to FS-HR-01. Recommendation: isolate "
            "patient-zero, halt the HR share, disable the account, and block the C2. "
            "Dossier submitted to the Human Security Officer for approval."
        ),
    },
    timeline=[
        {"time": "14:02:00", "event": "Mass file encryption detected on LT-MKT-214", "source": "Threat Detection Agent"},
        {"time": "14:02:40", "event": "Lateral spread via SMB to HR share FS-HR-01 (~38k files)", "source": "Log Analysis Agent"},
        {"time": "14:03:10", "event": "Dropper confirmed: BlackForge ransomware (LockBit family)", "source": "Malware Analysis Agent"},
        {"time": "14:03:40", "event": "Severity CRITICAL — employee PII on FS-HR-01", "source": "Risk Assessment Agent"},
        {"time": "14:04:10", "event": "GDPR / CCPA 72-hour notification clock started", "source": "Compliance Agent"},
        {"time": "14:04:40", "event": "Internal 'disconnect laptops' directive drafted", "source": "PR Agent"},
    ],
    compliance_flags={"regulation_active": ["GDPR", "CCPA"], "reporting_deadline_hours": 72},
    communications={
        "customer_alert_draft": (
            "We are managing an internal security incident. Customer-facing services "
            "remain available and we will provide updates if anything changes."
        ),
        "press_release_draft": (
            "Holding statement: We are responding to a contained internal security "
            "incident and have engaged our full incident-response process. There is no "
            "indication of customer impact at this time."
        ),
    },
    proposed_actions=[
        {"action_id": "act-01", "action_type": "isolate_host", "target": "LT-MKT-214", "description": "Quarantine patient-zero laptop from the network immediately.", "risk_level": "low"},
        {"action_id": "act-02", "action_type": "isolate_host", "target": "FS-HR-01", "description": "Halt SMB on the HR file share to stop the encryption spread.", "risk_level": "high"},
        {"action_id": "act-03", "action_type": "lock_user", "target": "mwilson@company.com", "description": "Disable the compromised marketing account and all active sessions.", "risk_level": "medium"},
        {"action_id": "act-04", "action_type": "block_ip", "target": "91.219.236.18", "description": "Block the BlackForge C2 beacon IP at the network firewall.", "risk_level": "low"},
    ],
)
RANSOMWARE_LATERAL.findings["threat-detection-agent"]["payload"] = RANSOMWARE_LATERAL.detection


# ════════════════════════════════════════════════════════════════════════════
# Scenario 3 — AWS cloud cryptojacking (leaked IAM key → rogue GPU mining)
# ════════════════════════════════════════════════════════════════════════════
AWS_CRYPTOJACKING = Scenario(
    id="aws-cryptojacking",
    name="AWS Cloud Cryptojacking",
    category="Cloud / Cryptojacking",
    description=(
        "A CI/CD IAM access key is accidentally pushed to a public GitHub repository. "
        "Within minutes, Datadog flags a spike of GPU EC2 instance creations in an "
        "unusual region. The instances run XMRig mining to a Monero pool — financial "
        "and compute theft, with no customer or personal data accessed."
    ),
    incident_id="incident-2026-06-18-cj",
    room_title="#incident-2026-06-18-cj",
    threat_type="cryptojacking",
    dossier_severity="critical",
    facts={
        "principal": "ci-deploy-bot",
        "iam_key": "AKIA4XMPL3QZ7K2NDEMO",
        "repo": "github.com/acme/payments-api",
        "region": "ap-south-1 (Mumbai)",
        "instance_type": "p4d.24xlarge",
        "instance_count": 48,
        "attacker_ip": "45.135.232.9",
        "mining_pool": "pool.minexmr.com:4444",
        "wallet": "4xRADEMOwa11etMoneR0xx",
        "loss_per_day_usd": 84_000,
    },
    context=[
        {"label": "IAM principal", "value": "ci-deploy-bot"},
        {"label": "Leaked key", "value": "AKIA4XMPL3... (public GitHub)"},
        {"label": "Repository", "value": "github.com/acme/payments-api"},
        {"label": "Region", "value": "ap-south-1 (Mumbai)"},
        {"label": "Rogue compute", "value": "48 x p4d.24xlarge GPU instances"},
        {"label": "Estimated loss", "value": "~$84,000 / day"},
    ],
    seed_summary=(
        "DATADOG ALERT log-cloudtrail-77310: 48 GPU EC2 instances (p4d.24xlarge) "
        "launched in ap-south-1 at 03:47 UTC via IAM key AKIA4XMPL3 (principal "
        "ci-deploy-bot), from 45.135.232.9."
    ),
    seed_log_event={
        "timestamp": "2026-06-18T03:47:00Z",
        "log_id": "log-cloudtrail-77310",
        "source_ip": "45.135.232.9",
        "destination_ip": "13.234.0.10",
        "event_type": "process_creation",
        "severity": "high",
        "user_id": "ci-deploy-bot",
        "location": "ap-south-1 (Mumbai)",
        "status": "success",
        "metadata": {
            "api_call": "RunInstances",
            "instance_type": "p4d.24xlarge",
            "instance_count": 48,
            "iam_access_key": "AKIA4XMPL3QZ7K2NDEMO",
            "source_repo": "github.com/acme/payments-api",
        },
    },
    detection={
        "detection_id": "det-2026-618-cj",
        "linked_logs": ["log-cloudtrail-77310"],
        "threat_type": "cryptojacking",
        "confidence_score": 0.90,
        "severity": "high",
        "agent": "ThreatDetectionAgent",
        "summary": (
            "48 GPU EC2 instances launched in ap-south-1 via IAM key AKIA4XMPL3 found "
            "exposed in a public GitHub repository."
        ),
    },
    findings={
        "threat-detection-agent": {"message_type": "alert", "payload": None},
        "log-analysis-agent": {
            "message_type": "finding",
            "payload": {
                "leaked_key": "AKIA4XMPL3QZ7K2NDEMO",
                "principal": "ci-deploy-bot",
                "source_repo": "github.com/acme/payments-api (public)",
                "api_calls": ["RunInstances x48", "CreateKeyPair", "DescribeImages"],
                "region": "ap-south-1",
                "instances": "48 x p4d.24xlarge (GPU)",
                "attacker_ip": "45.135.232.9",
                "first_seen": "03:41 UTC",
            },
        },
        "malware-analysis-agent": {
            "message_type": "finding",
            "payload": {
                "artifact": "EC2 user-data startup script",
                "classification": "XMRig Monero cryptominer",
                "confidence": 0.95,
                "behaviors": [
                    "Downloads xmrig binary from a pastebin URL",
                    "Connects to mining pool pool.minexmr.com:4444",
                    "Mines Monero to wallet 4xRADEMOwa11etMoneR0xx",
                    "Disables CloudWatch agent to evade billing alerts",
                ],
                "mining_pool": "pool.minexmr.com:4444",
            },
        },
        "risk-assessment-agent": {
            "message_type": "alert",
            "payload": {
                "severity": "critical",
                "risk_score": 8.1,
                "compromised_asset": "AWS Production Account 8821",
                "asset_classification": "Cloud compute (no data store accessed)",
                "data_exposed": [],
                "estimated_loss_per_day_usd": 84_000,
                "regulatory_scope": [],
                "business_impact": (
                    "Financial / compute theft at ~$84,000/day in rogue GPU usage. "
                    "No customer or personal data was accessed."
                ),
            },
        },
        "compliance-agent": {
            "message_type": "recommendation",
            "payload": {
                "regulation": "None (no personal-data breach)",
                "breach_confirmed": False,
                "reporting_deadline_hours": 0,
                "notification_targets": [
                    "Finance / FinOps",
                    "Cloud security team",
                    "AWS Trust & Safety",
                ],
                "note": (
                    "Not a GDPR/CCPA reportable breach — a financial-loss and "
                    "cloud-abuse incident. No 72-hour clock applies."
                ),
            },
        },
        "pr-agent": {
            "message_type": "recommendation",
            "payload": {
                "internal_memo_draft": (
                    "FINOPS / SECURITY BRIEFING: Leaked IAM key led to rogue GPU mining "
                    "(~$84k/day). Contained; no data accessed. No public disclosure required."
                ),
                "customer_alert_draft": (
                    "No customer or personal data was accessed; no customer "
                    "notification is required for this incident."
                ),
                "press_release_draft": (
                    "Internal only — no public statement required. No customer data "
                    "was involved in this cloud-resource abuse incident."
                ),
                "recommended_tone": "factual, internal, no public disclosure",
            },
        },
    },
    fallback_narrative={
        "threat-detection-agent": (
            "Cloud anomaly: 48 GPU EC2 instances (p4d.24xlarge) launched in ap-south-1 "
            "via IAM key AKIA4XMPL3 — a key found in the public repository "
            "github.com/acme/payments-api. Investigate immediately."
        ),
        "log-analysis-agent": (
            "The leaked key belongs to ci-deploy-bot. CloudTrail shows 48 RunInstances "
            "calls from 45.135.232.9 in ap-south-1, far from our normal regions. "
            "Malware Analysis Agent, please inspect the instance startup scripts."
        ),
        "malware-analysis-agent": (
            "The EC2 user-data scripts install XMRig and connect to "
            "pool.minexmr.com:4444 (Monero). This is cryptojacking, not data theft. "
            "Risk and Compliance, please assess."
        ),
        "risk-assessment-agent": (
            "Severity CRITICAL by cost: ~$84,000/day in rogue GPU compute. No data "
            "store was accessed — this is financial/compute theft, not a data breach. "
            "Compliance and PR, please confirm scope and notify Finance."
        ),
        "compliance-agent": (
            "This is NOT a personal-data breach — no GDPR/CCPA clock applies. This is "
            "a cloud-abuse and financial-loss event; notify Finance, the cloud security "
            "team, and AWS Trust & Safety."
        ),
        "pr-agent": (
            "No customer data was affected, so no public disclosure is required. "
            "Prepared an internal FinOps/security briefing only. Tone: factual, internal."
        ),
        "incident-commander": (
            "Synthesis complete: cryptojacking via a leaked IAM key (~$84k/day, no data "
            "breach). Kill chain: key exposed in public repo → 48 rogue GPU EC2 instances "
            "→ XMRig Monero mining. Recommendation: revoke the IAM key, terminate rogue "
            "instances, disable the principal, and block the mining pool. Dossier "
            "submitted to the Human Security Officer for approval."
        ),
    },
    timeline=[
        {"time": "03:47:00", "event": "48 GPU EC2 instances launched in ap-south-1", "source": "Threat Detection Agent"},
        {"time": "03:47:35", "event": "Leaked IAM key (ci-deploy-bot) traced to public GitHub repo", "source": "Log Analysis Agent"},
        {"time": "03:48:05", "event": "Startup scripts run XMRig to Monero mining pool", "source": "Malware Analysis Agent"},
        {"time": "03:48:35", "event": "Severity CRITICAL — ~$84k/day, no data accessed", "source": "Risk Assessment Agent"},
        {"time": "03:49:00", "event": "No GDPR/CCPA clock — financial / cloud-abuse only", "source": "Compliance Agent"},
        {"time": "03:49:30", "event": "Internal-only briefing prepared (no public disclosure)", "source": "PR Agent"},
    ],
    compliance_flags={"regulation_active": [], "reporting_deadline_hours": 0},
    communications={
        "customer_alert_draft": (
            "No customer or personal data was accessed in this incident; no customer "
            "notification is required."
        ),
        "press_release_draft": (
            "Internal only — no public statement required. This was a cloud-resource "
            "abuse incident with no customer-data involvement."
        ),
    },
    proposed_actions=[
        {"action_id": "act-01", "action_type": "revoke_key", "target": "AKIA4XMPL3QZ7K2NDEMO", "description": "Revoke the leaked IAM access key immediately.", "risk_level": "low"},
        {"action_id": "act-02", "action_type": "terminate_instances", "target": "48 x p4d.24xlarge (ap-south-1)", "description": "Terminate all rogue GPU EC2 instances.", "risk_level": "medium"},
        {"action_id": "act-03", "action_type": "lock_user", "target": "ci-deploy-bot", "description": "Disable the compromised IAM principal pending key rotation.", "risk_level": "medium"},
        {"action_id": "act-04", "action_type": "block_ip", "target": "45.135.232.9", "description": "Block the attacker source IP and egress to the mining pool.", "risk_level": "low"},
    ],
)
AWS_CRYPTOJACKING.findings["threat-detection-agent"]["payload"] = AWS_CRYPTOJACKING.detection


# ── Registry ─────────────────────────────────────────────────────────────────
SCENARIOS: dict[str, Scenario] = {
    s.id: s for s in (ROMANIAN_PII, RANSOMWARE_LATERAL, AWS_CRYPTOJACKING)
}
DEFAULT_SCENARIO_ID = ROMANIAN_PII.id


def get_scenario(scenario_id: str | None) -> Scenario:
    return SCENARIOS.get(scenario_id or DEFAULT_SCENARIO_ID, ROMANIAN_PII)


def list_scenarios() -> list[Scenario]:
    return list(SCENARIOS.values())
