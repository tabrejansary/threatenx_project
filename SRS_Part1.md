# Software Requirements Specification (SRS) - Part 1
## Threatenx: Detect. Decide. Defend.
**Version:** 1.0.0-draft  
**Project Phase:** Initial Specification & Multi-Agent Architecture Design  
**Author:** Multiagent AI System Developer  
**Status:** Draft  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document details the functional, non-functional, interface, and behavioral requirements for the **Threatenx** system. Threatenx is a collaborative, multi-agent cybersecurity incident response platform built to run on top of the **Band (Thenvoi)** messaging and orchestration backbone. 

This document serves as the primary technical specification for engineers, security architects, product managers, and external collaborators. It defines the system boundaries, agent capabilities, API integration patterns, data schemas, and user interfaces.

### 1.2 Document Conventions
- **Bold terms:** Represent specific software modules, variables, or system roles (e.g., **Threat Detection Agent**, **Incident Commander Agent**).
- **Monospaced font:** Used for code blocks, JSON payloads, file paths, environmental variables (e.g., `acp_agent_id`, `PRD_Part1.md`), and directory paths.
- **RFC 2119 Key Words:** The terms *MUST*, *MUST NOT*, *REQUIRED*, *SHALL*, *SHALL NOT*, *SHOULD*, *SHOULD NOT*, *RECOMMENDED*, *MAY*, and *OPTIONAL* in this document are to be interpreted as described in RFC 2119.

### 1.3 Intended Audience and Reading Suggestions
- **Security Engineers / Developers:** Should focus on Section 3 (System Features) and SRS Part 2 (Interface Requirements, System Architecture, and JSON Schemas).
- **Product Managers & Business Stakeholders:** Should read Section 1 (Introduction) and Section 2 (Overall Description) to understand project boundaries and operations.
- **Compliance & Legal Teams:** Should review Section 2.5 (Design and Implementation Constraints) and Section 3.4 (Regulatory & Crisis Drafting Engine).

### 1.4 Product Scope
Threatenx is an event-driven automation mesh designed to parse SIEM/EDR alerts, coordinate investigations among seven specialized AI agents via Band.ai rooms, compile findings into unified incident dossiers, draft compliance and PR materials, and stage containment scripts for execution. 

#### Out of Scope:
- Threatenx *does not* replace EDRs (Endpoint Detection & Response) or firewalls; instead, it interfaces with existing installations via local tools and APIs.
- Threatenx *does not* make autonomous decisions regarding critical network containment without a Human Security Officer's approval (unless explicitly configured in low-risk sandboxes).
- Threatenx *does not* ingest entire customer data lakes into the cloud. It uses a local pull model where edge agents query SIEMs dynamically.

### 1.5 References
1. **Band.ai Developer Documentation:** [docs.band.ai](https://docs.band.ai)
2. **Thenvoi Python SDK Repository:** [github.com/thenvoi/thenvoi-sdk-python](https://github.com/thenvoi/thenvoi-sdk-python)
3. **RFC 2119:** Key words for use in RFCs to Indicate Requirement Levels.

---

## 2. Overall Description

### 2.1 Product Perspective
Threatenx functions as a coordination layer sitting between raw enterprise security telemetry (SIEM, EDR, Active Directory, Firewalls) and human incident response teams. It uses **Band (Thenvoi)** as a universal interaction layer (or "agentic mesh"), enabling modular, cross-framework agents to work in parallel within a shared room context.

 ```
 +-----------------------------------------------------------------+
 |                 Customer Secure Perimeter (VPC)                 |
 |                                                                 |
 |  +--------------------+                   +------------------+  |
 |  | Telemetry Sources  | <--- (Pulls) ---- | Threatenx Edge   |  |
 |  | (SIEM, EDR, AD)    |                   | Worker Agents    |  |
 |  +---------+----------+                   +--------+---------+  |
 |            | (Push Trigger)                        | (Sanitized)|
 +------------|---------------------------------------|------------+
              |                                       |
              v                                       v
 +-----------------------------------------------------------------+
 |                    Threatenx Cloud (Band.ai)                    |
 |                                                                 |
 |  +-----------------------------------------------------------+  |
 |  |            Band.ai Room & Agentic Collaboration           |  |
 |  |          (Seven Autonomous Specialized Agents)            |  |
 |  +----------------------------+------------------------------+  |
 |                               |                                 |
 |                               v                                 |
 |  +-----------------------------------------------------------+  |
 |  |                       Threatenx Dashboard                 |  |
 |  |                (Human Security Officer Approval Room)     |  |
 |  +-----------------------------------------------------------+  |
 +-----------------------------------------------------------------+
 ```

### 2.2 Product Functions
1. **Telemetry Ingestion & Room Bootstrapping:** Ingest log triggers, generate incident rooms on Band.ai, and trigger investigation cycles.
2. **Multi-Agent Collaborative Forensics:** Route tasks to specialized analysis agents (Log, Malware, Risk, Compliance, PR) for parallel assessment.
3. **Regulatory Document & Crisis Communication Drafting:** Automatically draft notification documents (such as GDPR filings) and communication plans based on findings.
4. **Playbook Aggregation:** Synthesize analysis results into a structured incident report containing localized timeline logs and a proposed mitigation plan.
5. **Interactive Operator Dashboard:** Display live investigations, expose interactive agent controls to human analysts, and support single-click containment execution.

### 2.3 User Classes and Characteristics
- **SOC Analyst (L1/L2):** Uses the platform to understand the root cause of alerts, view auto-compiled traces, and execute initial response actions.
- **Incident Response Commander (L3 / SecOps Lead):** Reviews complex dossiers, overrides automated mitigation proposals, and manages external communications.
- **CISO / Security Director:** Monitors metrics, reviews compliance and regulatory reports, and approves public relations messaging.

### 2.4 Operating Environment
Threatenx is designed to run in two distinct deployment configurations:
- **MVP / Hackathon Deployment:** The dashboard runs as a cloud-hosted Vercel application. The Python agents run as continuous worker processes on lightweight PaaS containers (e.g., Railway or Render).
- **Enterprise Production (Hybrid Edge):** The Python agents run in independent Docker containers strictly located *inside the customer's secure VPC or on-premise network*.
- **Band Mesh Connectivity:** Both environments require egress connectivity to `*.band.ai` and `*.thenvoi.com` domains over secure WebSockets (`wss://`) and HTTPS (`https://`).
- **Dashboard Frontend:** Runs on modern web browsers (Chrome, Firefox, Safari, Edge).

### 2.5 Design and Implementation Constraints
1. **Deterministic Containment:** AI agents *SHALL NOT* possess write permissions to direct enterprise APIs unless an automated containment rule has been explicitly signed and pre-authorized.
2. **Context Window Limitations:** Agents must operate within the limits of LLM context windows. Long timeline logs *MUST* be filtered, aggregated, or summarized before injection into LLM prompts.
3. **Data Privacy & Sanitization:** Before security logs are sent to public cloud LLM endpoints via the agents, all logs *MUST* be sanitized to remove plaintext passwords, sensitive database values, or internal credentials.
4. **Statutory Timelines:** Compliance drafting routines *MUST* prioritize alerting the operator immediately if regulatory timelines (e.g., GDPR 72-hour notifications) are applicable.
5. **Observable LLM Frameworks:** Agents *MUST* be built using standard Python and explicit structured outputs rather than heavy, "black-box" frameworks (e.g., CrewAI, LangGraph) to ensure deterministic execution and ease of debugging.

### 2.6 Assumptions and Dependencies
- **Band Platform Stability:** It is assumed that the Band.ai platform is operational and accessible to route agent WebSocket communication.
- **Agent Framework Compatibility:** It is assumed that agents connect using compatible adapters supported by the `thenvoi-sdk-python` library.
- **Credential Validity:** Relies on valid API tokens for firewall containment operations, EDR query hooks, and SIEM databases.

---

## 3. System Features

### 3.1 Agent Coordination via Band (Thenvoi)
#### 3.1.1 Description and Priority
This is the core coordination feature of Threatenx. It enables agents built on different frameworks (e.g., LangGraph, CrewAI, or raw scripts) to discover each other, join incident-specific communication rooms, and exchange diagnostic context. Priority is **High**.

#### 3.1.2 Functional Requirements
- **FR-COORD-1 (Room Creation):** The backend *MUST* generate a unique Band Room when a new detection trigger is ingested.
- **FR-COORD-2 (Agent Subscription):** The system *MUST* invite the Threat Detection, Log Analysis, Malware, Risk, Compliance, PR, and Incident Commander Agents to the newly created room.
- **FR-COORD-3 (Context Propagation):** Every message posted in the room *MUST* update the shared room history context, ensuring that newly participating agents have access to all historic forensics.
- **FR-COORD-4 (Dynamic Mentions):** Agents *SHALL* be capable of querying other agents using `@AgentName` syntax to spawn sub-tasks.

---

### 3.2 Automated Investigation & Diagnostics
#### 3.2.1 Description and Priority
Once a room is bootstrapped, the analysis agents collaborate to gather log evidence, analyze binaries, and determine severity. Priority is **High**.

#### 3.2.2 Functional Requirements
- **FR-DIAG-1 (Log Parsing):** The **Log Analysis Agent** *MUST* extract network flows, lateral movements, and file access pathways relative to the anomalous credentials.
- **FR-DIAG-2 (Malware Sandbox Query):** The **Malware Analysis Agent** *MUST* parse command-line scripts or file hashes using sandboxing tools or external APIs and return reputation metrics.
- **FR-DIAG-3 (Risk Scoring):** The **Risk Assessment Agent** *MUST* assign a numeric score (0.0 to 10.0) based on asset criticality and volume of exposed data.

---

### 3.3 Dashboard Visualization & Incident Tracking
#### 3.3.1 Description and Priority
Provides the web-based visual workspace for the human analyst to monitor and guide the multi-agent system. Priority is **High**.

#### 3.3.2 Functional Requirements
- **FR-UI-1 (Live Stream):** The dashboard *MUST* show a real-time log of agent messages as they coordinate in the Band room.
- **FR-UI-2 (Timeline Compilation):** The UI *MUST* render a graphical timeline summarizing key events.
- **FR-UI-3 (Stage Actions):** The UI *MUST* present the Incident Commander Agent's containment recommendations as checkable options.
- **FR-UI-4 (Action Trigger):** The UI *MUST* trigger containment APIs immediately upon the operator clicking the approval button.

---

### 3.4 Regulatory & Crisis Drafting Engine
#### 3.4.1 Description and Priority
Automates the production of legal compliance documents and public communications during high-severity events. Priority is **Medium**.

#### 3.4.2 Functional Requirements
- **FR-COMP-1 (GDPR Checklist):** The **Compliance Agent** *MUST* evaluate if PII belonging to EU citizens was exposed and draft a GDPR Article 33 report.
- **FR-COMP-2 (Deadline Tracking):** The platform *MUST* render a countdown timer if a statutory reporting deadline is triggered.
- **FR-PR-1 (Communication Drafting):** The **PR Agent** *MUST* generate three communication drafts: internal team briefing, client email alert, and public press statement.
