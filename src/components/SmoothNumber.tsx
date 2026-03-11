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

    // On large jumps (tab-switch, initial load) snap position partway
    // to avoid counting through a huge range. Reset velocity.
    const scale = Math.max(Math.abs(prevTarget), Math.abs(value), 1);
    const jumpRatio = Math.abs(value - prevTarget) / scale;
    if (jumpRatio > 0.5) {
      // Snap to 85% of the way — the spring covers the last 15% smoothly
      posRef.current = prevTarget + (value - prevTarget) * 0.85;
      velRef.current = 0;
    }

    cancelAnimationFrame(rafRef.current);
    lastTRef.current = null;

    const step = (now: number) => {
      lastTRef.current ??= now;
      const dt = Math.min((now - lastTRef.current) / 1000, 0.033); // s, capped at 33ms
      lastTRef.current = now;

      const diff = targetRef.current - posRef.current;

      // Relative settlement threshold: scales with value magnitude
      // Small values (< ₹1000): settle within ₹0.5
      // Large values (₹50L): settle within ₹50 (invisible at that scale)
      const threshold = Math.max(0.5, Math.abs(targetRef.current) * 0.000005);
      const velThreshold = Math.max(1, Math.abs(targetRef.current) * 0.00002);
      if (Math.abs(diff) < threshold && Math.abs(velRef.current) < velThreshold) {
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
