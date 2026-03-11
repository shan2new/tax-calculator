import type { YearData } from "@/lib/calc";

const fINR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fShort = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return fINR(n);
};

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

export function LoanInsights({
  amount,
  rate,
  tenure,
  emi,
  total,
  interest,
  loanLabel,
}: LoanInsightsProps) {
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
          <div style={statLabelStyle}>EMI</div>
          <div style={statValueStyle}>{fINR(Math.round(emi))}</div>
          <div style={{ ...statLabelStyle, marginTop: 2, marginBottom: 0, fontSize: 11 }}>/mo</div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={statLabelStyle}>Total Interest</div>
          <div style={statValueStyle}>{fShort(interest)}</div>
        </div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={statLabelStyle}>Total Payment</div>
          <div style={statValueStyle}>{fShort(total)}</div>
        </div>
      </div>
      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: "1px solid var(--border, rgba(255,255,255,0.06))",
          fontSize: 12,
          color: "var(--text-muted, rgba(255,255,255,0.4))",
          fontWeight: 300,
        }}
      >
        {fShort(amount)} {loanLabel} · {rate}% · {tenure} years
      </div>
    </div>
  );
}
