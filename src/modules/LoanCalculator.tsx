"use client";

import { useState, useCallback, useEffect, type MouseEvent, type ReactNode } from "react";
import { Ring } from "@/components/Ring";
import { SmoothNumber } from "@/components/SmoothNumber";
import { ScrubValue } from "@/components/ScrubValue";
import { Haptic } from "@/hooks/useHaptic";
import { usePremiumPress } from "@/hooks/usePremiumPress";
import { fINR, fShort, fShortStep } from "@/lib/format";
import { LOAN_TYPES, emiCalc } from "@/lib/calc";

interface PinnedState {
  amount: number;
  rate: number;
  tenure: number;
  emi: number;
  total: number;
  interest: number;
  ir: number;
}

interface LoanModuleProps {
  dark: boolean;
}

function LoanTypeTab({
  active,
  label,
  onClick,
}: Readonly<{
  active: boolean;
  label: string;
  onClick: () => void;
}>) {
  const press = usePremiumPress();

  return (
    <button
      {...press.bind}
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        color: active ? "var(--tab-active)" : "var(--tab-inactive)",
        fontSize: 12,
        fontWeight: active ? 400 : 300,
        letterSpacing: "0.05em",
        padding: "8px 14px",
        cursor: "pointer",
        fontFamily: "inherit",
        position: "relative",
        transform: press.pressed ? "translateY(1px) scale(0.96)" : press.hovered ? "translateY(-1px)" : "translateY(0)",
        transition:
          "color var(--motion-medium) var(--ease-premium), transform var(--motion-medium) var(--ease-premium), opacity var(--motion-medium) var(--ease-premium)",
      }}
    >
      {label}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: `translateX(-50%) scaleX(${active ? 1 : press.hovered ? 0.55 : 0.2})`,
          transformOrigin: "center",
          width: 20,
          height: 1,
          background: "var(--tab-line)",
          opacity: active ? 1 : press.hovered ? 0.75 : 0.2,
          transition:
            "transform var(--motion-slow) var(--ease-premium), opacity var(--motion-medium) var(--ease-premium), background var(--motion-medium) var(--ease-premium)",
        }}
      />
    </button>
  );
}

function ActionIconButton({
  active = false,
  onClick,
  children,
}: Readonly<{
  active?: boolean;
  onClick: (ev: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}>) {
  const press = usePremiumPress();

  return (
    <button
      {...press.bind}
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: active ? "var(--warn)" : "var(--text-muted-faint)",
        padding: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition:
          "color var(--motion-medium) var(--ease-premium), transform var(--motion-medium) var(--ease-premium), opacity var(--motion-medium) var(--ease-premium)",
        transform: press.pressed
          ? "translateY(1px) scale(0.92)"
          : active
            ? "scale(1.08)"
            : press.hovered
              ? "scale(1.04)"
              : "scale(1)",
        opacity: press.pressed ? 0.84 : 1,
      }}
    >
      {children}
    </button>
  );
}

export function LoanModule({ dark }: Readonly<LoanModuleProps>) {
  const [ti, setTi] = useState(0);
  const t = LOAN_TYPES[ti];
  const [amount, setAmount] = useState(t.amt);
  const [rate, setRate] = useState(t.rate);
  const [tenure, setTenure] = useState(t.yr);
  const [vel, setVel] = useState(0);
  const [tickSig, setTickSig] = useState(0);
  const fireTick = useCallback(() => setTickSig(Date.now()), []);
  const [amortOpen, setAmortOpen] = useState(false);
  const [ringView, setRingView] = useState(0);
  const [displayRingView, setDisplayRingView] = useState(0);
  const [ringContentVisible, setRingContentVisible] = useState(true);

  // Comparison mode
  const [comparing, setComparing] = useState(false);
  const [pinned, setPinned] = useState<PinnedState | null>(null);

  // Share
  const [shareVisible, setShareVisible] = useState(false);

  const switchType = (i: number) => {
    if (i === ti) return;
    Haptic.medium();
    setTi(i);
    const n = LOAN_TYPES[i];
    setAmount(n.amt);
    setRate(n.rate);
    setTenure(n.yr);
    setComparing(false);
    setPinned(null);
  };

  const cycleRingView = () => {
    Haptic.light();
    setRingView((v) => (v + 1) % 3);
  };

  useEffect(() => {
    if (comparing) {
      setDisplayRingView(ringView);
      setRingContentVisible(true);
      return;
    }
    if (displayRingView === ringView) return;
    setRingContentVisible(false);
    const swapTimer = globalThis.setTimeout(() => {
      setDisplayRingView(ringView);
      setRingContentVisible(true);
    }, 110);
    return () => globalThis.clearTimeout(swapTimer);
  }, [comparing, displayRingView, ringView]);

  const e = emiCalc(amount, rate, tenure);
  const total = e * tenure * 12;
  const interest = total - amount;
  const ir = total > 0 ? interest / total : 0;

  const pinCurrent = () => {
    Haptic.medium();
    setPinned({ amount, rate, tenure, emi: e, total, interest, ir });
    setComparing(true);
  };

  const clearCompare = () => {
    Haptic.light();
    setComparing(false);
    setPinned(null);
  };

  // Comparison deltas
  const delta = pinned
    ? {
        emi: e - pinned.emi,
        total: total - pinned.total,
        interest: interest - pinned.interest,
      }
    : null;

  // Amortization
  const mr2 = rate / 1200;
  const years: { y: number; p: number; i: number; bal: number }[] = [];
  let bal2 = amount;
  for (let y = 1; y <= tenure; y++) {
    let yp = 0,
      yi = 0;
    for (let m = 0; m < 12; m++) {
      if (bal2 <= 0) break;
      const ip = bal2 * mr2;
      const pp = Math.min(e - ip, bal2);
      yi += ip;
      yp += pp;
      bal2 -= pp;
    }
    years.push({ y, p: yp, i: yi, bal: Math.max(0, bal2) });
  }
  const maxP = years.length > 0 ? Math.max(...years.map((d) => d.p + d.i)) : 1;
  const cross = years.findIndex((d) => d.p > d.i);

  // Share card generator
  const generateShareCard = async () => {
    Haptic.medium();
    const W = 600,
      H = 800;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark = dark;
    ctx.fillStyle = isDark ? "#0A0A0A" : "#F8F6F2";
    ctx.fillRect(0, 0, W, H);

    const textColor = isDark ? "#E8E4DE" : "#2A2520";
    const mutedColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(42,37,32,0.52)";
    const faintColor = isDark ? "rgba(255,255,255,0.25)" : "rgba(42,37,32,0.28)";
    const warnColor = isDark ? "rgba(255,185,165,0.85)" : "rgba(172,68,40,0.85)";

    // Draw ring (simplified static version)
    const cx = W / 2,
      cy = 240,
      R = 130;
    const pEnd = (1 - ir) * Math.PI * 2;
    const start = -Math.PI / 2;

    // Glow
    const grd = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.3);
    grd.addColorStop(0, isDark ? "rgba(232,228,222,0.03)" : "rgba(80,68,52,0.04)");
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    // Principal arc
    ctx.beginPath();
    ctx.arc(cx, cy, R, start, start + pEnd);
    ctx.strokeStyle = isDark ? "#E8E4DE" : "#3C3630";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.shadowColor = isDark ? "rgba(232,228,222,0.12)" : "rgba(80,68,52,0.08)";
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Interest arc
    if (ir > 0.01) {
      ctx.beginPath();
      ctx.arc(cx, cy, R, start + pEnd + 0.06, start + Math.PI * 2);
      ctx.strokeStyle = isDark ? "rgba(255,180,160,0.2)" : "rgba(168,72,40,0.2)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // EMI text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "200 14px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = faintColor;
    ctx.fillText("PER MONTH", cx, cy - 40);
    ctx.font = "200 52px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = textColor;
    ctx.fillText(fINR(e), cx, cy + 5);
    ctx.font = "300 14px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = mutedColor;
    ctx.fillText(`${fShort(total)} total`, cx, cy + 40);

    // Details section
    const detailY = 420;
    const drawRow = (label: string, value: string, y: number, highlight = false) => {
      ctx.font = "300 12px -apple-system, system-ui, sans-serif";
      ctx.fillStyle = faintColor;
      ctx.textAlign = "left";
      ctx.fillText(label.toUpperCase(), 60, y);
      ctx.font = "200 22px -apple-system, system-ui, sans-serif";
      ctx.fillStyle = highlight ? warnColor : textColor;
      ctx.textAlign = "right";
      ctx.fillText(value, W - 60, y);
    };

    drawRow("Loan Amount", fShort(amount), detailY);
    drawRow("Interest Rate", `${rate.toFixed(1)}%`, detailY + 50);
    drawRow("Tenure", `${tenure} ${tenure === 1 ? "year" : "years"}`, detailY + 100);

    // Separator
    ctx.fillStyle = faintColor;
    ctx.fillRect(60, detailY + 135, W - 120, 1);

    drawRow("Principal", fShort(amount), detailY + 170);
    drawRow("Interest", fShort(interest), detailY + 220, ir > 0.5);
    drawRow("Total Payable", fShort(total), detailY + 270);

    // Comparison delta if pinned
    if (delta) {
      ctx.fillStyle = faintColor;
      ctx.fillRect(60, detailY + 305, W - 120, 1);
      ctx.font = "300 12px -apple-system, system-ui, sans-serif";
      ctx.fillStyle = mutedColor;
      ctx.textAlign = "left";
      ctx.fillText("VS PREVIOUS SCENARIO", 60, detailY + 340);
      const sign = (n: number) => (n > 0 ? "+" : "");
      ctx.font = "200 18px -apple-system, system-ui, sans-serif";
      ctx.fillStyle =
        delta.emi > 0
          ? warnColor
          : isDark
            ? "rgba(160,220,180,0.7)"
            : "rgba(40,140,60,0.7)";
      ctx.textAlign = "right";
      ctx.fillText(`${sign(delta.emi)}${fINR(Math.round(delta.emi))}/mo`, W - 60, detailY + 340);
    }

    // Brand
    ctx.font = "200 11px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = faintColor;
    ctx.textAlign = "center";
    ctx.fillText("C L A R O S", W / 2, H - 50);
    ctx.font = "300 10px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.18)" : "rgba(42,37,32,0.18)";
    ctx.fillText("claros.app", W / 2, H - 32);

    // Export
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "claros-loan.png", { type: "image/png" });
      const shareUrl = `https://claros.app/loan?a=${amount}&r=${rate}&t=${tenure}`;

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Loan: ${fShort(amount)} @ ${rate}%`,
            text: `EMI: ${fINR(Math.round(e))}/mo for ${tenure}yrs\n${shareUrl}`,
            url: shareUrl,
          });
        } catch {
          // User cancelled share
        }
      } else {
        // Fallback: download + copy link
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "claros-loan.png";
        a.click();
        try {
          await navigator.clipboard.writeText(shareUrl);
          setShareVisible(true);
          setTimeout(() => setShareVisible(false), 2000);
        } catch {
          // Clipboard not available
        }
      }
    }, "image/png");
  };

  return (
    <div>
      {/* Sub-nav */}
      <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 24px" }}>
        {LOAN_TYPES.map((tp, i) => (
          <LoanTypeTab key={tp.id} label={tp.label} active={i === ti} onClick={() => switchType(i)} />
        ))}
      </div>

      {/* Ring area — single or split */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: comparing ? 12 : 0,
          transition: "gap var(--motion-slow) var(--ease-premium)",
          minHeight: comparing ? 180 : 260,
          marginBottom: 4,
        }}
      >
        {/* Pinned ring (left) — appears on compare */}
        <div
          style={{
            flex: comparing ? "1 1 0" : "0 0 0",
            maxWidth: comparing ? 170 : 0,
            opacity: comparing ? 1 : 0,
            transform: comparing ? "translateX(0) scale(1)" : "translateX(16px) scale(0.7)",
            transition:
              "max-width var(--motion-slow) var(--ease-premium), opacity var(--motion-medium) var(--ease-premium), transform var(--motion-slow) var(--ease-premium), flex-basis var(--motion-slow) var(--ease-premium)",
            overflow: "hidden",
          }}
        >
          {comparing && pinned && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ position: "relative", width: 140, height: 140 }}>
                <Ring
                  ir={pinned.ir}
                  velocity={0}
                  tickSignal={0}
                  dark={dark}
                  pinnedIR={null}
                  size={140}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: 7,
                      letterSpacing: "0.1em",
                      color: "var(--text-muted-faint)",
                      textTransform: "uppercase",
                      marginBottom: 3,
                    }}
                  >
                    pinned
                  </span>
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 200,
                      color: "var(--text-muted)",
                      fontFamily: "var(--font)",
                      letterSpacing: "-0.03em",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {fINR(Math.round(pinned.emi))}
                  </span>
                  <span
                    style={{ fontSize: 9, color: "var(--text-muted-faint)", marginTop: 3 }}
                  >
                    {fShort(pinned.amount)}
                  </span>
                  <span
                    style={{ fontSize: 8, color: "var(--text-muted-faint)", marginTop: 1 }}
                  >
                    {pinned.rate}% · {pinned.tenure}yr
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live ring (right when comparing, center when solo) */}
        <div
          style={{
            flex: comparing ? "1 1 0" : "0 0 260px",
            maxWidth: comparing ? 170 : 260,
            display: "flex",
            justifyContent: "center",
            transition:
              "max-width var(--motion-slow) var(--ease-premium), flex-basis var(--motion-slow) var(--ease-premium)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: comparing ? 140 : 260,
              height: comparing ? 140 : 260,
              transition:
                "width var(--motion-slow) var(--ease-premium), height var(--motion-slow) var(--ease-premium)",
            }}
          >
            <Ring
              ir={ir}
              velocity={vel}
              tickSignal={tickSig}
              dark={dark}
              pinnedIR={comparing && pinned ? pinned.ir : null}
              size={comparing ? 140 : 260}
            />
            <div
              onClick={comparing ? undefined : cycleRingView}
              onKeyDown={(e) => {
                if (comparing) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  cycleRingView();
                }
              }}
              role={comparing ? undefined : "button"}
              tabIndex={comparing ? -1 : 0}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: comparing ? "default" : "pointer",
              }}
            >
              {comparing ? (
                <>
                  <span
                    style={{
                      fontSize: 7,
                      letterSpacing: "0.1em",
                      color: "var(--text-muted-faint)",
                      textTransform: "uppercase",
                      marginBottom: 3,
                    }}
                  >
                    current
                  </span>
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 200,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font)",
                      letterSpacing: "-0.03em",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {fINR(Math.round(e))}
                  </span>
                  <span
                    style={{ fontSize: 9, color: "var(--text-muted-faint)", marginTop: 3 }}
                  >
                    {fShort(amount)}
                  </span>
                  <span
                    style={{ fontSize: 8, color: "var(--text-muted-faint)", marginTop: 1 }}
                  >
                    {rate}% · {tenure}yr
                  </span>
                </>
              ) : (
                <div
                  style={{
                    minHeight: 98,
                    minWidth: 164,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: ringContentVisible ? 1 : 0,
                      transform: ringContentVisible ? "translateY(0) scale(1)" : "translateY(8px) scale(0.985)",
                      transition:
                        "opacity var(--motion-medium) var(--ease-premium), transform var(--motion-slow) var(--ease-premium)",
                    }}
                  >
                  {displayRingView === 0 && (
                    <>
                      <span
                        style={{
                          fontSize: 9,
                          letterSpacing: "0.14em",
                          color: "var(--text-muted-faint)",
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        per month
                      </span>
                      <SmoothNumber value={e} prefix="₹" fontSize={38} />
                      <span
                        style={{
                          fontSize: 11,
                          color: ir > 0.5 ? "var(--warn)" : "var(--text-muted-faint)",
                          marginTop: 8,
                          transition: "color var(--motion-medium) var(--ease-premium)",
                        }}
                      >
                        {Math.round(ir * 100)}% goes to interest
                      </span>
                    </>
                  )}
                  {displayRingView === 1 && (
                    <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              fontSize: 9,
                              letterSpacing: "0.08em",
                              color: "var(--text-muted-faint)",
                              textTransform: "uppercase",
                              marginBottom: 4,
                            }}
                          >
                            Principal
                          </div>
                          <div
                            style={{
                              fontSize: 22,
                              fontWeight: 200,
                              color: "var(--text-primary)",
                              fontFamily: "var(--font)",
                              letterSpacing: "-0.03em",
                            }}
                          >
                            {fShort(amount)}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            color: "var(--text-muted-faint)",
                            marginBottom: 4,
                          }}
                        >
                          +
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              fontSize: 9,
                              letterSpacing: "0.08em",
                              color: "var(--text-muted-faint)",
                              textTransform: "uppercase",
                              marginBottom: 4,
                            }}
                          >
                            Interest
                          </div>
                          <div
                            style={{
                              fontSize: 22,
                              fontWeight: 200,
                              color: "var(--text-muted)",
                              fontFamily: "var(--font)",
                              letterSpacing: "-0.03em",
                            }}
                          >
                            {fShort(interest)}
                          </div>
                        </div>
                      </div>
                  )}
                  {displayRingView === 2 && (
                    <>
                      <span
                        style={{
                          fontSize: 9,
                          letterSpacing: "0.14em",
                          color: "var(--text-muted-faint)",
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        total payable
                      </span>
                      <SmoothNumber value={total} prefix="₹" fontSize={34} />
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted-faint)",
                          marginTop: 8,
                        }}
                      >
                        over {tenure} {tenure === 1 ? "year" : "years"}
                      </span>
                    </>
                  )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delta badge — only in compare mode */}
      {comparing && delta && (
        <div
          style={{
            textAlign: "center",
            padding: "4px 0 8px",
            animation: "hintFade 0.3s ease",
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontSize: 14,
              fontWeight: 300,
              fontFamily: "var(--font)",
              color: delta.emi > 0 ? "var(--warn)" : "var(--text-positive)",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.02em",
              transform: "translateY(0) scale(1)",
              padding: "4px 10px",
              borderRadius: 999,
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            {delta.emi > 0 ? "+" : ""}
            {fINR(Math.round(delta.emi))}/mo
          </span>
          <span style={{ fontSize: 11, color: "var(--text-muted-faint)", marginLeft: 6 }}>
            ({delta.total > 0 ? "+" : ""}
            {fShort(Math.abs(delta.total))} total)
          </span>
        </div>
      )}

      {/* Action row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          padding: "4px 0 4px",
        }}
      >
        <ActionIconButton
          active={comparing}
          onClick={(ev) => {
            ev.stopPropagation();
            if (comparing) clearCompare(); else pinCurrent();
          }}
        >
          {comparing ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M8 3v18" />
              <path d="M16 3v18" />
              <path d="M3 9h5" />
              <path d="M16 15h5" />
            </svg>
          )}
        </ActionIconButton>
        {!comparing && (
          <div style={{ display: "flex", gap: 6 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: i === ringView ? 10 : 4,
                  height: 4,
                  borderRadius: 2,
                  background:
                    i === ringView ? "var(--text-muted-mid)" : "var(--text-muted-faint)",
                  opacity: i === ringView ? 1 : 0.72,
                  transform: i === ringView ? "scaleX(1)" : "scaleX(0.92)",
                  transition:
                    "width var(--motion-medium) var(--ease-premium), background var(--motion-medium) var(--ease-premium), opacity var(--motion-medium) var(--ease-premium), transform var(--motion-medium) var(--ease-premium)",
                }}
              />
            ))}
          </div>
        )}
        <ActionIconButton
          onClick={(ev) => {
            ev.stopPropagation();
            generateShareCard();
          }}
          active={shareVisible}
        >
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            {shareVisible && (
              <div
                style={{
                  position: "absolute",
                  bottom: -20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: 9,
                  color: "var(--text-muted-mid)",
                  whiteSpace: "nowrap",
                  animation: "hintFade 0.2s ease",
                }}
              >
                Copied
              </div>
            )}
          </div>
        </ActionIconButton>
      </div>

      {/* Controls */}
      <div style={{ marginTop: 4 }}>
        <ScrubValue
          label="Loan amount"
          value={amount}
          min={t.minAmt}
          max={t.maxAmt}
          step={t.step}
          sensitivity={1.8}
          format={(v) => fShortStep(v, t.step)}
          scrubFormat={fINR}
          onVelocity={setVel}
          isAmount
          onChange={setAmount}
          tickStep={t.tickStep}
          onTick={fireTick}
        />
        <ScrubValue
          label="Interest rate"
          value={rate}
          min={4}
          max={20}
          step={0.1}
          sensitivity={0.35}
          format={(v) => `${v.toFixed(1)}%`}
          onVelocity={setVel}
          parseInput={(s) => Number.parseFloat(s.replaceAll("%", ""))}
          onChange={setRate}
          tickStep={1}
          onTick={fireTick}
        />
        <ScrubValue
          label="Tenure"
          value={tenure}
          min={1}
          max={t.maxYr}
          step={1}
          sensitivity={0.25}
          format={(v) => `${v} ${v === 1 ? "yr" : "yrs"}`}
          onVelocity={setVel}
          parseInput={(s) => Number.parseInt(s, 10)}
          onChange={setTenure}
          tickStep={1}
          onTick={fireTick}
        />
      </div>

      {/* Amortization */}
      {rate > 0 && tenure > 0 && e > 0 && (
        <div style={{ marginTop: 8 }}>
          <div
            onClick={() => {
              setAmortOpen(!amortOpen);
              Haptic.light();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setAmortOpen((v) => !v);
                Haptic.light();
              }
            }}
            role="button"
            tabIndex={0}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              padding: "14px 0",
              minHeight: 44,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "var(--text-muted-faint)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Year-by-year
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--text-muted-faint)",
                transform: amortOpen ? "rotate(180deg)" : "none",
              transition: "transform var(--motion-slow) var(--ease-premium), color var(--motion-medium) var(--ease-premium)",
                display: "inline-block",
              }}
            >
              ▾
            </span>
          </div>
          <div
            style={{
              maxHeight: amortOpen ? 2000 : 0,
              overflow: "hidden",
            transition: "max-height var(--motion-slow) var(--ease-premium), opacity var(--motion-medium) var(--ease-premium)",
            opacity: amortOpen ? 1 : 0.72,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingBottom: 16 }}>
              {years.map((d, idx) => {
                const tot = d.p + d.i;
                const pPct = (d.p / tot) * 100;
                const wPct = (tot / maxP) * 100;
                const isCross = idx === cross;
                return (
                  <div key={d.y}>
                    {isCross && (
                      <div
                        style={{
                          fontSize: 8,
                          color: "var(--text-muted)",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          padding: "8px 0 4px 28px",
                        }}
                      >
                        ↑ principal overtakes interest
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span
                        style={{
                          fontSize: 10,
                          width: 18,
                          textAlign: "right",
                          flexShrink: 0,
                          color: isCross ? "var(--text-muted-mid)" : "var(--text-muted-faint)",
                          fontWeight: isCross ? 500 : 400,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {d.y}
                      </span>
                      <div style={{ flex: 1, height: 6 }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${wPct}%`,
                            borderRadius: 3,
                            overflow: "hidden",
                            display: "flex",
                            transform: isCross ? "scaleY(1.16)" : "scaleY(1)",
                            transition:
                              "width var(--motion-slow) var(--ease-premium), transform var(--motion-medium) var(--ease-premium)",
                          }}
                        >
                          <div
                            style={{
                              width: `${pPct}%`,
                              background: "var(--bar-fill)",
                              height: "100%",
                              transition: "width var(--motion-slow) var(--ease-premium)",
                            }}
                          />
                          <div
                            style={{ flex: 1, background: "var(--bar-bg)", height: "100%" }}
                          />
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 9,
                          color: "var(--text-muted-faint)",
                          width: 42,
                          textAlign: "right",
                          flexShrink: 0,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {fShort(d.bal)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ padding: "20px 0 4px" }}>
        <p
          style={{
            fontSize: 9,
            color: "var(--text-muted-faint)",
            lineHeight: 1.6,
            margin: 0,
            letterSpacing: "0.01em",
          }}
        >
          EMI calculations are indicative and based on the reducing balance method. Actual EMI may
          vary based on the lender&apos;s terms, processing fees, and prepayment conditions. This tool
          does not constitute financial advice. Consult your bank or financial advisor before making
          borrowing decisions.
        </p>
      </div>
    </div>
  );
}
