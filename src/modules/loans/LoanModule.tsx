"use client";

import { useCallback, useMemo, useState } from "react";
import { Haptic } from "@/hooks/useHaptic";
import { useCollapsible } from "@/hooks/useCollapsible";
import { useViewCycler } from "@/hooks/useViewCycler";
import { LOAN_VIEW_COUNT, SHARE_TOAST_MS, VIEW_SWAP_DELAY_MS } from "@/lib/constants";
import { LOAN_TYPES, emiCalc, generateYearlyAmortization } from "@/lib/calc";
import { useTheme } from "@/providers/ThemeProvider";
import { buildLoanShareCardBlob, buildLoanShareUrl } from "@/lib/share-card";
import { fINR, fShort } from "@/lib/format";
import { LoanActions } from "@/modules/loans/LoanActions";
import { LoanControls } from "@/modules/loans/LoanControls";
import { LoanDisclaimer } from "@/modules/loans/LoanDisclaimer";
import { LoanRingArea } from "@/modules/loans/LoanRingArea";
import { LoanTypeTabs } from "@/modules/loans/LoanTypeTabs";
import { AmortizationChart } from "@/modules/loans/AmortizationChart";
import type { LoanDelta, PinnedLoanSnapshot } from "@/modules/loans/types";

interface LoanModuleProps {
  initialType?: number;
  initialAmount?: number;
  initialRate?: number;
  initialTenure?: number;
}

export function LoanModule({
  initialType = 0,
  initialAmount,
  initialRate,
  initialTenure,
}: LoanModuleProps = {}) {
  const { dark } = useTheme();
  const [activeTypeIndex, setActiveTypeIndex] = useState(initialType);
  const loanType = LOAN_TYPES[activeTypeIndex];

  const [amount, setAmount] = useState(initialAmount ?? loanType.amt);
  const [rate, setRate] = useState(initialRate ?? loanType.rate);
  const [tenure, setTenure] = useState(initialTenure ?? loanType.yr);
  const [velocity, setVelocity] = useState(0);
  const [tickSignal, setTickSignal] = useState(0);
  const [comparing, setComparing] = useState(false);
  const [pinned, setPinned] = useState<PinnedLoanSnapshot | null>(null);
  const [shareVisible, setShareVisible] = useState(false);

  const amortization = useCollapsible();
  const {
    view: ringView,
    displayView: displayRingView,
    visible: ringContentVisible,
    cycle: advanceRingView,
  } = useViewCycler({ viewCount: LOAN_VIEW_COUNT, skipAnimation: comparing });

  const emi = useMemo(() => emiCalc(amount, rate, tenure), [amount, rate, tenure]);
  const total = useMemo(() => emi * tenure * 12, [emi, tenure]);
  const interest = useMemo(() => total - amount, [amount, total]);
  const interestRatio = useMemo(() => (total > 0 ? interest / total : 0), [interest, total]);

  const years = useMemo(
    () => generateYearlyAmortization(amount, rate, tenure, emi),
    [amount, rate, tenure, emi]
  );
  const maxPrincipalAndInterest = useMemo(
    () => (years.length > 0 ? Math.max(...years.map((year) => year.p + year.i)) : 1),
    [years]
  );
  const crossoverIndex = useMemo(() => years.findIndex((year) => year.p > year.i), [years]);

  const delta = useMemo<LoanDelta | null>(
    () =>
      pinned
        ? {
            emi: emi - pinned.emi,
            total: total - pinned.total,
            interest: interest - pinned.interest,
          }
        : null,
    [emi, interest, pinned, total]
  );

  const fireTick = useCallback(() => setTickSignal(Date.now()), []);

  const switchType = useCallback((nextIndex: number) => {
    if (nextIndex === activeTypeIndex) return;

    Haptic.medium();
    const nextType = LOAN_TYPES[nextIndex];
    setActiveTypeIndex(nextIndex);
    setAmount(nextType.amt);
    setRate(nextType.rate);
    setTenure(nextType.yr);
    // Delay clearing compare state so ring animation finishes before compare overlay disappears
    globalThis.setTimeout(() => {
      setComparing(false);
      setPinned(null);
    }, VIEW_SWAP_DELAY_MS);
  }, [activeTypeIndex]);

  const cycleRingView = useCallback(() => {
    Haptic.light();
    advanceRingView();
  }, [advanceRingView]);

  const pinCurrent = useCallback(() => {
    Haptic.medium();
    setPinned({
      amount,
      rate,
      tenure,
      emi,
      total,
      interest,
      ir: interestRatio,
    });
    setComparing(true);
  }, [amount, emi, interest, interestRatio, rate, tenure, total]);

  const clearCompare = useCallback(() => {
    Haptic.light();
    setComparing(false);
    setPinned(null);
  }, []);

  const handleShare = useCallback(async () => {
    Haptic.medium();
    const blob = await buildLoanShareCardBlob({
      dark,
      amount,
      rate,
      tenure,
      emi,
      total,
      interest,
      ir: interestRatio,
      delta,
    });
    if (!blob) return;

    const file = new File([blob], "claros-loan.png", { type: "image/png" });
    const shareUrl = buildLoanShareUrl(amount, rate, tenure, loanType.id);

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `${loanType.label} Loan EMI: ${fINR(Math.round(emi))}/mo — Claros`,
          text: `${fShort(amount)} @ ${rate}% for ${tenure}yrs · Total: ${fShort(total)} · ${Math.round(interestRatio * 100)}% goes to interest`,
          url: shareUrl,
        });
      } catch {
        // Share cancelled.
      }
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "claros-loan.png";
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
  }, [amount, dark, delta, emi, interest, interestRatio, rate, tenure, total]);

  return (
    <div>
      <LoanTypeTabs activeIndex={activeTypeIndex} onSelect={switchType} />

      <LoanRingArea
        dark={dark}
        comparing={comparing}
        pinned={pinned}
        ir={interestRatio}
        velocity={velocity}
        tickSignal={tickSignal}
        amount={amount}
        rate={rate}
        tenure={tenure}
        emi={emi}
        total={total}
        interest={interest}
        ringView={ringView}
        displayRingView={displayRingView}
        ringContentVisible={ringContentVisible}
        onCycle={cycleRingView}
      />

      {comparing && delta ? (
        <div
          style={{
            textAlign: "center",
            padding: "4px 0 8px",
            animation: "hintFade 0.3s ease",
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontSize: 14,
              fontWeight: 300,
              fontFamily: "var(--font)",
              color: delta.emi > 0 ? "var(--warn)" : "var(--text-positive)",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.02em",
              transform: "translateY(0) scale(1)",
              padding: "4px 10px",
              borderRadius: 999,
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            {delta.emi > 0 ? "+" : ""}
            {fINR(Math.round(delta.emi))}/mo
          </span>
          <span style={{ fontSize: 11, color: "var(--text-muted-faint)", marginLeft: 6 }}>
            ({delta.total > 0 ? "+" : ""}
            {fShort(Math.abs(delta.total))} total)
          </span>
        </div>
      ) : null}

      <LoanActions
        comparing={comparing}
        ringView={ringView}
        shareVisible={shareVisible}
        onCompareToggle={(event) => {
          event.stopPropagation();
          if (comparing) clearCompare();
          else pinCurrent();
        }}
        onShare={(event) => {
          event.stopPropagation();
          void handleShare();
        }}
      />

      <LoanControls
        loanType={loanType}
        amount={amount}
        rate={rate}
        tenure={tenure}
        onAmountChange={setAmount}
        onRateChange={setRate}
        onTenureChange={setTenure}
        onVelocity={setVelocity}
        onTick={fireTick}
      />

      {rate > 0 && tenure > 0 && emi > 0 ? (
        <AmortizationChart
          open={amortization.open}
          onToggle={amortization.toggle}
          years={years}
          maxPrincipalAndInterest={maxPrincipalAndInterest}
          crossoverIndex={crossoverIndex}
        />
      ) : null}

      <LoanDisclaimer />
    </div>
  );
}
