import {
  calcTaxNew,
  calcTaxOld,
  emiCalc,
  generateYearlyAmortization,
} from "@/lib/calc";

describe("calc", () => {
  it("calculates EMI for a known loan", () => {
    expect(emiCalc(1_000_000, 12, 1)).toBeCloseTo(88_848.79, 2);
  });

  it("returns zero EMI when rate or tenure is zero", () => {
    expect(emiCalc(1_000_000, 0, 10)).toBe(0);
    expect(emiCalc(1_000_000, 10, 0)).toBe(0);
  });

  it("builds a yearly amortization schedule that settles the balance", () => {
    const emi = emiCalc(500_000, 10, 2);
    const years = generateYearlyAmortization(500_000, 10, 2, emi);

    expect(years).toHaveLength(2);
    expect(years[0].bal).toBeGreaterThan(0);
    expect(years.at(-1)?.bal ?? 1).toBeCloseTo(0, 0);
  });

  it("applies new regime rebate at 12L", () => {
    expect(calcTaxNew(1_200_000)).toBe(0);
  });

  it("calculates new regime tax above rebate threshold", () => {
    expect(calcTaxNew(1_500_000)).toBe(105_000);
  });

  it("calculates old regime tax after deductions", () => {
    expect(calcTaxOld(1_000_000, 200_000)).toBe(72_500);
  });
});
