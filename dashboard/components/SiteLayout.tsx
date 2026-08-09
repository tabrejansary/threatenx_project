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

export function UtilBar() {
  return (
    <div className="cs-util-bar">
      <Link href="/contact" className="cs-util-link breach">Experienced a breach?</Link>
      <Link href="/blog" className="cs-util-link">Blog</Link>
      <Link href="/contact" className="cs-util-link">Contact Us</Link>
      <Link href="/careers" className="cs-util-link">Careers</Link>
      <Link href="/innovations" className="cs-util-link">Latest Innovations</Link>
    </div>
  );
}

export function SiteHeader({ activePage = "" }: { activePage?: string }) {
  const navLinks = [
    { href: "/portal", label: "Platform" },
    { href: "/solutions", label: "Solutions" },
    { href: "/docs", label: "Documentation" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
  ];
  return (
    <header className="cs-header">
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <Link href="/" className="cs-brand">
          <ShieldIcon size={34} color="#ec0000" />
          <span className="cs-logo-text">Threaten<span>x</span></span>
        </Link>
        <nav>
          <ul className="cs-nav-menu">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="cs-nav-item" style={activePage === link.label ? { color: "#ec0000" } : {}}>
                  {link.label}
                </Link>
              </li>
            ))}
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
  );
}

export function SiteFooter() {
  return (
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
            <li><Link href="/pricing" className="cs-footer-link">Pricing &amp; Quotas</Link></li>
            <li><Link href="/blog" className="cs-footer-link">Blog</Link></li>
          </ul>
        </div>

        <div>
          <div className="cs-footer-col-title">Company</div>
          <ul className="cs-footer-links">
            <li><Link href="/about" className="cs-footer-link">About Us</Link></li>
            <li><Link href="/careers" className="cs-footer-link">Careers</Link></li>
            <li><Link href="/contact" className="cs-footer-link">Contact Sales</Link></li>
            <li><Link href="/contact" className="cs-footer-link">Emergency Hotline</Link></li>
            <li><Link href="/press" className="cs-footer-link">Press Releases</Link></li>
            <li><Link href="/trust" className="cs-footer-link">Security Trust</Link></li>
          </ul>
        </div>
      </div>

      <hr className="cs-footer-divider" />

      <div className="cs-footer-bottom">
        <div className="cs-footer-copy">&copy; 2026 Threatenx Inc. All rights reserved.</div>
        <div className="cs-footer-legal">
          <Link href="/privacy" className="cs-footer-legal-link">Privacy Notice</Link>
          <Link href="/terms" className="cs-footer-legal-link">Terms of Service</Link>
          <Link href="/cookies" className="cs-footer-legal-link">Cookie Policy</Link>
          <Link href="/privacy" className="cs-footer-legal-link">GDPR Data Request</Link>
          <Link href="/trust" className="cs-footer-legal-link">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
}