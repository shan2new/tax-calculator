"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCollapsible } from "@/hooks/useCollapsible";
import { useViewCycler } from "@/hooks/useViewCycler";
import {
  SCRUB_TICK_PULSE_MS,
  TAX_HERO_VIEW_COUNT,
  VERDICT_PULSE_MS,
} from "@/lib/constants";
import { calcTaxNew, calcTaxOld } from "@/lib/calc";
import { RegimeBar } from "@/modules/tax/RegimeBar";
import { SlabBreakdown } from "@/modules/tax/SlabBreakdown";
import { TaxControls } from "@/modules/tax/TaxControls";
import { TaxDisclaimer } from "@/modules/tax/TaxDisclaimer";
import { TaxHero } from "@/modules/tax/TaxHero";

export function TaxModule() {
  const [income, setIncome] = useState(1500000);
  const [deductions, setDeductions] = useState(200000);
  const [velocity, setVelocity] = useState(0);
  const [tickPulse, setTickPulse] = useState(false);
  const [verdictPulse, setVerdictPulse] = useState(false);
  const tickPulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const slabs = useCollapsible();
  const {
    view: heroView,
    displayView: displayHeroView,
    visible: heroContentVisible,
    cycle: cycleHero,
  } = useViewCycler({ viewCount: TAX_HERO_VIEW_COUNT });

  const taxNew = useMemo(() => calcTaxNew(income), [income]);
  const taxOld = useMemo(() => calcTaxOld(income, deductions), [deductions, income]);
  const cessNew = useMemo(() => taxNew * 0.04, [taxNew]);
  const cessOld = useMemo(() => taxOld * 0.04, [taxOld]);
  const totalNew = useMemo(() => taxNew + cessNew, [cessNew, taxNew]);
  const totalOld = useMemo(() => taxOld + cessOld, [cessOld, taxOld]);
  const savings = useMemo(() => totalOld - totalNew, [totalNew, totalOld]);
  const betterRegime = savings > 0 ? "new" : savings < 0 ? "old" : "same";
  const bestTax = useMemo(() => Math.min(totalNew, totalOld), [totalNew, totalOld]);
  const takeHome = useMemo(() => (income > 0 ? Math.round((income - bestTax) / 12) : 0), [bestTax, income]);
  const effectiveRate = useMemo(() => (income > 0 ? (bestTax / income) * 100 : 0), [bestTax, income]);
  const scrubEnergy = Math.min(1, velocity / 18);
  const winnerScale = 1 + scrubEnergy * 0.08 + (verdictPulse || tickPulse ? 0.1 : 0);

  const fireTick = useCallback(() => {
    setTickPulse(true);
    globalThis.clearTimeout(tickPulseTimeoutRef.current);
    tickPulseTimeoutRef.current = globalThis.setTimeout(
      () => setTickPulse(false),
      SCRUB_TICK_PULSE_MS
    );
  }, []);

  useEffect(() => {
    setVerdictPulse(true);
    const timer = globalThis.setTimeout(() => setVerdictPulse(false), VERDICT_PULSE_MS);
    return () => globalThis.clearTimeout(timer);
  }, [betterRegime, savings]);

  useEffect(
    () => () => {
      globalThis.clearTimeout(tickPulseTimeoutRef.current);
    },
    []
  );

  return (
    <div>
      <div style={{ textAlign: "center", padding: "8px 0 20px" }}>
        <span style={{ fontSize: 11, color: "var(--text-muted-faint)", letterSpacing: "0.08em" }}>
          FY 2025–26
        </span>
      </div>

      <TaxHero
        heroView={heroView}
        displayHeroView={displayHeroView}
        heroContentVisible={heroContentVisible}
        takeHome={takeHome}
        betterRegime={betterRegime}
        savings={savings}
        effectiveRate={effectiveRate}
        totalNew={totalNew}
        totalOld={totalOld}
        income={income}
        deductions={deductions}
        cessNew={cessNew}
        verdictPulse={verdictPulse}
        tickPulse={tickPulse}
        onCycle={cycleHero}
      />

      <RegimeBar
        totalNew={totalNew}
        totalOld={totalOld}
        betterRegime={betterRegime}
        winnerScale={winnerScale}
      />

      <TaxControls
        income={income}
        deductions={deductions}
        onIncomeChange={setIncome}
        onDeductionsChange={setDeductions}
        onVelocity={setVelocity}
        onTick={fireTick}
      />

      <SlabBreakdown open={slabs.open} onToggle={slabs.toggle} income={income} />
      <TaxDisclaimer />
    </div>
  );
}
