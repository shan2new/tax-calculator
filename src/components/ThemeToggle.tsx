"use client";

import { Haptic } from "@/hooks/useHaptic";
import { usePremiumPress } from "@/hooks/usePremiumPress";

interface ThemeToggleProps {
  dark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ dark, onToggle }: Readonly<ThemeToggleProps>) {
  const { pressed, hovered, bind } = usePremiumPress();

  return (
    <button
      {...bind}
      onClick={() => {
        Haptic.medium();
        onToggle();
      }}
      aria-label="Toggle theme"
      style={{
        position: "fixed",
        top: "max(16px, env(safe-area-inset-top))",
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        background: "var(--toggle-bg)",
        border: "1px solid var(--border)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "var(--toggle-shadow)",
        transform: pressed
          ? "translateY(1px) scale(0.95)"
          : hovered
            ? "translateY(-1px) scale(1.02)"
            : "translateY(0) scale(1)",
        transition:
          "background var(--motion-theme) var(--ease-premium), border-color var(--motion-theme) var(--ease-premium), box-shadow var(--motion-theme) var(--ease-premium), transform var(--motion-medium) var(--ease-premium)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: -8,
          borderRadius: 999,
          background: "radial-gradient(circle, rgba(255,255,255,0.14), transparent 68%)",
          opacity: hovered ? 0.7 : pressed ? 0.45 : 0,
          transform: pressed ? "scale(0.92)" : hovered ? "scale(1.08)" : "scale(0.96)",
          transition: "opacity var(--motion-medium) var(--ease-premium), transform var(--motion-medium) var(--ease-premium)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          width: 18,
          height: 18,
          transform: pressed ? "scale(0.94)" : hovered ? "scale(1.05)" : "scale(1)",
          transition: "transform var(--motion-medium) var(--ease-premium)",
        }}
      >
        {/* Sun */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--toggle-icon)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            position: "absolute",
            inset: 0,
            width: 18,
            height: 18,
            opacity: dark ? 0 : 1,
            transform: dark ? "rotate(-90deg) scale(0.5)" : "rotate(0) scale(1)",
            transition:
              "opacity var(--motion-slow) var(--ease-premium), transform var(--motion-slow) var(--ease-premium)",
          }}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
        </svg>
        {/* Moon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--toggle-icon)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            position: "absolute",
            inset: 0,
            width: 18,
            height: 18,
            opacity: dark ? 1 : 0,
            transform: dark ? "rotate(0) scale(1)" : "rotate(90deg) scale(0.5)",
            transition:
              "opacity var(--motion-slow) var(--ease-premium), transform var(--motion-slow) var(--ease-premium)",
          }}
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      </div>
    </button>
  );
}
