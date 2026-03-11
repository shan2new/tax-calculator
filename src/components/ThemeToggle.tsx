"use client";

import { Haptic } from "@/hooks/useHaptic";

interface ThemeToggleProps {
  dark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ dark, onToggle }: ThemeToggleProps) {
  return (
    <button
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
        transition: "background 0.7s, border-color 0.7s, box-shadow 0.7s",
      }}
    >
      <div style={{ position: "relative", width: 18, height: 18 }}>
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
            transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
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
            transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      </div>
    </button>
  );
}
