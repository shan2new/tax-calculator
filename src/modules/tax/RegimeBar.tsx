"use client";

import { fShort } from "@/lib/format";

interface RegimeBarProps {
  totalNew: number;
  totalOld: number;
  betterRegime: "new" | "old" | "same";
  winnerScale: number;
}

export function RegimeBar({
  totalNew,
  totalOld,
  betterRegime,
  winnerScale,
}: Readonly<RegimeBarProps>) {
  return (
    <div style={{ padding: "0 0 16px" }}>
      <div style={{ display: "flex", gap: 4, height: 4, borderRadius: 2, overflow: "hidden" }}>
        <div
          style={{
            flex: totalNew || 1,
            background:
              betterRegime === "new" || betterRegime === "same" ? "var(--bar-fill)" : "var(--bar-bg)",
            borderRadius: 2,
            transform:
              betterRegime === "new" || betterRegime === "same"
                ? `scaleY(${winnerScale.toFixed(3)})`
                : "scaleY(1)",
            transformOrigin: "center",
            transition:
              "flex var(--motion-slow) var(--ease-premium), background var(--motion-medium) var(--ease-premium), transform var(--motion-medium) var(--ease-premium)",
          }}
        />
        <div
          style={{
            flex: totalOld || 1,
            background: betterRegime === "old" ? "var(--bar-fill)" : "var(--bar-bg)",
            borderRadius: 2,
            transform: betterRegime === "old" ? `scaleY(${winnerScale.toFixed(3)})` : "scaleY(1)",
            transformOrigin: "center",
            transition:
              "flex var(--motion-slow) var(--ease-premium), background var(--motion-medium) var(--ease-premium), transform var(--motion-medium) var(--ease-premium)",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span
          style={{
            fontSize: 9,
            color: betterRegime !== "old" ? "var(--text-muted-mid)" : "var(--text-muted-faint)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            transition: "color var(--motion-medium) var(--ease-premium)",
          }}
        >
          New {fShort(totalNew)}
        </span>
        <span
          style={{
            fontSize: 9,
            color: betterRegime === "old" ? "var(--text-muted-mid)" : "var(--text-muted-faint)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            transition: "color var(--motion-medium) var(--ease-premium)",
          }}
        >
          Old {fShort(totalOld)}
        </span>
      </div>
    </div>
  );
}
