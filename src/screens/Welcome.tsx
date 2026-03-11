"use client";

import { useState, useEffect } from "react";
import { Haptic } from "@/hooks/useHaptic";

interface WelcomeOverlayProps {
  onAccept: () => void;
  dark: boolean;
}

export function WelcomeOverlay({ onAccept }: WelcomeOverlayProps) {
  const [phase, setPhase] = useState<"entering" | "visible" | "exiting" | "done">("entering");

  useEffect(() => {
    const t = setTimeout(() => setPhase("visible"), 100);
    return () => clearTimeout(t);
  }, []);

  const handleAccept = () => {
    Haptic.medium();
    setPhase("exiting");
    setTimeout(() => onAccept(), 500);
  };

  if (phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 36px",
        opacity: phase === "exiting" ? 0 : phase === "visible" ? 1 : 0,
        transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: 300,
          opacity: phase === "visible" ? 1 : 0,
          transform:
            phase === "visible"
              ? "translateY(0) scale(1)"
              : phase === "exiting"
                ? "translateY(-12px) scale(0.98)"
                : "translateY(20px) scale(0.98)",
          transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 150ms",
        }}
      >
        {/* Mark */}
        <svg width="48" height="48" viewBox="0 0 36 36" style={{ marginBottom: 28 }}>
          <path
            d="M 26 8 A 13 13 0 1 0 26 28"
            fill="none"
            stroke="var(--text-primary)"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M 22 12 A 8 8 0 1 0 22 24"
            fill="none"
            stroke="var(--text-primary)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>

        <div
          style={{
            fontSize: 38,
            fontWeight: 200,
            color: "var(--text-primary)",
            letterSpacing: "-0.04em",
            fontFamily: "var(--font)",
            marginBottom: 8,
          }}
        >
          Claros
        </div>

        <div
          style={{
            fontSize: 14,
            color: "var(--text-muted)",
            lineHeight: 1.6,
            marginBottom: 8,
            fontWeight: 300,
          }}
        >
          Financial clarity, one decision at a time.
        </div>

        {/* India badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 16,
            border: "1px solid var(--border)",
            background: "var(--card-bg)",
            marginBottom: 32,
          }}
        >
          <svg
            width="16"
            height="11"
            viewBox="0 0 18 12"
            style={{ borderRadius: 2, flexShrink: 0, overflow: "hidden" }}
          >
            <rect y="0" width="18" height="4" fill="#FF9933" opacity="0.85" />
            <rect y="4" width="18" height="4" fill="#FFFFFF" opacity="0.9" />
            <rect y="8" width="18" height="4" fill="#138808" opacity="0.85" />
            <circle cx="9" cy="6" r="1.5" fill="none" stroke="#000080" strokeWidth="0.4" opacity="0.5" />
          </svg>
          <span
            style={{
              fontSize: 9,
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
              fontWeight: 300,
            }}
          >
            Designed in Bengaluru
          </span>
        </div>

        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted-faint)",
            lineHeight: 1.7,
            marginBottom: 32,
            textAlign: "left",
          }}
        >
          All calculations run on your device. No data is collected, stored, or shared. Results are
          indicative and do not constitute financial advice. For users aged 18+.
        </div>

        <button
          onClick={handleAccept}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 14,
            background: "var(--text-primary)",
            border: "none",
            color: "var(--bg)",
            fontSize: 14,
            fontWeight: 400,
            letterSpacing: "0.02em",
            cursor: "pointer",
            fontFamily: "var(--font)",
            transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.3s",
          }}
          onPointerDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)";
          }}
          onPointerUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
          onPointerLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          Get started
        </button>

        <div
          style={{
            fontSize: 10,
            color: "var(--text-muted-faint)",
            marginTop: 16,
            lineHeight: 1.5,
          }}
        >
          By continuing, you agree to our{" "}
          <span style={{ color: "var(--text-muted)" }}>Terms of Use</span> and acknowledge the{" "}
          <span style={{ color: "var(--text-muted)" }}>Privacy Policy</span>.
        </div>
      </div>
    </div>
  );
}
