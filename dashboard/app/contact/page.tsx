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

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

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

      {/* Content */}
      <section style={{ padding: "80px 40px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="cs-kicker" style={{ justifyContent: "center", display: "flex" }}>CONTACT THREATENX</div>
          <h1 style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-1px" }}>Talk to our Security Architecture Team</h1>
          <p style={{ fontSize: 16, color: "#666", marginTop: 12 }}>Under active attack? Select emergency breach hotline below for immediate dispatch.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <div style={{ background: "#0a0a0a", color: "#fff", padding: 36, borderRadius: 8, border: "1px solid #2a2a2a" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#ec0000", letterSpacing: 1.5, marginBottom: 12 }}>🚨 24/7 BREACH EMERGENCY HOTLINE</div>
            <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Active Incident Response</h3>
            <p style={{ fontSize: 14, color: "#aaa", lineHeight: 1.6, marginBottom: 24 }}>
              If your organisation is currently experiencing an active ransomware campaign, data exfiltration, or cloud compromise:
            </p>
            <div style={{ background: "#1a0000", border: "1px solid #ec0000", borderRadius: 6, padding: 16, fontSize: 16, fontWeight: 900, color: "#ec0000", textAlign: "center", marginBottom: 20 }}>
              📞 +1 (800) 555-THREAT (8473)
            </div>
            <Link href="/portal" className="cs-btn-red" style={{ justifyContent: "center", width: "100%" }}>
              Open Emergency Incident Room →
            </Link>
          </div>

          <div style={{ background: "#f8f8f8", border: "1px solid #e0e0e0", borderRadius: 8, padding: 36 }}>
            <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 20 }}>Enterprise Inquiry</h3>
            {submitted ? (
              <div style={{ padding: 20, background: "#0a1f0a", border: "1px solid #22c55e", borderRadius: 6, color: "#22c55e", fontWeight: 700 }}>
                Thank you! Our architecture team will reach out within 2 hours.
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: "#555", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Work Email</label>
                  <input required type="email" placeholder="ciso@company.com" style={{ width: "100%", padding: "12px 14px", borderRadius: 4, border: "1px solid #ccc", outline: "none" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: "#555", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Inquiry Type</label>
                  <select style={{ width: "100%", padding: "12px 14px", borderRadius: 4, border: "1px solid #ccc", outline: "none", background: "#fff" }}>
                    <option>Enterprise VPC Deployment</option>
                    <option>Custom SIEM Integration</option>
                    <option>Partnership / Reseller</option>
                    <option>General Question</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: "#555", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Message</label>
                  <textarea rows={4} placeholder="Describe your security requirements..." style={{ width: "100%", padding: "12px 14px", borderRadius: 4, border: "1px solid #ccc", outline: "none" }}></textarea>
                </div>
                <button type="submit" className="cs-btn-red" style={{ justifyContent: "center" }}>Submit Inquiry →</button>
              </form>
            )}
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