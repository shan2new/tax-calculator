"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Haptic } from "@/hooks/useHaptic";
import { useCollapsible } from "@/hooks/useCollapsible";
import { useViewCycler } from "@/hooks/useViewCycler";
import {
  SCRUB_TICK_PULSE_MS,
  SHARE_TOAST_MS,
  TAX_HERO_VIEW_COUNT,
  VERDICT_PULSE_MS,
} from "@/lib/constants";
import { calcTaxNew, calcTaxOld } from "@/lib/calc";
import { fINR, fShort } from "@/lib/format";
import { buildTaxShareCardBlob, buildTaxShareUrl } from "@/lib/share-card";
import { useTheme } from "@/providers/ThemeProvider";
import { RegimeBar } from "@/modules/tax/RegimeBar";
import { SlabBreakdown } from "@/modules/tax/SlabBreakdown";
import { TaxActions } from "@/modules/tax/TaxActions";
import { TaxControls } from "@/modules/tax/TaxControls";
import { TaxDisclaimer } from "@/modules/tax/TaxDisclaimer";
import { TaxHero } from "@/modules/tax/TaxHero";

interface TaxModuleProps {
  initialIncome?: number;
  initialDeductions?: number;
}

export function TaxModule({ initialIncome = 1500000, initialDeductions = 200000 }: TaxModuleProps = {}) {
  const { dark } = useTheme();
  const [income, setIncome] = useState(initialIncome);
  const [deductions, setDeductions] = useState(initialDeductions);
  const [velocity, setVelocity] = useState(0);
  const [tickPulse, setTickPulse] = useState(false);
  const [verdictPulse, setVerdictPulse] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
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
  const pulseBoost = verdictPulse || tickPulse ? 0.1 : 0;
  const winnerScale = 1 + Math.max(scrubEnergy * 0.08, pulseBoost);

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

  const handleShare = useCallback(async () => {
    Haptic.medium();
    const blob = await buildTaxShareCardBlob({
      dark,
      income,
      deductions,
      totalNew,
      totalOld,
      takeHome,
      effectiveRate,
      betterRegime,
      savings,
    });
    if (!blob) return;

    const file = new File([blob], "claros-tax.png", { type: "image/png" });
    const shareUrl = buildTaxShareUrl(income);
    const regimeLabel = betterRegime === "new" ? "New" : betterRegime === "old" ? "Old" : "Equal";

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `Income Tax on ${fShort(income)} — Claros`,
          text: `Monthly take-home: ${fINR(takeHome)} · ${effectiveRate.toFixed(1)}% effective rate · ${regimeLabel} regime saves ${fShort(Math.abs(savings))}/yr`,
          url: shareUrl,
        });
      } catch {
        // Share cancelled.
      }
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "claros-tax.png";
    anchor.click();

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareVisible(true);
      globalThis.setTimeout(() => setShareVisible(false), SHARE_TOAST_MS);
    } catch {
      // Clipboard not available.
    } finally {
      URL.revokeObjectURL(anchor.href);
    }
  }, [betterRegime, dark, deductions, effectiveRate, income, savings, takeHome, totalNew, totalOld]);

  return (
    <div>
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

      <TaxActions
        heroView={heroView}
        shareVisible={shareVisible}
        onShare={(event) => {
          event.stopPropagation();
          void handleShare();
        }}
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
