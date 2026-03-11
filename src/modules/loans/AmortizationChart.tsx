"use client";

import { memo } from "react";
import { CollapsibleSection } from "@/components/ui";
import { Haptic } from "@/hooks/useHaptic";
import type { YearData } from "@/lib/calc";
import { fShort } from "@/lib/format";

interface AmortizationChartProps {
  open: boolean;
  onToggle: () => void;
  years: YearData[];
  maxPrincipalAndInterest: number;
  crossoverIndex: number;
}

export const AmortizationChart = memo(function AmortizationChart({
  open,
  onToggle,
  years,
  maxPrincipalAndInterest,
  crossoverIndex,
}: Readonly<AmortizationChartProps>) {
  return (
    <div style={{ marginTop: 8 }}>
      <CollapsibleSection
        label="Year-by-year"
        open={open}
        onToggle={() => {
          onToggle();
          Haptic.light();
        }}
        maxHeight={2000}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingBottom: 16 }}>
          {years.map((year, index) => {
            const total = year.p + year.i;
            const principalPercent = (year.p / total) * 100;
            const widthPercent = (total / maxPrincipalAndInterest) * 100;
            const isCrossover = index === crossoverIndex;

            return (
              <div key={year.y}>
                {isCrossover ? (
                  <div
                    style={{
                      fontSize: 8,
                      color: "var(--text-muted)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "8px 0 4px 28px",
                    }}
                  >
                    ↑ principal overtakes interest
                  </div>
                ) : null}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      fontSize: 10,
                      width: 18,
                      textAlign: "right",
                      flexShrink: 0,
                      color: isCrossover ? "var(--text-muted-mid)" : "var(--text-muted-faint)",
                      fontWeight: isCrossover ? 500 : 400,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {year.y}
                  </span>
                  <div style={{ flex: 1, height: 6 }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${widthPercent}%`,
                        borderRadius: 3,
                        overflow: "hidden",
                        display: "flex",
                        transform: isCrossover ? "scaleY(1.16)" : "scaleY(1)",
                        transition:
                          "width var(--motion-slow) var(--ease-premium), transform var(--motion-medium) var(--ease-premium)",
                      }}
                    >
                      <div
                        style={{
                          width: `${principalPercent}%`,
                          background: "var(--bar-fill)",
                          height: "100%",
                          transition: "width var(--motion-slow) var(--ease-premium)",
                        }}
                      />
                      <div style={{ flex: 1, background: "var(--bar-bg)", height: "100%" }} />
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 9,
                      color: "var(--text-muted-faint)",
                      width: 42,
                      textAlign: "right",
                      flexShrink: 0,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {fShort(year.bal)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>
    </div>
  );
});
