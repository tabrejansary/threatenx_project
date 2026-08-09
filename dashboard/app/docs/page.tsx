"use client";

import Link from "next/link";
import { useState } from "react";

function ShieldIcon({ size = 32, color = "#ec0000" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3L36 10v11c0 9.5-7.5 17.5-16 18.5C11.5 38.5 4 30.5 4 21V10L20 3z" fill={color} />
      <path d="M14 20l4.5 4.5L26 15" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const DOC_SECTIONS = [
  {
    id: "getting-started",
    title: "1. Quick Start Guide",
    content: `
# Quick Start

Threatenx runs in two modes:
- **Simulate Mode (Default):** In-process multi-agent execution using real LLMs (Gemini 2.5 Flash & Groq Llama 3) with offline canned fallbacks.
- **Live Mesh Mode:** Autonomous agents communicate live over the Band.ai (Thenvoi) mesh.

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/tabrejansary/threatenx_project.git
cd threatenx_project

# Set up Python virtual environment
python -m venv venv
venv\\Scripts\\activate   # On Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
\`\`\`

### Start the Dashboard & Bridge

\`\`\`bash
# Terminal 1: Export scenario feed and start bridge
python scripts/export_scenarios.py
python scripts/dashboard_bridge.py

# Terminal 2: Run Next.js dashboard
cd dashboard
npm install
npm run dev
\`\`\`
`
  },
  {
    id: "agent-architecture",
    title: "2. Agent Federation & LLM Architecture",
    content: `
# Agent Federation

Threatenx coordinates 7 specialized AI agents:

1. **Threat Detection Agent** (Gemini 2.5 Flash) — Monitors SIEM/EDR events and bootstraps incident rooms.
2. **Log Analysis Agent** (Gemini 2.5 Flash) — Reconstructs database queries, user logins, and exfiltration paths.
3. **Malware Analysis Agent** (Gemini 2.5 Flash) — Performs isolated binary static analysis and C2 extraction.
4. **Risk Assessment Agent** (Gemini 2.5 Flash) — Calculates business impact and CVSS severity scores.
5. **Compliance Agent** (Gemini 2.5 Flash) — Checks GDPR 72h, CCPA, HIPAA statutory clocks and notification targets.
6. **PR / Comms Agent** (Gemini 2.5 Flash) — Drafts customer advisories and executive press releases.
7. **Incident Commander** (Groq Llama 3 70B) — Synthesizes findings into a unified containment playbook for HITL approval.

### Composition Architecture

Rather than using monolithic single-prompt LLMs, Threatenx uses a composition model where specialized agents communicate via structured messages on the **Band (Thenvoi)** interaction mesh.
`
  },
  {
    id: "api-reference",
    title: "3. Dashboard Bridge API Reference",
    content: `
# Bridge API Reference

The dashboard bridge (\`scripts/dashboard_bridge.py\`) runs an HTTP + WebSocket server on port \`8787\`.

### Endpoints

- \`GET /health\` — Returns server status, mode (\`simulate\` | \`live\`), and active scenario ID.
- \`GET /scenarios\` — Returns array of available public scenario objects.
- \`POST /api/trigger\` — Triggers a scenario run. Payload: \`{ "scenario_id": "romanian-pii" }\`.
- \`POST /message\` — Posts an operator query into the room. Payload: \`{ "content": "..." }\`.
- \`WS /ws\` — WebSocket connection streaming real-time agent messages, snapshot state, and final dossiers.
`
  }
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ background: "#ffffff", color: "#111", minHeight: "100vh" }}>
      {/* Header */}
      <header className="cs-header">
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link href="/" className="cs-brand">
            <ShieldIcon size={34} color="#ec0000" />
            <span className="cs-logo-text">Threaten<span>x</span></span>
          </Link>
          <nav>
            <ul className="cs-nav-menu">
              <li><Link href="/" className="cs-nav-item">Platform</Link></li>
              <li><Link href="/solutions" className="cs-nav-item">Solutions</Link></li>
              <li><Link href="/docs" className="cs-nav-item" style={{ color: "#ec0000" }}>Documentation</Link></li>
              <li><Link href="/pricing" className="cs-nav-item">Pricing</Link></li>
              <li><Link href="/about" className="cs-nav-item">About</Link></li>
              <li><Link href="/blog" className="cs-nav-item">Blog</Link></li>
            </ul>
          </nav>
        </div>
        <div className="cs-header-right">
          <Link href="/login" className="cs-icon-btn" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "0 14px", width: "auto", borderRadius: 4, fontSize: 13, fontWeight: 700, color: "#111", textDecoration: "none" }}>
            Log in
          </Link>
          <Link href="/signup" className="cs-btn-red">
            Start free trial →
          </Link>
        </div>
      </header>

      {/* Main Documentation Shell */}
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "260px 1fr", gap: 40, padding: "40px 40px 90px" }}>
        {/* Sidebar Nav */}
        <aside style={{ borderRight: "1px solid #eee", paddingRight: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#ec0000", letterSpacing: 1.5, marginBottom: 16 }}>DOCUMENTATION</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {DOC_SECTIONS.map((sec, i) => (
              <button
                key={sec.id}
                onClick={() => setActiveTab(i)}
                style={{
                  textAlign: "left",
                  padding: "10px 14px",
                  borderRadius: 4,
                  border: "none",
                  background: activeTab === i ? "#0a0a0a" : "transparent",
                  color: activeTab === i ? "#ffffff" : "#444",
                  fontWeight: activeTab === i ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer"
                }}
              >
                {sec.title}
              </button>
            ))}
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "24px 0" }} />
          <div style={{ fontSize: 11, fontWeight: 800, color: "#777", letterSpacing: 1 }}>SDK LINKS</div>
          <ul style={{ list-style: "none", fontSize: 12, display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            <li><a href="https://github.com/tabrejansary/threatenx_project" target="_blank" rel="noreferrer" style={{ color: "#ec0000", textDecoration: "none", fontWeight: 700 }}>GitHub Repository ↗</a></li>
            <li><Link href="/portal" style={{ color: "#555", textDecoration: "none" }}>Live Incident Portal</Link></li>
            <li><Link href="/pricing" style={{ color: "#555", textDecoration: "none" }}>API Quotas & Pricing</Link></li>
          </ul>
        </aside>

        {/* Content Pane */}
        <main>
          <div style={{ background: "#f8f8f8", border: "1px solid #e0e0e0", borderRadius: 8, padding: 36 }}>
            <pre style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "#222", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
              {DOC_SECTIONS[activeTab].content}
            </pre>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="cs-footer">
        <div className="cs-footer-bottom">
          <div className="cs-footer-copy">© 2026 Threatenx Inc. All rights reserved.</div>
          <div className="cs-footer-legal">
            <Link href="/" className="cs-footer-legal-link">Home</Link>
            <Link href="/portal" className="cs-footer-legal-link">Portal</Link>
            <Link href="/pricing" className="cs-footer-legal-link">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}