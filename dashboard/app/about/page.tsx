"use client";

import Link from "next/link";

function ShieldIcon({ size = 32, color = "#ec0000" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3L36 10v11c0 9.5-7.5 17.5-16 18.5C11.5 38.5 4 30.5 4 21V10L20 3z" fill={color} />
      <path d="M14 20l4.5 4.5L26 15" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AboutPage() {
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
              <li><Link href="/pricing" className="cs-nav-item">Pricing</Link></li>
              <li><Link href="/about" className="cs-nav-item" style={{ color: "#ec0000" }}>About</Link></li>
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
      <section style={{ background: "#0a0a0a", color: "#fff", padding: "80px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="cs-kicker" style={{ justifyContent: "center", display: "flex" }}>OUR MISSION</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: 20 }}>
            Redefining Cybersecurity with <span style={{ color: "#ec0000" }}>Autonomous Agentic Intelligence</span>
          </h1>
          <p style={{ fontSize: 17, color: "#888", lineHeight: 1.6 }}>
            Modern enterprise defense cannot rely on manual triage or monolithic chatbots. Threatenx coordinates specialized autonomous AI agents to defend global networks in real time.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section style={{ padding: "80px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          <div style={{ background: "#f8f8f8", border: "1px solid #e0e0e0", borderRadius: 8, padding: 32 }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>⚡</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Sub-3 Minute MTTR</h3>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>
              Automating detection, malware detonation, log tracing, and statutory compliance clock calculations in parallel instead of sequential SOC handoffs.
            </p>
          </div>

          <div style={{ background: "#f8f8f8", border: "1px solid #e0e0e0", borderRadius: 8, padding: 32 }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>🛡️</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Human-in-the-Loop</h3>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>
              AI proposes containment playbooks; Human Security Officers retain final approval authority. Absolute safety with enterprise-grade governance.
            </p>
          </div>

          <div style={{ background: "#f8f8f8", border: "1px solid #e0e0e0", borderRadius: 8, padding: 32 }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>🔒</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Zero-Trust Hybrid Edge</h3>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>
              Worker agents execute inside customer VPCs. Only sanitized IoC metadata is shared over the Band interaction mesh. Raw PII never leaves your network.
            </p>
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
          </div>
        </div>
      </footer>
    </div>
  );
}