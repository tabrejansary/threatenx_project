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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
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
      <div className="auth-card">
        <Link href="/" className="auth-brand">
          <ShieldIcon size={28} color="#ec0000" />
          <span className="auth-brand-name">Threaten<span>x</span></span>
        </Link>
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Sign in to the Security Operations Center</div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-email">Email address</label>
            <input id="login-email" className="auth-input" type="email" placeholder="officer@company.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-password">Password</label>
            <input id="login-password" className="auth-input" type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <div className="auth-check-row">
            <input id="login-remember" type="checkbox" className="auth-check" checked={remember} onChange={e => setRemember(e.target.checked)} />
            <label htmlFor="login-remember" className="auth-check-label">Remember this device</label>
            <a href="#" style={{ marginLeft: "auto", color: "#ec0000", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Forgot password?</a>
          </div>
          <button id="btn-login" type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Sign in to SOC Portal"}
          </button>
        </form>
        <div className="auth-divider">
          <div className="auth-divider-line" /><span className="auth-divider-text">OR</span><div className="auth-divider-line" />
        </div>
        <button className="auth-btn" style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ccc", marginBottom: 24 }} onClick={() => router.push("/portal")}>
          Continue as Guest
        </button>
        <div className="auth-footer">
          {"Don't have an account? "}<Link href="/signup">Create one</Link>
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