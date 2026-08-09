"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type {
  ConnectionState,
  Dossier,
  DossierTab,
  FeedEntry,
  Phase,
  ProposedAction,
  ScenarioPublic,
} from "@/lib/types";

const BRIDGE_WS  = process.env.NEXT_PUBLIC_BRIDGE_URL || "ws://localhost:8787/ws";
const HTTP_BASE  = BRIDGE_WS.replace(/^ws/, "http").replace(/\/ws$/, "");

// ── Agent color map ───────────────────────────────────────────────────────────
const AGENT: Record<string, { color: string; initials: string; name: string }> = {
  "threat-detection-agent":  { color: "var(--c-threat)",     initials: "TD",  name: "Threat Detection" },
  "log-analysis-agent":      { color: "var(--c-log)",        initials: "LA",  name: "Log Analysis" },
  "malware-analysis-agent":  { color: "var(--c-malware)",    initials: "MW",  name: "Malware Analysis" },
  "risk-assessment-agent":   { color: "var(--c-risk)",       initials: "RA",  name: "Risk Assessment" },
  "compliance-agent":        { color: "var(--c-compliance)", initials: "CO",  name: "Compliance" },
  "pr-agent":                { color: "var(--c-pr)",         initials: "PR",  name: "PR / Comms" },
  "incident-commander":      { color: "var(--c-commander)",  initials: "IC",  name: "Incident Commander" },
  "system":                  { color: "var(--c-system)",     initials: "EDR", name: "EDR Telemetry" },
  "officer":                 { color: "var(--c-officer)",    initials: "SO",  name: "Security Officer" },
};

// Action type display config (text only — no emojis)
const ACTION_TYPE: Record<string, { label: string; icon: React.ReactNode }> = {
  block_ip:            { label: "Block IP",             icon: <IcnBlock /> },
  lock_user:           { label: "Revoke Credentials",   icon: <IcnLock /> },
  isolate_host:        { label: "Isolate Host",         icon: <IcnIsolate /> },
  password_reset:      { label: "Password Reset",       icon: <IcnReset /> },
  revoke_key:          { label: "Revoke IAM Key",       icon: <IcnLock /> },
  terminate_instances: { label: "Terminate Instances",  icon: <IcnTerminate /> },
  quarantine_file:     { label: "Quarantine File",      icon: <IcnIsolate /> },
};

const ALL_AGENTS = [
  { handle: "threat-detection-agent",  llm: "Gemini" },
  { handle: "log-analysis-agent",      llm: "Gemini" },
  { handle: "malware-analysis-agent",  llm: "Gemini" },
  { handle: "risk-assessment-agent",   llm: "Gemini" },
  { handle: "compliance-agent",        llm: "Gemini" },
  { handle: "pr-agent",                llm: "Gemini" },
  { handle: "incident-commander",      llm: "Groq" },
];

export default function PortalPage() {
  const [scenarios,  setScenarios]  = useState<ScenarioPublic[]>([]);
  const [activeId,   setActiveId]   = useState("");
  const [phase,      setPhase]      = useState<Phase>("idle");
  const [feed,       setFeed]       = useState<FeedEntry[]>([]);
  const [dossier,    setDossier]    = useState<Dossier | null>(null);
  const [conn,       setConn]       = useState<ConnectionState>("connecting");
  const [bridgeMode, setBridgeMode] = useState<string | null>(null);
  const [selected,   setSelected]   = useState<Set<string>>(new Set());
  const [approved,   setApproved]   = useState(false);
  const [tab,        setTab]        = useState<DossierTab>("customer");
  const [draft,      setDraft]      = useState("");

  const wsRef      = useRef<WebSocket | null>(null);
  const feedEndRef = useRef<HTMLDivElement>(null);
  const timers     = useRef<ReturnType<typeof setTimeout>[]>([]);

  const active    = useMemo(() => scenarios.find(s => s.id === activeId) ?? null, [scenarios, activeId]);
  const connected = conn === "live";

  // ── Load scenarios ──────────────────────────────────────────────────────────
  useEffect(() => {
    const apply = (data: ScenarioPublic[]) => {
      setScenarios(data);
      setActiveId(cur => cur || data[0]?.id || "");
    };
    fetch(`${HTTP_BASE}/scenarios`, { cache: "no-store" })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(apply)
      .catch(() =>
        fetch("/scenarios.json", { cache: "no-store" })
          .then(r => r.json()).then(apply).catch(() => undefined)
      );
  }, []);

  // ── WebSocket ───────────────────────────────────────────────────────────────
  useEffect(() => {
    let dead = false;
    let ws: WebSocket;
    try { ws = new WebSocket(BRIDGE_WS); } catch { setConn("offline"); return; }
    wsRef.current = ws;
    ws.onopen  = () => !dead && setConn("live");
    ws.onerror = () => !dead && setConn(c => c === "live" ? c : "offline");
    ws.onclose = () => !dead && setConn("offline");
    ws.onmessage = ev => {
      if (dead) return;
      let m: Record<string,unknown>;
      try { m = JSON.parse(ev.data as string); } catch { return; }
      if (m.type === "snapshot") {
        setBridgeMode((m.mode as string) ?? null);
        setConn("live");
        if (m.active_scenario) setActiveId(c => c || (m.active_scenario as string));
        const snap = m as { feed?: FeedEntry[]; dossier?: Dossier };
        if (snap.feed?.length) {
          setFeed(snap.feed);
          setPhase(snap.dossier ? "done" : "running");
          if (snap.dossier) setDossier(snap.dossier);
        }
      } else if (m.type === "reset") {
        clearTimers();
        setActiveId(m.scenario_id as string);
        setFeed([]); setDossier(null); setApproved(false); setPhase("running");
      } else if (m.type === "message" && m.entry) {
        const e = m.entry as FeedEntry;
        setFeed(prev => prev.some(x => x.id === e.id) ? prev : [...prev, e]);
      } else if (m.type === "dossier" && m.dossier) {
        const d = m.dossier as Dossier;
        setDossier(d);
        setSelected(new Set(d.proposed_actions.map(a => a.action_id)));
        setPhase("done");
      }
    };
    return () => { dead = true; ws.close(); };
  }, []);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [feed]);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function pickScenario(id: string) {
    clearTimers();
    setActiveId(id);
    setPhase("idle"); setFeed([]); setDossier(null); setApproved(false);
    const s = scenarios.find(x => x.id === id);
    if (s) setSelected(new Set(s.proposed_actions.map(a => a.action_id)));
  }

  function offlineReplay(scenario: ScenarioPublic) {
    (scenario.feed ?? []).forEach((entry, i) => {
      const t = setTimeout(() => {
        setFeed(prev => [...prev, entry]);
        if (entry.is_dossier) {
          setDossier(scenario.dossier);
          setSelected(new Set(scenario.dossier.proposed_actions.map(a => a.action_id)));
          setPhase("done");
        }
      }, 600 + i * 1100);
      timers.current.push(t);
    });
  }

  async function triggerIncident() {
    if (!active) return;
    clearTimers();
    setFeed([]); setDossier(null); setApproved(false); setPhase("running");
    if (connected) {
      try {
        await fetch(`${HTTP_BASE}/api/trigger`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenario_id: active.id }),
        });
        return;
      } catch { /* offline replay */ }
    }
    offlineReplay(active);
  }

  async function approve() {
    if (!active) return;
    try {
      await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incident_id: active.incident_id, action_ids: [...selected] }),
      });
    } catch { /* best-effort */ }
    setApproved(true);
  }

  const sendMsg = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    const ws = wsRef.current;
    if (connected && ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "message", content: text }));
    } else {
      setFeed(prev => [...prev, {
        seq: 9000 + prev.length, id: `op-${prev.length}`,
        clock: new Date().toTimeString().slice(0,8),
        from_agent: "Security Officer", handle: "officer", llm: null,
        content: text, mentions: [], message_type: "query",
        is_dossier: false, payload: null,
      }]);
    }
    setDraft("");
  }, [draft, connected]);

  if (!active) {
    return (
      <div className="full-center">
        <div style={{ textAlign: "center" }}>
          <HexShield size={52} color="var(--text-faint)" />
          <p style={{ marginTop: 16, color: "var(--text-muted)", fontSize: 13 }}>
            Loading incident workspace…
          </p>
        </div>
      </div>
    );
  }

  const cf      = dossier?.compliance_flags ?? active.compliance_flags;
  const comms   = dossier?.communications   ?? active.communications;
  const actions = dossier?.proposed_actions ?? [];
  const timeline= dossier?.timeline         ?? active.timeline;
  const reg     = cf.regulation_active.join(", ") || "None";

  const connText = conn === "live"
    ? (bridgeMode === "live" ? "LIVE · Band Mesh" : "LIVE · Agent Simulation")
    : conn === "connecting" ? "Connecting…" : "Offline — Replay Mode";

  return (
    <>
      {/* ════════════════ TOP NAV ════════════════ */}
      <header className="topnav">
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <Link href="/" className="nav-brand">
            <HexShield size={34} color="#fff" />
            <div className="nav-wordmark">
              <div className="nav-product-name">
                Threaten<em>x</em>
              </div>
              <div className="nav-product-sub">Detect · Decide · Defend</div>
            </div>
          </Link>

          <div className="nav-divider" />
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 12, fontWeight: 500 }}>
              Platform Overview
            </Link>
            <span style={{ color: "var(--text-primary)", fontSize: 12, fontWeight: 600 }}>
              Active Incident Portal
            </span>
          </div>
        </div>

        <div className="nav-right">
          <div className={`conn-pill ${conn}`}>
            <div className="conn-dot" />
            {connText}
          </div>
          <div className="nav-user">
            <div className="nav-avatar">AD</div>
            <div className="nav-user-info">
              <div className="nav-user-name">Security Officer</div>
              <div className="nav-user-role">Threatenx HITL Portal</div>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════ APP SHELL ════════════════ */}
      <div className="app-shell">

        {/* ════ LEFT SIDEBAR ════ */}
        <aside className="col">

          {/* Incident list */}
          <div className="sidebar-block">
            <div className="block-header">
              <span className="block-title">Active Incidents</span>
              <span className="block-count">{scenarios.length}</span>
            </div>

            {scenarios.map(s => {
              const isActive = s.id === activeId;
              const isDone   = isActive && phase === "done";
              const isRun    = isActive && phase === "running";
              return (
                <div
                  key={s.id}
                  id={`inc-${s.id}`}
                  className={`inc-card ${isActive ? "active" : ""}`}
                  onClick={() => pickScenario(s.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === "Enter" && pickScenario(s.id)}
                >
                  <div className="inc-category">{s.category}</div>
                  <div className="inc-name">{s.name}</div>
                  <div className="inc-footer">
                    <span className={`sev ${s.severity}`}>{s.severity}</span>
                    <span className={`inc-status ${isDone ? "done" : isRun ? "running" : ""}`}>
                      {isDone ? "Resolved" : isRun ? "Running" : "Standby"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Agent roster */}
          <div className="sidebar-block">
            <div className="block-header">
              <span className="block-title">Agent Federation</span>
              <span className="block-count">7</span>
            </div>
            <div className="agent-list">
              {ALL_AGENTS.map(a => {
                const meta = AGENT[a.handle];
                return (
                  <div key={a.handle} className="agent-row">
                    <div className="agent-dot" style={{ background: meta?.color }} />
                    <span className="agent-label">{meta?.name}</span>
                    <span className="agent-llm">{a.llm}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ════ CENTER COLUMN ════ */}
        <section className="col col-main">

          {/* Incident title bar */}
          <div className="inc-header-bar">
            <span className={`sev ${active.severity}`}>{active.severity}</span>
            <div className="inc-header-text">
              <div className="inc-header-title">{active.name}</div>
              <div className="inc-header-meta">
                {active.room_title}
                &nbsp;·&nbsp;{active.category}
                {active.threat_type ? `  ·  ${active.threat_type.replace(/_/g," ")}` : ""}
              </div>
            </div>
          </div>

          {phase === "idle" ? (
            /* ─── Pre-trigger context ─── */
            <div className="ctx-view">
              <p className="ctx-description">{active.description}</p>

              <div className="ctx-section-title">Seeded Forensic Context</div>
              <div className="facts-grid">
                {active.context.map((c, i) => (
                  <div key={i} className="fact-tile">
                    <div className="fact-tile-label">{c.label}</div>
                    <div className="fact-tile-value">{c.value}</div>
                  </div>
                ))}
              </div>

              <div className="ctx-section-title">Initial EDR Telemetry Event</div>
              <pre className="code-block">{JSON.stringify(active.seed_event, null, 2)}</pre>

              <div className="trigger-area">
                <button
                  id="btn-trigger-incident"
                  className="btn-trigger"
                  onClick={triggerIncident}
                  disabled={phase !== "idle"}
                >
                  <IcnPlay />
                  Trigger Incident Response
                </button>
                <p className="trigger-hint">
                  {connected
                    ? `Engages 7 autonomous agents via the ${bridgeMode === "live" ? "live Band mesh" : "agent simulation mesh"}. Streams the full response cascade in real time.`
                    : "Bridge offline — will replay seeded agent responses. Start dashboard_bridge.py for live agent mode."}
                </p>
              </div>
            </div>
          ) : (
            /* ─── Active incident view ─── */
            <>
              {/* System Timeline */}
              <div className="panel">
                <div className="panel-hd">
                  <span className="panel-title">System Timeline</span>
                  <span className="panel-badge">{timeline.length} events</span>
                </div>
                <div className="timeline">
                  {timeline.map((t, i) => (
                    <div key={i} className="tl-item">
                      <div className="tl-time">{t.time}</div>
                      <div className="tl-event">{t.event}</div>
                      <div className="tl-source">{t.source}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feed header */}
              <div style={{ padding:"12px 22px 0", flexShrink:0 }}>
                <div className="panel-hd">
                  <span className="panel-title">Band Collaboration Feed</span>
                  <span className={`panel-badge ${phase === "running" ? "streaming" : ""}`}>
                    {phase === "running" ? "Streaming" : `${feed.length} messages`}
                  </span>
                </div>
              </div>

              {/* Live feed */}
              <div className="feed-area">
                {feed.map(m => <MsgCard key={`${m.handle}-${m.id ?? m.seq}`} entry={m} />)}

                {phase === "running" && (
                  <div className="typing-ind">
                    <div className="dots">
                      <div className="dot" />
                      <div className="dot" />
                      <div className="dot" />
                    </div>
                    <span>Agents collaborating in real time…</span>
                  </div>
                )}
                <div ref={feedEndRef} />
              </div>

              {/* Operator input */}
              <div className="op-input-bar">
                <input
                  id="op-input"
                  className="op-input"
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMsg()}
                  placeholder="Message the room (e.g. @IncidentCommander request additional context on the kill chain)"
                />
                <button id="btn-send" className="btn-send" onClick={sendMsg}>
                  Send
                </button>
              </div>
            </>
          )}
        </section>

        {/* ════ RIGHT PANEL ════ */}
        <aside className="col">

          {/* Summary stats */}
          <div className="panel">
            <div className="panel-hd">
              <span className="panel-title">Incident Summary</span>
            </div>
            <div className="stats-grid">
              <div className="stat-tile">
                <div className="stat-label">Severity</div>
                <div className={`stat-value ${active.severity}`}>{active.severity.toUpperCase()}</div>
              </div>
              <div className="stat-tile">
                <div className="stat-label">Regulation</div>
                <div className={`stat-value ${reg === "None" ? "" : "small"}`}>{reg}</div>
              </div>
              <div className="stat-tile">
                <div className="stat-label">Deadline</div>
                <div className={`stat-value ${cf.reporting_deadline_hours > 0 ? "deadline" : ""}`}>
                  {cf.reporting_deadline_hours > 0 ? `${cf.reporting_deadline_hours}h` : "—"}
                </div>
              </div>
              <div className="stat-tile">
                <div className="stat-label">Incident ID</div>
                <div className="stat-value small mono" style={{ fontSize:10, wordBreak:"break-all" }}>
                  {active.incident_id}
                </div>
              </div>
            </div>
          </div>

          {/* Action Center — HITL */}
          <div className="panel">
            <div className="panel-hd">
              <span className="panel-title">Containment Actions</span>
              {dossier && <span className="panel-badge">{selected.size} selected</span>}
            </div>

            {!dossier ? (
              <div className="placeholder-msg">
                {phase === "running"
                  ? "Incident Commander is synthesizing the containment playbook…"
                  : "Trigger incident response to generate the containment playbook."}
              </div>
            ) : (
              <>
                {actions.map((a: ProposedAction) => {
                  const cfg = ACTION_TYPE[a.action_type] ?? { label: a.action_type, icon: <IcnBlock /> };
                  return (
                    <div
                      key={a.action_id}
                      id={`action-${a.action_id}`}
                      className={`action-card ${selected.has(a.action_id) ? "selected" : ""}`}
                      onClick={() => {
                        if (approved) return;
                        setSelected(s => {
                          const n = new Set(s);
                          n.has(a.action_id) ? n.delete(a.action_id) : n.add(a.action_id);
                          return n;
                        });
                      }}
                    >
                      <input
                        type="checkbox"
                        className="ac-checkbox"
                        checked={selected.has(a.action_id)}
                        disabled={approved}
                        onChange={() => {}}
                        id={`chk-${a.action_id}`}
                      />
                      <div className="ac-body">
                        <div className="ac-type-row">
                          <div className="ac-icon">{cfg.icon}</div>
                          <span className="ac-type-name">{cfg.label}</span>
                        </div>
                        <div className="ac-target">{a.target}</div>
                        <div className="ac-desc">{a.description}</div>
                      </div>
                      <span className={`risk-lbl ${a.risk_level}`}>{a.risk_level}</span>
                    </div>
                  );
                })}

                <button
                  id="btn-approve"
                  className={`btn-approve ${approved ? "approved" : ""}`}
                  disabled={approved || selected.size === 0}
                  onClick={approve}
                >
                  {approved
                    ? "Containment Executed"
                    : `Approve ${selected.size} Action${selected.size === 1 ? "" : "s"}`}
                </button>

                {approved && (
                  <div className="approve-confirm">
                    {selected.size} containment action{selected.size === 1 ? "" : "s"} dispatched to the integration layer.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Dossier viewer */}
          {dossier && (
            <div className="panel">
              <div className="panel-hd">
                <span className="panel-title">Dossier &amp; Artifacts</span>
              </div>

              <div className="tab-bar">
                {(["customer","press","compliance","raw"] as DossierTab[]).map(t => (
                  <button
                    key={t}
                    id={`tab-${t}`}
                    className={`tab-pill ${tab === t ? "on" : ""}`}
                    onClick={() => setTab(t)}
                  >
                    {t === "customer" ? "Customer Alert"
                      : t === "press" ? "Press Release"
                      : t === "compliance" ? "Compliance"
                      : "Raw JSON"}
                  </button>
                ))}
              </div>

              {tab === "customer" && (
                <div className="doc-pane">{comms.customer_alert_draft}</div>
              )}
              {tab === "press" && (
                <div className="doc-pane">{comms.press_release_draft}</div>
              )}
              {tab === "compliance" && (
                <div className="kv-table">
                  <div className="kv-row">
                    <span className="kv-key">Regulation</span>
                    <span className="kv-val">{reg}</span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-key">Reporting Deadline</span>
                    <span className={`kv-val ${cf.reporting_deadline_hours > 0 ? "deadline" : ""}`}>
                      {cf.reporting_deadline_hours > 0 ? `${cf.reporting_deadline_hours} hours` : "Not applicable"}
                    </span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-key">Severity</span>
                    <span className="kv-val">{active.severity.toUpperCase()}</span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-key">Incident ID</span>
                    <span className="kv-val mono" style={{ fontSize:10 }}>{active.incident_id}</span>
                  </div>
                </div>
              )}
              {tab === "raw" && (
                <pre className="doc-pane mono" style={{ fontSize:11 }}>
                  {JSON.stringify(dossier, null, 2)}
                </pre>
              )}
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

function MsgCard({ entry }: { entry: FeedEntry }) {
  const meta = AGENT[entry.handle] ?? { color: "var(--text-secondary)", initials: "??", name: entry.from_agent };
  const llm = entry.llm ?? (entry.handle === "incident-commander" ? "groq" : entry.handle !== "system" && entry.handle !== "officer" ? "gemini" : null);

  return (
    <div
      id={`msg-${entry.id}`}
      className={`msg-card ${entry.is_dossier ? "dossier" : ""}`}
      style={{ borderLeftColor: meta.color }}
    >
      <div className="msg-head">
        <div
          className="msg-avatar"
          style={{ background: meta.color, color: "#080808" }}
          title={meta.name}
        >
          <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 0 }}>
            {meta.initials}
          </span>
        </div>
        <span className="msg-from" style={{ color: meta.color }}>{entry.from_agent}</span>
        {llm && <span className="msg-llm-tag">{llm}</span>}
        {entry.clock && <span className="msg-time">{entry.clock}</span>}
        {entry.mentions.length > 0 && (
          <span className="msg-arrow">→ {entry.mentions.map(m => `@${m}`).join(", ")}</span>
        )}
      </div>
      <div className="msg-body">{entry.content}</div>
      {entry.is_dossier && (
        <div className="msg-dossier-strip">
          Incident dossier compiled — submitted to Security Officer for containment approval
        </div>
      )}
    </div>
  );
}

function HexShield({ size = 32, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 2L36 10v12c0 9-7.2 17.1-16 18C11.2 39.1 4 31 4 22V10L20 2z"
        fill={color}
        fillOpacity="0.12"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14 20l4.5 4.5L26 16"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IcnPlay() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <polygon points="5,2 14,8 5,14" fill="currentColor" />
    </svg>
  );
}

function IcnBlock() {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="var(--crit)" strokeWidth="1.4"/>
      <line x1="3" y1="3" x2="11" y2="11" stroke="var(--crit)" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function IcnLock() {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <rect x="2.5" y="6" width="9" height="6.5" rx="1.5" stroke="var(--high)" strokeWidth="1.4"/>
      <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="var(--high)" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function IcnIsolate() {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="var(--medium)" strokeWidth="1.4"/>
      <line x1="7" y1="4" x2="7" y2="10" stroke="var(--medium)" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="4" y1="7" x2="10" y2="7" stroke="var(--medium)" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function IcnReset() {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7a4.5 4.5 0 104.5-4.5H4" stroke="var(--low)" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M2.5 3.5V7H6" stroke="var(--low)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IcnTerminate() {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <line x1="3" y1="3" x2="11" y2="11" stroke="var(--crit)" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="11" y1="3" x2="3" y2="11" stroke="var(--crit)" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
