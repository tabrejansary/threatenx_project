import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Threatenx | Active Incident Portal — Detect. Decide. Defend.",
  description:
    "Threatenx is a next-generation collaborative multi-agent cybersecurity incident response platform. Automated triage, real-time forensics, and HITL containment — from detection to defense in under 3 minutes.",
  keywords: [
    "cybersecurity",
    "incident response",
    "SOC",
    "AI agents",
    "threat detection",
    "SIEM",
    "EDR",
    "GDPR compliance",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
