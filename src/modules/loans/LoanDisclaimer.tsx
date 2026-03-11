"use client";

export function LoanDisclaimer() {
  return (
    <div style={{ padding: "20px 0 4px" }}>
      <p
        style={{
          fontSize: 9,
          color: "var(--text-muted-faint)",
          lineHeight: 1.6,
          margin: 0,
          letterSpacing: "0.01em",
        }}
      >
        EMI calculations are indicative and based on the reducing balance method. Actual EMI may
        vary based on the lender&apos;s terms, processing fees, and prepayment conditions. This tool
        does not constitute financial advice. Consult your bank or financial advisor before making
        borrowing decisions.
      </p>
    </div>
  );
}
