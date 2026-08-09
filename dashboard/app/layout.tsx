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
      <body>{children}</body>
    </html>
  );
}
