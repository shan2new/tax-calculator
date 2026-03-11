import { fINR, fShort } from "@/lib/format";
import type { LoanDelta } from "@/modules/loans/types";

/* ─── Tax share ─── */

interface TaxShareCardParams {
  dark: boolean;
  income: number;
  deductions: number;
  totalNew: number;
  totalOld: number;
  takeHome: number;
  effectiveRate: number;
  betterRegime: "new" | "old" | "same";
  savings: number;
}

export function buildTaxShareUrl(income: number) {
  const slug =
    income >= 1e7
      ? `${income / 1e7}-crore`
      : `${income / 1e5}-lpa`;
  return `https://getclaros.in/tax/fy-2025-26/${slug}`;
}

export function buildTaxShareCardBlob({
  dark,
  income,
  deductions,
  totalNew,
  totalOld,
  takeHome,
  effectiveRate,
  betterRegime,
  savings,
}: Readonly<TaxShareCardParams>): Promise<Blob | null> {
  return new Promise((resolve) => {
    const width = 600;
    const height = 700;
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
    const accentColor = dark ? "rgba(160,220,180,0.85)" : "rgba(40,140,60,0.85)";

    // Glow
    const glow = ctx.createRadialGradient(width / 2, 200, 40, width / 2, 200, 220);
    glow.addColorStop(0, dark ? "rgba(232,228,222,0.03)" : "rgba(80,68,52,0.04)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // Header
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "200 14px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = faintColor;
    ctx.fillText("MONTHLY TAKE-HOME", width / 2, 100);
    ctx.font = "200 56px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = textColor;
    ctx.fillText(fINR(takeHome), width / 2, 155);

    // Verdict pill
    const verdictText =
      betterRegime !== "same"
        ? `${betterRegime === "new" ? "New" : "Old"} regime saves ${fShort(Math.abs(savings))}/yr`
        : "Both regimes are equal";
    ctx.font = "300 15px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = betterRegime !== "same" ? accentColor : mutedColor;
    ctx.fillText(verdictText, width / 2, 210);

    ctx.font = "300 12px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = mutedColor;
    ctx.fillText(`${effectiveRate.toFixed(1)}% effective tax rate`, width / 2, 240);

    // Regime comparison bar
    const barY = 280;
    const barW = width - 120;
    const barH = 36;
    const barX = 60;
    const totalTax = totalNew + totalOld || 1;
    const newFrac = totalNew / totalTax;

    // New regime bar
    ctx.fillStyle = dark ? "rgba(232,228,222,0.15)" : "rgba(60,54,48,0.1)";
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW * newFrac - 2, barH, [6, 0, 0, 6]);
    ctx.fill();
    if (betterRegime === "new") {
      ctx.fillStyle = dark ? "rgba(232,228,222,0.06)" : "rgba(60,54,48,0.04)";
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW * newFrac - 2, barH, [6, 0, 0, 6]);
      ctx.fill();
    }
    // Old regime bar
    ctx.fillStyle = dark ? "rgba(255,180,160,0.12)" : "rgba(168,72,40,0.1)";
    ctx.beginPath();
    ctx.roundRect(barX + barW * newFrac + 2, barY, barW * (1 - newFrac) - 2, barH, [0, 6, 6, 0]);
    ctx.fill();

    // Bar labels
    ctx.font = "300 11px -apple-system, system-ui, sans-serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle = betterRegime === "new" ? textColor : mutedColor;
    ctx.fillText(`New ${fShort(totalNew)}`, barX + 10, barY + barH / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = betterRegime === "old" ? textColor : mutedColor;
    ctx.fillText(`Old ${fShort(totalOld)}`, barX + barW - 10, barY + barH / 2);

    // Detail rows
    const detailY = 360;
    const drawRow = (label: string, value: string, y: number) => {
      ctx.font = "300 12px -apple-system, system-ui, sans-serif";
      ctx.fillStyle = faintColor;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(label.toUpperCase(), 60, y);
      ctx.font = "200 22px -apple-system, system-ui, sans-serif";
      ctx.fillStyle = textColor;
      ctx.textAlign = "right";
      ctx.fillText(value, width - 60, y);
    };

    drawRow("Gross Income", fShort(income), detailY);
    drawRow("Deductions (Old)", fShort(deductions), detailY + 50);

    ctx.fillStyle = faintColor;
    ctx.fillRect(60, detailY + 85, width - 120, 1);

    drawRow("Tax (New Regime)", fShort(totalNew), detailY + 120);
    drawRow("Tax (Old Regime)", fShort(totalOld), detailY + 170);

    if (betterRegime !== "same") {
      ctx.fillStyle = faintColor;
      ctx.fillRect(60, detailY + 205, width - 120, 1);
      ctx.font = "300 12px -apple-system, system-ui, sans-serif";
      ctx.fillStyle = faintColor;
      ctx.textAlign = "left";
      ctx.fillText("YOU SAVE", 60, detailY + 240);
      ctx.font = "200 22px -apple-system, system-ui, sans-serif";
      ctx.fillStyle = accentColor;
      ctx.textAlign = "right";
      ctx.fillText(`${fShort(Math.abs(savings))}/yr`, width - 60, detailY + 240);
    }

    // Footer
    ctx.font = "200 11px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = dark ? "rgba(255,255,255,0.32)" : "rgba(42,37,32,0.32)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("C L A R O S", width / 2, height - 50);
    ctx.font = "300 10px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = dark ? "rgba(255,255,255,0.24)" : "rgba(42,37,32,0.24)";
    ctx.fillText("getclaros.in", width / 2, height - 32);

    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

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

const LOAN_TYPE_SLUGS: Record<string, string> = {
  personal: "personal-loan",
  car: "car-loan",
  home: "home-loan",
  education: "education-loan",
};

export function buildLoanShareUrl(amount: number, rate: number, tenure: number, loanTypeId = "personal") {
  const typeSlug = LOAN_TYPE_SLUGS[loanTypeId] ?? "personal-loan";
  const amtSlug =
    amount >= 1e7
      ? `${amount / 1e7}-crore`
      : `${amount / 1e5}-lakh`;
  return `https://getclaros.in/loans/${typeSlug}/${amtSlug}/${rate}-percent/${tenure}-years`;
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

    const brandX = width / 2;
    const brandY = height - 56;
    const brandColor = dark ? "rgba(255,255,255,0.42)" : "rgba(42,37,32,0.4)";
    const brandOuter = 14;
    const brandInner = 9;
    const brandStart = -2.25;
    const brandEnd = 2.25;

    // Intrusive on purpose: keep the mark visible in every share crop.
    ctx.beginPath();
    ctx.arc(brandX, brandY, brandOuter, brandStart, brandEnd, false);
    ctx.strokeStyle = brandColor;
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(brandX, brandY, brandInner, -2.0, 2.0, false);
    ctx.strokeStyle = dark ? "rgba(255,255,255,0.26)" : "rgba(42,37,32,0.24)";
    ctx.lineWidth = 1.3;
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.font = "200 11px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = dark ? "rgba(255,255,255,0.38)" : "rgba(42,37,32,0.36)";
    ctx.textAlign = "center";
    ctx.fillText("C L A R O S", width / 2, height - 34);
    ctx.font = "300 10px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = dark ? "rgba(255,255,255,0.24)" : "rgba(42,37,32,0.24)";
    ctx.fillText("getclaros.in", width / 2, height - 18);

    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}
