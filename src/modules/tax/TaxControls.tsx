"use client";

import { ScrubValue } from "@/components/ScrubValue";
import { TAX_CONTROL_CONFIG } from "@/lib/constants";
import { fINR, fShortStep } from "@/lib/format";
import type { IncomeMode } from "@/modules/tax/TaxHeaderStrip";

const CTC_MULTIPLIER = 1.12;

export const grossToCtc = (gross: number): number =>
  Math.round(gross * CTC_MULTIPLIER);
export const ctcToGross = (ctc: number): number =>
  Math.round(ctc / CTC_MULTIPLIER);

interface TaxControlsProps {
  mode: IncomeMode;
  annualRate: number;
  deductions: number;
  onAnnualRateChange: (value: number) => void;
  onDeductionsChange: (value: number) => void;
  onVelocity: (value: number) => void;
  onTick: () => void;
}

export function TaxControls({
  mode,
  annualRate,
  deductions,
  onAnnualRateChange,
  onDeductionsChange,
  onVelocity,
  onTick,
}: Readonly<TaxControlsProps>) {
  const isCtc = mode === "ctc";
  const incomeValue = isCtc ? grossToCtc(annualRate) : annualRate;
  const incomeSublabel = isCtc
    ? "Drag · tap to type · 12-month rate, converted to gross"
    : "Drag · tap to type · 12-month rate";

  const handleIncomeChange = (value: number) => {
    onAnnualRateChange(isCtc ? ctcToGross(value) : value);
  };

  return (
    <div style={{ marginTop: 18 }}>
      <div
        style={{
          padding: "16px 20px",
          borderTop: "0.5px solid var(--border)",
        }}
      >
        <ScrubValue
          prominent
          sublabel={incomeSublabel}
          label={isCtc ? "Annual CTC" : "Gross income"}
          value={incomeValue}
          min={0}
          max={isCtc ? Math.round(50_000_000 * CTC_MULTIPLIER) : 50_000_000}
          step={TAX_CONTROL_CONFIG.income.step}
          sensitivity={TAX_CONTROL_CONFIG.income.sensitivity}
          format={(value) => fShortStep(value, TAX_CONTROL_CONFIG.income.step)}
          scrubFormat={fINR}
          onVelocity={onVelocity}
          isAmount
          onChange={handleIncomeChange}
          tickStep={TAX_CONTROL_CONFIG.income.tickStep}
          onTick={onTick}
        />
      </div>
      <div
        style={{
          padding: "16px 20px",
          borderTop: "0.5px solid var(--border)",
        }}
      >
        <ScrubValue
          prominent
          sublabel="Drag · tap to type · 80C + 80D + HRA total"
          label="Deductions"
          value={deductions}
          min={0}
          max={1_000_000}
          step={TAX_CONTROL_CONFIG.deductions.step}
          sensitivity={TAX_CONTROL_CONFIG.deductions.sensitivity}
          format={(value) =>
            fShortStep(value, TAX_CONTROL_CONFIG.deductions.step)
          }
          scrubFormat={fINR}
          onVelocity={onVelocity}
          isAmount
          onChange={onDeductionsChange}
          tickStep={TAX_CONTROL_CONFIG.deductions.tickStep}
          onTick={onTick}
        />
      </div>
    </div>
  );
}
