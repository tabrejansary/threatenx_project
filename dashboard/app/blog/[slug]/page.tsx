"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { BLOG_POSTS } from "../page";

function ShieldIcon({ size = 32, color = "#ec0000" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3L36 10v11c0 9.5-7.5 17.5-16 18.5C11.5 38.5 4 30.5 4 21V10L20 3z" fill={color} />
      <path d="M14 20l4.5 4.5L26 15" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BlogArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const post = BLOG_POSTS.find(p => p.slug === slug) || BLOG_POSTS[0];

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
              <li><Link href="/portal" className="cs-nav-item">Platform</Link></li>
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

      {/* Article Header Banner */}
      <section style={{ background: post.bgGradient, color: "#fff", padding: "70px 40px", borderBottom: "1px solid #222" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Link href="/blog" style={{ color: post.accentColor, fontSize: 12, fontWeight: 800, textDecoration: "none", textTransform: "uppercase", letterSpacing: 1, display: "inline-block", marginBottom: 20 }}>
            ← Back to Blog Research
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 900, background: post.accentColor, color: "#fff", padding: "3px 10px", borderRadius: 3, letterSpacing: 1 }}>{post.category}</span>
            <span style={{ fontSize: 12, color: "#aaa" }}>{post.date} • {post.readTime}</span>
          </div>

          <h1 style={{ fontSize: 42, fontWeight: 900, color: "#fff", lineHeight: 1.2, letterSpacing: "-1px", marginBottom: 24 }}>
            {post.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 20, borderTop: "1px solid #222" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#000", border: `2px solid ${post.accentColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff" }}>
              {post.author.split(" ").map(n=>n[0]).join("")}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{post.author}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{post.authorRole}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Article Body */}
      <main style={{ padding: "60px 40px 90px", maxWidth: 860, margin: "0 auto", fontSize: 16, lineHeight: 1.8, color: "#222" }}>
        {/* Article Banner Image */}
        {post.image && (
          <div style={{ borderRadius: 8, overflow: "hidden", marginBottom: 40, border: "1px solid #e0e0e0", boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}>
            <img src={post.image} alt={post.title} style={{ width: "100%", height: 380, objectFit: "cover" }} />
          </div>
        )}

        <p style={{ fontSize: 19, fontWeight: 500, color: "#444", lineHeight: 1.6, marginBottom: 36, borderLeft: `4px solid ${post.accentColor}`, paddingLeft: 20 }}>
          {post.excerpt}
        </p>

        <h2 style={{ fontSize: 26, fontWeight: 900, marginTop: 40, marginBottom: 16 }}>1. Threat Overview & Initial Telemetry</h2>
        <p style={{ marginBottom: 20 }}>
          When security operations centers encounter geographic login anomalies or suspicious binary executions, manual sequential triage introduces fatal delay. Threatenx Threat Detection Agent ingests multi-source SIEM and EDR logs to immediately bootstrap an incident room.
        </p>

        {/* Code / Telemetry Log Box */}
        <div style={{ background: "#0a0a0a", color: "#fff", borderRadius: 8, padding: 24, margin: "28px 0", border: "1px solid #222", fontFamily: "JetBrains Mono, monospace" }}>
          <div style={{ fontSize: 11, color: post.accentColor, fontWeight: 800, letterSpacing: 1.5, marginBottom: 12 }}>FORENSIC TELEMETRY EXTRACT</div>
          <pre style={{ fontSize: 12, color: "#22c55e", lineHeight: 1.6, whiteSpace: "pre-wrap", margin: 0 }}>
            {post.visualCode}
          </pre>
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 900, marginTop: 40, marginBottom: 16 }}>2. Multi-Agent Analysis & IoC Extraction</h2>
        <p style={{ marginBottom: 20 }}>
          Simultaneously, specialized worker agents collaborate in real time:
        </p>
        <ul style={{ paddingLeft: 24, marginBottom: 28, display: "flex", flexDirection: "column", gap: 10 }}>
          <li><strong>Log Analysis Agent:</strong> Reconstructs SQL query sequences and maps exfiltrated data volumes.</li>
          <li><strong>Malware Analysis Agent:</strong> Performs static binary disassembly, identifies sandbox evasion hooks, and flags C2 infrastructure.</li>
          <li><strong>Compliance Agent:</strong> Evaluates GDPR Article 33 statutory filing requirements and calculates the 72-hour countdown deadline.</li>
        </ul>

        {/* IoC Table */}
        <div style={{ margin: "36px 0" }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Extracted Indicators of Compromise (IoCs)</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f0f0f0", borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: 12 }}>Indicator Type</th>
                <th style={{ padding: 12 }}>Value / Hash</th>
                <th style={{ padding: 12 }}>Confidence</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 12, fontWeight: 700 }}>IP Address (C2)</td>
                <td style={{ padding: 12, fontFamily: "monospace", color: "#ec0000" }}>185.112.144.12</td>
                <td style={{ padding: 12 }}>98% (High)</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 12, fontWeight: 700 }}>SHA-256 Hash</td>
                <td style={{ padding: 12, fontFamily: "monospace" }}>e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</td>
                <td style={{ padding: 12 }}>97% (High)</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 12, fontWeight: 700 }}>Target DB Table</td>
                <td style={{ padding: 12, fontFamily: "monospace" }}>DB-Prod-09.dbo.Customers</td>
                <td style={{ padding: 12 }}>100% (Confirmed)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CTA Card inside Article */}
        <div style={{ background: "#0a0a0a", color: "#fff", borderRadius: 8, padding: 36, textAlign: "center", margin: "48px 0" }}>
          <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Test this attack scenario live</h3>
          <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>
            Run the 7-agent federation against this exact forensic scenario in the Threatenx Interactive Portal.
          </p>
          <Link href="/portal" className="cs-btn-red" style={{ display: "inline-flex", justifyContent: "center" }}>
            Open Active Incident Portal →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="cs-footer">
        <div className="cs-footer-bottom">
          <div className="cs-footer-copy">© 2026 Threatenx Inc. All rights reserved.</div>
          <div className="cs-footer-legal">
            <Link href="/" className="cs-footer-legal-link">Home</Link>
            <Link href="/portal" className="cs-footer-legal-link">Portal</Link>
            <Link href="/blog" className="cs-footer-legal-link">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}