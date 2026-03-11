import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EMI Calculator India — Home, Car, Personal & Education Loan | Claros";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          CLAROS · EMI CALCULATOR
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 200,
            color: "#E8E4DE",
            letterSpacing: "-0.04em",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          Loan EMI Calculator
        </div>
        <div
          style={{
            fontSize: 22,
            color: "rgba(232,228,222,0.5)",
            marginBottom: 40,
            fontWeight: 300,
          }}
        >
          Home · Car · Personal · Education
        </div>
        <div
          style={{
            fontSize: 16,
            color: "rgba(232,228,222,0.4)",
            fontWeight: 300,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          Year-by-year amortization schedule · Principal vs interest breakdown · India-first formatting
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
          getclaros.in/loans
        </div>
      </div>
    ),
    { ...size }
  );
}
