"use client";

import { useRef, useEffect, useState } from "react";

interface SmoothNumberProps {
  value: number;
  prefix?: string;
  fontSize?: number;
}

// Slightly softer, overdamped spring for premium glide without overshoot.
// Critical: b_crit = 2·√160 ≈ 25.3  →  b=30 gives ~18% overdamping.
const SPRING_K = 160;
const SPRING_B = 30;

export function SmoothNumber({
  value,
  prefix = "₹",
  fontSize = 42,
}: Readonly<SmoothNumberProps>) {
  const posRef = useRef(value);
  const velRef = useRef(0);
  const targetRef = useRef(value);
  const lastTRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const prevTarget = targetRef.current;
    targetRef.current = value;

    // On large jumps (tab-switch, initial load) reset velocity so the snap
    // is immediate rather than counting through a huge range.
    const scale = Math.max(Math.abs(prevTarget), Math.abs(value), 1);
    if (Math.abs(value - prevTarget) / scale > 0.5) {
      velRef.current = 0;
    }

    cancelAnimationFrame(rafRef.current);
    lastTRef.current = null;

    const step = (now: number) => {
      lastTRef.current ??= now;
      const dt = Math.min((now - lastTRef.current) / 1000, 0.033); // s, capped at 33ms
      lastTRef.current = now;

      const diff = targetRef.current - posRef.current;

      // Settle: both position error and velocity must be negligible
      if (Math.abs(diff) < 0.5 && Math.abs(velRef.current) < 1) {
        posRef.current = targetRef.current;
        velRef.current = 0;
        setDisplay(targetRef.current);
        return;
      }

      // F = K·(target − pos) − B·vel
      const accel = SPRING_K * diff - SPRING_B * velRef.current;
      velRef.current += accel * dt;
      posRef.current += velRef.current * dt;
      setDisplay(posRef.current);

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return (
    <span
      style={{
        fontSize,
        fontWeight: 200,
        color: "var(--text-primary)",
        letterSpacing: "-0.04em",
        fontFamily: "var(--font)",
        lineHeight: 1,
        display: "inline-block",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {prefix}
      {Math.round(display).toLocaleString("en-IN")}
    </span>
  );
}
