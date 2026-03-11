"use client";

export function TaxDisclaimer() {
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
        Tax calculations are based on published Income Tax slabs for FY 2025–26 and are indicative
        only. Standard deduction of ₹75,000 under new regime and HRA/LTA exemptions are not
        included. Surcharge for income above ₹50L is not applied. This tool does not constitute tax
        advice. Consult a chartered accountant or tax professional for accurate filing.
      </p>
    </div>
  );
}
