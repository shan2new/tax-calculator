import { ImageResponse } from "next/og";
import { parseIncomeSlug, formatIncomeForTitle, formatFyYear } from "@/lib/seo-utils";
import { calcTaxNew, calcTaxOld } from "@/lib/calc";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface PageParams {
  fyYear: string;
  income: string;
}

export default async function Image({ params }: { params: Promise<PageParams> }) {
  const p = await params;
  const income = parseIncomeSlug(p.income);
  const fy = formatFyYear(p.fyYear);
  const incomeLabel = formatIncomeForTitle(p.income);

  const taxNew = income ? calcTaxNew(income) : 0;
  const taxOld = income ? calcTaxOld(income, 200000) : 0;
  const totalNew = taxNew * 1.04;
  const totalOld = taxOld * 1.04;
  const savings = totalOld - totalNew;
  const bestTax = Math.min(totalNew, totalOld);
  const takeHome = income > 0 ? Math.round((income - bestTax) / 12) : 0;
  const betterRegime = savings > 0 ? "New regime" : savings < 0 ? "Old regime" : null;
  const absSavings = Math.abs(savings);
  const savingsStr =
    absSavings >= 1e5
      ? `₹${(absSavings / 1e5).toFixed(1)}L`
      : `₹${Math.round(absSavings).toLocaleString("en-IN")}`;
  const takeHomeStr = takeHome > 0 ? `₹${takeHome.toLocaleString("en-IN")}` : "—";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            fontSize: 16,
            color: "rgba(232,228,222,0.35)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          CLAROS · INCOME TAX
        </div>
        {betterRegime && absSavings > 0 && (
          <>
            <div
              style={{
                fontSize: 18,
                color: "rgba(160,220,180,0.6)",
                fontWeight: 300,
                marginBottom: 8,
              }}
            >
              {betterRegime} saves
            </div>
            <div
              style={{
                fontSize: 80,
                fontWeight: 200,
                color: "#E8E4DE",
                letterSpacing: "-0.05em",
                lineHeight: 1,
                marginBottom: 16,
              }}
            >
              {savingsStr}
            </div>
          </>
        )}
        <div
          style={{
            fontSize: 22,
            color: "rgba(232,228,222,0.5)",
            fontWeight: 300,
            marginBottom: 20,
          }}
        >
          {incomeLabel} · {fy}
        </div>
        <div
          style={{
            fontSize: 18,
            color: "rgba(232,228,222,0.4)",
            fontWeight: 300,
          }}
        >
          Monthly take-home: {takeHomeStr}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 14,
            color: "rgba(232,228,222,0.25)",
            letterSpacing: "0.08em",
          }}
        >
          getclaros.in
        </div>
      </div>
    ),
    { ...size }
  );
}
