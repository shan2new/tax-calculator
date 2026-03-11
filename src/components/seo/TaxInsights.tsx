const fINR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fShort = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(n % 1e7 === 0 ? 0 : 1)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(n % 1e5 === 0 ? 0 : 1)} L`;
  if (n >= 1e3) return `₹${(n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1)}K`;
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

export function TaxInsights({
  totalNew,
  totalOld,
  takeHome,
  effectiveRate,
  savings,
  betterRegime,
}: TaxInsightsProps) {
  const regimeLabel = betterRegime === "new" ? "New" : betterRegime === "old" ? "Old" : "Both";
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
      {/* Hero: Monthly take-home */}
      <div style={{ marginBottom: 16 }}>
        <div style={statLabel}>Monthly Take-Home</div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 200,
            fontVariantNumeric: "tabular-nums",
            color: "var(--text-primary, #e8e4de)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {fINR(takeHome)}
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 300,
            color: "var(--text-muted, rgba(255,255,255,0.4))",
            marginTop: 6,
          }}
        >
          {effectiveRate.toFixed(1)}% effective tax rate
        </div>
      </div>

      {/* Regime comparison */}
      <div
        style={{
          display: "flex",
          gap: 24,
          paddingTop: 14,
          borderTop: "1px solid var(--border, rgba(255,255,255,0.06))",
        }}
      >
        <div>
          <div style={statLabel}>New Regime</div>
          <div
            style={{
              ...statValue,
              color: betterRegime === "new"
                ? "var(--text-positive, #a0dcb4)"
                : "var(--text-primary, #e8e4de)",
            }}
          >
            {fShort(totalNew)}
          </div>
        </div>
        <div>
          <div style={statLabel}>Old Regime</div>
          <div
            style={{
              ...statValue,
              color: betterRegime === "old"
                ? "var(--text-positive, #a0dcb4)"
                : "var(--text-primary, #e8e4de)",
            }}
          >
            {fShort(totalOld)}
          </div>
        </div>
        {betterRegime !== "same" && absSavings > 0 && (
          <div>
            <div style={statLabel}>You Save</div>
            <div style={{ ...statValue, color: "var(--text-positive, #a0dcb4)" }}>
              {fShort(absSavings)}
              <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.6 }}> ({regimeLabel})</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const statLabel: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 400,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
  marginBottom: 6,
};

const statValue: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 300,
  fontVariantNumeric: "tabular-nums",
  color: "var(--text-primary, #e8e4de)",
  letterSpacing: "-0.02em",
  lineHeight: 1.3,
};
