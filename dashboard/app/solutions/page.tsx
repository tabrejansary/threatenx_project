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

const SOLUTION_DETAILS = [
  {
    id: "breaches",
    tag: "THREAT DETECTION & TRIAGE",
    title: "Stop Breaches Before Lateral Movement Takes Hold",
    sub: "Traditional SOCs take hours to correlate alerts across multi-cloud and endpoint tools. Threatenx Threat Detection Agent identifies anomalies in seconds and orchestrates 6 analysis agents in parallel.",
    points: [
      "Real-time correlation of geographic login anomalies (e.g. Chicago -> Romania in 4h)",
      "Automated payload detonation & IoC extraction via Malware Analysis Agent",
      "Unified Incident Commander synthesis powered by Groq Llama 3 70B",
      "Single-click HITL approval for network host isolation & IP blocking"
    ]
  },
  {
    id: "data-exfil",
    tag: "FORENSIC LOG ANALYSIS",
    title: "Reconstruct Database Abuse & Exfiltration Paths",
    sub: "Log Analysis Agent parses raw SIEM and database audit logs to pinpoint exactly which database tables were queried, volume of data staged, and C2 exfiltration endpoints.",
    points: [
      "Reconstructs SQL queries (e.g., SELECT * FROM Customers on DB-Prod-09)",
      "Tracks volume exfiltrated (e.g., 4.2 GB of customer PII)",
      "Maps external C2 destination IP & domain ownership records",
      "Provides forensic proof required for regulatory investigations"
    ]
  },
  {
    id: "cloud",
    tag: "CLOUD INFRASTRUCTURE PROTECTION",
    title: "Detect Leaked IAM Keys & Stop Cryptojacking",
    sub: "Cloud workloads face constant credential theft and unauthorized compute provisioning. Threatenx correlates AWS CloudTrail and GCP Audit Logs instantly.",
    points: [
      "Detects IAM access keys used from blacklisted foreign ASNs",
      "Alerts on unauthorized GPU/EC2 instance provisioning (cryptojacking)",
      "Calculates real-time financial loss rate (e.g. $84,000/day exposure)",
      "Automated containment: key revocation and instance termination"
    ]
  },
  {
    id: "compliance",
    tag: "REGULATORY COMPLIANCE AUTOMATION",
    title: "Automate GDPR 72-Hour Breach Reporting",
    sub: "Compliance Agent maps breach scope directly against legal frameworks (GDPR Article 33, CCPA, HIPAA, PCI-DSS) and calculates statutory reporting deadlines.",
    points: [
      "Automated countdown clock for GDPR 72-hour notification requirement",
      "Generates customer advisory drafts and executive board briefings",
      "Identifies specific regulatory authorities (ICO, CNIL, BfDI)",
      "Reduces legal risk and prevents catastrophic regulatory fines"
    ]
  }
];

export default function SolutionsPage() {
  const [selectedTab, setSelectedTab] = useState(0);

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
              <li><Link href="/solutions" className="cs-nav-item" style={{ color: "#ec0000" }}>Solutions</Link></li>
              <li><Link href="/docs" className="cs-nav-item">Documentation</Link></li>
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

      {/* Hero */}
      <section style={{ background: "#0a0a0a", color: "#fff", padding: "80px 40px", position: "relative" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div className="cs-kicker">ENTERPRISE SOLUTIONS</div>
            <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.08, marginBottom: 20 }}>
              End-to-End Protection Driven by <span style={{ color: "#ec0000" }}>Collaborative AI</span>
            </h1>
            <p style={{ fontSize: 17, color: "#888", lineHeight: 1.6, marginBottom: 32 }}>
              Deploy specialized autonomous agents tailored to your team&apos;s specific security challenges — from ransomware containment to automated GDPR compliance filings.
            </p>
            <div style={{ display: "flex", gap: 14 }}>
              <Link href="/portal" className="cs-btn-red-lg">Explore Incident Portal →</Link>
              <Link href="/signup" className="cs-btn-white-outline">Start Free Trial</Link>
            </div>
          </div>

          <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: 8, padding: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#ec0000", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>THREATENX FEDERATION</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["Threat Detection Agent (Gemini Flash)", "Log Analysis Agent (Gemini Flash)", "Malware Analysis Agent (Gemini Flash)", "Risk Assessment Agent (Gemini Flash)", "Compliance Agent (Gemini Flash)", "PR & Comms Agent (Gemini Flash)", "Incident Commander (Groq Llama 3 70B)"].map((agent, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#1a1a1a", borderRadius: 4, borderLeft: i === 6 ? "3px solid #ec0000" : "3px solid #444" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 6 ? "#ec0000" : "#22c55e" }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{agent}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tabs */}
      <section style={{ padding: "80px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 40, borderBottom: "2px solid #eee", paddingBottom: 16, overflowX: "auto" }}>
          {SOLUTION_DETAILS.map((sol, index) => (
            <button
              key={sol.id}
              onClick={() => setSelectedTab(index)}
              style={{
                padding: "10px 20px",
                border: "none",
                background: selectedTab === index ? "#ec0000" : "transparent",
                color: selectedTab === index ? "#fff" : "#444",
                fontWeight: 800,
                fontSize: 13,
                borderRadius: 4,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s"
              }}
            >
              {sol.tag}
            </button>
          ))}
        </div>

        {/* Selected Tab Content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#ec0000", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
              {SOLUTION_DETAILS[selectedTab].tag}
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 20 }}>
              {SOLUTION_DETAILS[selectedTab].title}
            </h2>
            <p style={{ fontSize: 16, color: "#555", lineHeight: 1.6, marginBottom: 28 }}>
              {SOLUTION_DETAILS[selectedTab].sub}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {SOLUTION_DETAILS[selectedTab].points.map((pt, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ color: "#ec0000", fontWeight: 900, fontSize: 16, lineHeight: 1 }}>✓</span>
                  <span style={{ fontSize: 14, color: "#333", fontWeight: 600 }}>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 8, padding: 36, color: "#fff" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#777", letterSpacing: 1.5, marginBottom: 16 }}>LIVE SCENARIO DEMONSTRATION</div>
            <div style={{ background: "#161616", padding: 16, borderRadius: 6, fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#22c55e", lineHeight: 1.6, marginBottom: 20 }}>
              [00:01] THREAT DETECTED: Anomaly in Bucharest ASN 209<br/>
              [00:03] LOG ANALYZER: 4.2GB PII query detected on DB-Prod-09<br/>
              [00:05] MALWARE DETONATION: Trojan hash 97% confidence<br/>
              [00:08] COMMANDER: Playbook ready for Security Officer
            </div>
            <Link href="/portal" className="cs-btn-red" style={{ justifyContent: "center", width: "100%" }}>
              Launch Interactive Scenario →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="cs-footer">
        <div className="cs-footer-bottom">
          <div className="cs-footer-copy">© 2026 Threatenx Inc. All rights reserved.</div>
          <div className="cs-footer-legal">
            <Link href="/" className="cs-footer-legal-link">Home</Link>
            <Link href="/portal" className="cs-footer-legal-link">Portal</Link>
            <Link href="/pricing" className="cs-footer-legal-link">Pricing</Link>
            <Link href="/docs" className="cs-footer-legal-link">Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}