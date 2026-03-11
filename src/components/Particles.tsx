"use client";

import { useRef, useEffect } from "react";
import { THEMES_CANVAS } from "@/lib/theme";

interface ParticlesProps {
  intensity: number;
  dark: boolean;
}

export function Particles({ intensity, dark }: ParticlesProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const intRef = useRef(intensity);
  const darkRef = useRef(dark);

  useEffect(() => { intRef.current = intensity; }, [intensity]);
  useEffect(() => { darkRef.current = dark; }, [dark]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      c.style.width = "100%";
      c.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const ps = Array.from({ length: 20 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.05 - 0.015,
      sz: Math.random() * 1.2 + 0.3,
      op: Math.random() * 0.025,
      ph: Math.random() * Math.PI * 2,
    }));

    let rafId: number;
    const draw = (ts: number) => {
      const t = ts * 0.001;
      const w = window.innerWidth, h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      const th = THEMES_CANVAS[darkRef.current ? "dark" : "light"];
      const [pr, pg, pb] = th.particleRGB;
      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        const fl = (Math.sin(t * 1.2 + p.ph) + 1) * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pr},${pg},${pb}, ${p.op * (0.4 + fl * 0.6) * (0.3 + intRef.current * 0.7)})`;
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
}
