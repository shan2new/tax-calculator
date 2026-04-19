"use client";

import { SmoothNumber } from "@/components/SmoothNumber";
import { fShort } from "@/lib/format";

interface TaxHeroProps {
  takeHome: number;
  betterRegime: "new" | "old" | "same";
  savings: number;
  effectiveRate: number;
  monthsWorked: number;
}

export function TaxHero({
  takeHome,
  betterRegime,
  savings,
  effectiveRate,
  monthsWorked,
}: Readonly<TaxHeroProps>) {
  const midYear = monthsWorked < 12;
  const eyebrow = midYear
    ? `monthly take-home · ${monthsWorked} mo`
    : "monthly take-home";

  return (
    <div
      style={{
        padding: "28px 20px 18px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.14em",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        {eyebrow}
      </span>

      <SmoothNumber
        value={takeHome}
        prefix="₹"
        fontSize={48}
        fontWeight={300}
        letterSpacing="-0.035em"
      />

      <div
        style={{
          marginTop: 16,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 14px",
          borderRadius: 999,
          background: "var(--card-bg)",
          border: "0.5px solid var(--border-strong)",
          fontSize: 12,
          fontVariantNumeric: "tabular-nums",
          color: "var(--text-muted)",
          transition:
            "border-color var(--motion-medium) var(--ease-premium), background var(--motion-medium) var(--ease-premium)",
        }}
      >
        {betterRegime !== "same" ? (
          <>
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
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              {betterRegime === "new" ? "New regime" : "Old regime"}
            </span>
            <span style={{ color: "var(--text-muted)" }}>
              saves {fShort(Math.abs(savings))}/yr
            </span>
          </>
        ) : (
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
            Both regimes equal
          </span>
        )}
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 11,
          color: "var(--text-muted)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {effectiveRate.toFixed(1)}% effective tax rate
      </div>
    </div>
  );
}
