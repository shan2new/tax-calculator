import { formatCurrency } from './formatters';

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
  totalDeductions?: number;
  hraExemption?: number;
  section80CDeduction?: number;
  section80DDeduction?: number;
  homeLoanDeduction?: number;
}

export interface OldTaxRegimeInputs {
  section80C: number;
  section80D: number;
  hraReceived: number;
  rentPaid: number;
  isMetroCity: boolean;
  homeLoanInterest: number;
  section80E: number;
  section80G: number;
  section80EE: number;
  section80EEA: number;
  section80TTA: number;
}

export interface TaxRegimeComparison {
  newRegime: TaxResult;
  oldRegime: TaxResult;
  recommendation: 'new' | 'old';
  savings: number;
  reasonsNew: string[];
  reasonsOld: string[];
}

export interface IncomePeriod {
  id: string;
  startMonth: number; // 1-12 (April=1, March=12)
  endMonth: number; // 1-12
  grossIncome: number; // Monthly income for this period
  description?: string; // Optional description like "Job at Company A"
}

export interface MultiPeriodTaxInputs {
  incomePeriods: IncomePeriod[];
  regime: 'new' | 'old';
  oldRegimeDeductions?: OldTaxRegimeInputs;
}

export interface MultiPeriodTaxResult extends TaxResult {
  totalMonthsWorked: number;
  incomePeriods: IncomePeriod[];
  periodBreakdown: {
    period: IncomePeriod;
    income: number;
    monthsInPeriod: number;
  }[];
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

// Old Tax Regime Slabs for FY 2025-26
const OLD_TAX_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 5 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity, rate: 30 }
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
  const surchargeResult = calculateSurcharge(taxAfterRebate, taxableIncome);
  const surcharge = surchargeResult.surcharge;
  const surchargeRate = surchargeResult.rate;
  
  // Calculate Health & Education Cess (4%)
  const cess = (taxAfterRebate + surcharge) * 0.04;
  const totalTaxBeforeMarginalRelief = taxAfterRebate + surcharge + cess;
  
  // Calculate marginal relief
  const marginalRelief = calculateMarginalRelief(taxableIncome, totalTaxBeforeMarginalRelief);
  const totalTax = totalTaxBeforeMarginalRelief - marginalRelief;
  
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

export function calculateOldTaxRegime(
  grossIncome: number, 
  monthsWorked: number = 12,
  deductions: OldTaxRegimeInputs
): TaxResult {
  const effectiveIncome = (grossIncome * monthsWorked) / 12;
  
  // Standard Deduction (Old Regime has lower amount)
  const standardDeduction = 50000;
  
  // Calculate HRA Exemption
  const hraExemption = calculateHRAExemption(
    effectiveIncome,
    deductions.hraReceived,
    deductions.rentPaid,
    deductions.isMetroCity
  );
  
  // Calculate total deductions
  const section80CDeduction = Math.min(deductions.section80C, 150000);
  const section80DDeduction = Math.min(deductions.section80D, 25000); // Basic limit
  const homeLoanDeduction = Math.min(deductions.homeLoanInterest, 200000);
  
  const totalDeductions = standardDeduction + 
                         hraExemption + 
                         section80CDeduction + 
                         section80DDeduction + 
                         homeLoanDeduction +
                         deductions.section80E +
                         deductions.section80G +
                         deductions.section80EE +
                         deductions.section80EEA +
                         Math.min(deductions.section80TTA, 10000);
  
  const taxableIncome = Math.max(0, effectiveIncome - totalDeductions);
  
  // Calculate basic tax using old slabs
  let basicTax = 0;
  for (const slab of OLD_TAX_SLABS) {
    if (taxableIncome > slab.min) {
      const taxableInThisSlab = Math.min(taxableIncome, slab.max) - slab.min;
      basicTax += (taxableInThisSlab * slab.rate) / 100;
    }
  }
  
  // Rebate under section 87A (same as new regime)
  const rebate = taxableIncome <= 500000 ? Math.min(basicTax, 12500) : 0;
  const taxAfterRebate = Math.max(0, basicTax - rebate);
  
  // Surcharge calculation (same logic as new regime)
  const surchargeResultOld = calculateSurcharge(taxAfterRebate, taxableIncome);
  const surcharge = surchargeResultOld.surcharge;
  const surchargeRate = surchargeResultOld.rate;
  
  // Calculate marginal relief
  const marginalReliefOld = calculateMarginalRelief(taxableIncome, taxAfterRebate + surcharge);
  
  // Health and Education Cess
  const cess = (taxAfterRebate + surcharge - marginalReliefOld) * 0.04;
  
  const totalTax = taxAfterRebate + surcharge - marginalReliefOld + cess;
  
  return {
    effectiveIncome,
    standardDeduction,
    taxableIncome,
    basicTax,
    rebate,
    taxAfterRebate,
    surcharge,
    surchargeRate,
    marginalRelief: marginalReliefOld,
    cess,
    totalTax,
    afterTaxAnnual: effectiveIncome - totalTax,
    afterTaxMonthly: (effectiveIncome - totalTax) / monthsWorked,
    effectiveTaxRate: effectiveIncome > 0 ? (totalTax / effectiveIncome) * 100 : 0,
    slabDetails: generateOldSlabDetails(taxableIncome),
    totalDeductions,
    hraExemption,
    section80CDeduction,
    section80DDeduction,
    homeLoanDeduction
  };
}

function calculateHRAExemption(
  basicSalary: number,
  hraReceived: number,
  rentPaid: number,
  isMetroCity: boolean
): number {
  if (hraReceived === 0 || rentPaid === 0) return 0;
  
  const hraPercent = isMetroCity ? 0.5 : 0.4;
  const exemptionOptions = [
    hraReceived,
    basicSalary * hraPercent,
    Math.max(0, rentPaid - (basicSalary * 0.1))
  ];
  
  return Math.min(...exemptionOptions);
}

function generateOldSlabDetails(taxableIncome: number) {
  return OLD_TAX_SLABS.map(slab => {
    const isActive = taxableIncome > slab.min;
    const taxableInThisSlab = isActive 
      ? Math.min(taxableIncome, slab.max) - slab.min 
      : 0;
    const tax = (taxableInThisSlab * slab.rate) / 100;
    
    const maxDisplay = slab.max === Infinity ? "Above" : formatCurrency(slab.max);
    
    return {
      range: `${formatCurrency(slab.min)} - ${maxDisplay}`,
      rate: `${slab.rate}%`,
      tax,
      taxable: taxableInThisSlab,
      active: isActive && tax > 0
    };
  });
}

export function compareRegimes(
  grossIncome: number,
  monthsWorked: number,
  oldRegimeDeductions: OldTaxRegimeInputs
): TaxRegimeComparison {
  const newRegime = calculateTax(grossIncome, monthsWorked);
  const oldRegime = calculateOldTaxRegime(grossIncome, monthsWorked, oldRegimeDeductions);
  
  const savings = Math.abs(newRegime.totalTax - oldRegime.totalTax);
  const recommendation = newRegime.totalTax <= oldRegime.totalTax ? 'new' : 'old';
  
  return {
    newRegime,
    oldRegime,
    recommendation,
    savings,
    reasonsNew: [
      "No documentation required for deductions",
      "Higher standard deduction (₹75,000)",
      "Simplified tax calculation",
      "Lower tax rates in middle income brackets"
    ],
    reasonsOld: [
      "Multiple deduction options available",
      "HRA, 80C, 80D benefits",
      "Home loan interest deduction",
      "Suitable for high deduction investors"
    ]
  };
}

// Multi-period calculation functions

export function validateIncomePeriods(periods: IncomePeriod[]): {
  isValid: boolean;
  message: string;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (periods.length === 0) {
    errors.push("At least one income period is required");
  }
  
  // Check for overlapping periods
  for (let i = 0; i < periods.length; i++) {
    const period = periods[i];
    
    if (period.startMonth > period.endMonth) {
      errors.push(`Period ${i + 1}: Start month cannot be after end month`);
    }
    
    if (period.grossIncome <= 0) {
      errors.push(`Period ${i + 1}: Income must be greater than 0`);
    }
    
    // Check for overlaps with other periods
    for (let j = i + 1; j < periods.length; j++) {
      const otherPeriod = periods[j];
      if (periodsOverlap(period, otherPeriod)) {
        errors.push(`Period ${i + 1} overlaps with Period ${j + 1}`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    message: errors.length === 0 ? "Valid income periods" : "Invalid income periods",
    errors
  };
}

function periodsOverlap(period1: IncomePeriod, period2: IncomePeriod): boolean {
  return period1.startMonth <= period2.endMonth && period2.startMonth <= period1.endMonth;
}

function getMonthsInPeriod(startMonth: number, endMonth: number): number {
  if (startMonth <= endMonth) {
    return endMonth - startMonth + 1;
  } else {
    // Handle cross-year periods (e.g., March to April next year)
    return (12 - startMonth + 1) + endMonth;
  }
}

export function calculateMultiPeriodTax(
  incomePeriods: IncomePeriod[],
  regime: 'new' | 'old' = 'new',
  oldRegimeDeductions?: OldTaxRegimeInputs
): MultiPeriodTaxResult {
  const validation = validateIncomePeriods(incomePeriods);
  if (!validation.isValid) {
    throw new Error(`Invalid income periods: ${validation.errors.join(', ')}`);
  }
  
  // Calculate total income and months worked
  let totalIncome = 0;
  let totalMonthsWorked = 0;
  const periodBreakdown: MultiPeriodTaxResult['periodBreakdown'] = [];
  
  for (const period of incomePeriods) {
    const monthsInPeriod = getMonthsInPeriod(period.startMonth, period.endMonth);
    const periodIncome = period.grossIncome * monthsInPeriod;
    
    totalIncome += periodIncome;
    totalMonthsWorked += monthsInPeriod;
    
    periodBreakdown.push({
      period,
      income: periodIncome,
      monthsInPeriod
    });
  }
  
  // Convert total income to annual equivalent for tax calculation
  const annualEquivalentIncome = totalIncome;
  
  // Calculate tax based on regime
  let baseResult: TaxResult;
  if (regime === 'new') {
    baseResult = calculateTax(annualEquivalentIncome, totalMonthsWorked);
  } else {
    if (!oldRegimeDeductions) {
      throw new Error("Old regime deductions are required for old tax regime calculation");
    }
    baseResult = calculateOldTaxRegime(annualEquivalentIncome, totalMonthsWorked, oldRegimeDeductions);
  }
  
  return {
    ...baseResult,
    totalMonthsWorked,
    incomePeriods,
    periodBreakdown
  };
}

export function compareMultiPeriodRegimes(
  incomePeriods: IncomePeriod[],
  oldRegimeDeductions: OldTaxRegimeInputs
): TaxRegimeComparison {
  const newRegimeResult = calculateMultiPeriodTax(incomePeriods, 'new');
  const oldRegimeResult = calculateMultiPeriodTax(incomePeriods, 'old', oldRegimeDeductions);
  
  const savings = Math.abs(newRegimeResult.totalTax - oldRegimeResult.totalTax);
  const recommendation = newRegimeResult.totalTax <= oldRegimeResult.totalTax ? 'new' : 'old';
  
  return {
    newRegime: newRegimeResult,
    oldRegime: oldRegimeResult,
    recommendation,
    savings,
    reasonsNew: [
      "No documentation required for deductions",
      "Higher standard deduction (₹75,000)",
      "Simplified tax calculation",
      "Lower tax rates in middle income brackets"
    ],
    reasonsOld: [
      "Multiple deduction options available",
      "HRA, 80C, 80D benefits",
      "Home loan interest deduction",
      "Suitable for high deduction investors"
    ]
  };
}

// Helper function to get month name from month number (1=April, 12=March)
export function getMonthName(month: number): string {
  const months = [
    'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December', 'January', 'February', 'March'
  ];
  return months[month - 1] || 'Invalid';
}

// Helper function to create a simple income period for backward compatibility
export function createSimpleIncomePeriod(grossIncome: number, monthsWorked: number): IncomePeriod[] {
  return [{
    id: 'simple-period',
    startMonth: 1, // April
    endMonth: monthsWorked,
    grossIncome: grossIncome / monthsWorked, // Convert annual to monthly
    description: `${monthsWorked} months of work`
  }];
} 