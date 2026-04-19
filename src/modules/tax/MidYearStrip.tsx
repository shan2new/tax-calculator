"use client";

import { fShort } from "@/lib/format";

interface MidYearStripProps {
  fyIncome: number;
  monthsWorked: number;
  annualRate: number;
}

export function MidYearStrip({
  fyIncome,
  monthsWorked,
  annualRate,
}: Readonly<MidYearStripProps>) {
  return (
    <div
      style={{
        margin: "10px 16px 0",
        padding: "9px 14px",
        borderRadius: 10,
        border: "0.5px solid var(--border)",
        background: "var(--surface-raised)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
        FY earning{" "}
        <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
          {fShort(fyIncome)}
        </span>{" "}
        · {monthsWorked} mo
      </span>
      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
        at {fShort(annualRate)}/yr rate
      </span>
    </div>
  );
}
