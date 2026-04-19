"use client";

import { useEffect } from "react";
import { Haptic } from "@/hooks/useHaptic";

const MONTHS = [
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
];

interface MidYearPickerProps {
  open: boolean;
  startMonth: number;
  onClose: () => void;
  onSelect: (month: number) => void;
}

export function monthLabel(startMonth: number): string {
  if (startMonth === 0) return "Full FY";
  return MONTHS[startMonth];
}

export function MidYearPicker({
  open,
  startMonth,
  onClose,
  onSelect,
}: Readonly<MidYearPickerProps>) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const monthsWorked = 12 - startMonth;
  const helper =
    startMonth === 0
      ? "Full FY · 12 months of earning."
      : `You'll earn for ${monthsWorked} months this FY · tax applies only to that partial income.`;

  return (
    <>
      <div
        role="presentation"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--sheet-backdrop, rgba(0,0,0,0.55))",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 240ms cubic-bezier(0.16,1,0.3,1)",
          zIndex: 40,
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mid-year joining month picker"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          margin: "0 auto",
          maxWidth: 400,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          background: "var(--surface)",
          border: "0.5px solid var(--border)",
          borderBottom: "none",
          boxShadow: "0 -12px 40px rgba(0,0,0,0.35)",
          padding: "12px 20px 24px",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition:
            "transform 320ms cubic-bezier(0.16,1,0.3,1), opacity 320ms cubic-bezier(0.16,1,0.3,1)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          zIndex: 50,
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}
        >
          <div
            aria-hidden
            style={{
              width: 36,
              height: 4,
              borderRadius: 999,
              background: "var(--border-strong)",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Joined in…
          </span>
          <button
            onClick={() => {
              Haptic.light();
              onClose();
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              padding: "4px 2px",
            }}
          >
            Done
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 6,
          }}
        >
          {MONTHS.map((label, i) => {
            const active = startMonth === i;
            return (
              <button
                key={label}
                onClick={() => {
                  Haptic.light();
                  onSelect(i);
                }}
                style={{
                  padding: "8px 0",
                  borderRadius: 8,
                  border: active
                    ? "1px solid var(--text-primary)"
                    : "0.5px solid var(--border)",
                  background: active ? "var(--text-primary)" : "transparent",
                  color: active ? "var(--bg)" : "var(--text-secondary)",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "var(--font)",
                  cursor: "pointer",
                  transition:
                    "background 200ms cubic-bezier(0.16,1,0.3,1), color 200ms cubic-bezier(0.16,1,0.3,1), border-color 200ms cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 11,
            color: "var(--text-muted)",
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          {helper}
        </div>
      </div>
    </>
  );
}
