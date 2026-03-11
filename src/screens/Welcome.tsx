"use client";

import { useState, useEffect } from "react";
import { Haptic } from "@/hooks/useHaptic";
import { usePremiumPress } from "@/hooks/usePremiumPress";

interface WelcomeOverlayProps {
  onAccept: () => void;
}

export function WelcomeOverlay({ onAccept }: Readonly<WelcomeOverlayProps>) {
  const [visible, setVisible] = useState(false);
  const continuePress = usePremiumPress();

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
      <button
        aria-label="Dismiss welcome"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 199,
          background: "rgba(0,0,0,0.4)",
          opacity: visible ? 1 : 0,
          border: "none",
          padding: 0,
          transition: "opacity var(--motion-medium) var(--ease-premium)",
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
          transform: visible ? "translateY(0) scale(1)" : "translateY(100%) scale(0.985)",
          transformOrigin: "bottom center",
          transition: "transform var(--motion-slow) var(--ease-premium), background var(--motion-theme) var(--ease-premium)",
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
              opacity: visible ? 1 : 0.5,
              transform: visible ? "scaleX(1)" : "scaleX(0.8)",
              transition: "opacity var(--motion-medium) var(--ease-premium), transform var(--motion-slow) var(--ease-premium)",
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
          {...continuePress.bind}
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
            opacity: continuePress.pressed ? 0.92 : 1,
            transform: continuePress.pressed
              ? "translateY(1px) scale(0.982)"
              : continuePress.hovered
                ? "translateY(-1px) scale(1.005)"
                : "translateY(0) scale(1)",
            boxShadow: continuePress.pressed
              ? "0 6px 18px rgba(0,0,0,0.16)"
              : "0 12px 24px rgba(0,0,0,0.10)",
            transition:
              "transform var(--motion-medium) var(--ease-premium), opacity var(--motion-medium) var(--ease-premium), background var(--motion-theme) var(--ease-premium), color var(--motion-theme) var(--ease-premium), box-shadow var(--motion-medium) var(--ease-premium)",
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
