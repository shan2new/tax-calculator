"use client";

import { useRouter } from "next/navigation";
import { Haptic } from "@/hooks/useHaptic";
import { usePremiumPress } from "@/hooks/usePremiumPress";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/providers/ThemeProvider";

interface NavHeaderProps {
  title: string;
  subtitle?: string;
}

export function NavHeader({ title, subtitle }: Readonly<NavHeaderProps>) {
  const router = useRouter();
  const { dark, toggle } = useTheme();
  const backPress = usePremiumPress();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 0 4px",
        minHeight: 44,
        gap: 8,
      }}
    >
      <button
        {...backPress.bind}
        onClick={() => {
          Haptic.light();
          router.push("/");
        }}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "8px 4px 8px 0",
          display: "flex",
          alignItems: "center",
          alignSelf: "flex-start",
          marginTop: 2,
          color: "var(--text-muted-mid)",
          opacity: backPress.pressed ? 0.8 : 1,
          transform: backPress.pressed
            ? "translateX(-1px) scale(0.94)"
            : backPress.hovered
              ? "translateX(-2px)"
              : "translateX(0)",
          transition:
            "color var(--motion-medium) var(--ease-premium), transform var(--motion-medium) var(--ease-premium), opacity var(--motion-medium) var(--ease-premium)",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div style={{ minWidth: 0, flex: 1 }}>
        <h1
          style={{
            fontSize: 17,
            fontWeight: 300,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            margin: 0,
            lineHeight: 1.2,
            fontFamily: "var(--font)",
            transition: "color var(--motion-theme) var(--ease-premium)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              margin: "2px 0 0",
              fontWeight: 300,
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      <ThemeToggle dark={dark} onToggle={toggle} />
    </div>
  );
}
