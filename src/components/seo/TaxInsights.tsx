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

export function TaxInsights({
  income,
  totalNew,
  totalOld,
  takeHome,
  effectiveRate,
  savings,
  betterRegime,
  deductions,
}: TaxInsightsProps) {
  const regimeLabel = betterRegime === "new" ? "New regime" : betterRegime === "old" ? "Old regime" : "Both regimes";
  const absSavings = Math.abs(savings);

  const breakEvenDeductions = income > 0 ? Math.max(0, totalNew - totalOld + deductions) : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "20px 0",
        borderTop: "1px solid var(--border, rgba(255,255,255,0.08))",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 400,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
          marginBottom: 4,
        }}
      >
        Key Insights
      </div>

      <InsightItem
        label="Monthly take-home"
        value={fINR(takeHome)}
        sub={`After ${betterRegime === "same" ? "tax" : `tax under ${regimeLabel.toLowerCase()}`} on ₹${(income / 1e5).toFixed(income % 1e5 === 0 ? 0 : 1)}L annual income`}
        positive={betterRegime !== "same"}
      />
      <InsightItem
        label="Effective tax rate"
        value={`${effectiveRate.toFixed(1)}%`}
        sub={`You pay ${fShort(Math.min(totalNew, totalOld))} in total tax (including 4% cess)`}
      />
      {betterRegime !== "same" && absSavings > 0 && (
        <InsightItem
          label={`${regimeLabel} saves`}
          value={fShort(absSavings)}
          sub={`${betterRegime === "new" ? "New" : "Old"} regime is better for this income and deduction level`}
          positive
        />
      )}
      {betterRegime === "new" && breakEvenDeductions > 0 && (
        <InsightItem
          label="Old regime break-even"
          value={fShort(breakEvenDeductions)}
          sub={`You would need total deductions above ${fShort(breakEvenDeductions)} for the old regime to be beneficial`}
        />
      )}
    </div>
  );
}

function InsightItem({
  label,
  value,
  sub,
  warn,
  positive,
}: {
  label: string;
  value: string;
  sub: string;
  warn?: boolean;
  positive?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "var(--text-muted, rgba(255,255,255,0.5))",
            fontWeight: 300,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 300,
            fontVariantNumeric: "tabular-nums",
            color: warn
              ? "var(--warn, rgba(255,180,160,0.85))"
              : positive
                ? "var(--text-positive, #a0dcb4)"
                : "var(--text-primary, #e8e4de)",
          }}
        >
          {value}
        </span>
      </div>
      <p
        style={{
          fontSize: 11,
          color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {sub}
      </p>
    </div>
  );
}
