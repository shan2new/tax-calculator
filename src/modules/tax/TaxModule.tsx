"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Haptic } from "@/hooks/useHaptic";
import { SCRUB_TICK_PULSE_MS, SHARE_TOAST_MS } from "@/lib/constants";
import { calcTaxNew, calcTaxOld } from "@/lib/calc";
import { fINR, fShort } from "@/lib/format";
import { buildTaxShareCardBlob, buildTaxShareUrl } from "@/lib/share-card";
import { useTheme } from "@/providers/ThemeProvider";
import { MidYearChip } from "@/modules/tax/MidYearChip";
import { MidYearPicker, monthLabel } from "@/modules/tax/MidYearPicker";
import { MidYearStrip } from "@/modules/tax/MidYearStrip";
import {
  TaxBreakdown,
  type BreakdownVariant,
} from "@/modules/tax/TaxBreakdown";
import { TaxControls } from "@/modules/tax/TaxControls";
import { TaxDisclaimer } from "@/modules/tax/TaxDisclaimer";
import { TaxHeaderStrip, type IncomeMode } from "@/modules/tax/TaxHeaderStrip";
import { TaxHero } from "@/modules/tax/TaxHero";

interface TaxModuleProps {
  initialIncome?: number;
  initialDeductions?: number;
  /** When true (e.g. deep-linked detail pages), ignore persisted income/deductions. */
  fromUrl?: boolean;
}

const STORAGE_KEY = "claros_tax_v2";

interface PersistedState {
  mode: IncomeMode;
  annualRate: number;
  deductions: number;
  startMonth: number;
  variant: BreakdownVariant;
}

function loadPersisted(): Partial<PersistedState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return parsed;
  } catch {
    return null;
  }
}

function savePersisted(state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / privacy-mode errors
  }
}

export function TaxModule({
  initialIncome = 1_800_000,
  initialDeductions = 200_000,
  fromUrl = false,
}: TaxModuleProps = {}) {
  const { dark } = useTheme();
  const [mode, setMode] = useState<IncomeMode>("gross");
  const [annualRate, setAnnualRate] = useState(initialIncome);
  const [deductions, setDeductions] = useState(initialDeductions);
  const [startMonth, setStartMonth] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [variant, setVariant] = useState<BreakdownVariant>("receipt");
  const [shareVisible, setShareVisible] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const tickPulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    const stored = loadPersisted();
    if (stored) {
      if (stored.mode === "gross" || stored.mode === "ctc")
        setMode(stored.mode);
      if (
        !fromUrl &&
        typeof stored.annualRate === "number" &&
        Number.isFinite(stored.annualRate)
      ) {
        setAnnualRate(stored.annualRate);
      }
      if (
        !fromUrl &&
        typeof stored.deductions === "number" &&
        Number.isFinite(stored.deductions)
      ) {
        setDeductions(stored.deductions);
      }
      if (
        typeof stored.startMonth === "number" &&
        stored.startMonth >= 0 &&
        stored.startMonth <= 11
      ) {
        setStartMonth(stored.startMonth);
      }
      if (
        stored.variant === "receipt" ||
        stored.variant === "dual" ||
        stored.variant === "slabs"
      ) {
        setVariant(stored.variant);
      }
    }
    setHydrated(true);
  }, [fromUrl]);

  useEffect(() => {
    if (!hydrated) return;
    savePersisted({ mode, annualRate, deductions, startMonth, variant });
  }, [hydrated, mode, annualRate, deductions, startMonth, variant]);

  const monthsWorked = 12 - startMonth;
  const fyIncome = useMemo(
    () => Math.round((annualRate * monthsWorked) / 12),
    [annualRate, monthsWorked],
  );
  const fyDeductions = useMemo(
    () => Math.round((deductions * monthsWorked) / 12),
    [deductions, monthsWorked],
  );
  const tNew = useMemo(() => calcTaxNew(fyIncome), [fyIncome]);
  const tOld = useMemo(
    () => calcTaxOld(fyIncome, fyDeductions),
    [fyIncome, fyDeductions],
  );
  const cessNew = tNew * 0.04;
  const cessOld = tOld * 0.04;
  const totalNew = tNew + cessNew;
  const totalOld = tOld + cessOld;
  const savings = totalOld - totalNew;
  const betterRegime: "new" | "old" | "same" =
    Math.abs(savings) < 1 ? "same" : savings > 0 ? "new" : "old";
  const bestTax = Math.min(totalNew, totalOld);
  const takeHome =
    fyIncome > 0 ? Math.round((fyIncome - bestTax) / monthsWorked) : 0;
  const effectiveRate = fyIncome > 0 ? (bestTax / fyIncome) * 100 : 0;

  const fireTick = useCallback(() => {
    // Haptic pulse is owned inside ScrubValue; kept as a no-op hook
    // so TaxControls retains its existing tick-forwarding contract.
    globalThis.clearTimeout(tickPulseTimeoutRef.current);
    tickPulseTimeoutRef.current = globalThis.setTimeout(
      () => {},
      SCRUB_TICK_PULSE_MS,
    );
  }, []);

  useEffect(
    () => () => {
      globalThis.clearTimeout(tickPulseTimeoutRef.current);
    },
    [],
  );

  const handleShare = useCallback(async () => {
    Haptic.medium();
    const blob = await buildTaxShareCardBlob({
      dark,
      income: fyIncome,
      deductions: fyDeductions,
      totalNew,
      totalOld,
      takeHome,
      effectiveRate,
      betterRegime,
      savings,
    });
    if (!blob) return;
    const file = new File([blob], "claros-tax.png", { type: "image/png" });
    const shareUrl = buildTaxShareUrl(annualRate);
    const regimeLabel =
      betterRegime === "new" ? "New" : betterRegime === "old" ? "Old" : "Equal";

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `Income Tax on ${fShort(annualRate)} — Claros`,
          text: `Monthly take-home: ${fINR(takeHome)} · ${effectiveRate.toFixed(1)}% effective rate · ${regimeLabel} regime saves ${fShort(Math.abs(savings))}/yr`,
          url: shareUrl,
        });
      } catch {
        // cancelled
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
      // clipboard unavailable
    } finally {
      URL.revokeObjectURL(anchor.href);
    }
  }, [
    annualRate,
    betterRegime,
    dark,
    effectiveRate,
    fyDeductions,
    fyIncome,
    savings,
    takeHome,
    totalNew,
    totalOld,
  ]);

  return (
    <div>
      {/* Stage 1 — hero (150ms) */}
      <div
        style={{
          opacity: 0,
          animation: "navIn 0.65s cubic-bezier(0.16,1,0.3,1) 150ms both",
        }}
      >
        <TaxHeaderStrip mode={mode} onModeChange={setMode} />
        <TaxHero
          takeHome={takeHome}
          betterRegime={betterRegime}
          savings={savings}
          effectiveRate={effectiveRate}
          monthsWorked={monthsWorked}
        />
        {startMonth > 0 ? (
          <MidYearStrip
            fyIncome={fyIncome}
            monthsWorked={monthsWorked}
            annualRate={annualRate}
          />
        ) : null}
        <TaxBreakdown
          variant={variant}
          income={fyIncome}
          tNew={tNew}
          tOld={tOld}
          cessNew={cessNew}
          totalNew={totalNew}
          totalOld={totalOld}
          savings={savings}
          betterRegime={betterRegime}
        />
        <VariantSwitch variant={variant} onChange={setVariant} />
      </div>

      {/* Stage 2 — controls (280ms) */}
      <div
        style={{
          opacity: 0,
          animation: "navIn 0.55s cubic-bezier(0.16,1,0.3,1) 280ms both",
        }}
      >
        <TaxControls
          mode={mode}
          annualRate={annualRate}
          deductions={deductions}
          onAnnualRateChange={setAnnualRate}
          onDeductionsChange={setDeductions}
          onVelocity={() => {
            /* reserved for velocity-driven visuals */
          }}
          onTick={fireTick}
        />
        <MidYearChip
          startMonth={startMonth}
          monthLabel={monthLabel(startMonth)}
          onOpen={() => setPickerOpen(true)}
        />
      </div>

      {/* Stage 3 — secondary content (420ms) */}
      <div
        style={{
          opacity: 0,
          animation: "navIn 0.5s cubic-bezier(0.16,1,0.3,1) 420ms both",
        }}
      >
        <ShareButton visible={shareVisible} onShare={handleShare} />
        <TaxDisclaimer />
      </div>

      <MidYearPicker
        open={pickerOpen}
        startMonth={startMonth}
        onClose={() => setPickerOpen(false)}
        onSelect={(m) => setStartMonth(m)}
      />
    </div>
  );
}

function VariantSwitch({
  variant,
  onChange,
}: Readonly<{
  variant: BreakdownVariant;
  onChange: (v: BreakdownVariant) => void;
}>) {
  const options: { key: BreakdownVariant; label: string }[] = [
    { key: "receipt", label: "Receipt" },
    { key: "dual", label: "Dual" },
    { key: "slabs", label: "Slabs" },
  ];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 6,
        padding: "10px 16px 0",
      }}
    >
      {options.map((opt) => {
        const active = variant === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => {
              if (active) return;
              Haptic.light();
              onChange(opt.key);
            }}
            style={{
              padding: "5px 12px",
              borderRadius: 999,
              border: active
                ? "0.5px solid var(--border-strong)"
                : "0.5px solid var(--border)",
              background: active ? "var(--card-active)" : "transparent",
              color: active ? "var(--text-primary)" : "var(--text-muted)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.04em",
              fontFamily: "var(--font)",
              cursor: active ? "default" : "pointer",
              transition:
                "background 220ms cubic-bezier(0.16,1,0.3,1), color 220ms cubic-bezier(0.16,1,0.3,1), border-color 220ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function ShareButton({
  visible,
  onShare,
}: Readonly<{
  visible: boolean;
  onShare: () => void | Promise<void>;
}>) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "16px 16px 4px",
      }}
    >
      <button
        onClick={() => {
          void onShare();
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          borderRadius: 999,
          border: "0.5px solid var(--border)",
          background: "var(--card-bg)",
          color: "var(--text-muted)",
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "var(--font)",
          cursor: "pointer",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        <span>{visible ? "Copied" : "Share"}</span>
      </button>
    </div>
  );
}
