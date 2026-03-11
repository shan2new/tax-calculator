"use client";

import type { ReactNode } from "react";
import { usePremiumPress } from "@/hooks/usePremiumPress";

interface CollapsibleSectionProps {
  label: string;
  open: boolean;
  onToggle: () => void;
  maxHeight: number;
  children: ReactNode;
}

export function CollapsibleSection({
  label,
  open,
  onToggle,
  maxHeight,
  children,
}: Readonly<CollapsibleSectionProps>) {
  const press = usePremiumPress();

  return (
    <div>
      <button
        {...press.bind}
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          padding: "14px 0",
          minHeight: 44,
          background: "transparent",
          border: "none",
          textAlign: "left",
          font: "inherit",
          transform: press.pressed ? "translateY(1px)" : "translateY(0)",
          transition: "transform var(--motion-medium) var(--ease-premium)",
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "var(--text-muted-faint)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <span
          aria-hidden
          style={{
            fontSize: 12,
            color: "var(--text-muted-faint)",
            transform: open ? "rotate(180deg)" : "none",
            transition:
              "transform var(--motion-medium) var(--ease-premium), color var(--motion-medium) var(--ease-premium)",
            display: "inline-block",
          }}
        >
          ▾
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? maxHeight : 0,
          overflow: "hidden",
          transition:
            "max-height var(--motion-slow) var(--ease-premium), opacity var(--motion-medium) var(--ease-premium)",
          opacity: open ? 1 : 0.72,
        }}
      >
        {children}
      </div>
    </div>
  );
}
