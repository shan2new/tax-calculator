"use client";

import type { MouseEvent, ReactNode } from "react";
import { usePremiumPress } from "@/hooks/usePremiumPress";

interface ActionButtonProps {
  active?: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}

export function ActionButton({
  active = false,
  onClick,
  children,
}: Readonly<ActionButtonProps>) {
  const press = usePremiumPress();
  let transform = "scale(1)";
  if (press.pressed) transform = "translateY(1px) scale(0.92)";
  else if (active) transform = "scale(1.08)";
  else if (press.hovered) transform = "scale(1.04)";

  return (
    <button
      {...press.bind}
      type="button"
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: active ? "var(--warn)" : "var(--text-muted-faint)",
        padding: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition:
          "color var(--motion-medium) var(--ease-premium), transform var(--motion-medium) var(--ease-premium), opacity var(--motion-medium) var(--ease-premium)",
        transform,
        opacity: press.pressed ? 0.84 : 1,
      }}
    >
      {children}
    </button>
  );
}
