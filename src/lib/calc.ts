/* ══════════ Loan Types ══════════ */
export interface LoanType {
  id: string;
  label: string;
  amt: number;
  rate: number;
  yr: number;
  maxAmt: number;
  minAmt: number;
  maxYr: number;
  step: number;
  tickStep: number;
}

export const LOAN_TYPES: LoanType[] = [
  { id: "personal", label: "Personal", amt: 500000, rate: 12, yr: 5, maxAmt: 4000000, minAmt: 50000, maxYr: 7, step: 25000, tickStep: 100000 },
  { id: "car", label: "Car", amt: 1000000, rate: 9.5, yr: 7, maxAmt: 5000000, minAmt: 100000, maxYr: 10, step: 50000, tickStep: 200000 },
  { id: "home", label: "Home", amt: 5000000, rate: 8.5, yr: 20, maxAmt: 50000000, minAmt: 100000, maxYr: 30, step: 100000, tickStep: 1000000 },
  { id: "education", label: "Education", amt: 2000000, rate: 8, yr: 10, maxAmt: 10000000, minAmt: 100000, maxYr: 15, step: 100000, tickStep: 500000 },
];

/* ══════════ EMI Calculation ══════════ */
export const emiCalc = (p: number, r: number, n: number): number => {
  if (!r || !n) return 0;
  const mr = r / 1200;
  const mn = n * 12;
  return (p * mr * Math.pow(1 + mr, mn)) / (Math.pow(1 + mr, mn) - 1);
};

/* ══════════ Amortization ══════════ */
export interface YearData {
  y: number;
  p: number;
  i: number;
  bal: number;
}

export function generateYearlyAmortization(
  amount: number,
  rate: number,
  tenure: number,
  emi: number
): YearData[] {
  const mr = rate / 1200;
  const years: YearData[] = [];
  let bal = amount;
  for (let y = 1; y <= tenure; y++) {
    let yp = 0;
    let yi = 0;
    for (let m = 0; m < 12; m++) {
      if (bal <= 0) break;
      const ip = bal * mr;
      const pp = Math.min(emi - ip, bal);
      yi += ip;
      yp += pp;
      bal -= pp;
    }
    years.push({ y, p: yp, i: yi, bal: Math.max(0, bal) });
  }
  return years;
}

/* ══════════ Income Tax — FY 2025-26 ══════════ */
type Slab = [number, number, number]; // [lower, upper, rate]

const TAX_NEW: Slab[] = [
  [0, 400000, 0],
  [400000, 800000, 0.05],
  [800000, 1200000, 0.10],
  [1200000, 1600000, 0.15],
  [1600000, 2000000, 0.20],
  [2000000, 2400000, 0.25],
  [2400000, Infinity, 0.30],
];

const TAX_OLD: Slab[] = [
  [0, 250000, 0],
  [250000, 500000, 0.05],
  [500000, 1000000, 0.20],
  [1000000, Infinity, 0.30],
];

export { TAX_NEW, TAX_OLD };

const calcTaxFromSlabs = (income: number, slabs: Slab[]): number => {
  let tax = 0;
  for (const [lo, hi, rate] of slabs) {
    if (income > lo) tax += (Math.min(income, hi) - lo) * rate;
  }
  return tax;
};

export const calcTaxNew = (income: number): number => {
  let tax = calcTaxFromSlabs(income, TAX_NEW);
  // Section 87A rebate: no tax if income <= 12L (new regime FY25-26)
  if (income <= 1200000) tax = 0;
  // Marginal relief for income slightly above 12L
  if (income > 1200000 && income <= 1275000) {
    const excess = income - 1200000;
    tax = Math.min(tax, excess);
  }
  return tax;
};

export const calcTaxOld = (income: number, deductions: number): number => {
  const taxable = Math.max(0, income - deductions);
  let tax = calcTaxFromSlabs(taxable, TAX_OLD);
  // Section 87A rebate: no tax if taxable <= 5L (old regime)
  if (taxable <= 500000) tax = 0;
  return tax;
};
