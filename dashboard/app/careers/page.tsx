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

export default function CareersPage() {
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
          <div className="cs-kicker" style={{ justifyContent: "center", display: "flex" }}>JOIN THE TEAM</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-1.5px" }}>Build the Future of Autonomous Cyber Defense</h1>
          <p style={{ fontSize: 16, color: "#888", marginTop: 16 }}>We are looking for security researchers, AI engineers, and system architects passionate about solving enterprise incident response.</p>
        </div>
      </section>

      <section style={{ padding: "60px 40px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 28 }}>Open Roles</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { title: "Senior AI Security Engineer", dept: "AI Engineering", loc: "San Francisco, CA / Remote" },
            { title: "Principal Threat Intel Researcher", dept: "Threat Labs", loc: "London, UK / Remote" },
            { title: "Distributed Systems Backend Architect (Python/Go)", dept: "Mesh Infrastructure", loc: "Remote" },
            { title: "Product Designer (Enterprise Security)", dept: "Design", loc: "San Francisco, CA" }
          ].map((role, i) => (
            <div key={i} style={{ background: "#f8f8f8", border: "1px solid #e0e0e0", borderRadius: 6, padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#000", marginBottom: 4 }}>{role.title}</h3>
                <div style={{ fontSize: 13, color: "#666" }}>{role.dept} • {role.loc}</div>
              </div>
              <Link href="/contact" className="cs-btn-red" style={{ padding: "8px 16px", fontSize: 12 }}>Apply Now →</Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="cs-footer"><div className="cs-footer-bottom"><div className="cs-footer-copy">© 2026 Threatenx Inc. All rights reserved.</div></div></footer>
    </div>
  );
}