"use client";

import { useState, useEffect } from "react";
import { Haptic } from "@/hooks/useHaptic";

interface WelcomeOverlayProps {
  onAccept: () => void;
}

export function WelcomeOverlay({ onAccept }: WelcomeOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleAccept = () => {
    Haptic.medium();
    setVisible(false);
    setTimeout(() => onAccept(), 400);
  };

  return (
    <>
      {/* Scrim */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 199,
          background: "rgba(0,0,0,0.4)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: visible ? "auto" : "none",
        }}
        onClick={handleAccept}
      />

      {/* Bottom sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          background: "var(--bg)",
          borderRadius: "20px 20px 0 0",
          padding: "28px 28px max(28px, env(safe-area-inset-bottom))",
          maxWidth: 480,
          margin: "0 auto",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: "0 -4px 40px rgba(0,0,0,0.25)",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: "var(--text-muted-faint)",
            }}
          />
        </div>

        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            lineHeight: 1.7,
            marginBottom: 20,
          }}
        >
          All calculations run on your device. No data is collected, stored, or shared.
          Results are indicative and do not constitute financial advice. For users aged 18+.
        </div>

        <button
          onClick={handleAccept}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
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
          Continue
        </button>

        <div
          style={{
            fontSize: 10,
            color: "var(--text-muted-faint)",
            marginTop: 12,
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          By continuing, you agree to our{" "}
          <span style={{ color: "var(--text-muted)" }}>Terms of Use</span> and acknowledge the{" "}
          <span style={{ color: "var(--text-muted)" }}>Privacy Policy</span>.
        </div>
      </div>
    </>
  );
}
