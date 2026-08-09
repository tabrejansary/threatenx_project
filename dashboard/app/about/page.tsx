"use client";
import { UtilBar, SiteHeader, SiteFooter } from "../../components/SiteLayout";

export default function AboutPage() {
  return (
    <div style={{ background: "#ffffff", color: "#111", minHeight: "100vh" }}>
      <UtilBar />
      <SiteHeader activePage="About" />

      <section style={{ background: "#0a0a0a", color: "#fff", padding: "80px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="cs-kicker" style={{ justifyContent: "center", display: "flex" }}>OUR MISSION</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: 20 }}>
            Redefining Cybersecurity with <span style={{ color: "#ec0000" }}>Autonomous Agentic Intelligence</span>
          </h1>
          <p style={{ fontSize: 17, color: "#888", lineHeight: 1.6 }}>
            Modern enterprise defense cannot rely on manual triage or monolithic chatbots. Threatenx coordinates specialized autonomous AI agents to defend global networks in real time.
          </p>
        </div>
      </section>

      <section style={{ padding: "80px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          {[
            { icon: "⚡", title: "Sub-3 Minute MTTR", desc: "Automating detection, malware detonation, log tracing, and statutory compliance clock calculations in parallel instead of sequential SOC handoffs." },
            { icon: "🛡️", title: "Human-in-the-Loop", desc: "AI proposes containment playbooks; Human Security Officers retain final approval authority. Absolute safety with enterprise-grade governance." },
            { icon: "🔒", title: "Zero-Trust Hybrid Edge", desc: "Worker agents execute inside customer VPCs. Only sanitized IoC metadata is shared over the Band interaction mesh. Raw PII never leaves your network." }
          ].map((item, i) => (
            <div key={i} style={{ background: "#f8f8f8", border: "1px solid #e0e0e0", borderRadius: 8, padding: 32 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#0a0a0a", padding: "80px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="cs-kicker" style={{ justifyContent: "center", display: "flex" }}>THE TEAM</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: "-1px" }}>Built by Security Practitioners</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              { initials: "AV", name: "Dr. Aris Vance", role: "Chief AI Architect", expertise: "Multi-agent LLM orchestration" },
              { initials: "ER", name: "Elena Rostova", role: "Head of Compliance Engineering", expertise: "GDPR & CCPA automation" },
              { initials: "MT", name: "Marcus Thorne", role: "Principal Cloud Security Researcher", expertise: "AWS/GCP threat modelling" },
              { initials: "SJ", name: "Sarah Jenkins", role: "VP of Product Security", expertise: "HITL governance & UX" }
            ].map((member, i) => (
              <div key={i} style={{ background: "#111", border: "1px solid #222", borderRadius: 8, padding: 28, textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#ec0000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, margin: "0 auto 16px" }}>{member.initials}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{member.name}</div>
                <div style={{ fontSize: 12, color: "#ec0000", fontWeight: 700, marginBottom: 8 }}>{member.role}</div>
                <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{member.expertise}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}