"use client";
import { useState } from "react";
import Link from "next/link";
import { UtilBar, SiteHeader, SiteFooter } from "../../components/SiteLayout";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ background: "#ffffff", color: "#111", minHeight: "100vh" }}>
      <UtilBar />
      <SiteHeader />

      <section style={{ background: "#0a0a0a", color: "#fff", padding: "70px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="cs-kicker" style={{ justifyContent: "center", display: "flex" }}>CONTACT THREATENX</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-1.5px" }}>Talk to our Security Architecture Team</h1>
          <p style={{ fontSize: 16, color: "#888", marginTop: 12, lineHeight: 1.6 }}>Under active attack? Use the emergency incident room for immediate autonomous triage.</p>
        </div>
      </section>

      <section style={{ padding: "70px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <div style={{ background: "#0a0a0a", color: "#fff", padding: 40, borderRadius: 8, border: "1px solid #2a2a2a" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#ec0000", letterSpacing: 1.5, marginBottom: 12 }}>🚨 24/7 BREACH EMERGENCY HOTLINE</div>
            <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Active Incident Response</h3>
            <p style={{ fontSize: 14, color: "#aaa", lineHeight: 1.6, marginBottom: 24 }}>
              If your organisation is currently experiencing an active ransomware campaign, data exfiltration, or cloud compromise, launch an AI-assisted incident room immediately.
            </p>
            <div style={{ background: "#1a0000", border: "1px solid #ec0000", borderRadius: 6, padding: 16, fontSize: 16, fontWeight: 900, color: "#ec0000", textAlign: "center", marginBottom: 20 }}>
              📞 +1 (800) 555-THREAT (8473)
            </div>
            <Link href="/portal" className="cs-btn-red" style={{ justifyContent: "center", width: "100%", display: "flex" }}>
              Open Emergency Incident Room →
            </Link>

            <div style={{ marginTop: 32, paddingTop: 28, borderTop: "1px solid #222" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#888", letterSpacing: 1.5, marginBottom: 16 }}>DIRECT CONTACTS</div>
              {[
                { dept: "Sales Engineering", email: "sales@threatenx.io" },
                { dept: "Partner Program", email: "partners@threatenx.io" },
                { dept: "Data Protection Officer", email: "privacy@threatenx.io" }
              ].map((c, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "#666", fontWeight: 700 }}>{c.dept}</div>
                  <div style={{ fontSize: 13, color: "#ec0000", fontWeight: 700 }}>{c.email}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#f8f8f8", border: "1px solid #e0e0e0", borderRadius: 8, padding: 40 }}>
            <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 24 }}>Enterprise Inquiry</h3>
            {submitted ? (
              <div style={{ padding: 24, background: "#0a1f0a", border: "1px solid #22c55e", borderRadius: 6, color: "#22c55e", fontWeight: 700, textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>✓</div>
                Thank you! Our architecture team will reach out within 2 business hours.
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase" as const, display: "block", marginBottom: 6 }}>First Name</label>
                    <input required type="text" placeholder="Jane" style={{ width: "100%", padding: "12px 14px", borderRadius: 4, border: "1px solid #ccc", outline: "none", fontSize: 14 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase" as const, display: "block", marginBottom: 6 }}>Last Name</label>
                    <input required type="text" placeholder="Smith" style={{ width: "100%", padding: "12px 14px", borderRadius: 4, border: "1px solid #ccc", outline: "none", fontSize: 14 }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase" as const, display: "block", marginBottom: 6 }}>Work Email</label>
                  <input required type="email" placeholder="ciso@company.com" style={{ width: "100%", padding: "12px 14px", borderRadius: 4, border: "1px solid #ccc", outline: "none", fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase" as const, display: "block", marginBottom: 6 }}>Organisation</label>
                  <input required type="text" placeholder="Acme Corp" style={{ width: "100%", padding: "12px 14px", borderRadius: 4, border: "1px solid #ccc", outline: "none", fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase" as const, display: "block", marginBottom: 6 }}>Inquiry Type</label>
                  <select style={{ width: "100%", padding: "12px 14px", borderRadius: 4, border: "1px solid #ccc", outline: "none", background: "#fff", fontSize: 14 }}>
                    <option>Enterprise VPC Deployment</option>
                    <option>Custom SIEM Integration</option>
                    <option>Partnership / Reseller</option>
                    <option>GDPR Advisory Services</option>
                    <option>General Question</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase" as const, display: "block", marginBottom: 6 }}>Message</label>
                  <textarea rows={4} required placeholder="Describe your security requirements..." style={{ width: "100%", padding: "12px 14px", borderRadius: 4, border: "1px solid #ccc", outline: "none", fontSize: 14, resize: "vertical" }}></textarea>
                </div>
                <button type="submit" className="cs-btn-red" style={{ justifyContent: "center", display: "flex" }}>Submit Inquiry →</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}