"use client";

import { Haptic } from "@/hooks/useHaptic";
import { usePremiumPress } from "@/hooks/usePremiumPress";

interface MidYearChipProps {
  startMonth: number;
  monthLabel: string;
  onOpen: () => void;
}

export function MidYearChip({
  startMonth,
  monthLabel,
  onOpen,
}: Readonly<MidYearChipProps>) {
  const press = usePremiumPress();
  const monthsWorked = 12 - startMonth;
  const active = startMonth > 0;

  return (
    <button
      {...press.bind}
      onClick={() => {
        Haptic.medium();
        onOpen();
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        width: "100%",
        padding: "14px 20px",
        borderTop: "0.5px solid var(--border)",
        borderBottom: "none",
        borderLeft: "none",
        borderRight: "none",
        background: "transparent",
        cursor: "pointer",
        color: "var(--text-primary)",
        fontFamily: "var(--font)",
        transform: press.pressed ? "scale(0.995)" : "scale(1)",
        transition: "transform var(--motion-medium) var(--ease-premium)",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          Joined mid-year
        </span>
        {active ? (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.02em",
              padding: "3px 8px",
              borderRadius: 999,
              background: "var(--card-active)",
              border: "0.5px solid var(--border)",
              color: "var(--text-primary)",
            }}
          >
            {monthLabel}
          </span>
        ) : null}
      </span>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          color: "var(--text-muted)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {active ? `${monthsWorked} mo` : "Full FY"}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden
        >
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </span>
    </button>
  );
}
