const fINR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fShort = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return fINR(n);
};

interface TaxInsightsProps {
  income: number;
  totalNew: number;
  totalOld: number;
  takeHome: number;
  effectiveRate: number;
  savings: number;
  betterRegime: "new" | "old" | "same";
  deductions: number;
}

const statLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 400,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
  marginBottom: 4,
};

const statValueStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 300,
  fontVariantNumeric: "tabular-nums",
  color: "var(--text-primary, #e8e4de)",
  letterSpacing: "-0.02em",
  lineHeight: 1.2,
};

export function TaxInsights({
  totalNew,
  totalOld,
  takeHome,
  savings,
  betterRegime,
}: TaxInsightsProps) {
  const regimeLabel = betterRegime === "new" ? "New Regime" : betterRegime === "old" ? "Old Regime" : "Both Regimes";
  const absSavings = Math.abs(savings);

  return (
    <div
      style={{
        background: "var(--card-bg, rgba(255,255,255,0.03))",
        border: "1px solid var(--border, rgba(255,255,255,0.08))",
        borderRadius: 16,
        padding: "20px 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={statLabelStyle}>New Regime</div>
          <div
            style={{
              ...statValueStyle,
              color:
                betterRegime === "new"
                  ? "var(--text-positive, #a0dcb4)"
                  : "var(--text-primary, #e8e4de)",
            }}
          >
            {fShort(totalNew)}
          </div>
        </div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={statLabelStyle}>Old Regime</div>
          <div
            style={{
              ...statValueStyle,
              color:
                betterRegime === "old"
                  ? "var(--text-positive, #a0dcb4)"
                  : "var(--text-primary, #e8e4de)",
            }}
          >
            {fShort(totalOld)}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: "1px solid var(--border, rgba(255,255,255,0.06))",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {betterRegime !== "same" && absSavings > 0 && (
          <div
            style={{
              fontSize: 13,
              fontWeight: 300,
              color: "var(--text-positive, #a0dcb4)",
            }}
          >
            Save {fShort(absSavings)} with {regimeLabel}
          </div>
        )}
        <div
          style={{
            fontSize: 12,
            color: "var(--text-muted, rgba(255,255,255,0.4))",
            fontWeight: 300,
          }}
        >
          Monthly take-home: {fINR(takeHome)}
        </div>
      </div>
    </div>
  );
}
