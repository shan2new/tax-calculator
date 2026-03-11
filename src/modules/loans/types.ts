export interface PinnedLoanSnapshot {
  amount: number;
  rate: number;
  tenure: number;
  emi: number;
  total: number;
  interest: number;
  ir: number;
}

export interface LoanDelta {
  emi: number;
  total: number;
  interest: number;
}
