import type { YearData } from "@/lib/calc";

const fINR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fShort = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(n % 1e7 === 0 ? 0 : 1)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(n % 1e5 === 0 ? 0 : 1)} L`;
  if (n >= 1e3) return `₹${(n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1)}K`;
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

export function LoanInsights({
  total,
  interest,
  emi,
}: LoanInsightsProps) {
  const ir = total > 0 ? interest / total : 0;

  return (
    <div
      style={{
        background: "var(--card-bg, rgba(255,255,255,0.03))",
        border: "1px solid var(--border, rgba(255,255,255,0.08))",
        borderRadius: 16,
        padding: "20px 24px",
      }}
    >
      {/* Hero EMI */}
      <div style={{ marginBottom: 16 }}>
        <div style={statLabel}>Monthly EMI</div>
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
          {fINR(Math.round(emi))}
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: 24,
          paddingTop: 14,
          borderTop: "1px solid var(--border, rgba(255,255,255,0.06))",
        }}
      >
        <div>
          <div style={statLabel}>Total Interest</div>
          <div style={statValue}>{fShort(interest)}</div>
        </div>
        <div>
          <div style={statLabel}>Total Payable</div>
          <div style={statValue}>{fShort(total)}</div>
        </div>
        <div>
          <div style={statLabel}>Interest Share</div>
          <div
            style={{
              ...statValue,
              color: ir > 0.5
                ? "var(--warn, rgba(255,185,165,0.85))"
                : "var(--text-primary, #e8e4de)",
            }}
          >
            {Math.round(ir * 100)}%
          </div>
        </div>
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
