"use client";

import { ScrubValue } from "@/components/ScrubValue";
import { LOAN_CONTROL_CONFIG } from "@/lib/constants";
import type { LoanType } from "@/lib/calc";
import { fINR, fShortStep } from "@/lib/format";

interface LoanControlsProps {
  loanType: LoanType;
  amount: number;
  rate: number;
  tenure: number;
  onAmountChange: (value: number) => void;
  onRateChange: (value: number) => void;
  onTenureChange: (value: number) => void;
  onVelocity: (value: number) => void;
  onTick: () => void;
}

export function LoanControls({
  loanType,
  amount,
  rate,
  tenure,
  onAmountChange,
  onRateChange,
  onTenureChange,
  onVelocity,
  onTick,
}: Readonly<LoanControlsProps>) {
  return (
    <div style={{ marginTop: 4 }}>
      <ScrubValue
        label="Loan amount"
        value={amount}
        min={loanType.minAmt}
        max={loanType.maxAmt}
        step={loanType.step}
        sensitivity={LOAN_CONTROL_CONFIG.amount.sensitivity}
        format={(value) => fShortStep(value, loanType.step)}
        scrubFormat={fINR}
        onVelocity={onVelocity}
        isAmount
        onChange={onAmountChange}
        tickStep={loanType.tickStep}
        onTick={onTick}
      />
      <ScrubValue
        label="Interest rate"
        value={rate}
        min={4}
        max={20}
        step={0.1}
        sensitivity={LOAN_CONTROL_CONFIG.rate.sensitivity}
        format={(value) => `${value.toFixed(1)}%`}
        onVelocity={onVelocity}
        parseInput={(value) => Number.parseFloat(value.replaceAll("%", ""))}
        onChange={onRateChange}
        tickStep={LOAN_CONTROL_CONFIG.rate.tickStep}
        onTick={onTick}
      />
      <ScrubValue
        label="Tenure"
        value={tenure}
        min={1}
        max={loanType.maxYr}
        step={1}
        sensitivity={LOAN_CONTROL_CONFIG.tenure.sensitivity}
        format={(value) => `${value} ${value === 1 ? "yr" : "yrs"}`}
        onVelocity={onVelocity}
        parseInput={(value) => Number.parseInt(value, 10)}
        onChange={onTenureChange}
        tickStep={LOAN_CONTROL_CONFIG.tenure.tickStep}
        onTick={onTick}
      />
    </div>
  );
}
