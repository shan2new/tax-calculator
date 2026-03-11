"use client";

import { useRef, useEffect } from "react";
import { THEMES_CANVAS } from "@/lib/theme";

interface BrandMarkProps {
  dark: boolean;
}

export function BrandMark({ dark }: BrandMarkProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const darkRef = useRef(dark);
  useEffect(() => { darkRef.current = dark; }, [dark]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = 40;
    c.width = W * dpr;
    c.height = W * dpr;
    c.style.width = `${W}px`;
    c.style.height = `${W}px`;
    ctx.scale(dpr, dpr);
    let raf: number;
    const sR = [232, 228, 222];

    const draw = (ts: number) => {
      const t = ts * 0.001;
      ctx.clearRect(0, 0, W, W);
      const th = THEMES_CANVAS[darkRef.current ? "dark" : "light"];
      for (let i = 0; i < 3; i++) sR[i] += (th.ringRGB[i] - sR[i]) * 0.04;
      const rr = Math.round(sR[0]), rg = Math.round(sR[1]), rb = Math.round(sR[2]);
      const cx = W / 2, cy = W / 2;
      const breathe = 1 + Math.sin(t * 1.0) * 0.015;
      const breathe2 = 1 + Math.sin(t * 1.0 + 0.5) * 0.02;

      // Outer arc
      const R1 = 15 * breathe;
      ctx.beginPath();
      ctx.arc(cx, cy, R1, -2.3, 2.3, false);
      ctx.strokeStyle = `rgba(${rr},${rg},${rb},0.55)`;
      ctx.lineWidth = 1.8;
      ctx.lineCap = "round";
      ctx.shadowColor = `rgba(${rr},${rg},${rb},0.06)`;
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Inner arc
      const R2 = 9.5 * breathe2;
      ctx.beginPath();
      ctx.arc(cx, cy, R2, -2.0, 2.0, false);
      ctx.strokeStyle = `rgba(${rr},${rg},${rb},0.22)`;
      ctx.lineWidth = 1.2;
      ctx.lineCap = "round";
      ctx.stroke();

      // Tiny orbiting dot
      const dotAngle = t * 0.4;
      const dotR = (R1 + R2) / 2 + Math.sin(t * 1.5) * 2;
      const dotX = cx + Math.cos(dotAngle) * dotR;
      const dotY = cy + Math.sin(dotAngle) * dotR;
      const dotOp = (Math.sin(t * 1.8) + 1) * 0.04;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rr},${rg},${rb},${dotOp})`;
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} style={{ display: "block", marginBottom: 16 }} />;
}
