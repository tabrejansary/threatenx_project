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

export default function TrustPage() {
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
          <div className="cs-kicker" style={{ justifyContent: "center", display: "flex" }}>TRUST & SECURITY CENTER</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-1.5px" }}>Enterprise Security Trust Portal</h1>
          <p style={{ fontSize: 16, color: "#888", marginTop: 16 }}>Threatenx maintains continuous compliance with international security standards.</p>
        </div>
      </section>

      <section style={{ padding: "60px 40px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 40 }}>
          {["SOC 2 TYPE II", "ISO 27001", "GDPR COMPLIANT", "FedRAMP READY"].map((c, i) => (
            <div key={i} style={{ background: "#f8f8f8", border: "1px solid #e0e0e0", borderRadius: 6, padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#000" }}>{c}</div>
              <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 700, marginTop: 4 }}>Verified Active</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="cs-footer"><div className="cs-footer-bottom"><div className="cs-footer-copy">© 2026 Threatenx Inc. All rights reserved.</div></div></footer>
    </div>
  );
}