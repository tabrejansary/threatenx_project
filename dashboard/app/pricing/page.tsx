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

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

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
              <li><Link href="/docs" className="cs-nav-item">Documentation</Link></li>
              <li><Link href="/pricing" className="cs-nav-item" style={{ color: "#ec0000" }}>Pricing</Link></li>
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
      <section style={{ background: "#0a0a0a", color: "#fff", padding: "80px 40px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 840, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div className="cs-kicker" style={{ justifyContent: "center", display: "flex" }}>ENTERPRISE PRICING</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-1.5px", marginBottom: 20 }}>
            Predictable security pricing for <span style={{ color: "#ec0000" }}>autonomous AI teams</span>
          </h1>
          <p style={{ fontSize: 17, color: "#888", lineHeight: 1.6, marginBottom: 36 }}>
            Scale your SOC capabilities with 7 specialized AI agents. Zero per-seat lock-in — pay for what your infrastructure requires.
          </p>

          {/* Toggle */}
          <div style={{ display: "inline-flex", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 30, padding: 4 }}>
            <button
              onClick={() => setBillingCycle("monthly")}
              style={{ padding: "8px 20px", borderRadius: 24, border: "none", background: billingCycle === "monthly" ? "#ec0000" : "transparent", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              style={{ padding: "8px 20px", borderRadius: 24, border: "none", background: billingCycle === "annual" ? "#ec0000" : "transparent", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}
            >
              Annual Billing <span style={{ fontSize: 10, background: "#fff", color: "#000", padding: "2px 6px", borderRadius: 10, marginLeft: 4 }}>SAVE 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: "60px 40px 90px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {/* Tier 1 */}
          <div style={{ background: "#ffffff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 32, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#777", letterSpacing: 1.5, textTransform: "uppercase" }}>DEVELOPER / SANDBOX</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#000", margin: "16px 0 8px" }}>$0 <span style={{ fontSize: 14, color: "#777", fontWeight: 500 }}>/ month</span></div>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.5, marginBottom: 24 }}>Ideal for evaluating threat simulation and testing agent integrations offline.</p>
            <Link href="/portal" className="cs-btn-dark-outline" style={{ justifyContent: "center", width: "100%", marginBottom: 24, textAlign: "center" }}>Try Simulation Mode</Link>
            <hr style={{ border: "none", borderTop: "1px solid #eee", marginBottom: 20 }} />
            <ul style={{ listStyle: "none", fontSize: 13, color: "#444", display: "flex", flexDirection: "column", gap: 12 }}>
              <li>✓ 3 Seeded Attack Scenarios</li>
              <li>✓ Full 7-Agent Simulation</li>
              <li>✓ Interactive HITL Portal</li>
              <li>✓ Local JSON Dossier Export</li>
              <li style={{ color: "#aaa" }}>✕ Live SIEM/EDR Stream</li>
            </ul>
          </div>

          {/* Tier 2 */}
          <div style={{ background: "#ffffff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 32, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#777", letterSpacing: 1.5, textTransform: "uppercase" }}>PRO SOC</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#000", margin: "16px 0 8px" }}>
              {billingCycle === "annual" ? "$499" : "$599"} <span style={{ fontSize: 14, color: "#777", fontWeight: 500 }}>/ mo</span>
            </div>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.5, marginBottom: 24 }}>For growing security operations teams looking to automate triage & incident drafting.</p>
            <Link href="/signup" className="cs-btn-red" style={{ justifyContent: "center", width: "100%", marginBottom: 24 }}>Start 15-Day Trial</Link>
            <hr style={{ border: "none", borderTop: "1px solid #eee", marginBottom: 20 }} />
            <ul style={{ listStyle: "none", fontSize: 13, color: "#444", display: "flex", flexDirection: "column", gap: 12 }}>
              <li>✓ Everything in Sandbox</li>
              <li>✓ 50 Active Incidents / mo</li>
              <li>✓ Live Band.ai Agent Mesh</li>
              <li>✓ Gemini 2.5 Flash + Groq Llama 3</li>
              <li>✓ GDPR 72h Clock Automation</li>
              <li>✓ Standard Webhooks & Slack Alerts</li>
            </ul>
          </div>

          {/* Tier 3 Featured */}
          <div style={{ background: "#0a0a0a", color: "#fff", border: "2px solid #ec0000", borderRadius: 8, padding: 32, display: "flex", flexDirection: "column", position: "relative" }}>
            <div style={{ position: "absolute", top: -12, right: 24, background: "#ec0000", color: "#fff", fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 10, letterSpacing: 1 }}>MOST POPULAR</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#ec0000", letterSpacing: 1.5, textTransform: "uppercase" }}>ENTERPRISE AUTONOMOUS</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", margin: "16px 0 8px" }}>
              {billingCycle === "annual" ? "$1,899" : "$2,299"} <span style={{ fontSize: 14, color: "#888", fontWeight: 500 }}>/ mo</span>
            </div>
            <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.5, marginBottom: 24 }}>Full autonomous response capabilities with 24/7 SIEM ingestion and custom containment scripts.</p>
            <Link href="/signup" className="cs-btn-red-lg" style={{ justifyContent: "center", width: "100%", marginBottom: 24 }}>Get Enterprise Access →</Link>
            <hr style={{ border: "none", borderTop: "1px solid #222", marginBottom: 20 }} />
            <ul style={{ listStyle: "none", fontSize: 13, color: "#ccc", display: "flex", flexDirection: "column", gap: 12 }}>
              <li>✓ Unlimited Incidents</li>
              <li>✓ Sub-3 Minute MTTR Guarantee</li>
              <li>✓ Custom EDR/SIEM API Connectors</li>
              <li>✓ Multi-Tenant Team RBAC</li>
              <li>✓ Automated PR & Legal Briefing Generation</li>
              <li>✓ 99.9% Uptime SLA & 24/7 Support</li>
            </ul>
          </div>

          {/* Tier 4 */}
          <div style={{ background: "#ffffff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 32, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#777", letterSpacing: 1.5, textTransform: "uppercase" }}>HYBRID VPC EDGE</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#000", margin: "16px 0 8px" }}>Custom</div>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.5, marginBottom: 24 }}>Deploy worker agents inside your private cloud or on-prem VPC. Zero PII leaves your firewall.</p>
            <Link href="/contact" className="cs-btn-dark-outline" style={{ justifyContent: "center", width: "100%", marginBottom: 24, textAlign: "center" }}>Contact Architecture Team</Link>
            <hr style={{ border: "none", borderTop: "1px solid #eee", marginBottom: 20 }} />
            <ul style={{ listStyle: "none", fontSize: 13, color: "#444", display: "flex", flexDirection: "column", gap: 12 }}>
              <li>✓ On-Prem Docker Agent Deployment</li>
              <li>✓ Bring Your Own Model (BYOM / Ollama)</li>
              <li>✓ FedRAMP / HIPAA Zero-Trust Architecture</li>
              <li>✓ Dedicated Technical Account Manager</li>
              <li>✓ Air-Gapped Network Support</li>
            </ul>
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
            <Link href="/docs" className="cs-footer-legal-link">Docs</Link>
            <Link href="/contact" className="cs-footer-legal-link">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}