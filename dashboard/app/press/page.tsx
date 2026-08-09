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

export default function PressPage() {
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
          <div className="cs-kicker" style={{ justifyContent: "center", display: "flex" }}>PRESS & MEDIA</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-1.5px" }}>Official Press Releases</h1>
        </div>
      </section>

      <section style={{ padding: "60px 40px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { date: "August 8, 2026", title: "Threatenx Unveils Autonomous 7-Agent Incident Response Federation at Fal.Con 2026" },
            { date: "July 20, 2026", title: "Threatenx Achieves SOC 2 Type II Certification & Launches Zero-Trust VPC Agent Deployment" },
            { date: "June 15, 2026", title: "Threatenx Integrates Groq Llama 3 70B Engine to Achieve Sub-500ms Incident Synthesis" }
          ].map((pr, i) => (
            <div key={i} style={{ borderBottom: "1px solid #eee", paddingBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#888", fontWeight: 700, marginBottom: 6 }}>{pr.date}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#000", marginBottom: 8 }}>{pr.title}</h3>
              <Link href="/blog" style={{ color: "#ec0000", fontWeight: 800, fontSize: 13, textDecoration: "none" }}>Read press release →</Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="cs-footer"><div className="cs-footer-bottom"><div className="cs-footer-copy">© 2026 Threatenx Inc. All rights reserved.</div></div></footer>
    </div>
  );
}