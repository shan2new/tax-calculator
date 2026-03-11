"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Haptic } from "@/hooks/useHaptic";
import { useRipples } from "@/hooks/useRipples";
import { toINRCommas, parseINRInput, humanHint } from "@/lib/format";

interface RipplesProps {
  rips: { id: number; x: number; y: number }[];
}

function Ripples({ rips }: RipplesProps) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {rips.map((r) => (
        <div
          key={r.id}
          style={{
            position: "absolute",
            left: r.x,
            top: r.y,
            width: 0,
            height: 0,
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--ripple) 0%, transparent 70%)",
            animation: "rip 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
            transform: "translate(-50%,-50%)",
          }}
        />
      ))}
    </div>
  );
}

interface ScrubValueProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  label: string;
  parseInput?: (s: string) => number;
  sensitivity?: number;
  onVelocity?: (v: number) => void;
  isAmount?: boolean;
  tickStep?: number;
  onTick?: () => void;
}

export function ScrubValue({
  value,
  onChange,
  min,
  max,
  step,
  format,
  label,
  parseInput,
  sensitivity = 1,
  onVelocity,
  isAmount,
  tickStep,
  onTick,
}: ScrubValueProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [scrubbing, setScrubbing] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [dotPulse, setDotPulse] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrubR = useRef({ active: false, sx: 0, sv: 0, moved: false, lx: 0, lt: 0, vel: 0 });
  const momentumRef = useRef<number>(0);
  const cRef = useRef<HTMLDivElement>(null);
  const { rips, add } = useRipples();
  const prevBucket = useRef(Math.floor(value / (tickStep || 1)));

  const clamp = useCallback(
    (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step)),
    [min, max, step]
  );
  const pct = ((value - min) / (max - min)) * 100;

  const parsedDraft = isAmount ? parseINRInput(draft) : NaN;
  const hint =
    editing && isAmount && !isNaN(parsedDraft) && parsedDraft > 0 ? humanHint(parsedDraft) : "";

  useEffect(() => {
    if (!tickStep || !scrubbing) {
      prevBucket.current = Math.floor(value / (tickStep || 1));
      return;
    }
    const bucket = Math.floor(value / tickStep);
    if (bucket !== prevBucket.current) {
      prevBucket.current = bucket;
      setDotPulse(true);
      Haptic.light();
      if (onTick) onTick();
      setTimeout(() => setDotPulse(false), 180);
    }
  }, [value, tickStep, scrubbing, onTick]);

  const handleDraftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (isAmount) {
      const a = raw.replace(/[^0-9.,crClL\s]/g, "");
      setDraft(/[crClL]/i.test(a) ? a : toINRCommas(a.replace(/,/g, "")));
    } else {
      setDraft(raw);
    }
  };

  const applyMomentum = useCallback(
    (iv: number, cv: number) => {
      cancelAnimationFrame(momentumRef.current);
      let v = iv;
      let currentVal = cv;
      const coast = () => {
        v *= 0.93;
        if (Math.abs(v) < 0.4) return;
        currentVal = clamp(
          currentVal + (v * 0.016) / (window.innerWidth * 0.5) * (max - min) * sensitivity
        );
        onChange(currentVal);
        momentumRef.current = requestAnimationFrame(coast);
      };
      momentumRef.current = requestAnimationFrame(coast);
    },
    [max, min, sensitivity, clamp, onChange]
  );

  const onDown = (e: React.PointerEvent) => {
    if (editing) return;
    cancelAnimationFrame(momentumRef.current);
    const s = scrubR.current;
    s.active = true;
    s.sx = e.clientX;
    s.sv = value;
    s.moved = false;
    s.lx = e.clientX;
    s.lt = performance.now();
    s.vel = 0;
    if (cRef.current) {
      const r = cRef.current.getBoundingClientRect();
      add(e.clientX - r.left, e.clientY - r.top);
    }

    const onMove = (ev: PointerEvent) => {
      if (!s.active) return;
      const dx = ev.clientX - s.sx;
      if (!s.moved && Math.abs(dx) < 5) return;
      if (!s.moved) Haptic.light();
      s.moved = true;
      setScrubbing(true);
      onChange(clamp(s.sv + (dx / (window.innerWidth * 0.5)) * (max - min) * sensitivity));
      const now = performance.now();
      const dt = now - s.lt;
      if (dt > 0 && dt < 100) {
        s.vel = ((ev.clientX - s.lx) / dt) * 16;
        if (onVelocity) onVelocity(Math.abs(s.vel) / 16);
      }
      s.lx = ev.clientX;
      s.lt = now;
    };

    const onUp = () => {
      s.active = false;
      setScrubbing(false);
      if (onVelocity) onVelocity(0);
      if (!s.moved) {
        Haptic.medium();
        if (isAmount) setDraft(toINRCommas(String(Math.round(value))));
        else if (typeof value === "number" && value % 1 !== 0) setDraft(value.toFixed(1));
        else setDraft(String(Math.round(value)));
        setEditing(true);
      } else if (Math.abs(s.vel) > 3) {
        Haptic.light();
        applyMomentum(s.vel, value);
      }
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => () => cancelAnimationFrame(momentumRef.current), []);

  const commit = () => {
    let p: number;
    if (isAmount) p = parseINRInput(draft);
    else p = parseInput ? parseInput(draft) : parseFloat(draft.replace(/,/g, ""));
    if (!isNaN(p)) onChange(clamp(p));
    setEditing(false);
  };

  return (
    <div
      ref={cRef}
      onPointerDown={onDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "16px 0 12px",
        cursor: editing ? "text" : scrubbing ? "grabbing" : "grab",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none",
        position: "relative",
        overflow: "hidden",
        minHeight: 44,
      }}
    >
      <Ripples rips={rips} />
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ flexShrink: 0, marginRight: 12 }}>
          <span
            style={{
              fontSize: 12,
              color: scrubbing
                ? "var(--text-muted-strong)"
                : hovered
                  ? "var(--text-muted-mid)"
                  : "var(--text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            {label}
          </span>
          {hint && (
            <div
              style={{
                fontSize: 10,
                color: "var(--text-muted-mid)",
                marginTop: 2,
                animation: "hintFade 0.2s ease",
              }}
            >
              {hint}
            </div>
          )}
        </div>
        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <input
              ref={inputRef}
              type="text"
              inputMode={isAmount ? "numeric" : "decimal"}
              value={draft}
              onChange={handleDraftChange}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") setEditing(false);
              }}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: "1px solid var(--border-strong)",
                color: "var(--text-primary)",
                fontSize: 24,
                fontWeight: 200,
                textAlign: "right",
                width: "100%",
                maxWidth: 180,
                outline: "none",
                fontFamily: "var(--font)",
                letterSpacing: "-0.02em",
                padding: "0 0 2px",
                caretColor: "var(--text-muted-mid)",
              }}
            />
            {isAmount && (
              <div style={{ fontSize: 9, color: "var(--text-muted-faint)", marginTop: 4 }}>
                type &quot;50L&quot; or &quot;1.5Cr&quot;
              </div>
            )}
          </div>
        ) : (
          <span
            style={{
              fontSize: 24,
              fontWeight: 200,
              color: scrubbing ? "var(--text-primary)" : "var(--text-secondary)",
              letterSpacing: "-0.03em",
              fontFamily: "var(--font)",
              whiteSpace: "nowrap",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {format(value)}
          </span>
        )}
      </div>
      <div
        style={{
          marginTop: 10,
          height: 2,
          position: "relative",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "var(--track-bg)" }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${pct}%`,
            background: scrubbing
              ? "var(--track-active)"
              : hovered
                ? "var(--track-hover)"
                : "var(--track-rest)",
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${pct}%`,
            top: "50%",
            transform: "translate(-50%,-50%)",
            width: dotPulse ? 10 : scrubbing ? 5 : hovered ? 3 : 0,
            height: dotPulse ? 10 : scrubbing ? 5 : hovered ? 3 : 0,
            borderRadius: "50%",
            background: "var(--dot-color)",
            boxShadow: dotPulse ? "var(--glow-strong)" : scrubbing ? "var(--glow)" : "none",
            transition: dotPulse
              ? "all 0.06s ease-out"
              : "all 0.25s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>
    </div>
  );
}
