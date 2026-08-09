"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────────────
   THREATENX HOMEPAGE — CrowdStrike 1:1 Layout & Component Fidelity
   Colors: White #ffffff | Black #000000 | Red #ec0000 ONLY
   ───────────────────────────────────────────────────────────────────────── */

const HERO_SLIDES = [
  {
    eyebrow: "THREATENX 2026 THREAT INTELLIGENCE REPORT",
    title: <>Stop Breaches.<br /><em>Protect Data.</em></>,
    sub: "Get frontline intelligence on how autonomous AI security agents are redefining enterprise incident response.",
    cta1: "Download Report",
    cta2: "Watch Demo",
  },
  {
    eyebrow: "NEW — INCIDENT COMMANDER AI ENGINE",
    title: <>Know them. Find them.<br /><em>Stop them.</em></>,
    sub: "Threatenx's Incident Commander synthesizes 7-agent forensic output into decisive containment playbooks in under 3 minutes.",
    cta1: "Explore Commander",
    cta2: "See How It Works",
  },
  {
    eyebrow: "GDPR & COMPLIANCE AUTOMATION",
    title: <>Automated.<br /><em>Auditable. Defensible.</em></>,
    sub: "Threatenx tracks statutory breach notification deadlines (GDPR 72h, CCPA, HIPAA) and generates ready-to-file legal disclosures automatically.",
    cta1: "Learn More",
    cta2: "Book Meeting",
  },
];

const ACCORDION_ITEMS = [
  {
    title: "Accelerate SOC Response with Autonomous AI",
    body: "Threatenx deploys 7 specialized AI agents that collaborate via a secure Band.ai mesh. Threat Detection bootstraps incidents, Log Analysis reconstructs attack paths, and Malware Analysis detonates suspicious binaries — all simultaneously, in under 3 minutes.",
    visual: {
      label: "AUTONOMOUS SOC RESPONSE",
      lines: [
        { agent: "Threat Detection Agent", text: "Geographic anomaly: jsmith@company.com login from Bucharest, Romania." },
        { agent: "Log Analysis Agent", text: "4.2 GB PII exfiltrated. SELECT * FROM Customers on DB-Prod-09." },
        { agent: "Malware Analysis Agent", text: "dump_pii.py classified as Trojan (97% confidence). C2: exfil-server-ro.com." },
      ]
    }
  },
  {
    title: "Stop Ransomware Before It Spreads",
    body: "Malware Analysis Agent detonates suspicious payloads in isolation. It detects file encryption behavior, shadow copy deletion commands, and ransomware-specific registry modifications — stopping lateral movement before it reaches critical assets.",
    visual: {
      label: "RANSOMWARE CONTAINMENT",
      lines: [
        { agent: "Malware Analysis Agent", text: "BlackForge ransomware detected. .forge extension, shadow copy deletion." },
        { agent: "Risk Assessment Agent", text: "38,000 files encrypted across HR share. Severity: CRITICAL 9.8/10." },
        { agent: "Incident Commander", text: "Isolate FINANCE-PC-04, revoke access, preserve forensic image." },
      ]
    }
  },
  {
    title: "Secure Cloud Infrastructure at Scale",
    body: "Threatenx integrates with AWS CloudTrail, GCP Audit Logs, and Azure Activity Logs to detect credential abuse, unauthorized compute provisioning (cryptojacking), and data exfiltration from cloud object storage.",
    visual: {
      label: "CLOUD THREAT DETECTION",
      lines: [
        { agent: "Threat Detection Agent", text: "AWS IAM key CI-DEPLOY-01 used from AS209 Russia. 48 GPU EC2 launched." },
        { agent: "Log Analysis Agent", text: "XMRig miners running in ap-south-1. Financial loss: $84,000/day." },
        { agent: "Incident Commander", text: "Revoke IAM key, terminate instances, re-issue rotated credentials." },
      ]
    }
  },
  {
    title: "Stay Compliant with Legal & Regulatory Frameworks",
    body: "Compliance Agent maps breach data against GDPR Article 33, CCPA, HIPAA, and PCI-DSS frameworks. It calculates statutory notification deadlines, identifies required notification targets, and drafts ready-to-file legal disclosures.",
    visual: {
      label: "COMPLIANCE AUTOMATION",
      lines: [
        { agent: "Compliance Agent", text: "GDPR Article 33 breach confirmed. 72-hour notification clock: ACTIVE." },
        { agent: "Compliance Agent", text: "Notification targets: ICO (UK), CNIL (FR), BfDI (DE)." },
        { agent: "PR / Comms Agent", text: "Customer advisory and executive briefing drafted for legal review." },
      ]
    }
  },
];

const SOLUTIONS = {
  "Stop Breaches": [
    { icon: "🛡", title: "Autonomous Threat Detection", body: "Continuous multi-source SIEM and EDR telemetry correlation. Detects geographic anomalies, credential abuse, and IoCs in real time.", link: "/portal" },
    { icon: "🔬", title: "Malware Sandbox Detonation", body: "Isolated binary analysis with static disassembly, behavioral scoring, and C2 beacon identification. No network exposure.", link: "/portal" },
    { icon: "🎯", title: "Incident Commander HITL", body: "Groq Llama 3 70B synthesizes all agent findings into a decisive playbook submitted for Human Security Officer single-click approval.", link: "/portal" },
  ],
  "Prevent Data Leakage": [
    { icon: "📊", title: "Forensic Log Analysis", body: "Reconstructs lateral movement paths, DB query sequences, and exfiltration volumes. 100% grounded in raw log evidence.", link: "/portal" },
    { icon: "⚖️", title: "GDPR 72h Compliance Clock", body: "Automated statutory breach notification timeline management. Ready-to-file legal disclosures for GDPR, CCPA, HIPAA, and PCI-DSS.", link: "/portal" },
    { icon: "📡", title: "Real-Time Threat Feed", body: "Live WebSocket stream of multi-agent collaboration from the Band.ai mesh, displayed in the SOC Incident Portal.", link: "/portal" },
  ],
  "Secure Cloud": [
    { icon: "☁️", title: "AWS CloudTrail Integration", body: "Monitors IAM key usage, EC2 provisioning anomalies, and S3 bucket access across AWS, GCP, and Azure environments.", link: "/portal" },
    { icon: "🔑", title: "IAM Credential Abuse", body: "Detects leaked API keys, unauthorized credential usage from foreign ASNs, and cryptojacking compute provisioning at scale.", link: "/portal" },
    { icon: "💰", title: "Financial Loss Quantification", body: "Calculates real-time financial exposure from cloud resource abuse. Reports cost impact to risk stakeholders automatically.", link: "/portal" },
  ],
  "Stop Ransomware": [
    { icon: "🦠", title: "Ransomware Strain Classification", body: "Identifies ransomware families (LockBit, BlackForge, ALPHV) via file extension patterns, ransom note signatures, and C2 infrastructure.", link: "/portal" },
    { icon: "🔒", title: "Lateral Movement Tracing", body: "Tracks SMB share encryption, RDP session hijacking, and Active Directory credential reuse across the kill chain.", link: "/portal" },
    { icon: "🏛️", title: "HR & Payroll Data Protection", body: "Monitors access to sensitive HR shares containing employee SSNs, payroll data, and medical records with immediate alerting.", link: "/portal" },
  ],
};

const ADVERSARIES = [
  { name: "FANCY BEAR", type: "Nation State", icon: "🐻", nation: "Russia" },
  { name: "LAZARUS", type: "Nation State", icon: "👻", nation: "N. Korea" },
  { name: "SCATTERED SPIDER", type: "eCrime", icon: "🕷️", nation: "Underground" },
  { name: "CARBON SPIDER", type: "eCrime", icon: "🕸️", nation: "Underground" },
  { name: "COZY BEAR", type: "Nation State", icon: "🐼", nation: "Russia" },
  { name: "BLACKFORGE", type: "RaaS", icon: "🔒", nation: "Unknown" },
];

const TESTIMONIALS = [
  {
    quote: "Threatenx reduced our Mean Time to Containment from 4 hours to under 3 minutes. The GDPR compliance automation alone saved us from significant regulatory fines.",
    author: "Sarah K.",
    role: "CISO, FinTech Global Corp",
    initials: "SK",
  },
  {
    quote: "The multi-agent approach is brilliant. Having 7 specialists working simultaneously instead of a slow sequential triage is a genuine paradigm shift for our SOC.",
    author: "Marcus R.",
    role: "VP Security Operations, Healthcare Systems",
    initials: "MR",
  },
  {
    quote: "The Human-in-the-Loop containment is exactly what enterprise security requires. Every action is proposed, reviewed, and approved before execution. Never again flying blind.",
    author: "Priya N.",
    role: "Security Architect, E-Commerce Platform",
    initials: "PN",
  },
];

const STATS = [
  { num: "3", unit: "min", label: "Mean Time to Containment", desc: "vs 4+ hours industry average" },
  { num: "7", unit: "+", label: "Autonomous AI Agents", desc: "Specialized by discipline" },
  { num: "100", unit: "%", label: "Forensic Accuracy", desc: "Zero hallucination guarantee" },
  { num: "72", unit: "h", label: "GDPR Clock Automation", desc: "Statutory filing compliance" },
];

// ── Radial Concentric Platform Diagram ──────────────────────────────────────
function RadialPlatformDiagram() {
  return (
    <svg viewBox="0 0 700 700" width="100%" height="100%" style={{ display: "block" }}>
      {/* Outer ring — light grey dotted */}
      <circle cx="350" cy="350" r="310" fill="none" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="4 6" />
      {/* Second ring */}
      <circle cx="350" cy="350" r="240" fill="none" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="4 6" />
      {/* Third ring */}
      <circle cx="350" cy="350" r="170" fill="none" stroke="#333" strokeWidth="1" />
      {/* Core circle — red */}
      <circle cx="350" cy="350" r="100" fill="#ec0000" />
      {/* Core inner */}
      <circle cx="350" cy="350" r="60" fill="#000" />

      {/* Core text */}
      <text x="350" y="342" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900" fontFamily="Inter,sans-serif" letterSpacing="1">THREATENX</text>
      <text x="350" y="357" textAnchor="middle" fill="#fff" fontSize="8" fontFamily="Inter,sans-serif" letterSpacing="0.5" opacity="0.7">COMMANDER AI</text>

      {/* Ring 1 label — unified protection */}
      <text x="350" y="268" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900" fontFamily="Inter,sans-serif" letterSpacing="1.5">UNIFIED PROTECTION</text>

      {/* Ring 2 segments label */}
      <text x="350" y="126" textAnchor="middle" fill="#aaa" fontSize="8" fontWeight="800" fontFamily="Inter,sans-serif" letterSpacing="1">REAL-TIME DECISION INTELLIGENCE</text>

      {/* Outer ring labels — 8 positions */}
      {/* Top */}
      <text x="350" y="28" textAnchor="middle" fill="#888" fontSize="8.5" fontWeight="800" fontFamily="Inter,sans-serif" letterSpacing="0.5">INCIDENT COMMANDER</text>
      <text x="350" y="40" textAnchor="middle" fill="#888" fontSize="7" fontFamily="Inter,sans-serif">Groq Llama 3 70B</text>
      {/* Top right */}
      <text x="568" y="120" textAnchor="middle" fill="#888" fontSize="8.5" fontWeight="800" fontFamily="Inter,sans-serif" letterSpacing="0.5">COMPLIANCE</text>
      <text x="568" y="132" textAnchor="middle" fill="#888" fontSize="7" fontFamily="Inter,sans-serif">GDPR / CCPA / HIPAA</text>
      {/* Right */}
      <text x="655" y="350" textAnchor="middle" fill="#888" fontSize="8.5" fontWeight="800" fontFamily="Inter,sans-serif" letterSpacing="0.5">PR / COMMS</text>
      <text x="655" y="363" textAnchor="middle" fill="#888" fontSize="7" fontFamily="Inter,sans-serif">Stakeholder Alerts</text>
      {/* Bottom right */}
      <text x="568" y="590" textAnchor="middle" fill="#888" fontSize="8.5" fontWeight="800" fontFamily="Inter,sans-serif" letterSpacing="0.5">RISK ASSESSMENT</text>
      <text x="568" y="602" textAnchor="middle" fill="#888" fontSize="7" fontFamily="Inter,sans-serif">Severity Scoring</text>
      {/* Bottom */}
      <text x="350" y="670" textAnchor="middle" fill="#888" fontSize="8.5" fontWeight="800" fontFamily="Inter,sans-serif" letterSpacing="0.5">MALWARE ANALYSIS</text>
      <text x="350" y="682" textAnchor="middle" fill="#888" fontSize="7" fontFamily="Inter,sans-serif">Sandbox Detonation</text>
      {/* Bottom left */}
      <text x="135" y="590" textAnchor="middle" fill="#888" fontSize="8.5" fontWeight="800" fontFamily="Inter,sans-serif" letterSpacing="0.5">LOG ANALYSIS</text>
      <text x="135" y="602" textAnchor="middle" fill="#888" fontSize="7" fontFamily="Inter,sans-serif">Kill Chain Tracing</text>
      {/* Left */}
      <text x="45" y="350" textAnchor="middle" fill="#888" fontSize="8.5" fontWeight="800" fontFamily="Inter,sans-serif" letterSpacing="0.5">THREAT DETECT</text>
      <text x="45" y="363" textAnchor="middle" fill="#888" fontSize="7" fontFamily="Inter,sans-serif">Gemini 2.5 Flash</text>
      {/* Top left */}
      <text x="135" y="120" textAnchor="middle" fill="#888" fontSize="8.5" fontWeight="800" fontFamily="Inter,sans-serif" letterSpacing="0.5">SECURITY OFFICER</text>
      <text x="135" y="132" textAnchor="middle" fill="#888" fontSize="7" fontFamily="Inter,sans-serif">Human-in-the-Loop</text>

      {/* Connector dots on outer ring */}
      {[
        [350, 40], [590, 110], [660, 350], [590, 590],
        [350, 660], [110, 590], [40, 350], [110, 110]
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="10" fill="#1a1a1a" stroke="#ec0000" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="4" fill="#ec0000" />
        </g>
      ))}

      {/* Inner orbit dots on ring 2 (240px) */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const r = 240;
        const cx = 350 + r * Math.cos((angle - 90) * Math.PI / 180);
        const cy = 350 + r * Math.sin((angle - 90) * Math.PI / 180);
        return <circle key={i} cx={cx} cy={cy} r="5" fill="#1a1a1a" stroke="#444" strokeWidth="1.5" />;
      })}

      {/* Mid orbit dots on ring 3 (170px) */}
      {["IDENTITY", "THREAT INTEL", "AI AGENTS", "DATA SEC", "EXPOSURE", "SIEM", "ENDPOINT", "CLOUD"].map((label, i) => {
        const r = 170;
        const angle = i * 45 - 90;
        const cx = 350 + r * Math.cos(angle * Math.PI / 180);
        const cy = 350 + r * Math.sin(angle * Math.PI / 180);
        const lx = 350 + (r + 30) * Math.cos(angle * Math.PI / 180);
        const ly = 350 + (r + 30) * Math.sin(angle * Math.PI / 180);
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="12" fill="#111" stroke="#333" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r="4" fill="#ec0000" />
            <text x={lx} y={ly + 3} textAnchor="middle" fill="#666" fontSize="6.5" fontWeight="700" fontFamily="Inter,sans-serif" letterSpacing="0.5">{label}</text>
          </g>
        );
      })}

      {/* Connecting lines from center to outer */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const r1 = 60;
        const r2 = 310;
        const a = (angle - 90) * Math.PI / 180;
        return (
          <line
            key={i}
            x1={350 + r1 * Math.cos(a)}
            y1={350 + r1 * Math.sin(a)}
            x2={350 + r2 * Math.cos(a)}
            y2={350 + r2 * Math.sin(a)}
            stroke="#1e1e1e"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
}

// ── Red Geometric Chevron SVG (CrowdStrike Exact) ───────────────────────────
function HeroGeoSVG() {
  return (
    <svg viewBox="0 0 680 540" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
      {/* Large bottom-left chevrons */}
      <g opacity="0.85">
        <polygon points="0,540 180,270 0,270" fill="#ec0000" opacity="0.9" />
        <polygon points="60,540 240,270 60,270" fill="#c00000" opacity="0.75" />
        <polygon points="120,540 300,270 120,270" fill="#900000" opacity="0.55" />
        <polygon points="180,540 360,270 180,270" fill="#600000" opacity="0.35" />
        <polygon points="240,540 420,270 240,270" fill="#400000" opacity="0.18" />
      </g>

      {/* Large top-right chevrons pointing down */}
      <g opacity="0.9">
        <polygon points="680,0 480,270 680,270" fill="#ec0000" opacity="0.95" />
        <polygon points="620,0 420,270 620,270" fill="#c00000" opacity="0.75" />
        <polygon points="560,0 360,270 560,270" fill="#900000" opacity="0.5" />
        <polygon points="500,0 300,270 500,270" fill="#600000" opacity="0.3" />
        <polygon points="440,0 240,270 440,270" fill="#400000" opacity="0.15" />
      </g>
    </svg>
  );
}

// ── Main Page Component ──────────────────────────────────────────────────────
export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [accordionOpen, setAccordionOpen] = useState(0);
  const [activeSolution, setActiveSolution] = useState("Stop Breaches");
  const [activeStrip, setActiveStrip] = useState(0);
  const [annoVisible, setAnnoVisible] = useState(true);
  const [adSearch, setAdSearch] = useState("");
  const slideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-advance hero slides
  useEffect(() => {
    slideTimer.current = setTimeout(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => { if (slideTimer.current) clearTimeout(slideTimer.current); };
  }, [slide]);

  const filteredAdversaries = ADVERSARIES.filter(a =>
    a.name.toLowerCase().includes(adSearch.toLowerCase()) ||
    a.type.toLowerCase().includes(adSearch.toLowerCase())
  );

  return (
    <div style={{ background: "#ffffff", color: "#111", minHeight: "100vh" }}>

      {/* ── Utility Bar ─────────────────────────────────────────────────────── */}
      <div className="cs-util-bar">
        <a href="/portal" className="cs-util-link breach">Experienced a breach?</a>
        <a href="#" className="cs-util-link">Blog</a>
        <a href="#" className="cs-util-link">Contact Us</a>
        <a href="#" className="cs-util-link">Careers</a>
        <a href="#" className="cs-util-link">Latest Innovations</a>
      </div>

      {/* ── Global Header ───────────────────────────────────────────────────── */}
      <header className="cs-header">
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link href="/" className="cs-brand">
            <ShieldIcon size={34} color="#ec0000" />
            <span className="cs-logo-text">Threaten<span>x</span></span>
          </Link>
          <nav>
            <ul className="cs-nav-menu">
              {["Platform", "Services", "Solutions", "Why Threatenx", "Resources", "Pricing"].map(item => (
                <li key={item}>
                  <a href="#" className="cs-nav-item">
                    {item}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="cs-header-right">
          <button className="cs-icon-btn" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M16.5 16.5l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <button className="cs-icon-btn" aria-label="Account">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <Link href="/portal" className="cs-btn-red" id="btn-start-free-trial">
            Start free trial →
          </Link>
        </div>
      </header>

      {/* ── Announcement Bar ────────────────────────────────────────────────── */}
      {annoVisible && (
        <div className="cs-anno-bar">
          <span style={{ fontWeight: 800 }}>Fal.Con 2026:</span>
          <span>Autonomous SOC agents outsprint adversaries in the AI security race.</span>
          <Link href="/portal" className="cs-anno-link">Read press release →</Link>
          <button className="cs-anno-close" onClick={() => setAnnoVisible(false)}>×</button>
        </div>
      )}

      {/* ── Hero Section (Black, Red Chevrons) ──────────────────────────────── */}
      <section className="cs-hero">
        {/* Geometric Red Chevrons */}
        <div className="cs-hero-geo">
          <HeroGeoSVG />
        </div>

        <div className="cs-hero-inner">
          {/* Left: text content */}
          <div style={{ position: "relative", zIndex: 3 }}>
            <div className="cs-hero-eyebrow">{HERO_SLIDES[slide].eyebrow}</div>
            <h1 className="cs-hero-h1">{HERO_SLIDES[slide].title}</h1>
            <p className="cs-hero-sub">{HERO_SLIDES[slide].sub}</p>
            <div className="cs-hero-ctas">
              <Link href="/portal" className="cs-btn-red-lg" id="hero-btn-primary">
                {HERO_SLIDES[slide].cta1} →
              </Link>
              <a href="#demo" className="cs-btn-white-outline">{HERO_SLIDES[slide].cta2}</a>
            </div>
            {/* Carousel dots */}
            <div className="cs-carousel-dots">
              {HERO_SLIDES.map((_, i) => (
                <button key={i} className={`cs-dot${slide === i ? " active" : ""}`} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} />
              ))}
            </div>
          </div>

          {/* Right: live incident terminal widget */}
          <div style={{ position: "relative", zIndex: 3 }}>
            <div style={{
              background: "#111111",
              border: "1px solid #2a2a2a",
              borderRadius: 8,
              overflow: "hidden",
            }}>
              {/* Widget header */}
              <div style={{ background: "#1a1a1a", borderBottom: "1px solid #2a2a2a", padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ec0000", display: "inline-block" }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: 1.5, textTransform: "uppercase" }}>LIVE INCIDENT FEED</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 2, background: "#ec0000", color: "#fff", letterSpacing: 0.5, textTransform: "uppercase" }}>CRITICAL</span>
              </div>

              {/* Widget body */}
              <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { agent: "Threat Detection Agent", text: "Geographic anomaly: jsmith login from Bucharest, Romania (prior: Chicago 4h ago)." },
                  { agent: "Log Analysis Agent", text: "4.2 GB PII exfiltrated from DB-Prod-09. Destination: 185.112.144.12." },
                  { agent: "Incident Commander", text: "Playbook ready. Awaiting Security Officer approval before containment." },
                ].map((row, i) => (
                  <div key={i} style={{ background: "#1a1a1a", borderLeft: "3px solid #ec0000", padding: "10px 12px", borderRadius: 4 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: "#ec0000", marginBottom: 3, letterSpacing: 0.3 }}>{row.agent}</div>
                    <div style={{ fontSize: 12, color: "#cccccc", lineHeight: 1.45 }}>{row.text}</div>
                  </div>
                ))}
                <Link href="/portal" className="cs-btn-red" style={{ justifyContent: "center", width: "100%", padding: 12, marginTop: 4 }}>
                  Open Incident Portal →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── News Ticker Bar ──────────────────────────────────────────────────── */}
      <div className="cs-news-bar">
        <div className="cs-news-grid">
          {[
            { title: "Fal.Con 2026 — Threatenx AI summit sells out as autonomous SOC demand surges", arrow: "→" },
            { title: "New: Incident Commander now supports Groq Llama 3 70B for sub-60s synthesis", arrow: "→" },
            { title: "GDPR Compliance Clock: Automated 72-hour breach notification now generally available", arrow: "→" },
          ].map((item, i) => (
            <Link href="/portal" key={i} className="cs-news-item">
              <div className="cs-news-title">{item.title}</div>
              <span className="cs-news-arrow">{item.arrow}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Platform Diagram Section ─────────────────────────────────────────── */}
      <section className="cs-platform-section">
        <div className="cs-platform-inner">
          <div className="cs-platform-header">
            <div className="cs-kicker">THE AGENTIC SECURITY PLATFORM</div>
            <h2 className="cs-platform-h2">
              Unified and built to secure the AI revolution
            </h2>
            <p className="cs-platform-sub">
              A single coordinated platform where 7 AI agents collaborate across the full incident response lifecycle — detection, forensics, compliance, and containment.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 60, alignItems: "center" }}>
            {/* Radial SVG Diagram */}
            <div className="cs-radial-wrap" style={{ width: "100%", maxWidth: 600, height: 520 }}>
              <RadialPlatformDiagram />
            </div>

            {/* Right: capability list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { title: "Single Agent Mesh", body: "All 7 agents communicate over the secure Band.ai mesh. No siloed tools. One unified incident room per event.", icon: "◈" },
                { title: "Real-Time Decision Intelligence", body: "Gemini 2.5 Flash workers analyze evidence in parallel. Incident Commander synthesizes final verdict in under 60 seconds.", icon: "⚡" },
                { title: "Unified Protection Surface", body: "Covers endpoint, cloud, identity, SaaS, browser, and IoT — mapped to a single asset inventory.", icon: "🛡" },
                { title: "Human-in-the-Loop Control", body: "Security Officers retain 100% final authority. Staged playbooks require explicit approval before any action executes.", icon: "👤" },
              ].map((item, i) => (
                <div key={i} style={{ padding: "20px 24px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, display: "flex", gap: 16, alignItems: "flex-start", transition: "border-color 0.15s", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#ec0000")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
                >
                  <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 5 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: "#777", lineHeight: 1.6 }}>{item.body}</div>
                  </div>
                </div>
              ))}
              <Link href="/portal" className="cs-btn-red" style={{ marginTop: 8, justifyContent: "center", padding: 14, fontSize: 14 }}>
                Explore Platform →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform Strip ───────────────────────────────────────────────────── */}
      <div className="cs-platform-strip">
        <div className="cs-platform-strip-inner">
          {["Threat Detection", "Log Forensics", "Malware Analysis", "Compliance Automation", "HITL Containment", "Cloud Security"].map((item, i) => (
            <button
              key={i}
              className={`cs-strip-item${activeStrip === i ? " active" : ""}`}
              onClick={() => setActiveStrip(i)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L4 7v6c0 5.25 3.75 9.5 8 10.5 4.25-1 8-5.25 8-10.5V7l-8-4z" stroke={activeStrip === i ? "#ec0000" : "#999"} strokeWidth="2" strokeLinejoin="round"/>
              </svg>
              <span style={{ color: activeStrip === i ? "#ec0000" : undefined }}>{item}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Feature Accordion Section ────────────────────────────────────────── */}
      <section className="cs-feature-section" id="platform">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="cs-kicker">THE FUTURE OF SECURITY STARTS HERE</div>
          <h2 style={{ fontSize: 42, fontWeight: 900, letterSpacing: "-1.2px", color: "#000", marginBottom: 60, lineHeight: 1.1 }}>
            Stop breaches at every stage
          </h2>

          <div className="cs-feature-inner">
            {/* Left Sticky Visual */}
            <div className="cs-feature-visual">
              <div className="cs-feature-visual-box">
                <div style={{ fontSize: 10, fontWeight: 800, color: "#555", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>
                  {ACCORDION_ITEMS[accordionOpen].visual.label}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {ACCORDION_ITEMS[accordionOpen].visual.lines.map((line, i) => (
                    <div key={i} style={{ background: "#1a1a1a", borderLeft: "3px solid #ec0000", padding: "10px 14px", borderRadius: 4 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 800, color: "#ec0000", marginBottom: 4 }}>{line.agent}</div>
                      <div style={{ fontSize: 12, color: "#bbb", lineHeight: 1.5 }}>{line.text}</div>
                    </div>
                  ))}
                </div>
                <Link href="/portal" className="cs-btn-red" style={{ marginTop: 20, justifyContent: "center", padding: 12 }}>
                  Open Incident Portal →
                </Link>
              </div>
            </div>

            {/* Right Accordion */}
            <div className="cs-feature-accordion">
              {ACCORDION_ITEMS.map((item, i) => (
                <div key={i} className="cs-feature-accordion-item">
                  <button className="cs-accordion-btn" onClick={() => setAccordionOpen(accordionOpen === i ? -1 : i)}>
                    <span className={`cs-accordion-title${accordionOpen === i ? " active" : ""}`}>{item.title}</span>
                    <span className={`cs-accordion-icon${accordionOpen === i ? " open" : ""}`}>+</span>
                  </button>
                  <div className="cs-accordion-body" style={{ maxHeight: accordionOpen === i ? 200 : 0 }}>
                    <div className="cs-accordion-body-inner">{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Solutions Section ────────────────────────────────────────────────── */}
      <section className="cs-solutions-section" id="solutions">
        <div className="cs-solutions-inner">
          <div className="cs-kicker">ENTERPRISE SOLUTIONS</div>
          <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-1.2px", color: "#000", marginBottom: 16, lineHeight: 1.1 }}>
            Experience industry-leading solutions<br />from one powerful platform
          </h2>
          <p style={{ fontSize: 16, color: "#666", marginBottom: 36, lineHeight: 1.65, maxWidth: 700 }}>
            Select a security challenge below to explore how Threatenx&apos;s multi-agent platform addresses it end to end.
          </p>

          <div className="cs-solutions-switcher">
            {Object.keys(SOLUTIONS).map(key => (
              <button
                key={key}
                className={`cs-switcher-btn${activeSolution === key ? " active" : ""}`}
                onClick={() => setActiveSolution(key)}
              >
                {key}
              </button>
            ))}
          </div>

          <div className="cs-solutions-grid">
            {SOLUTIONS[activeSolution as keyof typeof SOLUTIONS].map((sol, i) => (
              <Link href={sol.link} key={i} className="cs-sol-card">
                <div className="cs-sol-icon">
                  <span style={{ fontSize: 20 }}>{sol.icon}</span>
                </div>
                <div className="cs-sol-title">{sol.title}</div>
                <div className="cs-sol-body">{sol.body}</div>
                <div className="cs-sol-link">Learn more <span>→</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Statistics Section ───────────────────────────────────────────────── */}
      <section className="cs-stats-section" id="demo">
        <div className="cs-stats-inner">
          <div className="cs-stats-header">
            <div className="cs-kicker" style={{ color: "#555", justifyContent: "center", display: "flex" }}>BY THE NUMBERS</div>
            <h2 className="cs-stats-h2">Customers trust Threatenx to protect what matters most</h2>
            <p className="cs-stats-sub">Real metrics from production incident response deployments across enterprise and regulated industries.</p>
          </div>
          <div className="cs-stats-grid">
            {STATS.map((s, i) => (
              <div key={i} className="cs-stat-box">
                <div className="cs-stat-num">
                  {s.num}<span className="cs-stat-unit">{s.unit}</span>
                </div>
                <div className="cs-stat-label">{s.label}</div>
                <div className="cs-stat-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Adversary Intelligence Section ──────────────────────────────────── */}
      <section className="cs-adversary-section" id="agents">
        <div className="cs-adversary-inner">
          {/* Left: text + search */}
          <div>
            <div className="cs-adversary-eyebrow">ADVERSARY INTELLIGENCE</div>
            <h2 className="cs-adversary-h2">
              Know them. Find them.<br /><em>Stop them.</em>
            </h2>
            <p className="cs-adversary-sub">
              Adversaries operate with unprecedented stealth. Threatenx tracks and profiles active threat actors — nation-state groups, ransomware-as-a-service operators, and eCrime syndicates — and maps them against your specific exposure.
            </p>

            <div className="cs-adversary-search">
              <input
                type="text"
                placeholder="Search adversary groups, TTPs, or malware families..."
                value={adSearch}
                onChange={e => setAdSearch(e.target.value)}
              />
              <button className="cs-adversary-search-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
                  <path d="M16.5 16.5l4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="cs-adversary-tags">
              {["NATION STATE", "RANSOMWARE", "ECRIME", "HACKTIVISM", "FINANCIAL"].map(tag => (
                <a href="#" key={tag} className="cs-adv-tag">{tag}</a>
              ))}
            </div>
          </div>

          {/* Right: adversary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {filteredAdversaries.map((adv, i) => (
              <div key={i} className="cs-adv-card">
                <div className="cs-adv-avatar">{adv.icon}</div>
                <div className="cs-adv-name">{adv.name}</div>
                <div className="cs-adv-type">{adv.type}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{adv.nation}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="cs-testimonials-section">
        <div className="cs-testimonials-inner">
          <div className="cs-kicker">CUSTOMER TRUST</div>
          <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-1.2px", color: "#000", lineHeight: 1.1 }}>
            Security teams trust Threatenx to stop what matters
          </h2>

          <div className="cs-testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="cs-testimonial-card">
                <div className="cs-quote-mark">&ldquo;</div>
                <p className="cs-testimonial-text">{t.quote}</p>
                <div className="cs-testimonial-author">
                  <div className="cs-author-avatar">{t.initials}</div>
                  <div>
                    <div className="cs-author-name">{t.author}</div>
                    <div className="cs-author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Logos ──────────────────────────────────────────────────────── */}
      <section className="cs-logos-section">
        <div className="cs-logos-inner">
          <div className="cs-logos-label">Trusted by teams at industry-leading enterprises</div>
          <div className="cs-logos-row">
            {["ENTERPRISE FINTECH", "GLOBAL HEALTHCARE", "CLOUD NATIVE SaaS", "FORTUNE 500 MFG", "GLOBAL LOGISTICS", "REGULATED BANKING"].map(logo => (
              <div key={logo} className="cs-logo-pill">{logo}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Red CTA Banner ───────────────────────────────────────────────────── */}
      <section className="cs-cta-section">
        <div className="cs-cta-inner">
          <h2 className="cs-cta-h2">Try Threatenx free for 15 days</h2>
          <p className="cs-cta-sub">
            Deploy 7 AI security agents against a live breach scenario. No credit card required. Full incident portal access.
          </p>
          <div className="cs-cta-btns">
            <Link href="/portal" id="cta-btn-trial" className="cs-btn-white-solid">
              Start free trial →
            </Link>
            <Link href="/portal" className="cs-btn-transparent-outline">
              Contact us
            </Link>
            <a href="#platform" className="cs-btn-transparent-outline">
              View pricing
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="cs-footer">
        <div className="cs-footer-top">
          {/* Brand block */}
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

          {/* Col 2 */}
          <div>
            <div className="cs-footer-col-title">Platform</div>
            <ul className="cs-footer-links">
              {["Threat Detection", "Log Analysis", "Malware Sandbox", "Risk Assessment", "Compliance Clock", "Incident Commander"].map(l => (
                <li key={l}><a href="#platform" className="cs-footer-link">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <div className="cs-footer-col-title">Solutions</div>
            <ul className="cs-footer-links">
              {["Stop Breaches", "Prevent Data Leakage", "Secure Cloud", "Stop Ransomware", "GDPR Compliance", "HITL Response"].map(l => (
                <li key={l}><a href="#solutions" className="cs-footer-link">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <div className="cs-footer-col-title">Resources</div>
            <ul className="cs-footer-links">
              {["Incident Portal", "Documentation", "Agent Architecture", "API Reference", "Scenario Library", "Blog"].map(l => (
                <li key={l}><a href="#" className="cs-footer-link">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Col 5 */}
          <div>
            <div className="cs-footer-col-title">Company</div>
            <ul className="cs-footer-links">
              {["About Us", "Careers", "Press Releases", "Contact Sales", "Partner Program", "Security Trust"].map(l => (
                <li key={l}><a href="#" className="cs-footer-link">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="cs-footer-divider" />

        <div className="cs-footer-bottom">
          <div className="cs-footer-copy">© 2026 Threatenx Inc. All rights reserved.</div>
          <div className="cs-footer-legal">
            {["Privacy Notice", "Terms of Service", "Cookie Policy", "GDPR Data Request", "Accessibility"].map(l => (
              <a key={l} href="#" className="cs-footer-legal-link">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Local SVG Icon Components ─────────────────────────────────────────────── */
function ShieldIcon({ size = 32, color = "#ec0000" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3L36 10v11c0 9.5-7.5 17.5-16 18.5C11.5 38.5 4 30.5 4 21V10L20 3z" fill={color} />
      <path d="M14 20l4.5 4.5L26 15" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

