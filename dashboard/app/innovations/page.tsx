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

export default function InnovationsPage() {
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
              <li><Link href="/portal" className="cs-nav-item">Platform</Link></li>
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

      <section style={{ background: "#0a0a0a", color: "#fff", padding: "80px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="cs-kicker" style={{ justifyContent: "center", display: "flex" }}>R&D LABS</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-1.5px" }}>Latest Platform Innovations</h1>
          <p style={{ fontSize: 16, color: "#888", marginTop: 16 }}>Breakthroughs in multi-agent orchestration, Groq Llama 3 70B sub-500ms dossier synthesis, and zero-trust VPC edge containers.</p>
        </div>
      </section>

      <section style={{ padding: "60px 40px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {[
            { title: "Band.ai Mesh v2 Protocol Update", desc: "Reduces agent-to-agent message latency to sub-20ms across global cloud availability zones." },
            { title: "Groq Llama-3-70B Synthesis Engine", desc: "Enables Incident Commander to synthesize 6 parallel worker streams into a unified executive dossier in under 500ms." },
            { title: "Hybrid Edge Docker Agent Distribution", desc: "Allows CISO teams to run worker agents locally inside private VPCs while maintaining zero PII cloud exfiltration." }
          ].map((item, i) => (
            <div key={i} style={{ background: "#f8f8f8", border: "1px solid #e0e0e0", borderRadius: 8, padding: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#ec0000", letterSpacing: 1.5, marginBottom: 8 }}>NEW INNOVATION</div>
              <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="cs-footer"><div className="cs-footer-bottom"><div className="cs-footer-copy">© 2026 Threatenx Inc. All rights reserved.</div></div></footer>
    </div>
  );
}