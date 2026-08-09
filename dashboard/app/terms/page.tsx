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

export default function TermsPage() {
  return (
    <div style={{ background: "#ffffff", color: "#111", minHeight: "100vh" }}>
      <LegalHeader />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "60px 40px", lineHeight: 1.85 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#ec0000", letterSpacing: 1.5, marginBottom: 12 }}>LEGAL</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ color: "#888", marginBottom: 40, fontSize: 13 }}>Last updated: August 9, 2026</p>

        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>1. Acceptance of Terms</h2>
        <p style={{ color: "#444", marginBottom: 24 }}>By accessing the Threatenx multi-agent security platform, SOC portal, or any associated APIs, you agree to these Terms of Service and our Privacy Notice.</p>

        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>2. Permitted Use</h2>
        <p style={{ color: "#444", marginBottom: 24 }}>Threatenx is licensed for authorized security operations personnel to perform defensive incident response activities within their own organisation&apos;s networks. Any offensive use, resale, or reverse engineering is strictly prohibited.</p>

        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>3. Human-in-the-Loop Governance</h2>
        <p style={{ color: "#444", marginBottom: 24 }}>All AI-generated containment actions must be reviewed and explicitly approved by an authorised Human Security Officer before execution. Threatenx Inc. holds no liability for autonomous actions taken without valid operator approval in the dashboard.</p>

        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>4. LLM API Services</h2>
        <p style={{ color: "#444", marginBottom: 24 }}>The platform uses Google Gemini 2.5 Flash and Groq Llama 3 70B APIs. Usage is subject to Google&apos;s and Groq&apos;s terms. Threatenx caches canned fallback responses when API quotas are exhausted to maintain availability.</p>

        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>5. Limitation of Liability</h2>
        <p style={{ color: "#444", marginBottom: 24 }}>Threatenx Inc. is not liable for security breaches or data losses arising from failure to implement HITL-approved containment actions, external API outages, or misconfigured SIEM/EDR integrations.</p>
      </div>
      <LegalFooter />
    </div>
  );
}