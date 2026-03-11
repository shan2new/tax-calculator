"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

interface PressableCardProps {
  children: ReactNode;
  onClick: () => void;
  delay: number;
  style?: CSSProperties;
}

export function PressableCard({ children, onClick, delay, style: extraStyle }: PressableCardProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => {
        setPressed(false);
        onClick();
      }}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
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
        transform: pressed ? "scale(0.97)" : "scale(1)",
        transition: pressed
          ? "transform 0.12s cubic-bezier(0.2, 0, 0.6, 1)"
          : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: pressed ? "var(--card-shadow-pressed)" : "var(--card-shadow)",
        width: "100%",
        ...extraStyle,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 20,
          background: "linear-gradient(135deg, var(--card-gradient-start), transparent 60%)",
          opacity: pressed ? 0.5 : 1,
          transition: "opacity 0.15s",
          pointerEvents: "none",
        }}
      />
      {children}
    </button>
  );
}
