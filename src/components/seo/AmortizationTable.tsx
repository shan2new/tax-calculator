import type { YearData } from "@/lib/calc";

const fINR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const fShort = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(n % 1e7 === 0 ? 0 : 1)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(n % 1e5 === 0 ? 0 : 1)} L`;
  return fINR(n);
};

interface AmortizationTableProps {
  years: YearData[];
  crossoverIndex: number;
}

export function AmortizationTable({ years, crossoverIndex }: AmortizationTableProps) {
  return (
    <div style={{ overflowX: "auto", marginTop: 8 }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 13,
          fontFamily: "var(--font, system-ui, sans-serif)",
          color: "var(--text-primary, #e8e4de)",
        }}
        aria-label="Year-by-year amortization schedule"
      >
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border, rgba(255,255,255,0.08))" }}>
            <th
              style={{
                textAlign: "left",
                padding: "8px 8px",
                fontWeight: 400,
                fontSize: 11,
                color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Year
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "8px 8px",
                fontWeight: 400,
                fontSize: 11,
                color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Principal
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "8px 8px",
                fontWeight: 400,
                fontSize: 11,
                color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Interest
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "8px 8px",
                fontWeight: 400,
                fontSize: 11,
                color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Balance
            </th>
          </tr>
        </thead>
        <tbody>
          {years.map((row, idx) => (
            <tr
              key={row.y}
              style={{
                borderBottom: "1px solid var(--border, rgba(255,255,255,0.05))",
                background: idx === crossoverIndex ? "var(--card-bg, rgba(255,255,255,0.03))" : "transparent",
              }}
            >
              <td
                style={{
                  padding: "8px 8px",
                  color: idx === crossoverIndex ? "var(--text-positive, #a0dcb4)" : "var(--text-muted, rgba(255,255,255,0.5))",
                  fontWeight: idx === crossoverIndex ? 400 : 300,
                }}
              >
                {idx === crossoverIndex ? `Yr ${row.y} ↑` : `Yr ${row.y}`}
              </td>
              <td style={{ textAlign: "right", padding: "8px 8px", fontVariantNumeric: "tabular-nums" }}>
                {fShort(row.p)}
              </td>
              <td
                style={{
                  textAlign: "right",
                  padding: "8px 8px",
                  fontVariantNumeric: "tabular-nums",
                  color: row.i > row.p ? "var(--warn, rgba(255,180,160,0.85))" : "inherit",
                }}
              >
                {fShort(row.i)}
              </td>
              <td
                style={{
                  textAlign: "right",
                  padding: "8px 8px",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--text-muted, rgba(255,255,255,0.5))",
                }}
              >
                {row.bal > 0 ? fShort(row.bal) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {crossoverIndex >= 0 && (
        <p
          style={{
            fontSize: 11,
            color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
            marginTop: 8,
            letterSpacing: "0.01em",
          }}
        >
          ↑ Year {years[crossoverIndex]?.y} — principal repayment overtakes interest
        </p>
      )}
    </div>
  );
}
