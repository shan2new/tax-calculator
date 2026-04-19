"use client";

import { TAX_NEW } from "@/lib/calc";
import { fINR, fShort } from "@/lib/format";

export type BreakdownVariant = "receipt" | "dual" | "slabs";

interface TaxBreakdownProps {
  variant: BreakdownVariant;
  income: number;
  tNew: number;
  tOld: number;
  cessNew: number;
  totalNew: number;
  totalOld: number;
  savings: number;
  betterRegime: "new" | "old" | "same";
}

const cardStyle: React.CSSProperties = {
  margin: "8px 16px 0",
  borderRadius: 16,
  border: "0.5px solid var(--border)",
  background: "var(--surface-raised)",
  padding: "16px 18px",
  boxShadow: "var(--card-shadow)",
};

const easing = "cubic-bezier(0.16,1,0.3,1)";

export function TaxBreakdown(props: Readonly<TaxBreakdownProps>) {
  if (props.variant === "receipt") return <ReceiptVariant {...props} />;
  if (props.variant === "dual") return <DualVariant {...props} />;
  return <SlabsVariant {...props} />;
}

function ReceiptVariant({
  income,
  tNew,
  cessNew,
  totalNew,
}: Readonly<TaxBreakdownProps>) {
  const takeHome = Math.max(0, income - totalNew);
  const effRate = income > 0 ? (totalNew / income) * 100 : 0;

  const rows = [
    {
      label: "Gross income",
      value: fINR(income),
      width: 100,
      color: "var(--text-secondary)",
      bold: false,
      sign: "",
    },
    {
      label: "Income tax",
      value: fINR(tNew),
      width: income > 0 ? (tNew / income) * 100 : 0,
      color: "var(--warn)",
      bold: false,
      sign: "−",
    },
    {
      label: "Health & edu cess (4%)",
      value: fINR(cessNew),
      width: income > 0 ? (cessNew / income) * 100 : 0,
      color: "var(--warn)",
      bold: false,
      sign: "−",
    },
    {
      label: "Annual take-home",
      value: fINR(takeHome),
      width: income > 0 ? (takeHome / income) * 100 : 0,
      color: "var(--text-primary)",
      bold: true,
      sign: "",
    },
  ];

  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.16em",
            color: "var(--text-muted)",
            textTransform: "uppercase",
          }}
        >
          Your rupee
        </span>
        <span
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {effRate.toFixed(1)}% → tax
        </span>
      </div>
      {rows.map((row, i) => (
        <div
          key={row.label}
          style={{ marginBottom: i === rows.length - 1 ? 0 : 11 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              fontSize: 13,
              fontVariantNumeric: "tabular-nums",
              color: row.color,
              fontWeight: row.bold ? 600 : 400,
            }}
          >
            <span>{row.label}</span>
            <span>
              {row.sign}
              {row.value}
            </span>
          </div>
          <div
            style={{
              marginTop: 6,
              height: 3,
              borderRadius: 999,
              background: "var(--bar-bg)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.max(0, Math.min(100, row.width))}%`,
                background: row.bold ? "var(--bar-fill)" : row.color,
                borderRadius: 999,
                transition: `width 240ms ${easing}`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DualVariant({
  income,
  totalNew,
  totalOld,
  savings,
  betterRegime,
}: Readonly<TaxBreakdownProps>) {
  const effNew = income > 0 ? (totalNew / income) * 100 : 0;
  const effOld = income > 0 ? (totalOld / income) * 100 : 0;
  const cells: {
    key: "new" | "old";
    label: string;
    total: number;
    eff: number;
    best: boolean;
  }[] = [
    {
      key: "new",
      label: "New regime",
      total: totalNew,
      eff: effNew,
      best: betterRegime === "new" || betterRegime === "same",
    },
    {
      key: "old",
      label: "Old regime",
      total: totalOld,
      eff: effOld,
      best: betterRegime === "old",
    },
  ];

  const newFlex = Math.max(totalNew, 1);
  const oldFlex = Math.max(totalOld, 1);

  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {cells.map((c) => (
          <div
            key={c.key}
            style={{
              padding: "12px 12px 14px",
              borderRadius: 12,
              background: c.best ? "var(--card-active)" : "transparent",
              border: c.best
                ? "1px solid var(--border-accent)"
                : "0.5px solid var(--border)",
              transition: `background 260ms ${easing}, border-color 260ms ${easing}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              {c.best ? (
                <span
                  aria-hidden
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: "var(--accent)",
                    boxShadow: "0 0 8px var(--accent-glow)",
                    display: "inline-block",
                  }}
                />
              ) : null}
              <span>{c.label}</span>
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 300,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {fShort(c.total)}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 11,
                color: "var(--text-muted)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {c.eff.toFixed(1)}% effective
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 2,
          height: 6,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: newFlex,
            background:
              betterRegime === "new" || betterRegime === "same"
                ? "var(--bar-fill)"
                : "var(--bar-bg)",
            transition: `flex 300ms ${easing}, background 300ms ${easing}`,
          }}
        />
        <div
          style={{
            flex: oldFlex,
            background:
              betterRegime === "old" ? "var(--bar-fill)" : "var(--bar-bg)",
            transition: `flex 300ms ${easing}, background 300ms ${easing}`,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 12,
          color: "var(--text-muted)",
          fontVariantNumeric: "tabular-nums",
          textAlign: "center",
        }}
      >
        {betterRegime === "same"
          ? "Both regimes equal"
          : `${betterRegime === "new" ? "New" : "Old"} saves ${fShort(Math.abs(savings))} per year`}
      </div>
    </div>
  );
}

function SlabsVariant({ income, tNew, cessNew }: Readonly<TaxBreakdownProps>) {
  if (income <= 1200000) {
    return (
      <div
        style={{
          ...cardStyle,
          padding: "24px 18px",
          textAlign: "center",
          fontSize: 12,
          color: "var(--text-muted)",
        }}
      >
        <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
          Under ₹12L
        </span>{" "}
        · 87A rebate — no tax
      </div>
    );
  }

  const active = TAX_NEW.filter(([lower]) => income > lower).map(
    ([lower, upper, rate]) => {
      const hi = upper === Infinity ? income : upper;
      const taxable = Math.min(income, hi) - lower;
      const contrib = taxable * rate;
      return { lower, upper, rate, taxable, contrib };
    },
  );
  const maxContrib = Math.max(...active.map((s) => s.contrib), 1);

  const rangeLabel = (lower: number, upper: number) => {
    const loFmt = lower === 0 ? "₹0" : fShort(lower);
    const hiFmt = upper === Infinity ? "∞" : fShort(upper);
    return `${loFmt} – ${hiFmt}`;
  };

  return (
    <div style={cardStyle}>
      {active.map((s) => (
        <div key={`${s.lower}-${s.upper}`} style={{ marginBottom: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              fontSize: 12,
              fontVariantNumeric: "tabular-nums",
              color: "var(--text-secondary)",
            }}
          >
            <span>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                {Math.round(s.rate * 100)}%
              </span>{" "}
              <span style={{ color: "var(--text-muted)" }}>
                | {rangeLabel(s.lower, s.upper)}
              </span>
            </span>
            <span style={{ color: "var(--text-primary)" }}>
              {fShort(s.contrib)}
            </span>
          </div>
          <div
            style={{
              marginTop: 5,
              height: 5,
              borderRadius: 999,
              background: "var(--bar-bg)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(s.contrib / maxContrib) * 100}%`,
                background:
                  "linear-gradient(90deg, var(--fill-active), var(--bar-fill))",
                borderRadius: 999,
                transition: `width 240ms ${easing}`,
              }}
            />
          </div>
        </div>
      ))}
      <div
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: "0.5px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: "var(--text-muted)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span>+ Health & edu cess 4%</span>
        <span style={{ color: "var(--text-secondary)" }}>{fINR(cessNew)}</span>
      </div>
      <div
        style={{
          marginTop: 6,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--text-primary)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span>Total tax</span>
        <span>{fINR(tNew + cessNew)}</span>
      </div>
    </div>
  );
}
