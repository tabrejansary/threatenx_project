"use client";
import { useState } from "react";
import { UtilBar, SiteHeader, SiteFooter } from "../../components/SiteLayout";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  return (
    <div style={{ background: "#ffffff", color: "#111", minHeight: "100vh" }}>
      <UtilBar />
      <SiteHeader activePage="Pricing" />

      <section style={{ background: "#0a0a0a", color: "#fff", padding: "80px 40px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div className="cs-kicker" style={{ justifyContent: "center", display: "flex" }}>ENTERPRISE PRICING</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-1.5px", marginBottom: 20, lineHeight: 1.1 }}>
            Predictable security pricing for <span style={{ color: "#ec0000" }}>autonomous AI teams</span>
          </h1>
          <p style={{ fontSize: 17, color: "#888", lineHeight: 1.6, marginBottom: 36 }}>
            Scale your SOC capabilities with 7 specialized AI agents. Zero per-seat lock-in.
          </p>
          <div style={{ display: "inline-flex", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 30, padding: 4 }}>
            <button onClick={() => setBillingCycle("monthly")} style={{ padding: "8px 20px", borderRadius: 24, border: "none", background: billingCycle === "monthly" ? "#ec0000" : "transparent", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Monthly</button>
            <button onClick={() => setBillingCycle("annual")} style={{ padding: "8px 20px", borderRadius: 24, border: "none", background: billingCycle === "annual" ? "#ec0000" : "transparent", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
              Annual <span style={{ fontSize: 10, background: "#fff", color: "#000", padding: "2px 6px", borderRadius: 10, marginLeft: 4 }}>SAVE 20%</span>
            </button>
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 40px 90px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {[
            {
              tier: "DEVELOPER / SANDBOX",
              price: "$0", unit: "/ month",
              desc: "Evaluate threat simulation and test agent integrations offline.",
              cta: "Try Simulation Mode", ctaHref: "/portal", ctaClass: "cs-btn-dark-outline",
              color: "#f0f0f0", textColor: "#000",
              features: ["3 Seeded Attack Scenarios", "Full 7-Agent Simulation", "Interactive HITL Portal", "Local JSON Dossier Export"],
              excluded: ["Live SIEM/EDR Stream"]
            },
            {
              tier: "PRO SOC",
              price: billingCycle === "annual" ? "$499" : "$599", unit: "/ mo",
              desc: "For growing security operations teams automating triage and incident drafting.",
              cta: "Start 15-Day Trial", ctaHref: "/signup", ctaClass: "cs-btn-red",
              color: "#f0f0f0", textColor: "#000",
              features: ["Everything in Sandbox", "50 Active Incidents / mo", "Live Band.ai Agent Mesh", "Gemini 2.5 Flash + Groq Llama 3", "GDPR 72h Clock Automation"],
              excluded: []
            },
            {
              tier: "ENTERPRISE AUTONOMOUS",
              price: billingCycle === "annual" ? "$1,899" : "$2,299", unit: "/ mo",
              desc: "Full autonomous response with 24/7 SIEM ingestion and containment scripts.",
              cta: "Get Enterprise Access →", ctaHref: "/signup", ctaClass: "cs-btn-red-lg",
              color: "#0a0a0a", textColor: "#fff",
              featured: true,
              features: ["Unlimited Incidents", "Sub-3 Minute MTTR SLA", "Custom EDR/SIEM API Connectors", "Multi-Tenant RBAC", "Automated PR & Legal Briefs", "99.9% Uptime + 24/7 Support"],
              excluded: []
            },
            {
              tier: "HYBRID VPC EDGE",
              price: "Custom", unit: "",
              desc: "Deploy agents inside your private cloud. Zero PII leaves your firewall.",
              cta: "Contact Architecture Team", ctaHref: "/contact", ctaClass: "cs-btn-dark-outline",
              color: "#f0f0f0", textColor: "#000",
              features: ["On-Prem Docker Agents", "BYOM (Ollama) Support", "FedRAMP / HIPAA Architecture", "Dedicated TAM", "Air-Gapped Network Support"],
              excluded: []
            }
          ].map((tier, i) => (
            <div key={i} style={{ background: tier.color, border: tier.featured ? "2px solid #ec0000" : "1px solid #e0e0e0", borderRadius: 8, padding: 32, display: "flex", flexDirection: "column", position: "relative" }}>
              {tier.featured && <div style={{ position: "absolute", top: -12, right: 24, background: "#ec0000", color: "#fff", fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 10, letterSpacing: 1 }}>MOST POPULAR</div>}
              <div style={{ fontSize: 12, fontWeight: 800, color: tier.featured ? "#ec0000" : "#777", letterSpacing: 1.5, textTransform: "uppercase" as const }}>{tier.tier}</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: tier.textColor, margin: "14px 0 6px" }}>{tier.price} <span style={{ fontSize: 14, color: tier.featured ? "#888" : "#777", fontWeight: 500 }}>{tier.unit}</span></div>
              <p style={{ fontSize: 13, color: tier.featured ? "#aaa" : "#666", lineHeight: 1.5, marginBottom: 20 }}>{tier.desc}</p>
              <a href={tier.ctaHref} className={tier.ctaClass} style={{ justifyContent: "center", width: "100%", marginBottom: 20, textAlign: "center", display: "block", padding: "10px 0" }}>{tier.cta}</a>
              <hr style={{ border: "none", borderTop: `1px solid ${tier.featured ? "#222" : "#eee"}`, marginBottom: 16 }} />
              <ul style={{ listStyle: "none", fontSize: 13, color: tier.featured ? "#ccc" : "#444", display: "flex", flexDirection: "column", gap: 10 }}>
                {tier.features.map(f => <li key={f}>✓ {f}</li>)}
                {tier.excluded.map(f => <li key={f} style={{ color: "#aaa" }}>✕ {f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}