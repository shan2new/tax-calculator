export interface TaxSlab {
  min: number;
  max: number;
  rate: number;
}

export interface SlabDetail {
  range: string;
  rate: string;
  taxable: number;
  tax: number;
  active: boolean;
}

export interface TaxCalculationResult {
  tax: number;
  slabDetails: SlabDetail[];
}

export interface SurchargeResult {
  surcharge: number;
  rate: number;
}

export interface TaxResult {
  effectiveIncome: number;
  standardDeduction: number;
  taxableIncome: number;
  basicTax: number;
  rebate: number;
  taxAfterRebate: number;
  surcharge: number;
  surchargeRate: number;
  cess: number;
  marginalRelief: number;
  totalTax: number;
  afterTaxAnnual: number;
  afterTaxMonthly: number;
  effectiveTaxRate: number;
  slabDetails: SlabDetail[];
}

// New Tax Regime Slabs for FY 2025-26
const TAX_SLABS: TaxSlab[] = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400000, max: 800000, rate: 0.05 },
  { min: 800000, max: 1200000, rate: 0.10 },
  { min: 1200000, max: 1600000, rate: 0.15 },
  { min: 1600000, max: 2000000, rate: 0.20 },
  { min: 2000000, max: 2400000, rate: 0.25 },
  { min: 2400000, max: Infinity, rate: 0.30 }
];

export function calculateBasicTax(income: number): TaxCalculationResult {
  let tax = 0;
  const slabDetails: SlabDetail[] = [];

  for (const slab of TAX_SLABS) {
    let taxableInSlab = 0;
    let taxInSlab = 0;
    let isActive = false;

    if (income > slab.min) {
      taxableInSlab = Math.min(income - slab.min, slab.max - slab.min);
      taxInSlab = taxableInSlab * slab.rate;
      tax += taxInSlab;
      isActive = taxableInSlab > 0;
    }

    slabDetails.push({
      range: `₹${(slab.min / 100000).toFixed(1)}L - ${
        slab.max === Infinity ? '∞' : '₹' + (slab.max / 100000).toFixed(1) + 'L'
      }`,
      rate: `${(slab.rate * 100).toFixed(0)}%`,
      taxable: taxableInSlab,
      tax: taxInSlab,
      active: isActive
    });
  }

  return { tax, slabDetails };
}

export function calculateSurcharge(income: number, basicTax: number): SurchargeResult {
  let surcharge = 0;
  let surchargeRate = 0;

  if (income > 5000000 && income <= 10000000) {
    surcharge = basicTax * 0.10;
    surchargeRate = 10;
  } else if (income > 10000000 && income <= 20000000) {
    surcharge = basicTax * 0.15;
    surchargeRate = 15;
  } else if (income > 20000000) {
    surcharge = basicTax * 0.25;
    surchargeRate = 25;
  }

  return { surcharge, rate: surchargeRate };
}

export function calculateMarginalRelief(income: number, totalTaxWithSurcharge: number): number {
  let marginalRelief = 0;
  const thresholds = [5000000, 10000000, 20000000];
  const surchargeRates = [0, 0.10, 0.15, 0.25];

  for (let i = 0; i < thresholds.length; i++) {
    if (income > thresholds[i] && income <= thresholds[i] + 500000) {
      const taxCalc = calculateBasicTax(thresholds[i]);
      const taxAtThreshold = taxCalc.tax;
      let surchargeAtThreshold = 0;

      if (i > 0) {
        surchargeAtThreshold = taxAtThreshold * surchargeRates[i];
      }

      const cessAtThreshold = (taxAtThreshold + surchargeAtThreshold) * 0.04;
      const totalTaxAtThreshold = taxAtThreshold + surchargeAtThreshold + cessAtThreshold;

      const incomeAboveThreshold = income - thresholds[i];
      const netIncomeWithCurrentTax = income - totalTaxWithSurcharge;
      const netIncomeAtThreshold = thresholds[i] - totalTaxAtThreshold;

      if (netIncomeWithCurrentTax < netIncomeAtThreshold) {
        marginalRelief = totalTaxWithSurcharge - (totalTaxAtThreshold + incomeAboveThreshold);
        break;
      }
    }
  }

  return Math.max(0, marginalRelief);
}

export function calculateTax(grossIncome: number, monthsWorked: number = 12): TaxResult {
  // Calculate effective income based on months worked
  const effectiveIncome = (grossIncome / 12) * monthsWorked;
  
  // Standard deduction of ₹75,000 or actual income, whichever is lower
  const standardDeduction = Math.min(75000, effectiveIncome);
  const taxableIncome = Math.max(0, effectiveIncome - standardDeduction);
  
  // Calculate basic tax
  const taxCalc = calculateBasicTax(taxableIncome);
  const basicTax = taxCalc.tax;
  const slabDetails = taxCalc.slabDetails;
  
  // Calculate rebate under Section 87A
  let rebate = 0;
  if (taxableIncome <= 1200000 && basicTax <= 60000) {
    rebate = basicTax;
  }
  
  const taxAfterRebate = basicTax - rebate;
  
  // Calculate surcharge
  const surchargeCalc = calculateSurcharge(taxableIncome, taxAfterRebate);
  const surcharge = surchargeCalc.surcharge;
  const surchargeRate = surchargeCalc.rate;
  
  // Calculate total before cess
  const totalBeforeCess = taxAfterRebate + surcharge;
  
  // Calculate Health & Education Cess (4%)
  const cess = totalBeforeCess * 0.04;
  const totalTaxBeforeRelief = totalBeforeCess + cess;
  
  // Calculate marginal relief
  const marginalRelief = calculateMarginalRelief(taxableIncome, totalTaxBeforeRelief);
  const totalTax = totalTaxBeforeRelief - marginalRelief;
  
  // Calculate after-tax amounts
  const afterTaxAnnual = effectiveIncome - totalTax;
  const afterTaxMonthly = afterTaxAnnual / monthsWorked;
  
  // Calculate effective tax rate
  const effectiveTaxRate = effectiveIncome > 0 ? (totalTax / effectiveIncome * 100) : 0;
  
  return {
    effectiveIncome,
    standardDeduction,
    taxableIncome,
    basicTax,
    rebate,
    taxAfterRebate,
    surcharge,
    surchargeRate,
    cess,
    marginalRelief,
    totalTax,
    afterTaxAnnual,
    afterTaxMonthly,
    effectiveTaxRate,
    slabDetails
  };
} 