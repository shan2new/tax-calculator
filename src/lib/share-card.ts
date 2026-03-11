import { fINR, fShort } from "@/lib/format";
import type { LoanDelta } from "@/modules/loans/types";

interface LoanShareCardParams {
  dark: boolean;
  amount: number;
  rate: number;
  tenure: number;
  emi: number;
  total: number;
  interest: number;
  ir: number;
  delta: LoanDelta | null;
}

export function buildLoanShareUrl(amount: number, rate: number, tenure: number) {
  return `https://claros.app/loan?a=${amount}&r=${rate}&t=${tenure}`;
}

export function buildLoanShareCardBlob({
  dark,
  amount,
  rate,
  tenure,
  emi,
  total,
  interest,
  ir,
  delta,
}: Readonly<LoanShareCardParams>): Promise<Blob | null> {
  return new Promise((resolve) => {
    const width = 600;
    const height = 800;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve(null);
      return;
    }

    ctx.fillStyle = dark ? "#0A0A0A" : "#F8F6F2";
    ctx.fillRect(0, 0, width, height);

    const textColor = dark ? "#E8E4DE" : "#2A2520";
    const mutedColor = dark ? "rgba(255,255,255,0.5)" : "rgba(42,37,32,0.52)";
    const faintColor = dark ? "rgba(255,255,255,0.25)" : "rgba(42,37,32,0.28)";
    const warnColor = dark ? "rgba(255,185,165,0.85)" : "rgba(172,68,40,0.85)";

    const centerX = width / 2;
    const centerY = 240;
    const radius = 130;
    const principalEnd = (1 - ir) * Math.PI * 2;
    const start = -Math.PI / 2;

    const glow = ctx.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius * 1.3);
    glow.addColorStop(0, dark ? "rgba(232,228,222,0.03)" : "rgba(80,68,52,0.04)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, start, start + principalEnd);
    ctx.strokeStyle = dark ? "#E8E4DE" : "#3C3630";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.shadowColor = dark ? "rgba(232,228,222,0.12)" : "rgba(80,68,52,0.08)";
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (ir > 0.01) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, start + principalEnd + 0.06, start + Math.PI * 2);
      ctx.strokeStyle = dark ? "rgba(255,180,160,0.2)" : "rgba(168,72,40,0.2)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "200 14px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = faintColor;
    ctx.fillText("PER MONTH", centerX, centerY - 40);
    ctx.font = "200 52px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = textColor;
    ctx.fillText(fINR(emi), centerX, centerY + 5);
    ctx.font = "300 14px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = mutedColor;
    ctx.fillText(`${fShort(total)} total`, centerX, centerY + 40);

    const detailY = 420;
    const drawRow = (label: string, value: string, y: number, highlight = false) => {
      ctx.font = "300 12px -apple-system, system-ui, sans-serif";
      ctx.fillStyle = faintColor;
      ctx.textAlign = "left";
      ctx.fillText(label.toUpperCase(), 60, y);
      ctx.font = "200 22px -apple-system, system-ui, sans-serif";
      ctx.fillStyle = highlight ? warnColor : textColor;
      ctx.textAlign = "right";
      ctx.fillText(value, width - 60, y);
    };

    drawRow("Loan Amount", fShort(amount), detailY);
    drawRow("Interest Rate", `${rate.toFixed(1)}%`, detailY + 50);
    drawRow("Tenure", `${tenure} ${tenure === 1 ? "year" : "years"}`, detailY + 100);

    ctx.fillStyle = faintColor;
    ctx.fillRect(60, detailY + 135, width - 120, 1);
    drawRow("Principal", fShort(amount), detailY + 170);
    drawRow("Interest", fShort(interest), detailY + 220, ir > 0.5);
    drawRow("Total Payable", fShort(total), detailY + 270);

    if (delta) {
      ctx.fillStyle = faintColor;
      ctx.fillRect(60, detailY + 305, width - 120, 1);
      ctx.font = "300 12px -apple-system, system-ui, sans-serif";
      ctx.fillStyle = mutedColor;
      ctx.textAlign = "left";
      ctx.fillText("VS PREVIOUS SCENARIO", 60, detailY + 340);
      ctx.font = "200 18px -apple-system, system-ui, sans-serif";
      ctx.fillStyle =
        delta.emi > 0
          ? warnColor
          : dark
            ? "rgba(160,220,180,0.7)"
            : "rgba(40,140,60,0.7)";
      ctx.textAlign = "right";
      ctx.fillText(
        `${delta.emi > 0 ? "+" : ""}${fINR(Math.round(delta.emi))}/mo`,
        width - 60,
        detailY + 340
      );
    }

    ctx.font = "200 11px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = faintColor;
    ctx.textAlign = "center";
    ctx.fillText("C L A R O S", width / 2, height - 50);
    ctx.font = "300 10px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = dark ? "rgba(255,255,255,0.18)" : "rgba(42,37,32,0.18)";
    ctx.fillText("claros.app", width / 2, height - 32);

    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}
