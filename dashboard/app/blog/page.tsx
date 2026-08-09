"use client";

import { useState } from "react";
import Link from "next/link";

function ShieldIcon({ size = 32, color = "#ec0000" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3L36 10v11c0 9.5-7.5 17.5-16 18.5C11.5 38.5 4 30.5 4 21V10L20 3z" fill={color} />
      <path d="M14 20l4.5 4.5L26 15" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const BLOG_POSTS = [
  {
    slug: "falcon-2026-autonomous-ai-security",
    title: "Fal.Con 2026: How Autonomous AI Security Agents Outpace Monolithic SOC Automation",
    category: "RESEARCH & THREAT INTEL",
    date: "August 8, 2026",
    readTime: "6 min read",
    author: "Dr. Aris Vance",
    authorRole: "Chief AI Architect",
    featured: true,
    excerpt: "Monolithic LLM prompts fail when triage requires real-time log parsing, malware detonation, and legal compliance drafting. Here is how multi-agent federation solves context overflow.",
    bgGradient: "linear-gradient(135deg, #1a0000 0%, #0a0a0a 100%)",
    accentColor: "#ec0000",
    visualIcon: "⚡",
    visualCode: `[AGENT_FEDERATION]
ThreatDetector -> LogAnalyzer -> MalwareDetonator
Result: MTTR reduced from 4.2h to 2m 14s`
  },
  {
    slug: "anatomy-72h-gdpr-breach-romanian-pii",
    title: "Anatomy of a 72-Hour GDPR Breach: From Geographic Anomaly to Data Exfiltration",
    category: "INCIDENT CASE STUDY",
    date: "August 2, 2026",
    readTime: "8 min read",
    author: "Elena Rostova",
    authorRole: "Lead Compliance Engineer",
    featured: false,
    excerpt: "A deep dive into how a valid MFA session from Romania resulted in 4.2GB of PII bulk download — and how Threatenx Compliance Agent automated regulatory disclosures.",
    bgGradient: "linear-gradient(135deg, #0a1f0a 0%, #0a0a0a 100%)",
    accentColor: "#22c55e",
    visualIcon: "⚖️",
    visualCode: `[GDPR_ARTICLE_33]
Reporting Clock: ACTIVE (72:00:00)
Exfiltrated Records: 150,000 PII rows`
  },
  {
    slug: "detecting-leaked-aws-iam-keys-cryptojacking",
    title: "Detecting Leaked AWS IAM Keys Used for Cryptojacking in Under 60 Seconds",
    category: "CLOUD SECURITY",
    date: "July 26, 2026",
    readTime: "5 min read",
    author: "Marcus Thorne",
    authorRole: "Principal Cloud Security Researcher",
    featured: false,
    excerpt: "Unauthorised GPU EC2 provisioning can cost enterprises over $84,000 per day. Learn how CloudTrail correlation agents revoke abused access keys instantly.",
    bgGradient: "linear-gradient(135deg, #1a1500 0%, #0a0a0a 100%)",
    accentColor: "#eab308",
    visualIcon: "☁️",
    visualCode: `[AWS_CLOUDTRAIL]
Event: RunInstances (48 x g5.12xlarge)
ASN: AS209 (Russia) -> Key Revoked`
  },
  {
    slug: "blackforge-ransomware-sandbox-disassembly",
    title: "Deconstructing BlackForge Ransomware: Static Disassembly & Shadow Copy Deletion",
    category: "MALWARE ANALYSIS",
    date: "July 18, 2026",
    readTime: "9 min read",
    author: "Kaelen Voss",
    authorRole: "Senior Malware Analyst",
    featured: false,
    excerpt: "Reverse-engineering BlackForge ransomware payload binaries. How Malware Analysis Agent detects SMB share encryption and shadow copy deletion commands.",
    bgGradient: "linear-gradient(135deg, #1a0a1f 0%, #0a0a0a 100%)",
    accentColor: "#a855f7",
    visualIcon: "🦠",
    visualCode: `[BINARY_DETONATION]
Cmd: vssadmin delete shadows /all /quiet
Extension: .forge -> C2 Beacon Flagged`
  },
  {
    slug: "hitl-human-in-the-loop-containment-safety",
    title: "Human-in-the-Loop Safeguards: Why Autonomous Security Requires Explicit Operator Consent",
    category: "PLATFORM ARCHITECTURE",
    date: "July 10, 2026",
    readTime: "4 min read",
    author: "Sarah Jenkins",
    authorRole: "VP of Product Security",
    featured: false,
    excerpt: "Fully autonomous execution can inadvertently sever critical production systems. Threatenx keeps Security Officers in total control with single-click HITL playbooks.",
    bgGradient: "linear-gradient(135deg, #0a1a1f 0%, #0a0a0a 100%)",
    accentColor: "#06b6d4",
    visualIcon: "👤",
    visualCode: `[HITL_GOVERNANCE]
Proposed: Isolate Host FINANCE-PC-04
Status: Pending Security Officer Approval`
  },
  {
    slug: "groq-llama3-70b-incident-commander-reasoning",
    title: "Benchmarking Llama 3 70B via Groq for Real-Time Security Incident Dossier Synthesis",
    category: "AI AGENT BENCHMARKS",
    date: "June 29, 2026",
    readTime: "7 min read",
    author: "Dr. Aris Vance",
    authorRole: "Chief AI Architect",
    featured: false,
    excerpt: "How sub-500ms inference speeds enable the Incident Commander agent to synthesize 6 parallel analysis streams into a unified executive dossier in real time.",
    bgGradient: "linear-gradient(135deg, #1f0a14 0%, #0a0a0a 100%)",
    accentColor: "#f43f5e",
    visualIcon: "🧠",
    visualCode: `[GROQ_INFERENCE_BENCHMARK]
Tokens/sec: 320 t/s
Synthesis Latency: 420ms -> Dossier Ready`
  }
];

export default function BlogIndexPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["ALL", "RESEARCH & THREAT INTEL", "INCIDENT CASE STUDY", "CLOUD SECURITY", "MALWARE ANALYSIS", "PLATFORM ARCHITECTURE"];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = activeCategory === "ALL" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0];

  return (
    <div style={{ background: "#ffffff", color: "#111", minHeight: "100vh" }}>
      {/* Utility Bar */}
      <div className="cs-util-bar">
        <Link href="/contact" className="cs-util-link breach">Experienced a breach?</Link>
        <Link href="/blog" className="cs-util-link">Blog</Link>
        <Link href="/contact" className="cs-util-link">Contact Us</Link>
        <Link href="/careers" className="cs-util-link">Careers</Link>
        <Link href="/innovations" className="cs-util-link">Latest Innovations</Link>
      </div>

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

      {/* Hero Section */}
      <section style={{ background: "#0a0a0a", color: "#fff", padding: "70px 40px 60px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="cs-kicker">THREATENX CYBER LABS & RESEARCH</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: 16 }}>
            Frontline Threat Intelligence & <span style={{ color: "#ec0000" }}>Autonomous Security Research</span>
          </h1>
          <p style={{ fontSize: 16, color: "#888", maxWidth: 680, lineHeight: 1.6, marginBottom: 40 }}>
            In-depth analysis of adversary TTPs, ransomware family disassemblies, multi-agent LLM benchmarks, and statutory GDPR breach compliance frameworks.
          </p>

          {/* Featured Hero Card */}
          <Link href={`/blog/${featuredPost.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
            <div style={{
              background: featuredPost.bgGradient,
              border: `1px solid ${featuredPost.accentColor}44`,
              borderRadius: 8,
              padding: 40,
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: 40,
              alignItems: "center",
              transition: "transform 0.2s, border-color 0.2s",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 10, fontWeight: 900, background: featuredPost.accentColor, color: "#fff", padding: "3px 10px", borderRadius: 3, letterSpacing: 1 }}>FEATURED POST</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: featuredPost.accentColor }}>{featuredPost.category}</span>
                  <span style={{ fontSize: 12, color: "#666" }}>• {featuredPost.readTime}</span>
                </div>
                <h2 style={{ fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1.25, marginBottom: 16, letterSpacing: "-0.5px" }}>
                  {featuredPost.title}
                </h2>
                <p style={{ fontSize: 15, color: "#aaa", lineHeight: 1.65, marginBottom: 24 }}>
                  {featuredPost.excerpt}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#222", border: `2px solid ${featuredPost.accentColor}`, display: "flex", alignItems: "center", justifyCenter: "center", color: "#fff", fontWeight: 800, fontSize: 12, textTransform: "uppercase" }}>
                    {featuredPost.author.split(" ").map(n=>n[0]).join("")}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{featuredPost.author}</div>
                    <div style={{ fontSize: 11, color: "#777" }}>{featuredPost.authorRole} • {featuredPost.date}</div>
                  </div>
                </div>
              </div>

              {/* Code Visual Card */}
              <div style={{ background: "#050505", border: "1px solid #222", borderRadius: 6, padding: 24, fontFamily: "JetBrains Mono, monospace" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, borderBottom: "1px solid #1a1a1a", paddingBottom: 10 }}>
                  <span style={{ fontSize: 24 }}>{featuredPost.visualIcon}</span>
                  <span style={{ fontSize: 10, color: featuredPost.accentColor, fontWeight: 700 }}>TELEMETRY_LOG</span>
                </div>
                <pre style={{ fontSize: 11.5, color: "#22c55e", lineHeight: 1.6, whiteSpace: "pre-wrap", margin: 0 }}>
                  {featuredPost.visualCode}
                </pre>
                <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid #1a1a1a", display: "flex", justifyContent: "flex-end" }}>
                  <span style={{ color: featuredPost.accentColor, fontSize: 13, fontWeight: 800 }}>Read Article →</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section style={{ background: "#ffffff", padding: "30px 40px", borderBottom: "1px solid #eee", sticky: "top", top: 68, zIndex: 100 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          {/* Category Tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  border: activeCategory === cat ? "1.5px solid #ec0000" : "1.5px solid #e0e0e0",
                  background: activeCategory === cat ? "#ec0000" : "#ffffff",
                  color: activeCategory === cat ? "#ffffff" : "#444444",
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: "relative", minWidth: 280 }}>
            <input
              type="text"
              placeholder="Search research articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 14px 9px 36px",
                borderRadius: 4,
                border: "1px solid #ccc",
                fontSize: 13,
                outline: "none"
              }}
            />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#888" }}>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M16.5 16.5l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Multi-layout Card Grid */}
      <section style={{ padding: "60px 40px 90px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
          {filteredPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit", display: "flex" }}>
              <div style={{
                background: "#ffffff",
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.12)";
                e.currentTarget.style.borderColor = "#ec0000";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                e.currentTarget.style.borderColor = "#e0e0e0";
              }}
              >
                {/* Visual Header Banner */}
                <div style={{ background: post.bgGradient, padding: 24, position: "relative", minHeight: 140, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 9, fontWeight: 900, color: "#fff", background: post.accentColor, padding: "2px 8px", borderRadius: 2, letterSpacing: 0.5 }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: 20 }}>{post.visualIcon}</span>
                  </div>
                  <pre style={{ fontSize: 10, color: post.accentColor, fontFamily: "JetBrains Mono, monospace", margin: 0, opacity: 0.9 }}>
                    {post.visualCode.split("\n")[0]}
                  </pre>
                </div>

                {/* Card Body */}
                <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 8, fontWeight: 600 }}>
                    {post.date} • {post.readTime}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: "#000", lineHeight: 1.35, marginBottom: 12 }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, flex: 1, marginBottom: 20 }}>
                    {post.excerpt}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid #eee" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>
                        {post.author.split(" ").map(n=>n[0]).join("")}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#333" }}>{post.author}</span>
                    </div>
                    <span style={{ color: "#ec0000", fontSize: 12, fontWeight: 800 }}>Read →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="cs-footer">
        <div className="cs-footer-top">
          <div className="cs-footer-brand-block">
            <Link href="/" className="cs-brand" style={{ gap: 10 }}>
              <ShieldIcon size={30} color="#ec0000" />
              <span className="cs-logo-text" style={{ color: "#fff" }}>Threaten<span>x</span></span>
            </Link>
            <p className="cs-footer-brand-tagline">
              The world&apos;s leading collaborative multi-agent cybersecurity incident response platform. 7 AI agents. 1 human decision. Zero breaches.
            </p>
            <div className="cs-footer-certs" style={{ marginTop: 20 }}>
              {["SOC 2 TYPE II", "ISO 27001", "GDPR COMPLIANT", "FedRAMP READY"].map(c => (
                <span key={c} className="cs-cert-badge">{c}</span>
              ))}
            </div>
          </div>

          <div>
            <div className="cs-footer-col-title">Platform</div>
            <ul className="cs-footer-links">
              <li><Link href="/platform/threat-detection" className="cs-footer-link">Threat Detection</Link></li>
              <li><Link href="/platform/log-analysis" className="cs-footer-link">Log Analysis</Link></li>
              <li><Link href="/platform/malware-sandbox" className="cs-footer-link">Malware Sandbox</Link></li>
              <li><Link href="/platform/risk-assessment" className="cs-footer-link">Risk Assessment</Link></li>
              <li><Link href="/platform/compliance-clock" className="cs-footer-link">Compliance Clock</Link></li>
              <li><Link href="/platform/incident-commander" className="cs-footer-link">Incident Commander</Link></li>
            </ul>
          </div>

          <div>
            <div className="cs-footer-col-title">Solutions</div>
            <ul className="cs-footer-links">
              <li><Link href="/solutions" className="cs-footer-link">Stop Breaches</Link></li>
              <li><Link href="/solutions" className="cs-footer-link">Prevent Data Leakage</Link></li>
              <li><Link href="/solutions" className="cs-footer-link">Secure Cloud</Link></li>
              <li><Link href="/solutions" className="cs-footer-link">Stop Ransomware</Link></li>
              <li><Link href="/solutions" className="cs-footer-link">GDPR Compliance</Link></li>
              <li><Link href="/portal" className="cs-footer-link">HITL Response</Link></li>
            </ul>
          </div>

          <div>
            <div className="cs-footer-col-title">Resources</div>
            <ul className="cs-footer-links">
              <li><Link href="/portal" className="cs-footer-link">Incident Portal</Link></li>
              <li><Link href="/docs" className="cs-footer-link">Documentation</Link></li>
              <li><Link href="/docs" className="cs-footer-link">Agent Architecture</Link></li>
              <li><Link href="/docs" className="cs-footer-link">API Reference</Link></li>
              <li><Link href="/pricing" className="cs-footer-link">Pricing & Quotas</Link></li>
              <li><Link href="/blog" className="cs-footer-link">Blog</Link></li>
            </ul>
          </div>

          <div>
            <div className="cs-footer-col-title">Company</div>
            <ul className="cs-footer-links">
              <li><Link href="/about" className="cs-footer-link">About Us</Link></li>
              <li><Link href="/contact" className="cs-footer-link">Contact Sales</Link></li>
              <li><Link href="/contact" className="cs-footer-link">Emergency Hotline</Link></li>
              <li><Link href="/press" className="cs-footer-link">Press Releases</Link></li>
              <li><Link href="/trust" className="cs-footer-link">Security Trust</Link></li>
            </ul>
          </div>
        </div>

        <hr className="cs-footer-divider" />

        <div className="cs-footer-bottom">
          <div className="cs-footer-copy">© 2026 Threatenx Inc. All rights reserved.</div>
          <div className="cs-footer-legal">
            <Link href="/privacy" className="cs-footer-legal-link">Privacy Notice</Link>
            <Link href="/terms" className="cs-footer-legal-link">Terms of Service</Link>
            <Link href="/cookies" className="cs-footer-legal-link">Cookie Policy</Link>
            <Link href="/privacy" className="cs-footer-legal-link">GDPR Data Request</Link>
            <Link href="/trust" className="cs-footer-legal-link">Accessibility</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}