"use client";

import { ScrubValue } from "@/components/ScrubValue";
import { TAX_CONTROL_CONFIG } from "@/lib/constants";
import { fINR, fShortStep } from "@/lib/format";

interface TaxControlsProps {
  income: number;
  deductions: number;
  onIncomeChange: (value: number) => void;
  onDeductionsChange: (value: number) => void;
  onVelocity: (value: number) => void;
  onTick: () => void;
}

export function TaxControls({
  income,
  deductions,
  onIncomeChange,
  onDeductionsChange,
  onVelocity,
  onTick,
}: Readonly<TaxControlsProps>) {
  return (
    <>
      <ScrubValue
        label="Gross income"
        value={income}
        min={0}
        max={50000000}
        step={TAX_CONTROL_CONFIG.income.step}
        sensitivity={TAX_CONTROL_CONFIG.income.sensitivity}
        format={(value) => fShortStep(value, TAX_CONTROL_CONFIG.income.step)}
        scrubFormat={fINR}
        onVelocity={onVelocity}
        isAmount
        onChange={onIncomeChange}
        tickStep={TAX_CONTROL_CONFIG.income.tickStep}
        onTick={onTick}
      />
      <ScrubValue
        label="Deductions (80C+D+HRA)"
        value={deductions}
        min={0}
        max={1000000}
        step={TAX_CONTROL_CONFIG.deductions.step}
        sensitivity={TAX_CONTROL_CONFIG.deductions.sensitivity}
        format={(value) => fShortStep(value, TAX_CONTROL_CONFIG.deductions.step)}
        scrubFormat={fINR}
        onVelocity={onVelocity}
        isAmount
        onChange={onDeductionsChange}
        tickStep={TAX_CONTROL_CONFIG.deductions.tickStep}
        onTick={onTick}
      />
    </>
  );
}
