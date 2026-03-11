import { ImageResponse } from "next/og";
import {
  parseAmountSlug,
  parseRateSlug,
  parseTenureSlug,
  parseLoanTypeSlug,
  formatAmountForTitle,
} from "@/lib/seo-utils";
import { emiCalc } from "@/lib/calc";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface PageParams {
  type: string;
  amount: string;
  rate: string;
  tenure: string;
}

export default async function Image({ params }: { params: Promise<PageParams> }) {
  const p = await params;
  const config = parseLoanTypeSlug(p.type);
  const amount = parseAmountSlug(p.amount);
  const rate = parseRateSlug(p.rate);
  const tenure = parseTenureSlug(p.tenure);

  const emi = config && amount && rate && tenure ? emiCalc(amount, rate, tenure) : 0;
  const total = emi * tenure * 12;
  const interest = total - amount;
  const interestPct = total > 0 ? Math.round((interest / total) * 100) : 0;
  const amountStr = config ? formatAmountForTitle(amount) : "Loan";
  const typeLabel = config?.label ?? "Loan";
  const emiStr = emi > 0 ? `₹${Math.round(emi).toLocaleString("en-IN")}` : "—";

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
          {`CLAROS · ${typeLabel.toUpperCase()}`}
        </div>
        <div
          style={{
            fontSize: 18,
            color: "rgba(232,228,222,0.4)",
            fontWeight: 300,
            marginBottom: 12,
          }}
        >
          PER MONTH
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
          {emiStr}
        </div>
        <div
          style={{
            fontSize: 22,
            color: "rgba(232,228,222,0.5)",
            fontWeight: 300,
            marginBottom: 32,
          }}
        >
          {`${amountStr} ${typeLabel} · ${rate}% · ${tenure} Years`}
        </div>
        {interestPct > 0 && (
          <div
            style={{
              fontSize: 16,
              color: "rgba(255,180,160,0.7)",
              fontWeight: 300,
            }}
          >
            {`${interestPct}% of total payments goes to interest`}
          </div>
        )}
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
