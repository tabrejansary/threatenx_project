"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function ShieldIcon({ size = 32, color = "#ec0000" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3L36 10v11c0 9.5-7.5 17.5-16 18.5C11.5 38.5 4 30.5 4 21V10L20 3z" fill={color} />
      <path d="M14 20l4.5 4.5L26 15" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "soc-analyst", org: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, val: string) { setForm(f => ({ ...f, [field]: val })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Please fill in all required fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    router.push("/portal");
  }

  return (
    <div className="auth-page">
      <svg className="auth-bg-geo" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <polygon points="0,600 200,300 0,300" fill="#ec0000" opacity="0.9" />
        <polygon points="60,600 260,300 60,300" fill="#c00000" opacity="0.6" />
        <polygon points="120,600 320,300 120,300" fill="#900000" opacity="0.35" />
        <polygon points="800,0 560,300 800,300" fill="#ec0000" opacity="0.9" />
        <polygon points="740,0 500,300 740,300" fill="#c00000" opacity="0.6" />
        <polygon points="680,0 440,300 680,300" fill="#900000" opacity="0.35" />
      </svg>
      <Link href="/" className="auth-back">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back to home
      </Link>
      <div className="auth-card" style={{ maxWidth: 480, padding: 36 }}>
        <Link href="/" className="auth-brand">
          <ShieldIcon size={28} color="#ec0000" />
          <span className="auth-brand-name">Threaten<span>x</span></span>
        </Link>
        <div className="auth-title">Create your account</div>
        <div className="auth-sub">Start your 15-day free trial. No credit card required.</div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="auth-field" style={{ marginBottom: 0 }}>
              <label className="auth-label" htmlFor="signup-name">Full name *</label>
              <input id="signup-name" className="auth-input" type="text" placeholder="Jane Smith" value={form.name} onChange={e => update("name", e.target.value)} />
            </div>
            <div className="auth-field" style={{ marginBottom: 0 }}>
              <label className="auth-label" htmlFor="signup-org">Organisation</label>
              <input id="signup-org" className="auth-input" type="text" placeholder="Acme Corp" value={form.org} onChange={e => update("org", e.target.value)} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }} />
          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-email">Work email *</label>
            <input id="signup-email" className="auth-input" type="email" placeholder="you@company.com" value={form.email} onChange={e => update("email", e.target.value)} autoComplete="email" />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-role">Your role</label>
            <select id="signup-role" className="auth-input-select" value={form.role} onChange={e => update("role", e.target.value)}>
              <option value="ciso">CISO / VP Security</option>
              <option value="soc-analyst">SOC Analyst</option>
              <option value="security-engineer">Security Engineer</option>
              <option value="incident-responder">Incident Responder</option>
              <option value="compliance-officer">Compliance Officer</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="auth-field" style={{ marginBottom: 0 }}>
              <label className="auth-label" htmlFor="signup-password">Password *</label>
              <input id="signup-password" className="auth-input" type="password" placeholder="Min 8 chars" value={form.password} onChange={e => update("password", e.target.value)} autoComplete="new-password" />
            </div>
            <div className="auth-field" style={{ marginBottom: 0 }}>
              <label className="auth-label" htmlFor="signup-confirm">Confirm *</label>
              <input id="signup-confirm" className="auth-input" type="password" placeholder="Repeat password" value={form.confirm} onChange={e => update("confirm", e.target.value)} autoComplete="new-password" />
            </div>
          </div>
          <div style={{ marginBottom: 24 }} />
          <button id="btn-signup" type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create account & open SOC Portal"}
          </button>
        </form>
        <div className="auth-footer">
          {"Already have an account? "}<Link href="/login">Sign in</Link>
        </div>
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap", justifyContent: "center" }}>
        {["SOC 2 TYPE II", "ISO 27001", "GDPR COMPLIANT", "ZERO TRUST"].map(badge => (
          <span key={badge} style={{ padding: "4px 10px", border: "1px solid #2a2a2a", borderRadius: 3, fontSize: 10, fontWeight: 700, color: "#444", letterSpacing: "0.5px", background: "rgba(17,17,17,0.8)" }}>{badge}</span>
        ))}
      </div>
    </div>
  );
}