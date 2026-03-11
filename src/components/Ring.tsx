"use client";

import { memo, useRef, useEffect } from "react";
import { THEMES_CANVAS } from "@/lib/theme";

interface RingProps {
  ir: number;
  velocity: number;
  tickSignal: number;
  dark: boolean;
  pinnedIR: number | null;
  size?: number;
}

export const Ring = memo(function Ring({
  ir,
  velocity,
  tickSignal,
  dark,
  pinnedIR,
  size = 260,
}: RingProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const data = useRef({ ir, vel: 0, tb: 0, pinIR: null as number | null });
  const darkRef = useRef(dark);


  useEffect(() => {
    data.current.ir = ir;
    data.current.vel = Math.min(1, Math.abs(velocity) * 3);
  }, [ir, velocity]);

  useEffect(() => {
    if (tickSignal) data.current.tb = 0.35;
  }, [tickSignal]);

  useEffect(() => {
    darkRef.current = dark;
  }, [dark]);

  useEffect(() => {
    data.current.pinIR = pinnedIR;
  }, [pinnedIR]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = size;
    c.width = W * dpr;
    c.height = W * dpr;
    c.style.width = `${W}px`;
    c.style.height = `${W}px`;
    ctx.scale(dpr, dpr);
    const cx = W / 2, cy = W / 2, R = W * 0.385;
    let sIR = data.current.ir, sVel = 0, raf: number;
    const sR = [232, 228, 222], sW = [255, 180, 160];

    const sparks = Array.from({ length: 8 }, (_, i) => ({
      phase: i * 0.8,
      drift: (Math.random() - 0.5) * 12,
      speed: 0.5 + Math.random() * 0.8,
    }));

    const draw = (ts: number) => {
      const t = ts * 0.001;
      const { ir: tIR, vel, tb } = data.current;
      data.current.vel *= 0.94;
      data.current.tb *= 0.88;
      sIR += (tIR - sIR) * 0.06;
      sVel += (vel - sVel) * 0.12;
      const th = THEMES_CANVAS[darkRef.current ? "dark" : "light"];
      for (let i = 0; i < 3; i++) {
        sR[i] += (th.ringRGB[i] - sR[i]) * 0.04;
        sW[i] += (th.warnRGB[i] - sW[i]) * 0.04;
      }
      const rr = Math.round(sR[0]), rg = Math.round(sR[1]), rb = Math.round(sR[2]);
      const wr = Math.round(sW[0]), wg = Math.round(sW[1]), wb = Math.round(sW[2]);
      ctx.clearRect(0, 0, W, W);

      // Inner luminance field
      const warmth = Math.max(0, (sIR - 0.2) / 0.6);
      const lumR = Math.round(rr * (1 - warmth * 0.3) + wr * warmth * 0.3);
      const lumG = Math.round(rg * (1 - warmth * 0.5) + wg * warmth * 0.3);
      const lumB = Math.round(rb * (1 - warmth * 0.5) + wb * warmth * 0.3);
      const innerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.7);
      innerGlow.addColorStop(0, `rgba(${lumR},${lumG},${lumB},${0.015 + warmth * 0.015 + tb * 0.02})`);
      innerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = innerGlow;
      ctx.fillRect(0, 0, W, W);

      // Outer glow layers
      for (let i = 2; i >= 0; i--) {
        const g = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, R * (1.15 + i * 0.12));
        g.addColorStop(0, `rgba(${rr},${rg},${rb},${th.glowBase * (3 - i) + sVel * 0.01 + tb * 0.02})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, W);
      }

      const br = 1 + Math.sin(t * 0.9) * (0.004 + sIR * 0.008 + sVel * 0.015) + tb * 0.012;
      const wob = (a: number) =>
        R * br +
        Math.sin(a * 3 + t * 0.6) * (0.4 + sIR * 2.5 + sVel * 6 + tb * 10) +
        Math.cos(a * 5 + t * 1.0) * (0.2 + sIR * 1.2 + sVel * 3 + tb * 5) +
        Math.sin(a * 7 + t * 1.4) * (sVel * 2 + tb * 3);
      const start = -Math.PI / 2;
      const pEnd = (1 - sIR) * Math.PI * 2;

      // Ghost ring — outer echo
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.04) {
        const ang = start + a, r2 = wob(ang) * (1.08 + tb * 0.025);
        if (a < 0.04) ctx.moveTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
        else ctx.lineTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(${rr},${rg},${rb},${0.012 + sVel * 0.012 + tb * 0.025})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Ghost ring 2 — inner whisper
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.04) {
        const ang = start + a, r2 = wob(ang) * (0.92 - tb * 0.01);
        if (a < 0.04) ctx.moveTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
        else ctx.lineTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(${rr},${rg},${rb},${0.008 + sVel * 0.008})`;
      ctx.lineWidth = 0.3;
      ctx.stroke();

      // Pinned comparison ghost arc
      const pinIR = data.current.pinIR;
      if (pinIR !== null && pinIR !== undefined) {
        const pinPEnd = (1 - pinIR) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, R * 0.99, start, start + pinPEnd);
        ctx.strokeStyle = `rgba(${rr},${rg},${rb},0.12)`;
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
        if (pinIR > 0.01) {
          ctx.beginPath();
          ctx.arc(cx, cy, R * 0.99, start + pinPEnd + 0.06, start + Math.PI * 2);
          ctx.strokeStyle = `rgba(${wr},${wg},${wb},0.06)`;
          ctx.lineWidth = 1.2;
          ctx.lineCap = "round";
          ctx.setLineDash([3, 5]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Principal arc — gradient stroke
      for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath();
        for (let a = 0; a <= pEnd; a += 0.015) {
          const ang = start + a, r2 = wob(ang) + (pass === 1 ? 0.5 : -0.5);
          if (a < 0.02) ctx.moveTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
          else ctx.lineTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
        }
        if (pass === 0) {
          ctx.shadowColor = `rgba(${rr},${rg},${rb},${th.glowAlpha + tb * 0.12})`;
          ctx.shadowBlur = 8 + sVel * 10 + tb * 14;
          ctx.strokeStyle = `rgba(${rr},${rg},${rb},${th.ringAlpha})`;
          ctx.lineWidth = 2.2 + sVel * 1 + tb * 1.2;
        } else {
          ctx.shadowBlur = 0;
          ctx.strokeStyle = `rgba(${rr},${rg},${rb},${th.ringAlpha * 0.3})`;
          ctx.lineWidth = 0.8;
        }
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Interest arc
      if (sIR > 0.005) {
        ctx.beginPath();
        const gap = 0.06;
        for (let a = pEnd + gap; a <= Math.PI * 2; a += 0.015) {
          const ang = start + a, r2 = wob(ang);
          if (a < pEnd + gap + 0.02) ctx.moveTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
          else ctx.lineTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
        }
        ctx.strokeStyle = `rgba(${wr},${wg},${wb},${th.interestBase + sIR * 0.15})`;
        ctx.shadowColor = `rgba(${wr},${wg},${wb},${sIR * 0.06})`;
        ctx.shadowBlur = sIR * 6;
        ctx.lineWidth = 1.4 + sIR * 0.6;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Boundary sparks
      if (sIR > 0.02 && sIR < 0.98) {
        const boundaryAngle = start + pEnd + 0.03;
        const bR = wob(boundaryAngle);
        const bx = cx + Math.cos(boundaryAngle) * bR;
        const by = cy + Math.sin(boundaryAngle) * bR;
        for (const sp of sparks) {
          const life = (Math.sin(t * sp.speed + sp.phase) + 1) * 0.5;
          const drift = sp.drift * life * (0.5 + sIR * 1.5);
          const sx = bx + Math.cos(boundaryAngle + Math.PI / 2) * drift;
          const sy = by + Math.sin(boundaryAngle + Math.PI / 2) * drift;
          const op = life * (0.03 + sIR * 0.04 + tb * 0.06);
          const sz = 0.5 + life * (0.8 + tb * 1.5);
          const mix = life;
          const sr = Math.round(rr * (1 - mix) + wr * mix);
          const sg = Math.round(rg * (1 - mix) + wg * mix);
          const sb = Math.round(rb * (1 - mix) + wb * mix);
          ctx.beginPath();
          ctx.arc(sx, sy, sz, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${sr},${sg},${sb},${op})`;
          ctx.fill();
        }
      }

      // Orbiting embers
      const ec = 4 + Math.round(tb * 6);
      for (let i = 0; i < ec; i++) {
        const a = (t * (0.14 + i * 0.04) + i * 1.1) % (Math.PI * 2);
        const ang = start + a, r2 = wob(ang) + Math.sin(t * 1.4 + i) * (2 + sVel * 4 + tb * 7);
        const op = (Math.sin(t * 1.0 + i * 0.9) + 1) * (0.015 + sVel * 0.025 + tb * 0.035);
        ctx.beginPath();
        ctx.arc(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2, 0.8 + sVel * 1 + tb * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rr},${rg},${rb},${op})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return <canvas ref={ref} style={{ display: "block" }} />;
});
