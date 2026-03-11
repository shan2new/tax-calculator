"use client";

import { memo } from "react";
import { CollapsibleSection } from "@/components/ui";
import { Haptic } from "@/hooks/useHaptic";
import { TAX_NEW } from "@/lib/calc";
import { fShort } from "@/lib/format";

interface SlabBreakdownProps {
  open: boolean;
  onToggle: () => void;
  income: number;
}

export const SlabBreakdown = memo(function SlabBreakdown({
  open,
  onToggle,
  income,
}: Readonly<SlabBreakdownProps>) {
  return (
    <div style={{ marginTop: 8 }}>
      <CollapsibleSection
        label="Tax slabs (New)"
        open={open}
        onToggle={() => {
          onToggle();
          Haptic.light();
        }}
        maxHeight={400}
      >
        <div style={{ paddingBottom: 16 }}>
          {TAX_NEW.map(([lower, upper, rate], index) => {
            const applicable = income > lower;
            const taxable = applicable ? Math.min(income, upper === Infinity ? income : upper) - lower : 0;
            const tax = taxable * rate;
            const widthPercent = income > 0 ? (taxable / income) * 100 : 0;
            if (!applicable && index > 0) return null;

            return (
              <div
                key={`${lower}-${upper}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: "var(--text-muted-faint)",
                    width: 28,
                    textAlign: "right",
                    flexShrink: 0,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {Math.round(rate * 100)}%
                </span>
                <div style={{ flex: 1, height: 6 }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.max(widthPercent, applicable ? 2 : 0)}%`,
                      borderRadius: 3,
                      background: applicable ? "var(--bar-fill)" : "var(--bar-bg)",
                      transform: applicable ? "scaleY(1.08)" : "scaleY(1)",
                      transformOrigin: "center",
                      transition:
                        "width var(--motion-medium) var(--ease-premium), background var(--motion-medium) var(--ease-premium), transform var(--motion-medium) var(--ease-premium)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color: applicable ? "var(--text-muted)" : "var(--text-muted-faint)",
                    width: 52,
                    textAlign: "right",
                    flexShrink: 0,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {tax > 0 ? fShort(tax) : "–"}
                </span>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>
    </div>
  );
});
