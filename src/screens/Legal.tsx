"use client";

import { type CSSProperties } from "react";
import { BrandMark } from "@/components/BrandMark";

interface LegalScreenProps {
  dark: boolean;
}

const S: Record<string, CSSProperties> = {
  label: {
    fontSize: 9,
    color: "var(--text-muted-faint)",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    marginBottom: 8,
    marginTop: 0,
  },
  body: {
    fontSize: 12,
    color: "var(--text-muted)",
    lineHeight: 1.7,
    margin: 0,
    letterSpacing: "0.01em",
  },
};

const sections = [
  {
    label: "About",
    body: "Claros is a financial exploration tool designed to make loan and tax calculations intuitive, transparent, and accessible. All calculations run entirely on your device. This tool is intended for users aged 18 and above.",
  },
  {
    label: "Privacy",
    body: "Claros does not collect, store, or transmit any personal or financial data. All calculations happen locally in your browser. No cookies are set. No analytics are collected. No accounts are required. Your financial data never leaves your device.\n\nWhen you use the Share feature, a summary image and URL are generated on your device. The URL contains only the calculation parameters (loan amount, rate, tenure) — no personal identifiers. Sharing is initiated by you and processed through your device's native share sheet.",
  },
  {
    label: "Disclaimer",
    body: "Claros is an indicative calculation tool and does not constitute financial, tax, or investment advice. EMI figures are computed using the standard reducing balance method and may differ from actual bank offers due to processing fees, insurance, prepayment terms, and rounding. Tax calculations are based on published Income Tax slabs for FY 2025–26 and do not account for all possible deductions, exemptions, surcharges, or individual circumstances. Always consult a qualified financial advisor, chartered accountant, or your lending institution before making financial decisions.",
  },
  {
    label: "Accuracy",
    body: "Tax slabs and rebate limits reflect the Finance Act 2025 as available at the time of development. We endeavour to keep calculations current but cannot guarantee accuracy if tax laws change mid-year. Users are responsible for verifying figures with official sources (incometax.gov.in).",
  },
  {
    label: "Terms of Use",
    body: 'By using Claros, you acknowledge that all calculations are approximate and for informational purposes only. This tool is intended for individuals aged 18 years or older. Claros, its creators, and affiliates accept no liability for financial decisions made based on outputs from this tool. Use of the comparison and share features is at your discretion. This tool is provided "as is" without warranty of any kind.',
  },
  {
    label: "Contact",
    body: "For questions, feedback, or concerns, reach out at hello@claros.app",
  },
];

export function LegalScreen({ dark }: LegalScreenProps) {
  return (
    <div style={{ padding: "8px 0" }}>
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 32,
          opacity: 0,
          animation: "legalIn 0.6s cubic-bezier(0.16,1,0.3,1) 100ms forwards",
        }}
      >
        <BrandMark dark={dark} />
        <div
          style={{
            fontSize: 22,
            fontWeight: 200,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
          }}
        >
          Claros
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted-faint)", marginTop: 6 }}>
          Version 1.0
        </div>
        {/* Premium India badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 12,
            padding: "6px 14px",
            borderRadius: 20,
            border: "1px solid var(--border)",
            background: "var(--card-bg)",
          }}
        >
          <svg
            width="18"
            height="12"
            viewBox="0 0 18 12"
            style={{ borderRadius: 2, flexShrink: 0, overflow: "hidden" }}
          >
            <rect y="0" width="18" height="4" fill="#FF9933" opacity="0.85" />
            <rect y="4" width="18" height="4" fill="#FFFFFF" opacity="0.9" />
            <rect y="8" width="18" height="4" fill="#138808" opacity="0.85" />
            <circle
              cx="9"
              cy="6"
              r="1.5"
              fill="none"
              stroke="#000080"
              strokeWidth="0.4"
              opacity="0.5"
            />
          </svg>
          <span
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
              fontWeight: 300,
            }}
          >
            Designed in Bengaluru, India
          </span>
        </div>
      </div>

      {/* Sections with staggered animation */}
      {sections.map((sec, idx) => (
        <div
          key={idx}
          style={{
            padding: "16px 0",
            borderTop: idx === 0 ? "none" : "1px solid var(--border)",
            opacity: 0,
            animation: `legalIn 0.5s cubic-bezier(0.16,1,0.3,1) ${200 + idx * 80}ms forwards`,
          }}
        >
          <div style={S.label}>{sec.label}</div>
          {sec.body.split("\n\n").map((para, pi) => (
            <p key={pi} style={{ ...S.body, marginTop: pi > 0 ? 10 : 0 }}>
              {para}
            </p>
          ))}
        </div>
      ))}

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "28px 0 8px",
          opacity: 0,
          animation: `legalIn 0.5s ease ${200 + sections.length * 80 + 100}ms forwards`,
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: "var(--text-muted-faint)",
            letterSpacing: "0.12em",
          }}
        >
          © {new Date().getFullYear()} Claros · All rights reserved
        </div>
      </div>
    </div>
  );
}
