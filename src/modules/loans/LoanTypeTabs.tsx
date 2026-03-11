"use client";

import { memo } from "react";
import { LOAN_TYPES } from "@/lib/calc";
import { usePremiumPress } from "@/hooks/usePremiumPress";

interface LoanTypeTabsProps {
  activeIndex: number;
  onSelect: (index: number) => void;
}

function LoanTypeTab({
  active,
  label,
  onClick,
}: Readonly<{ active: boolean; label: string; onClick: () => void }>) {
  const press = usePremiumPress();

  return (
    <button
      {...press.bind}
      type="button"
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        color: active ? "var(--tab-active)" : "var(--tab-inactive)",
        fontSize: 12,
        fontWeight: active ? 400 : 300,
        letterSpacing: "0.05em",
        padding: "8px 14px",
        cursor: "pointer",
        fontFamily: "inherit",
        position: "relative",
        transform: press.pressed
          ? "translateY(1px) scale(0.96)"
          : press.hovered
            ? "translateY(-1px)"
            : "translateY(0)",
        transition:
          "color var(--motion-medium) var(--ease-premium), transform var(--motion-medium) var(--ease-premium), opacity var(--motion-medium) var(--ease-premium)",
      }}
    >
      {label}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: `translateX(-50%) scaleX(${active ? 1 : press.hovered ? 0.55 : 0.2})`,
          transformOrigin: "center",
          width: 20,
          height: 1,
          background: "var(--tab-line)",
          opacity: active ? 1 : press.hovered ? 0.75 : 0.2,
          transition:
            "transform var(--motion-slow) var(--ease-premium), opacity var(--motion-medium) var(--ease-premium), background var(--motion-medium) var(--ease-premium)",
        }}
      />
    </button>
  );
}

export const LoanTypeTabs = memo(function LoanTypeTabs({
  activeIndex,
  onSelect,
}: Readonly<LoanTypeTabsProps>) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 24px" }}>
      {LOAN_TYPES.map((loanType, index) => (
        <LoanTypeTab
          key={loanType.id}
          label={loanType.label}
          active={index === activeIndex}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  );
});
