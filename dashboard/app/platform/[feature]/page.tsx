"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

function ShieldIcon({ size = 32, color = "#ec0000" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3L36 10v11c0 9.5-7.5 17.5-16 18.5C11.5 38.5 4 30.5 4 21V10L20 3z" fill={color} />
      <path d="M14 20l4.5 4.5L26 15" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FEATURE_DATA: Record<string, { title: string; agent: string; llm: string; desc: string }> = {
  "threat-detection": {
    title: "Threat Detection Agent",
    agent: "Threat Detection Agent",
    llm: "Gemini 2.5 Flash",
    desc: "Monitors SIEM telemetry, identifies geographic anomalies and credential abuse, and automatically spins up an incident room in Band.ai."
  },
  "log-analysis": {
    title: "Log Analysis Agent",
    agent: "Log Analysis Agent",
    llm: "Gemini 2.5 Flash",
    desc: "Parses database audit logs and user session histories to reconstruct SQL query sequences and exact exfiltration volumes."
  },
  "malware-sandbox": {
    title: "Malware Analysis Sandbox Agent",
    agent: "Malware Analysis Agent",
    llm: "Gemini 2.5 Flash",
    desc: "Executes isolated binary static disassembly, detects ransomware encryption behavior, and extracts C2 beacon endpoints."
  },
  "risk-assessment": {
    title: "Risk Assessment Agent",
    agent: "Risk Assessment Agent",
    llm: "Gemini 2.5 Flash",
    desc: "Calculates CVSS v3 severity scores, financial exposure rates, and affected business assets in real time."
  },
  "compliance-clock": {
    title: "Compliance Clock Agent",
    agent: "Compliance Agent",
    llm: "Gemini 2.5 Flash",
    desc: "Evaluates GDPR Article 33, CCPA, and HIPAA statutory breach reporting deadlines with an active 72-hour countdown clock."
  },
  "incident-commander": {
    title: "Incident Commander Agent",
    agent: "Incident Commander",
    llm: "Groq Llama 3 70B",
    desc: "Synthesizes multi-agent forensic streams into a unified executive dossier and stages single-click containment playbooks for HITL approval."
  }
};

export default function PlatformFeaturePage() {
  const params = useParams();
  const featureKey = (params?.feature as string) || "threat-detection";
  const feature = FEATURE_DATA[featureKey] || FEATURE_DATA["threat-detection"];

  return (
    <div style={{ background: "#ffffff", color: "#111", minHeight: "100vh" }}>
      <header className="cs-header">
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link href="/" className="cs-brand">
            <ShieldIcon size={34} color="#ec0000" />
            <span className="cs-logo-text">Threaten<span>x</span></span>
          </Link>
          <nav>
            <ul className="cs-nav-menu">
              <li><Link href="/portal" className="cs-nav-item" style={{ color: "#ec0000" }}>Platform</Link></li>
              <li><Link href="/solutions" className="cs-nav-item">Solutions</Link></li>
              <li><Link href="/docs" className="cs-nav-item">Documentation</Link></li>
              <li><Link href="/pricing" className="cs-nav-item">Pricing</Link></li>
              <li><Link href="/about" className="cs-nav-item">About</Link></li>
              <li><Link href="/blog" className="cs-nav-item">Blog</Link></li>
            </ul>
          </nav>
        </div>
        <div className="cs-header-right">
          <Link href="/login" className="cs-icon-btn" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "0 14px", width: "auto", borderRadius: 4, fontSize: 13, fontWeight: 700, color: "#111", textDecoration: "none" }}>Log in</Link>
          <Link href="/signup" className="cs-btn-red">Start free trial →</Link>
        </div>
      </header>

      <section style={{ background: "#0a0a0a", color: "#fff", padding: "80px 40px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div className="cs-kicker">THREATENX AGENT ARCHITECTURE</div>
          <h1 style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-1px", marginBottom: 16 }}>{feature.title}</h1>
          <p style={{ fontSize: 17, color: "#aaa", lineHeight: 1.6, marginBottom: 28 }}>{feature.desc}</p>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 800, background: "#ec0000", color: "#fff", padding: "4px 12px", borderRadius: 3 }}>MODEL: {feature.llm}</span>
            <span style={{ fontSize: 12, color: "#888", fontWeight: 700 }}>ORCHESTRATION: BAND.AI MESH</span>
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 40px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ background: "#f8f8f8", border: "1px solid #e0e0e0", borderRadius: 8, padding: 36, textAlign: "center" }}>
          <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>See {feature.agent} in action</h3>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>Watch how this agent collaborates live with the rest of the 7-agent federation.</p>
          <Link href="/portal" className="cs-btn-red" style={{ display: "inline-flex" }}>Launch Incident Portal →</Link>
        </div>
      </section>

      <footer className="cs-footer"><div className="cs-footer-bottom"><div className="cs-footer-copy">© 2026 Threatenx Inc. All rights reserved.</div></div></footer>
    </div>
  );
}