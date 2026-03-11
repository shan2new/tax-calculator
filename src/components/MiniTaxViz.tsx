"use client";

import { memo, useRef, useEffect } from "react";
import { THEMES_CANVAS } from "@/lib/theme";

interface MiniTaxVizProps {
  dark: boolean;
}

export const MiniTaxViz = memo(function MiniTaxViz({ dark }: MiniTaxVizProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const darkRef = useRef(dark);
  useEffect(() => { darkRef.current = dark; }, [dark]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = 64, H = 64;
    c.width = W * dpr;
    c.height = H * dpr;
    c.style.width = `${W}px`;
    c.style.height = `${H}px`;
    ctx.scale(dpr, dpr);
    let raf: number;

    const draw = (ts: number) => {
      const t = ts * 0.001;
      ctx.clearRect(0, 0, W, H);
      const th = THEMES_CANVAS[darkRef.current ? "dark" : "light"];
      const [rr, rg, rb] = th.ringRGB;
      const barW = 14, gap = 8, startX = (W - barW * 2 - gap) / 2;
      const newH = 28 + Math.sin(t * 0.7) * 2;
      const oldH = 38 + Math.sin(t * 0.7 + 1) * 2;
      const baseY = H - 12;

      const g1 = ctx.createLinearGradient(0, baseY - oldH, 0, baseY);
      g1.addColorStop(0, `rgba(${rr},${rg},${rb},0.06)`);
      g1.addColorStop(1, `rgba(${rr},${rg},${rb},0.18)`);
      ctx.beginPath();
      ctx.roundRect(startX, baseY - oldH, barW, oldH, 3);
      ctx.fillStyle = g1;
      ctx.fill();

      const g2 = ctx.createLinearGradient(0, baseY - newH, 0, baseY);
      g2.addColorStop(0, `rgba(${rr},${rg},${rb},0.15)`);
      g2.addColorStop(1, `rgba(${rr},${rg},${rb},0.45)`);
      ctx.beginPath();
      ctx.roundRect(startX + barW + gap, baseY - newH, barW, newH, 3);
      ctx.fillStyle = g2;
      ctx.fill();

      ctx.fillStyle = `rgba(${rr},${rg},${rb},0.15)`;
      ctx.font = "7px -apple-system, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("old", startX + barW / 2, baseY + 9);
      ctx.fillText("new", startX + barW + gap + barW / 2, baseY + 9);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} style={{ display: "block" }} />;
});
