"use client";

function ShieldIcon({ size = 32, color = "#ec0000" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3L36 10v11c0 9.5-7.5 17.5-16 18.5C11.5 38.5 4 30.5 4 21V10L20 3z" fill={color} />
      <path d="M14 20l4.5 4.5L26 15" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LegalHeader() {
  return (
    <header className="cs-header">
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <a href="/" className="cs-brand"><ShieldIcon size={34} color="#ec0000" /><span className="cs-logo-text">Threaten<span>x</span></span></a>
        <nav><ul className="cs-nav-menu">
          <li><a href="/portal" className="cs-nav-item">Platform</a></li>
          <li><a href="/solutions" className="cs-nav-item">Solutions</a></li>
          <li><a href="/docs" className="cs-nav-item">Documentation</a></li>
          <li><a href="/pricing" className="cs-nav-item">Pricing</a></li>
          <li><a href="/about" className="cs-nav-item">About</a></li>
          <li><a href="/blog" className="cs-nav-item">Blog</a></li>
        </ul></nav>
      </div>
      <div className="cs-header-right">
        <a href="/login" className="cs-icon-btn" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "0 14px", width: "auto", borderRadius: 4, fontSize: 13, fontWeight: 700, color: "#111", textDecoration: "none" }}>Log in</a>
        <a href="/signup" className="cs-btn-red">Start free trial →</a>
      </div>
    </header>
  );
}
function LegalFooter() {
  return (
    <footer className="cs-footer"><div className="cs-footer-bottom">
      <div className="cs-footer-copy">© 2026 Threatenx Inc. All rights reserved.</div>
      <div className="cs-footer-legal">
        <a href="/privacy" className="cs-footer-legal-link">Privacy Notice</a>
        <a href="/terms" className="cs-footer-legal-link">Terms of Service</a>
        <a href="/cookies" className="cs-footer-legal-link">Cookie Policy</a>
        <a href="/trust" className="cs-footer-legal-link">Accessibility</a>
      </div>
    </div></footer>
  );
}

export default function CookiePolicyPage() {
  return (
    <div style={{ background: "#ffffff", color: "#111", minHeight: "100vh" }}>
      <LegalHeader />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "60px 40px", lineHeight: 1.85 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#ec0000", letterSpacing: 1.5, marginBottom: 12 }}>LEGAL</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8 }}>Cookie Policy</h1>
        <p style={{ color: "#888", marginBottom: 40, fontSize: 13 }}>Last updated: August 9, 2026</p>

        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Cookies We Use</h2>

        <div style={{ overflowX: "auto", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f0f0f0", borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 800 }}>Cookie Name</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 800 }}>Purpose</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 800 }}>Duration</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 800 }}>Category</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "txsession", purpose: "Maintains authenticated SOC portal sessions", duration: "Session", cat: "Essential" },
                { name: "txscenario", purpose: "Remembers last active incident scenario", duration: "24 hours", cat: "Functional" },
                { name: "__Host-csrf", purpose: "Cross-site request forgery protection token", duration: "Session", cat: "Security" }
              ].map((c, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px 16px", fontFamily: "monospace", color: "#ec0000", fontWeight: 700 }}>{c.name}</td>
                  <td style={{ padding: "12px 16px", color: "#444" }}>{c.purpose}</td>
                  <td style={{ padding: "12px 16px", color: "#666" }}>{c.duration}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: c.cat === "Essential" ? "#0a1f0a" : "#1a1500", color: c.cat === "Essential" ? "#22c55e" : "#eab308", padding: "2px 8px", borderRadius: 3, fontSize: 11, fontWeight: 700 }}>{c.cat}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ color: "#444", marginBottom: 16 }}>Threatenx does not use advertising cookies, third-party analytics trackers, or fingerprinting technologies. No cookie data is sold or shared with third parties.</p>
        <p style={{ color: "#444" }}>Essential session cookies cannot be disabled without preventing portal authentication. To manage cookie preferences, contact privacy@threatenx.io.</p>
      </div>
      <LegalFooter />
    </div>
  );
}