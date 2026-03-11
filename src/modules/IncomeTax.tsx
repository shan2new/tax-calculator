"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { SmoothNumber } from "@/components/SmoothNumber";
import { ScrubValue } from "@/components/ScrubValue";
import { Haptic } from "@/hooks/useHaptic";
import { usePremiumPress } from "@/hooks/usePremiumPress";
import { fINR, fShort, fShortStep } from "@/lib/format";
import { calcTaxNew, calcTaxOld, TAX_NEW } from "@/lib/calc";

interface TaxModuleProps {
  dark?: boolean;
}

export function TaxModule({}: Readonly<TaxModuleProps>) {
  const [income, setIncome] = useState(1500000);
  const [deductions, setDeductions] = useState(200000);
  const [vel, setVel] = useState(0);
  const [tickPulse, setTickPulse] = useState(false);
  const tickPulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const fireTick = useCallback(() => {
    setTickPulse(true);
    globalThis.clearTimeout(tickPulseTimeoutRef.current);
    tickPulseTimeoutRef.current = globalThis.setTimeout(() => setTickPulse(false), 180);
  }, []);
  const [heroView, setHeroView] = useState(0);
  const [displayHeroView, setDisplayHeroView] = useState(0);
  const [heroContentVisible, setHeroContentVisible] = useState(true);
  const [slabsOpen, setSlabsOpen] = useState(false);
  const [verdictPulse, setVerdictPulse] = useState(false);
  const heroPress = usePremiumPress();
  const slabsPress = usePremiumPress();

  const taxNew = calcTaxNew(income);
  const taxOld = calcTaxOld(income, deductions);
  const cessNew = taxNew * 0.04;
  const cessOld = taxOld * 0.04;
  const totalNew = taxNew + cessNew;
  const totalOld = taxOld + cessOld;
  const savings = totalOld - totalNew;
  const betterRegime = savings > 0 ? "new" : savings < 0 ? "old" : "same";
  const bestTax = Math.min(totalNew, totalOld);
  const takeHome = income > 0 ? Math.round((income - bestTax) / 12) : 0;
  const effRate = income > 0 ? (bestTax / income) * 100 : 0;

  const cycleHero = () => {
    Haptic.light();
    setHeroView((v) => (v + 1) % 3);
  };

  useEffect(() => {
    if (displayHeroView === heroView) return;
    setHeroContentVisible(false);
    const swapTimer = globalThis.setTimeout(() => {
      setDisplayHeroView(heroView);
      setHeroContentVisible(true);
    }, 110);
    return () => globalThis.clearTimeout(swapTimer);
  }, [displayHeroView, heroView]);

  useEffect(() => {
    setVerdictPulse(true);
    const t = globalThis.setTimeout(() => setVerdictPulse(false), 240);
    return () => globalThis.clearTimeout(t);
  }, [betterRegime, savings]);

  useEffect(
    () => () => {
      globalThis.clearTimeout(tickPulseTimeoutRef.current);
    },
    []
  );

  const scrubEnergy = Math.min(1, vel / 18);
  const winnerScale = 1 + scrubEnergy * 0.08 + (verdictPulse || tickPulse ? 0.1 : 0);

  return (
    <div>
      <div style={{ textAlign: "center", padding: "8px 0 20px" }}>
        <span style={{ fontSize: 11, color: "var(--text-muted-faint)", letterSpacing: "0.08em" }}>
          FY 2025–26
        </span>
      </div>

      {/* Tappable hero — cycles verdict / new regime / old regime */}
      <div
        {...heroPress.bind}
        onClick={cycleHero}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            cycleHero();
          }
        }}
        role="button"
        tabIndex={0}
        style={{
          textAlign: "center",
          padding: "24px 0 20px",
          cursor: "pointer",
          minHeight: 140,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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
            minHeight: 112,
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
        {displayHeroView === 0 && (
          <>
            <span
              style={{
                fontSize: 9,
                letterSpacing: "0.14em",
                color: "var(--text-muted-faint)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              monthly take-home
            </span>
            <SmoothNumber value={takeHome} prefix="₹" fontSize={40} />
            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color: "var(--text-muted-mid)",
                padding: "6px 12px",
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
            <div style={{ fontSize: 11, color: "var(--text-muted-faint)", marginTop: 6 }}>
              {effRate.toFixed(1)}% effective tax rate
            </div>
          </>
        )}
        {displayHeroView === 1 && (
          <>
            <span
              style={{
                fontSize: 9,
                letterSpacing: "0.14em",
                color: "var(--text-muted-faint)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              new regime
            </span>
            <SmoothNumber value={totalNew} prefix="₹" fontSize={36} />
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
              {fINR(Math.round(totalNew / 12))}/mo ·{" "}
              {income > 0 ? ((totalNew / income) * 100).toFixed(1) : 0}% effective
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted-faint)", marginTop: 4 }}>
              incl. ₹{Math.round(cessNew).toLocaleString("en-IN")} cess
            </div>
          </>
        )}
        {displayHeroView === 2 && (
          <>
            <span
              style={{
                fontSize: 9,
                letterSpacing: "0.14em",
                color: "var(--text-muted-faint)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              old regime
            </span>
            <SmoothNumber value={totalOld} prefix="₹" fontSize={36} />
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
              {fINR(Math.round(totalOld / 12))}/mo ·{" "}
              {income > 0 ? ((totalOld / income) * 100).toFixed(1) : 0}% effective
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted-faint)", marginTop: 4 }}>
              taxable: {fShort(Math.max(0, income - deductions))} after deductions
            </div>
          </>
        )}
        </div>
        {/* View dots */}
        <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: i === heroView ? 10 : 4,
                height: 4,
                borderRadius: 2,
                background: i === heroView ? "var(--text-muted-mid)" : "var(--text-muted-faint)",
                opacity: i === heroView ? 1 : 0.72,
                transform: i === heroView ? "scaleX(1)" : "scaleX(0.92)",
                transition:
                  "width var(--motion-medium) var(--ease-premium), background var(--motion-medium) var(--ease-premium), opacity var(--motion-medium) var(--ease-premium), transform var(--motion-medium) var(--ease-premium)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Comparison bar — visual weight between regimes */}
      <div style={{ padding: "0 0 16px" }}>
        <div style={{ display: "flex", gap: 4, height: 4, borderRadius: 2, overflow: "hidden" }}>
          <div
            style={{
              flex: totalNew || 1,
              background:
                betterRegime === "new" || betterRegime === "same"
                  ? "var(--bar-fill)"
                  : "var(--bar-bg)",
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

      {/* Controls */}
      <ScrubValue
        label="Gross income"
        value={income}
        min={0}
        max={50000000}
        step={50000}
        sensitivity={2}
        format={(v) => fShortStep(v, 50000)}
        scrubFormat={fINR}
        onVelocity={setVel}
        isAmount
        onChange={setIncome}
        tickStep={500000}
        onTick={fireTick}
      />
      <ScrubValue
        label="Deductions (80C+D+HRA)"
        value={deductions}
        min={0}
        max={1000000}
        step={10000}
        sensitivity={1}
        format={(v) => fShortStep(v, 10000)}
        scrubFormat={fINR}
        onVelocity={setVel}
        isAmount
        onChange={setDeductions}
        tickStep={50000}
        onTick={fireTick}
      />

      {/* Slab breakdown — collapsible */}
      <div style={{ marginTop: 8 }}>
        <div
          {...slabsPress.bind}
          onClick={() => {
            setSlabsOpen(!slabsOpen);
            Haptic.light();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSlabsOpen((v) => !v);
              Haptic.light();
            }
          }}
          role="button"
          tabIndex={0}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            padding: "14px 0",
            minHeight: 44,
            transform: slabsPress.pressed ? "translateY(1px)" : "translateY(0)",
            transition: "transform var(--motion-medium) var(--ease-premium)",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "var(--text-muted-faint)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Tax slabs (New)
          </span>
          <span
            style={{
              fontSize: 12,
              color: "var(--text-muted-faint)",
              transform: slabsOpen ? "rotate(180deg)" : "none",
              transition: "transform var(--motion-slow) var(--ease-premium), color var(--motion-medium) var(--ease-premium)",
              display: "inline-block",
            }}
          >
            ▾
          </span>
        </div>
        <div
          style={{
            maxHeight: slabsOpen ? 400 : 0,
            overflow: "hidden",
            transition: "max-height var(--motion-slow) var(--ease-premium), opacity var(--motion-medium) var(--ease-premium)",
            opacity: slabsOpen ? 1 : 0.72,
          }}
        >
          <div style={{ paddingBottom: 16 }}>
            {TAX_NEW.map(([lo, hi, rate], i) => {
              const applicable = income > lo;
              const taxable = applicable
                ? Math.min(income, hi === Infinity ? income : hi) - lo
                : 0;
              const tax = taxable * rate;
              const maxWidth = income > 0 ? (taxable / income) * 100 : 0;
              if (!applicable && i > 0) return null;
              return (
                <div
                  key={i}
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
                        width: `${Math.max(maxWidth, applicable ? 2 : 0)}%`,
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
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: "20px 0 4px" }}>
        <p
          style={{
            fontSize: 9,
            color: "var(--text-muted-faint)",
            lineHeight: 1.6,
            margin: 0,
            letterSpacing: "0.01em",
          }}
        >
          Tax calculations are based on published Income Tax slabs for FY 2025–26 and are indicative
          only. Standard deduction of ₹75,000 under new regime and HRA/LTA exemptions are not
          included. Surcharge for income above ₹50L is not applied. This tool does not constitute tax
          advice. Consult a chartered accountant or tax professional for accurate filing.
        </p>
      </div>
    </div>
  );
}
