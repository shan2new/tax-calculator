"use client";

import { memo, useRef, useEffect } from "react";
import { THEMES_CANVAS } from "@/lib/theme";

interface MiniRingProps {
  dark: boolean;
}

export const MiniRing = memo(function MiniRing({ dark }: MiniRingProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const darkRef = useRef(dark);
  useEffect(() => { darkRef.current = dark; }, [dark]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = 64;
    c.width = W * dpr;
    c.height = W * dpr;
    c.style.width = `${W}px`;
    c.style.height = `${W}px`;
    ctx.scale(dpr, dpr);
    const cx = W / 2, cy = W / 2, R = 26;
    let raf: number;

    const draw = (ts: number) => {
      const t = ts * 0.001;
      ctx.clearRect(0, 0, W, W);
      const th = THEMES_CANVAS[darkRef.current ? "dark" : "light"];
      const [rr, rg, rb] = th.ringRGB;
      const br = 1 + Math.sin(t * 0.8) * 0.01;
      const wob = (a: number) => R * br + Math.sin(a * 3 + t * 0.5) * 1.5 + Math.cos(a * 5 + t * 0.9) * 0.8;
      const start = -Math.PI / 2;

      const g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.3);
      g.addColorStop(0, `rgba(${rr},${rg},${rb},0.03)`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, W);

      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 1.4; a += 0.03) {
        const ang = start + a, r = wob(ang);
        if (a < 0.03) ctx.moveTo(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
        else ctx.lineTo(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
      }
      ctx.strokeStyle = `rgba(${rr},${rg},${rb},${th.ringAlpha * 0.7})`;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.shadowColor = `rgba(${rr},${rg},${rb},0.08)`;
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      for (let a = Math.PI * 1.45; a <= Math.PI * 2; a += 0.03) {
        const ang = start + a, r = wob(ang);
        if (a < Math.PI * 1.48) ctx.moveTo(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
        else ctx.lineTo(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
      }
      ctx.strokeStyle = `rgba(${th.warnRGB[0]},${th.warnRGB[1]},${th.warnRGB[2]},0.12)`;
      ctx.lineWidth = 1.2;
      ctx.lineCap = "round";
      ctx.stroke();

      const ea = (t * 0.3) % (Math.PI * 2);
      const er = wob(start + ea);
      ctx.beginPath();
      ctx.arc(cx + Math.cos(start + ea) * er, cy + Math.sin(start + ea) * er, 1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rr},${rg},${rb},${(Math.sin(t) + 1) * 0.04})`;
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} style={{ display: "block" }} />;
});
