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

const POSTS = [
  {
    title: "Fal.Con 2026: How Autonomous AI Security Agents Beat Monolithic SOC Automation",
    date: "August 8, 2026",
    category: "RESEARCH & THREAT INTEL",
    excerpt: "Monolithic LLM prompts fail when triage requires real-time log parsing, malware detonation, and legal compliance drafting. Here is how multi-agent federation solves context overflow.",
    author: "Dr. Aris Vance, Chief AI Architect"
  },
  {
    title: "Anatomy of a 72-Hour GDPR Breach: From Geographic Anomaly to Data Exfiltration",
    date: "August 2, 2026",
    category: "INCIDENT CASE STUDY",
    excerpt: "A deep dive into how a valid MFA session from Romania resulted in 4.2GB of PII bulk download — and how Threatenx Compliance Agent automated regulatory disclosures.",
    author: "Elena Rostova, Lead Compliance Engineer"
  },
  {
    title: "Detecting Leaked AWS IAM Keys Used for Cryptojacking in Under 60 Seconds",
    date: "July 26, 2026",
    category: "CLOUD SECURITY",
    excerpt: "Unauthorised GPU EC2 provisioning can cost enterprises over $80k per day. Learn how CloudTrail correlation agents revoke abused access keys instantly.",
    author: "Marcus Thorne, Principal Cloud Security Researcher"
  }
];

export default function BlogPage() {
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
              <li><Link href="/about" className="cs-nav-item">About</Link></li>
              <li><Link href="/blog" className="cs-nav-item" style={{ color: "#ec0000" }}>Blog</Link></li>
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

      {/* Main content */}
      <section style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 60 }}>
          <div className="cs-kicker">THREATENX RESEARCH & INSIGHTS</div>
          <h1 style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-1px" }}>Cyber Threat Intelligence Blog</h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {POSTS.map((post, i) => (
            <article key={i} style={{ background: "#f8f8f8", border: "1px solid #e0e0e0", borderRadius: 8, padding: 36 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#ec0000", letterSpacing: 1.5 }}>{post.category}</span>
                <span style={{ fontSize: 12, color: "#888" }}>• {post.date}</span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 14, color: "#000" }}>{post.title}</h2>
              <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6, marginBottom: 20 }}>{post.excerpt}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#444" }}>By {post.author}</span>
                <Link href="/portal" style={{ color: "#ec0000", fontWeight: 800, textDecoration: "none", fontSize: 13 }}>
                  Read research article →
                </Link>
              </div>
            </article>
          ))}
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