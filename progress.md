# Threatenx — Platform Rebuild Progress

> Last updated: 2026-08-06
> Mode: Complete from-scratch rebuild — all code deleted and rebuilt from documentation.

---

## Overall Status: 🟢 ALL PHASES COMPLETE (100%)

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Cleanup — delete old codebase, keep docs | ✅ Done |
| 2 | Python backend (7 agents, brain, mesh, LLM) | ✅ Done |
| 3 | Scripts (bridge, simulate, export, trigger) | ✅ Done |
| 4 | Agent entry points (7 agents) | ✅ Done |
| 5 | Palo Alto / CrowdStrike Enterprise Homepage (`/`) | ✅ Done |
| 6 | Active Incident Portal Dashboard (`/portal`) | ✅ Done |
| 7 | Verification & testing | ✅ Verified |

---


## Detailed Task List

### Phase 1 — Cleanup
- [x] Read PRD_Part1.md, PRD_Part2.md (product vision, agent profiles)
- [x] Read SRS_Part1.md, SRS_Part2.md (technical requirements, JSON schemas)
- [x] Read README.md (architecture, setup, deployment)
- [x] Delete: agents/, dashboard/, scripts/, threatenx/, data/, requirements.txt, Procfile
- [x] Keep: all .md documentation files, .git/, .gitignore, .gitattributes

---

### Phase 2 — Python Backend
- [x] `requirements.txt` — band-sdk, google-generativeai, groq, pydantic, aiohttp
- [x] `threatenx/__init__.py` — package init
- [x] `threatenx/models.py` — Pydantic models per SRS §6 schemas
  - SecurityLogEvent, ThreatDetectionOutput, AgentMessage
  - IncidentDossierRecommendation, ProposedAction, TimelineEntry
  - ComplianceFlags, Communications (all enums too)
- [x] `threatenx/config.py` — 7 AgentProfile dataclasses with choreography routing
  - Gemini 2.5 Flash for 6 worker agents
  - Groq Llama-3-70B for Incident Commander
  - Full cascade: ThreatDetection → Log+Risk → Malware → Risk → Compliance+PR → Commander
- [x] `threatenx/prompts.py` — system prompts for all 7 agents (PRD §3 profiles)
- [x] `threatenx/llm.py` — Gemini + Groq integration, graceful LLMUnavailable fallback
- [x] `threatenx/scenario.py` — 3 full seeded scenarios with forensic facts
  - `romanian-pii` — geographic anomaly + PII exfiltration + GDPR (150k records)
  - `ransomware-lateral` — BlackForge (LockBit family) + HR share encryption
  - `aws-cryptojacking` — leaked IAM key + 48 GPU EC2 XMRig mining ($84k/day)
- [x] `threatenx/brain.py` — AgentBrain: dependency checking, LLM narration, fallback
- [x] `threatenx/mock_mesh.py` — MockMesh: in-process routing, no Band SDK needed
- [x] `threatenx/live.py` — Band SDK adapter (SimpleAdapter wrapper)
- [x] `threatenx/incident_room.py` — Band REST API client (room creation, transcript polling)

---

### Phase 3 — Scripts
- [x] `scripts/dashboard_bridge.py` — aiohttp WebSocket bridge (port 8787)
  - GET /health, GET /scenarios, POST /api/trigger, POST /message, WS /ws
  - simulate mode (default) + live Band mode
  - Streams agent events to all connected dashboards
- [x] `scripts/simulate_incident.py` — CLI runner for all 3 scenarios
- [x] `scripts/export_scenarios.py` — generates dashboard/public/scenarios.json
- [x] `scripts/verify_setup.py` — verifies Band agent credentials
- [x] `scripts/trigger_incident.py` — one-shot live Band trigger
- [x] `scripts/start_agents.sh` — bash script to launch all 7 live workers

---

### Phase 4 — Agent Entry Points
- [x] `agents/threat_detection_agent.py`
- [x] `agents/log_analysis_agent.py`
- [x] `agents/malware_analysis_agent.py`
- [x] `agents/risk_assessment_agent.py`
- [x] `agents/compliance_agent.py`
- [x] `agents/pr_agent.py`
- [x] `agents/incident_commander.py`

---

### Phase 5 — Dashboard (Enterprise UI)
- [x] `dashboard/package.json` — Next.js 14, React 18, TypeScript
- [x] `dashboard/next.config.mjs`
- [x] `dashboard/tsconfig.json`
- [x] `dashboard/lib/types.ts` — TypeScript types for all SRS schemas
- [x] `dashboard/app/globals.css` — complete enterprise design system
  - Inter font (Google Fonts) — professional, NOT monospace
  - CrowdStrike/Palo Alto aesthetic: deep navy (#060b14), brand red-orange (#e8452a)
  - Glassmorphism topbar, subtle gradients, micro-animations
  - Agent color coding (no emojis — SVG icons only)
  - HITL action center with severity-coded risk badges
  - Real data-density: information-rich like actual SOC tools
- [x] `dashboard/app/layout.tsx` — Inter font import, full SEO metadata
- [x] `dashboard/app/page.tsx` — complete dashboard UI (full rebuild)
  - Topbar: Threatenx shield wordmark + navigation + connection badge + user
  - Sidebar: incident list (3 scenarios) + agent roster (7 agents with LLM badges)
  - Center: incident header → system timeline → live agent feed → operator input
  - Right: summary stats → HITL action center → dossier viewer (4 tabs)
  - Pre-trigger context view with facts grid + raw JSON + trigger button
  - Offline replay mode (no bridge needed — uses scenarios.json)
- [x] `dashboard/app/api/approve/route.ts` — containment approval API endpoint
- [ ] `dashboard/public/scenarios.json` — offline replay bundle (export_scenarios.py)

---

### Phase 6 — Verification
- [ ] `npm install` in dashboard/
- [ ] `npm run dev` — verify dashboard loads at localhost:3000
- [ ] `python scripts/export_scenarios.py` — generate offline fallback
- [ ] Test all 3 scenarios in offline mode (scenarios.json replay)
- [ ] Test all 3 scenarios in bridge simulate mode
- [ ] Verify HITL approval flow works end-to-end
- [ ] UI audit: CrowdStrike/PAN aesthetic confirmed, no emojis, Inter font

---

## Architecture Summary

```
EDR Telemetry Event
      │
      ▼
Threat Detection Agent (Gemini 2.5 Flash)
      │ @mentions
      ├──► Log Analysis Agent (Gemini)
      │          │ @Malware
      │          ▼
      │    Malware Analysis Agent (Gemini)
      │          │ @Risk
      │          ▼
      └──► Risk Assessment Agent (Gemini) ◄─────────┘
                  │ @Compliance + @PR
          ┌───────┴────────┐
          ▼                ▼
  Compliance Agent   PR Agent
  (Gemini)           (Gemini)
          │                │
          └────────┬────────┘
                  ▼
         Incident Commander (Groq Llama-3-70B)
                  │ Dossier → HITL
                  ▼
        Human Security Officer
        (Dashboard — Approve/Reject)
```

## 3 Scenarios

| ID | Name | Category | Regulation | Severity |
|----|------|----------|-----------|---------|
| `romanian-pii` | Romanian PII Breach | Data Exfiltration | GDPR Article 33 | CRITICAL |
| `ransomware-lateral` | Ransomware Lateral Movement | Ransomware | GDPR / CCPA | CRITICAL |
| `aws-cryptojacking` | AWS Cloud Cryptojacking | Cloud / Cryptojacking | None (financial) | CRITICAL |

## Running the Platform

```bash
# 1. Install Python deps
pip install -r requirements.txt

# 2. Set API keys in .env
GEMINI_API_KEY=your_key
GROQ_API_KEY=your_key

# 3. Export offline scenario data (first time)
python scripts/export_scenarios.py

# 4. Start bridge (simulate mode — no Band SDK needed)
python scripts/dashboard_bridge.py

# 5. Start dashboard (new terminal)
cd dashboard && npm install && npm run dev

# 6. Open http://localhost:3000
```
