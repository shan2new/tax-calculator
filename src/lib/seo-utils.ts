export interface LoanConfig {
  slug: string;
  label: string;
  typeIndex: number;
  amounts: string[];
  rates: string[];
  tenures: string[];
}

export const LOAN_CONFIGS: LoanConfig[] = [
  {
    slug: 'home-loan',
    label: 'Home Loan',
    typeIndex: 2,
    amounts: ['10-lakh', '20-lakh', '25-lakh', '30-lakh', '40-lakh', '50-lakh', '60-lakh', '75-lakh', '1-crore'],
    rates: ['7.5', '8', '8.5', '9', '9.5'],
    tenures: ['10', '15', '20', '25', '30'],
  },
  {
    slug: 'car-loan',
    label: 'Car Loan',
    typeIndex: 1,
    amounts: ['3-lakh', '5-lakh', '8-lakh', '10-lakh', '15-lakh', '20-lakh'],
    rates: ['8', '8.5', '9', '9.5', '10'],
    tenures: ['3', '5', '7'],
  },
  {
    slug: 'personal-loan',
    label: 'Personal Loan',
    typeIndex: 0,
    amounts: ['1-lakh', '2-lakh', '3-lakh', '5-lakh', '10-lakh'],
    rates: ['10', '11', '12', '14', '16'],
    tenures: ['1', '2', '3', '5'],
  },
  {
    slug: 'education-loan',
    label: 'Education Loan',
    typeIndex: 3,
    amounts: ['5-lakh', '10-lakh', '15-lakh', '20-lakh', '30-lakh', '50-lakh'],
    rates: ['8', '8.5', '9', '9.5', '10'],
    tenures: ['5', '7', '10', '15'],
  },
];

export const TAX_INCOMES = [
  '5-lpa', '6-lpa', '7-lpa', '7.5-lpa', '8-lpa', '9-lpa', '10-lpa',
  '12-lpa', '15-lpa', '18-lpa', '20-lpa', '22-lpa', '25-lpa',
  '30-lpa', '35-lpa', '40-lpa', '50-lpa', '60-lpa', '75-lpa', '1-crore',
];

export function parseAmountSlug(slug: string): number {
  const s = slug.toLowerCase();
  if (s.endsWith('-crore')) {
    const n = Number.parseFloat(s.replace('-crore', ''));
    return n * 1e7;
  }
  if (s.endsWith('-lakh')) {
    const n = Number.parseFloat(s.replace('-lakh', ''));
    return n * 1e5;
  }
  return Number.parseFloat(s) || 0;
}

export function parseRateSlug(slug: string): number {
  return Number.parseFloat(slug.replace('-percent', '')) || 0;
}

export function parseTenureSlug(slug: string): number {
  return Number.parseInt(slug.replace('-years', ''), 10) || 0;
}

export function parseLoanTypeSlug(slug: string): LoanConfig | undefined {
  return LOAN_CONFIGS.find((c) => c.slug === slug);
}

export function parseIncomeSlug(slug: string): number {
  const s = slug.toLowerCase();
  if (s === '1-crore') return 1e7;
  if (s.endsWith('-lpa')) {
    const n = Number.parseFloat(s.replace('-lpa', ''));
    return n * 1e5;
  }
  if (s.endsWith('-crore')) {
    const n = Number.parseFloat(s.replace('-crore', ''));
    return n * 1e7;
  }
  return Number.parseFloat(s) * 1e5 || 0;
}

export function formatAmountForTitle(n: number): string {
  if (n >= 1e7) {
    return `${n / 1e7} Crore`;
  }
  if (n >= 1e5) {
    return `${n / 1e5} Lakh`;
  }
  return `₹${n.toLocaleString('en-IN')}`;
}

export function formatIncomeForTitle(slug: string): string {
  const s = slug.toLowerCase();
  if (s === '1-crore') return '₹1 Crore';
  if (s.endsWith('-lpa')) {
    const n = Number.parseFloat(s.replace('-lpa', ''));
    return `${n} LPA`;
  }
  return slug;
}

export function formatFyYear(slug: string): string {
  return slug.replace('fy-', 'FY ');
}
