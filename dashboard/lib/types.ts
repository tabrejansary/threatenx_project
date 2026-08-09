/** TypeScript types matching all Threatenx JSON schemas (SRS Part 2 §6) */

export type Severity = "low" | "medium" | "high" | "critical";
export type MessageType = "finding" | "alert" | "recommendation" | "query";
export type ConnectionState = "connecting" | "live" | "offline";
export type Phase = "idle" | "running" | "done";
export type DossierTab = "customer" | "press" | "compliance" | "raw";

// SRS §6.4 — Individual containment action
export interface ProposedAction {
  action_id: string;
  action_type: string;
  target: string;
  description: string;
  risk_level: "low" | "medium" | "high";
}

// SRS §6.4 — Timeline entry
export interface TimelineEntry {
  time: string;
  event: string;
  source: string;
}

// SRS §6.4 — Compliance flags
export interface ComplianceFlags {
  regulation_active: string[];
  reporting_deadline_hours: number;
}

// SRS §6.4 — Crisis communications
export interface Communications {
  customer_alert_draft: string;
  press_release_draft: string;
}

// SRS §6.4 — Full incident dossier from the Incident Commander
export interface Dossier {
  incident_id: string;
  severity: Severity;
  timeline: TimelineEntry[];
  compliance_flags: ComplianceFlags;
  communications: Communications;
  proposed_actions: ProposedAction[];
}

// Scenario context fact (label-value pair)
export interface ContextFact {
  label: string;
  value: string;
}

// Public scenario bundle served by the bridge and bundled in scenarios.json
export interface ScenarioPublic {
  id: string;
  name: string;
  category: string;
  description: string;
  incident_id: string;
  room_title: string;
  threat_type: string;
  severity: Severity;
  context: ContextFact[];
  seed_summary: string;
  seed_event: Record<string, unknown>;
  detection: Record<string, unknown>;
  timeline: TimelineEntry[];
  compliance_flags: ComplianceFlags;
  communications: Communications;
  proposed_actions: ProposedAction[];
  dossier: Dossier;
  feed?: FeedEntry[];  // present only in scenarios.json (offline replay)
}

// One message in the real-time collaboration feed
export interface FeedEntry {
  seq: number;
  id: string;
  clock: string;
  from_agent: string;
  handle: string;
  llm: string | null;
  content: string;
  mentions: string[];
  message_type: MessageType;
  is_dossier: boolean;
  payload: unknown | null;
}
