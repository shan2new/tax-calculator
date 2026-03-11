import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Claros — Free EMI Calculator & Income Tax Comparator for India";
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
            fontSize: 18,
            color: "rgba(232,228,222,0.4)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          CLAROS
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 200,
            color: "#E8E4DE",
            letterSpacing: "-0.04em",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          Financial clarity,
          <br />
          one decision at a time.
        </div>
        <div
          style={{
            fontSize: 20,
            color: "rgba(232,228,222,0.5)",
            marginBottom: 40,
            fontWeight: 300,
          }}
        >
          EMI Calculator · Income Tax Comparator · India
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
          }}
        >
          {["Home Loan EMI", "Car Loan EMI", "Tax FY 2025-26"].map((label) => (
            <div
              key={label}
              style={{
                fontSize: 14,
                color: "rgba(232,228,222,0.4)",
                padding: "8px 16px",
                border: "1px solid rgba(232,228,222,0.12)",
                borderRadius: 8,
              }}
            >
              {label}
            </div>
          ))}
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
