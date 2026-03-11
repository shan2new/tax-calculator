const fINR = (n: number) =>
  n === Infinity ? "Above" : `₹${n.toLocaleString("en-IN")}`;

const NEW_SLABS = [
  { lower: 0, upper: 400000, rate: "Nil" },
  { lower: 400000, upper: 800000, rate: "5%" },
  { lower: 800000, upper: 1200000, rate: "10%" },
  { lower: 1200000, upper: 1600000, rate: "15%" },
  { lower: 1600000, upper: 2000000, rate: "20%" },
  { lower: 2000000, upper: 2400000, rate: "25%" },
  { lower: 2400000, upper: Infinity, rate: "30%" },
];

const OLD_SLABS = [
  { lower: 0, upper: 250000, rate: "Nil" },
  { lower: 250000, upper: 500000, rate: "5%" },
  { lower: 500000, upper: 1000000, rate: "20%" },
  { lower: 1000000, upper: Infinity, rate: "30%" },
];

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 12,
  fontFamily: "var(--font, system-ui, sans-serif)",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 8px",
  fontWeight: 400,
  fontSize: 10,
  color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  borderBottom: "1px solid var(--border, rgba(255,255,255,0.08))",
};

const tdStyle: React.CSSProperties = {
  padding: "8px 8px",
  borderBottom: "1px solid var(--border, rgba(255,255,255,0.05))",
  color: "var(--text-muted, rgba(255,255,255,0.5))",
  fontWeight: 300,
};

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

interface TaxSlabTableProps {
  defaultOpen?: boolean;
}

export function TaxSlabTable({ defaultOpen = false }: TaxSlabTableProps) {
  return (
    <details
      open={defaultOpen || undefined}
      style={{
        marginTop: 24,
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
          Income Tax Slabs for FY 2025-26
        </h2>
        <span style={chevronStyle}>▾</span>
      </summary>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 12 }}>
        <p
          style={{
            fontSize: 11,
            color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
            margin: 0,
          }}
        >
          AY 2026-27
        </p>

        <div>
          <h3
            style={{
              fontSize: 12,
              fontWeight: 300,
              color: "var(--text-muted, rgba(255,255,255,0.5))",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              margin: "0 0 8px 0",
            }}
          >
            New Tax Regime (Default)
          </h3>
          <table style={tableStyle} aria-label="New tax regime slabs FY 2025-26">
            <thead>
              <tr>
                <th style={thStyle}>Income Slab</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Tax Rate</th>
              </tr>
            </thead>
            <tbody>
              {NEW_SLABS.map((slab, i) => (
                <tr key={i}>
                  <td style={tdStyle}>
                    {slab.upper === Infinity
                      ? `Above ${fINR(slab.lower)}`
                      : `${fINR(slab.lower)} – ${fINR(slab.upper)}`}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      color:
                        slab.rate === "Nil"
                          ? "var(--text-positive, #a0dcb4)"
                          : "var(--text-muted, rgba(255,255,255,0.5))",
                    }}
                  >
                    {slab.rate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p
            style={{
              fontSize: 11,
              color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
              marginTop: 8,
              lineHeight: 1.6,
            }}
          >
            Standard deduction: ₹75,000 · Section 87A rebate: zero tax if income ≤ ₹12L (₹12.75L with standard deduction)
          </p>
        </div>

        <div>
          <h3
            style={{
              fontSize: 12,
              fontWeight: 300,
              color: "var(--text-muted, rgba(255,255,255,0.5))",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              margin: "0 0 8px 0",
            }}
          >
            Old Tax Regime
          </h3>
          <table style={tableStyle} aria-label="Old tax regime slabs FY 2025-26">
            <thead>
              <tr>
                <th style={thStyle}>Income Slab</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Tax Rate</th>
              </tr>
            </thead>
            <tbody>
              {OLD_SLABS.map((slab, i) => (
                <tr key={i}>
                  <td style={tdStyle}>
                    {slab.upper === Infinity
                      ? `Above ${fINR(slab.lower)}`
                      : `${fINR(slab.lower)} – ${fINR(slab.upper)}`}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      color:
                        slab.rate === "Nil"
                          ? "var(--text-positive, #a0dcb4)"
                          : "var(--text-muted, rgba(255,255,255,0.5))",
                    }}
                  >
                    {slab.rate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p
            style={{
              fontSize: 11,
              color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
              marginTop: 8,
              lineHeight: 1.6,
            }}
          >
            Standard deduction: ₹50,000 · Eligible for 80C (₹1.5L), 80D, HRA, LTA, Section 24(b), NPS 80CCD(1B)
          </p>
        </div>
      </div>
    </details>
  );
}
