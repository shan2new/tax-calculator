export function LoanContent() {
  return (
    <section
      style={{
        marginTop: 32,
        paddingTop: 24,
        borderTop: "1px solid var(--border, rgba(255,255,255,0.08))",
        color: "var(--text-muted, rgba(255,255,255,0.5))",
        fontSize: 13,
        lineHeight: 1.7,
        fontWeight: 300,
      }}
    >
      <h2
        style={{
          fontSize: 14,
          fontWeight: 400,
          color: "var(--text-primary, #e8e4de)",
          letterSpacing: "-0.01em",
          marginBottom: 12,
          marginTop: 0,
        }}
      >
        How EMI is Calculated
      </h2>
      <p style={{ margin: "0 0 12px 0" }}>
        EMI (Equated Monthly Installment) uses the reducing balance method:
      </p>
      <p
        style={{
          margin: "0 0 12px 0",
          fontFamily: "monospace",
          fontSize: 12,
          background: "var(--card-bg, rgba(255,255,255,0.03))",
          padding: "10px 14px",
          borderRadius: 8,
          color: "var(--text-primary, #e8e4de)",
          overflowX: "auto",
        }}
      >
        EMI = P × r × (1+r)^n / ((1+r)^n − 1)
      </p>
      <p style={{ margin: "0 0 16px 0", fontSize: 12 }}>
        Where <strong style={{ color: "var(--text-primary, #e8e4de)", fontWeight: 400 }}>P</strong> is the principal,{" "}
        <strong style={{ color: "var(--text-primary, #e8e4de)", fontWeight: 400 }}>r</strong> is the monthly interest
        rate (annual rate ÷ 12 ÷ 100), and{" "}
        <strong style={{ color: "var(--text-primary, #e8e4de)", fontWeight: 400 }}>n</strong> is the total number of
        monthly installments.
      </p>

      <h3
        style={{
          fontSize: 13,
          fontWeight: 400,
          color: "var(--text-primary, #e8e4de)",
          letterSpacing: "-0.01em",
          marginBottom: 8,
          marginTop: 20,
        }}
      >
        Understanding the Amortization Schedule
      </h3>
      <p style={{ margin: "0 0 16px 0" }}>
        In the early years of a loan, a larger portion of your EMI goes toward interest. As you
        continue paying, the principal component gradually increases. The point where principal
        repayment exceeds interest is a significant milestone — for a 20-year home loan at 8.5%,
        this typically happens around year 12.
      </p>

      <h3
        style={{
          fontSize: 13,
          fontWeight: 400,
          color: "var(--text-primary, #e8e4de)",
          letterSpacing: "-0.01em",
          marginBottom: 8,
          marginTop: 20,
        }}
      >
        Tips to Reduce Total Interest
      </h3>
      <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
        <li>
          <strong style={{ color: "var(--text-primary, #e8e4de)", fontWeight: 400 }}>Prepay when possible</strong> —
          Even small additional payments toward principal can save lakhs over the tenure.
        </li>
        <li>
          <strong style={{ color: "var(--text-primary, #e8e4de)", fontWeight: 400 }}>Choose shorter tenure</strong> —
          A 15-year tenure vs 20 years increases your EMI but saves significantly on total interest.
        </li>
        <li>
          <strong style={{ color: "var(--text-primary, #e8e4de)", fontWeight: 400 }}>Compare lenders</strong> — A
          0.5% difference in interest rate on a ₹50 lakh loan saves approximately ₹5–6 lakh over 20
          years.
        </li>
        <li>
          <strong style={{ color: "var(--text-primary, #e8e4de)", fontWeight: 400 }}>Review periodically</strong> —
          If market rates drop, consider refinancing with a balance transfer to a lower-rate lender.
        </li>
      </ul>
    </section>
  );
}
