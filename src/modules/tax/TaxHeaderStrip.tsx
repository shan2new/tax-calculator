"use client";

import { Haptic } from "@/hooks/useHaptic";

export type IncomeMode = "gross" | "ctc";

interface TaxHeaderStripProps {
  mode: IncomeMode;
  onModeChange: (mode: IncomeMode) => void;
}

export function TaxHeaderStrip({
  mode,
  onModeChange,
}: Readonly<TaxHeaderStripProps>) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px 0",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: "var(--accent)",
            boxShadow: "0 0 8px var(--accent-glow)",
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          FY 2025–26
        </span>
      </div>
      <Segmented mode={mode} onModeChange={onModeChange} />
    </div>
  );
}

function Segmented({
  mode,
  onModeChange,
}: Readonly<{
  mode: IncomeMode;
  onModeChange: (mode: IncomeMode) => void;
}>) {
  const options: { key: IncomeMode; label: string }[] = [
    { key: "gross", label: "Gross" },
    { key: "ctc", label: "CTC" },
  ];
  return (
    <div
      role="tablist"
      aria-label="Income mode"
      style={{
        display: "inline-flex",
        padding: 2,
        borderRadius: 999,
        background: "var(--card-bg)",
        border: "0.5px solid var(--border)",
      }}
    >
      {options.map((opt) => {
        const active = mode === opt.key;
        return (
          <button
            key={opt.key}
            role="tab"
            aria-selected={active}
            onClick={() => {
              if (active) return;
              Haptic.medium();
              onModeChange(opt.key);
            }}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              border: "none",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "var(--font)",
              cursor: active ? "default" : "pointer",
              background: active ? "var(--surface-raised)" : "transparent",
              color: active ? "var(--text-primary)" : "var(--text-muted)",
              boxShadow: active ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
              transition:
                "background 220ms cubic-bezier(0.16,1,0.3,1), color 220ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
