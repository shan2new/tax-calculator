"use client";

import { HeroStage } from "@/components/ui/HeroStage";
import { SmoothNumber } from "@/components/SmoothNumber";
import { Haptic } from "@/hooks/useHaptic";
import { usePremiumPress } from "@/hooks/usePremiumPress";
import { fINR, fShort } from "@/lib/format";

interface TaxHeroProps {
  heroView: number;
  displayHeroView: number;
  heroContentVisible: boolean;
  takeHome: number;
  betterRegime: "new" | "old" | "same";
  savings: number;
  effectiveRate: number;
  totalNew: number;
  totalOld: number;
  income: number;
  deductions: number;
  cessNew: number;
  verdictPulse: boolean;
  tickPulse: boolean;
  onCycle: () => void;
}

export function TaxHero({
  heroView,
  displayHeroView,
  heroContentVisible,
  takeHome,
  betterRegime,
  savings,
  effectiveRate,
  totalNew,
  totalOld,
  income,
  deductions,
  cessNew,
  verdictPulse,
  tickPulse,
  onCycle,
}: Readonly<TaxHeroProps>) {
  const heroPress = usePremiumPress();

  return (
    <HeroStage minHeight={260} paddingBottom={12}>
      <div
        {...heroPress.bind}
        onClick={() => {
          Haptic.light();
          onCycle();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            Haptic.light();
            onCycle();
          }
        }}
        role="button"
        tabIndex={0}
        style={{
          textAlign: "center",
          cursor: "pointer",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          alignSelf: "stretch",
          transform: heroPress.pressed
            ? "translateY(1px) scale(0.992)"
            : heroPress.hovered
              ? "translateY(-1px)"
              : "translateY(0)",
          transition: "transform var(--motion-medium) var(--ease-premium)",
        }}
      >
        <div
          style={{
            minHeight: 180,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: heroContentVisible ? 1 : 0,
            transform: heroContentVisible ? "translateY(0) scale(1)" : "translateY(8px) scale(0.985)",
            transition:
              "opacity var(--motion-medium) var(--ease-premium), transform var(--motion-slow) var(--ease-premium)",
          }}
        >
          {displayHeroView === 0 ? (
            <>
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  color: "var(--text-muted-faint)",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                monthly take-home
              </span>
              <SmoothNumber value={takeHome} prefix="₹" fontSize={40} />
              <div
                style={{
                  marginTop: 16,
                  fontSize: 12,
                  color: "var(--text-muted-mid)",
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  transform: verdictPulse || tickPulse ? "scale(1.02)" : "scale(1)",
                  transition:
                    "transform var(--motion-medium) var(--ease-premium), border-color var(--motion-medium) var(--ease-premium), background var(--motion-medium) var(--ease-premium)",
                }}
              >
                {betterRegime !== "same" ? (
                  <>
                    <span style={{ color: "var(--text-primary)", fontWeight: 400 }}>
                      {betterRegime === "new" ? "New" : "Old"} regime
                    </span>{" "}
                    saves {fShort(Math.abs(savings))}/yr
                  </>
                ) : (
                  "Both regimes are equal"
                )}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted-faint)", marginTop: 10 }}>
                {effectiveRate.toFixed(1)}% effective tax rate
              </div>
            </>
          ) : null}

          {displayHeroView === 1 ? (
            <>
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  color: "var(--text-muted-faint)",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                new regime
              </span>
              <SmoothNumber value={totalNew} prefix="₹" fontSize={36} />
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 12 }}>
                {fINR(Math.round(totalNew / 12))}/mo ·{" "}
                {income > 0 ? ((totalNew / income) * 100).toFixed(1) : 0}% effective
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted-faint)", marginTop: 6 }}>
                incl. ₹{Math.round(cessNew).toLocaleString("en-IN")} cess
              </div>
            </>
          ) : null}

          {displayHeroView === 2 ? (
            <>
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  color: "var(--text-muted-faint)",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                old regime
              </span>
              <SmoothNumber value={totalOld} prefix="₹" fontSize={36} />
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 12 }}>
                {fINR(Math.round(totalOld / 12))}/mo ·{" "}
                {income > 0 ? ((totalOld / income) * 100).toFixed(1) : 0}% effective
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted-faint)", marginTop: 6 }}>
                taxable: {fShort(Math.max(0, income - deductions))} after deductions
              </div>
            </>
          ) : null}
        </div>
      </div>
    </HeroStage>
  );
}
