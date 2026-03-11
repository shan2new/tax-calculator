interface TaxContentProps {
  defaultOpen?: boolean;
}

const summaryStyle: React.CSSProperties = {
  cursor: "pointer",
  listStyle: "none",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
};

const chevronStyle: React.CSSProperties = {
  flexShrink: 0,
  fontSize: 12,
  color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
  transition: "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
  display: "inline-block",
};

export function TaxContent({ defaultOpen = false }: TaxContentProps) {
  return (
    <details
      open={defaultOpen || undefined}
      style={{
        marginTop: 24,
        color: "var(--text-muted, rgba(255,255,255,0.5))",
        fontSize: 13,
        lineHeight: 1.55,
        fontWeight: 300,
      }}
    >
      <summary style={summaryStyle}>
        <h2
          style={{
            fontSize: 13,
            fontWeight: 300,
            color: "var(--text-primary, #e8e4de)",
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          Which Regime Should You Choose?
        </h2>
        <span style={chevronStyle}>▾</span>
      </summary>

      <div style={{ marginTop: 12 }}>
        <p style={{ margin: "0 0 12px 0" }}>
          The new tax regime is better for most salaried individuals in FY 2025-26 due to the higher
          Section 87A rebate (zero tax up to ₹12L) and simplified slabs. However, the old regime can
          still save more tax if you have significant deductions.
        </p>

        <h3
          style={{
            fontSize: 13,
            fontWeight: 300,
            color: "var(--text-primary, #e8e4de)",
            letterSpacing: "-0.01em",
            marginBottom: 8,
            marginTop: 20,
          }}
        >
          Choose New Regime if
        </h3>
        <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
          <li>Your income is up to ₹12.75 lakh (zero tax after standard deduction)</li>
          <li>Your total deductions (80C + 80D + HRA + other) are less than ₹3–3.5 lakh</li>
          <li>You prefer simplicity — no need to track investments for tax saving</li>
          <li>You are in a lower income bracket where the new slab rates are more favorable</li>
        </ul>

        <h3
          style={{
            fontSize: 13,
            fontWeight: 300,
            color: "var(--text-primary, #e8e4de)",
            letterSpacing: "-0.01em",
            marginBottom: 8,
            marginTop: 20,
          }}
        >
          Choose Old Regime if
        </h3>
        <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
          <li>
            You actively claim HRA, home loan interest (Section 24), 80C investments, and 80D health
            insurance
          </li>
          <li>Your total deductions exceed ₹4–5 lakh annually</li>
          <li>
            You have an ongoing home loan — the ₹2L interest deduction under Section 24(b) can be
            significant
          </li>
          <li>You receive substantial HRA as part of your salary structure</li>
        </ul>

        <p
          style={{
            marginTop: 16,
            fontSize: 12,
            padding: "10px 14px",
            borderRadius: 8,
            background: "var(--card-bg, rgba(255,255,255,0.03))",
            border: "1px solid var(--border, rgba(255,255,255,0.08))",
            color: "var(--text-muted, rgba(255,255,255,0.5))",
          }}
        >
          Use the calculator above to enter your exact income and deductions — Claros will instantly
          show you which regime saves more and by how much.
        </p>
      </div>
    </details>
  );
}
