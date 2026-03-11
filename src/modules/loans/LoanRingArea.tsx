"use client";

import { Ring } from "@/components/canvas/Ring";
import { SmoothNumber } from "@/components/SmoothNumber";
import { fINR, fShort } from "@/lib/format";
import type { PinnedLoanSnapshot } from "@/modules/loans/types";

interface LoanRingAreaProps {
  dark: boolean;
  comparing: boolean;
  pinned: PinnedLoanSnapshot | null;
  ir: number;
  velocity: number;
  tickSignal: number;
  amount: number;
  rate: number;
  tenure: number;
  emi: number;
  total: number;
  interest: number;
  ringView: number;
  displayRingView: number;
  ringContentVisible: boolean;
  onCycle: () => void;
}

export function LoanRingArea({
  dark,
  comparing,
  pinned,
  ir,
  velocity,
  tickSignal,
  amount,
  rate,
  tenure,
  emi,
  total,
  interest,
  ringView,
  displayRingView,
  ringContentVisible,
  onCycle,
}: Readonly<LoanRingAreaProps>) {
  return (
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
        {comparing && pinned ? (
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
                <span style={{ fontSize: 9, color: "var(--text-muted-faint)", marginTop: 3 }}>
                  {fShort(pinned.amount)}
                </span>
                <span style={{ fontSize: 8, color: "var(--text-muted-faint)", marginTop: 1 }}>
                  {pinned.rate}% · {pinned.tenure}yr
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

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
            velocity={velocity}
            tickSignal={tickSignal}
            dark={dark}
            pinnedIR={comparing && pinned ? pinned.ir : null}
            size={comparing ? 140 : 260}
          />
          <div
            onClick={comparing ? undefined : onCycle}
            onKeyDown={(event) => {
              if (comparing) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onCycle();
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
                  {fINR(Math.round(emi))}
                </span>
                <span style={{ fontSize: 9, color: "var(--text-muted-faint)", marginTop: 3 }}>
                  {fShort(amount)}
                </span>
                <span style={{ fontSize: 8, color: "var(--text-muted-faint)", marginTop: 1 }}>
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
                  {displayRingView === 0 ? (
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
                      <SmoothNumber value={emi} prefix="₹" fontSize={38} />
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
                  ) : null}

                  {displayRingView === 1 ? (
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
                  ) : null}

                  {displayRingView === 2 ? (
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
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
