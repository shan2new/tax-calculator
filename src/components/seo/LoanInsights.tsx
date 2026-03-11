import type { YearData } from "@/lib/calc";

const fINR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fShort = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return fINR(n);
};
const pct = (n: number) => `${Math.round(n * 100)}%`;

interface LoanInsightsProps {
  amount: number;
  rate: number;
  tenure: number;
  emi: number;
  total: number;
  interest: number;
  years: YearData[];
  crossoverIndex: number;
  loanLabel: string;
}

export function LoanInsights({
  amount,
  rate,
  tenure,
  emi,
  total,
  interest,
  years,
  crossoverIndex,
  loanLabel,
}: LoanInsightsProps) {
  const interestPct = total > 0 ? interest / total : 0;
  const crossoverYear = crossoverIndex >= 0 ? years[crossoverIndex]?.y : null;

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
        label="Monthly EMI"
        value={fINR(Math.round(emi))}
        sub={`for ${tenure} years on ${fShort(amount)} ${loanLabel.toLowerCase()} at ${rate}%`}
      />
      <InsightItem
        label="Total interest"
        value={fShort(interest)}
        sub={`${pct(interestPct)} of total payments — you pay ${fShort(total)} overall`}
        warn={interestPct > 0.5}
      />
      {crossoverYear && (
        <InsightItem
          label="Principal overtakes interest"
          value={`Year ${crossoverYear}`}
          sub="After this year, more of each EMI goes toward principal than interest"
          positive
        />
      )}
      <InsightItem
        label="Prepayment tip"
        value="Save significantly"
        sub={`Paying ${fINR(Math.round(emi * 0.1))} extra/month could save ${fShort(interest * 0.15)}+ in interest over the tenure`}
      />
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
