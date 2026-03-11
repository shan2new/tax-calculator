"use client";

import { type CSSProperties, type ReactNode } from "react";
import { usePremiumPress } from "@/hooks/usePremiumPress";

interface PressableCardRenderState {
  pressed: boolean;
  hovered: boolean;
}

interface PressableCardProps {
  children: ReactNode | ((state: PressableCardRenderState) => ReactNode);
  onClick: () => void;
  delay: number;
  style?: CSSProperties;
}

export function PressableCard({
  children,
  onClick,
  delay,
  style: extraStyle,
}: Readonly<PressableCardProps>) {
  const { pressed, hovered, bind } = usePremiumPress();
  const childContent = typeof children === "function" ? children({ pressed, hovered }) : children;

  return (
    <button
      {...bind}
      onClick={onClick}
      style={{
        background: "var(--home-card-bg)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: "28px 24px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 20,
        textAlign: "left" as const,
        fontFamily: "inherit",
        opacity: 0,
        animation: `homeIn 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms forwards`,
        position: "relative",
        overflow: "hidden",
        transform: pressed
          ? "translateY(1px) scale(0.972)"
          : hovered
            ? "translateY(-1px) scale(1.003)"
            : "translateY(0) scale(1)",
        transition: pressed
          ? "transform var(--motion-fast) var(--ease-premium), box-shadow var(--motion-fast) var(--ease-premium), border-color var(--motion-fast) var(--ease-premium)"
          : "transform var(--motion-slow) var(--ease-premium), box-shadow var(--motion-medium) var(--ease-premium), border-color var(--motion-medium) var(--ease-premium)",
        boxShadow: pressed
          ? "var(--card-shadow-pressed)"
          : hovered
            ? "0 10px 28px rgba(0,0,0,0.10)"
            : "var(--card-shadow)",
        borderColor: hovered ? "var(--border-accent)" : "var(--border)",
        width: "100%",
        ...extraStyle,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 20,
          background:
            "linear-gradient(135deg, var(--card-gradient-start), transparent 56%, rgba(255,255,255,0.02) 100%)",
          opacity: pressed ? 0.42 : hovered ? 0.92 : 1,
          transform: pressed
            ? "translateY(3%) scale(0.985)"
            : hovered
              ? "translateY(-2%) scale(1.01)"
              : "translateY(0) scale(1)",
          transition:
            "opacity var(--motion-medium) var(--ease-premium), transform var(--motion-slow) var(--ease-premium)",
          pointerEvents: "none",
        }}
      />
      {childContent}
    </button>
  );
}
