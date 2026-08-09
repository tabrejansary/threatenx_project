# Threatenx - Detect. Decide. Defend.

Threatenx is a collaborative multi-agent cybersecurity incident response platform designed to automate the triage, analysis, risk scoring, compliance drafting, and mitigation of security incidents. 

Rather than relying on a single monolithic AI, Threatenx coordinates a squad of specialized, autonomous agents (e.g., Log Analysis, Malware, Risk, Compliance, PR) communicating in real-time over the **Band (Thenvoi)** universal interaction mesh, keeping a **Human Security Officer** in the loop for final approval.

---

## How It Works

1. **Detect:** The **Threat Detection Agent** identifies a security anomaly (such as a geographic login conflict) and spins up an incident-specific room in Band.ai.
2. **Decide:** Analysis agents join the room and coordinate dynamically in parallel. They query EDR/SIEM records, scan suspicious files, calculate business risk, and prepare legal/PR filings. The **Incident Commander Agent** synthesizes these findings into a unified incident dossier and action plan.
3. **Defend:** The **Human Security Officer** reviews the staged findings and communication materials on the dashboard, clicking approval to trigger automated containment scripts.

```
       +---------------------------------------------+
       |                  Band.ai                    |
       |               (Agent Mesh)                  |
       |                                             |
       |  +------------+             +------------+  |
       |  |  Log Agent | <=========> | Risk Agent |  |
       |  +------------+             +------------+  |
       |        ^                          ^         |
       |        |                          |         |
       |  +------------+             +------------+  |
       |  | Malw Agent | <=========> | Comp Agent |  |
       |  +------------+             +------------+  |
       +--------+--------------------------+---------+
                |                          |
                +------------+-------------+
                             |
                   +---------v---------+
                   |  Cmd Agent (Dossier)
                   +---------+---------+
                             |
                             v
                   +---------v---------+
                   |  Human Dashboard  | ===> [Approve Containment]
                   +-------------------+
```

---

## Tech Stack & Key Integrations

- **Orchestration Mesh:** [Band (Thenvoi)](https://band.ai) for communication, shared state rooms, and discovery.
- **Python SDK:** Connects custom LLM/tool agent pipelines using the `thenvoi-sdk-python` library. We use a **Composition Architecture** (via `SimpleAdapter`) rather than heavy frameworks.
- **LLM Models:** We use a "Mix and Match" strategy. **Google Gemini (1.5 Flash)** for rapid structured output (Worker agents) and **Llama 3 (via Groq)** for high-level reasoning (Commander agent).
- **Reference Web Dashboard:** Built using **Next.js (React)** with TailwindCSS, deployed to **Vercel**, streaming real-time room communication via WebSockets.
---

## Enterprise Privacy & Hybrid Deployment

Threatenx is built with absolute data privacy in mind, addressing the core objections CISOs have against cloud LLMs:
- **Hybrid Edge Agents:** "Worker" agents (like Log Analysis) deploy locally inside the customer's secure VPC or on-premise network as Docker containers.
- **Data Sanitization:** These edge agents query existing EDR/SIEM databases securely via local APIs. They analyze raw, sensitive logs and extract only sanitized metadata.
- **Zero-Trust Orchestration:** Only the anonymized metadata payloads are sent to the Band.ai cloud mesh for agent-to-agent coordination. Raw PII never leaves the customer's firewall.
- **Bring Your Own Model (BYOM):** Support for routing sensitive analysis to local, privacy-focused open-source LLMs (e.g., Llama 3) running on private infrastructure.

---

## Repository Documentation Layout

This repository contains the complete initial planning, product specification, and software requirements documentation for the Threatenx platform:

- **[PRD_Part1.md](PRD_Part1.md)**: Product goals, agent profiles (capabilities, missions, inputs/outputs), and a detailed chronological walkthrough of the Romanian login incident scenario.
- **[PRD_Part2.md](PRD_Part2.md)**: Non-functional requirements (performance, context scaling), dashboard UI layouts, Band integration details, metrics, and future roadmaps.
- **[SRS_Part1.md](SRS_Part1.md)**: Software Requirements Specification Part 1, establishing product scope, conventions, operating environment, design constraints, and core system features.
- **[SRS_Part2.md](SRS_Part2.md)**: Software Requirements Specification Part 2, defining external interfaces, database/API details, system architecture sequence diagrams, and formal **JSON schemas** for security events, detections, and agent messages.

---

## Getting Started

### Prerequisites
- Python 3.11+
- A [Band.ai](https://band.ai) account to obtain agent API credentials.

### Installation
Clone the repository and install the Thenvoi SDK:

```bash
# Clone the project
git clone https://github.com/tabrejansary/Threatenx.git
cd Threatenx

# Create a virtual environment and install the backend dependencies
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

> The Band SDK ships as the `band-sdk` package (it imports as `band`) and provides
> `Agent`, `SimpleAdapter`, `load_agent_config`, and the `band_*` platform tools.

### Environment Configuration
You need two configuration files to run Threatenx:

1. **`.env`** (For your LLM API Keys):
```bash
GEMINI_API_KEY="your-gemini-key"
GROQ_API_KEY="your-groq-key"
```

2. **`agent_config.yaml`** (For your Band Agent API Credentials):
```yaml
threat_detector:
  agent_id: "uuid-from-band"
  api_key: "api-key-from-band"
log_analyzer:
  agent_id: "uuid-from-band"
  api_key: "api-key-from-band"
# ... (repeat for all 7 agents)
```

### Incident Scenarios

Threatenx ships three seeded attack scenarios the agents can investigate. They
share the identical 7-agent choreography; only the forensic facts differ:

| ID | Attack | Outcome |
|:---|:-------|:--------|
| `romanian-pii` | Geographic anomaly → PII data exfiltration | CRITICAL · GDPR 72h |
| `ransomware-lateral` | Malicious PDF → ransomware lateral movement to HR share | CRITICAL · GDPR/CCPA |
| `aws-cryptojacking` | Leaked IAM key → rogue GPU EC2 cryptomining | CRITICAL · no PII (financial) |

### Running a scenario in your terminal (MOCK mode)
*(Self-contained "seeded mock data pipeline" — reliable, no live SIEM needed.)*

```bash
python scripts/simulate_incident.py                     # default scenario
python scripts/simulate_incident.py ransomware-lateral  # a specific scenario
python scripts/simulate_incident.py all                 # every scenario
```
*(Runs all 7 agent brains through the in-process `MockMesh` — identical agent
logic to live mode — and writes `data/incident_<id>.json`.)*

### The interactive dashboard (pick a scenario → trigger → watch live)

The dashboard talks to a Python **bridge** (`scripts/dashboard_bridge.py`) over a
WebSocket. The browser tells the bridge which scenario to run; the bridge spins
up the agents and streams each message live. Band keys stay server-side.

```
 Browser ⇄ (WebSocket) ⇄ dashboard_bridge.py ⇄ (agents / Band) ⇄ mesh
```

```bash
# 1. export scenario metadata for the UI (selector + context + offline fallback)
python scripts/export_scenarios.py

# 2. start the bridge (simulate mode is the default: real Gemini/Groq agents,
#    in-process, streamed live — the reliable demo path)
python scripts/dashboard_bridge.py

# 3. start the dashboard
cd dashboard && npm install && npm run dev    # http://localhost:3000
```

In the UI: **pick a scenario** in the left rail → read the seeded facts and the
raw EDR alert → click **▶ Trigger Incident Response**. The 7 colour-coded agents
stream their analysis in real time, the timeline fills in, and the Incident
Commander stages a containment playbook in the **Action Center** for approval.

### Going live on the real Band mesh

To drive the actual Band.ai mesh instead of the in-process simulation:

```bash
python scripts/verify_setup.py                       # confirm 7/7 agents connect
bash   scripts/start_agents.sh                       # Terminal 1: the 7 live workers
THREATENX_BRIDGE_MODE=live python scripts/dashboard_bridge.py   # Terminal 2: live bridge
cd dashboard && npm run dev                          # Terminal 3: dashboard
```
The bridge then creates a real Band room per trigger, posts the bootstrap (with a
hidden `[[scn:<id>]]` marker so the generic workers know the scenario), and polls
the live transcript. Header badge reads **● LIVE · Band mesh**.

> One-shot (no dashboard): `python scripts/trigger_incident.py <scenario-id>`.
> The dashboard points at `ws://localhost:8787/ws`; override with
> `NEXT_PUBLIC_BRIDGE_URL`. If no bridge is running, the dashboard replays the
> bundled `public/scenarios.json` feed (badge: "offline (replay)").

### LLM "Mix and Match" notes
- The **Incident Commander** reasons with **Llama 3 (70B) via Groq**.
- The six **worker agents** parse with **Gemini Flash**. Every LLM call has a
  graceful fallback to the seeded narrative, so the demo always completes even if
  a key is rate-limited or offline.
