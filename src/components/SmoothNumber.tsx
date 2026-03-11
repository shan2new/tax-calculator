"use client";

import { useRef, useEffect, useState } from "react";

interface SmoothNumberProps {
  value: number;
  prefix?: string;
  fontSize?: number;
}

export function SmoothNumber({ value, prefix = "₹", fontSize = 42 }: SmoothNumberProps) {
  const dRef = useRef(value);
  const tRef = useRef(value);
  const raf = useRef<number>(0);
  const [display, setDisplay] = useState(value);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    tRef.current = value;
    setScale(1.02);
    const st = setTimeout(() => setScale(1), 250);

    const anim = () => {
      const diff = tRef.current - dRef.current;
      if (Math.abs(diff) < 1) {
        dRef.current = tRef.current;
        setDisplay(tRef.current);
        return;
      }
      dRef.current += diff * 0.12;
      setDisplay(dRef.current);
      raf.current = requestAnimationFrame(anim);
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(anim);

    return () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(st);
    };
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
        transform: `scale(${scale})`,
        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {prefix}
      {Math.round(display).toLocaleString("en-IN")}
    </span>
  );
}
