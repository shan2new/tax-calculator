"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRipples } from "@/hooks/useRipples";
import { Haptic } from "@/hooks/useHaptic";
import {
  MOMENTUM_DECAY_BASE,
  MOMENTUM_DECAY_FAST,
  MOMENTUM_VEL_KNEE,
  MOMENTUM_MIN_VELOCITY,
  SCRUB_INTENT_PX,
  SCRUB_RELEASE_FLASH_MS,
  SCRUB_TICK_PULSE_MS,
  SETTLE_B,
  SETTLE_K,
} from "@/lib/constants";
import { toINRCommas, parseINRInput, humanHint, fINR } from "@/lib/format";

interface RipplesProps {
  rips: { id: number; x: number; y: number }[];
}

function Ripples({ rips }: Readonly<RipplesProps>) {
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
  scrubFormat?: (v: number) => string;
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
  scrubFormat,
  label,
  parseInput,
  sensitivity = 1,
  onVelocity,
  isAmount,
  tickStep,
  onTick,
}: Readonly<ScrubValueProps>) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [shakeError, setShakeError] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [dotPulse, setDotPulse] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const [dragEnergy, setDragEnergy] = useState(0);
  const [dragDirection, setDragDirection] = useState(0);
  const [releaseFlash, setReleaseFlash] = useState(false);
  const [boundaryHit, setBoundaryHit] = useState<"min" | "max" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openDraftRef = useRef("");
  const shakeTimeoutRef = useRef(0);
  const scrubR = useRef({
    active: false,
    momentum: false,
    pointerId: -1,
    sx: 0,
    sy: 0,
    target: value,
    animated: value,
    committed: value,
    raw: value,
    moved: false,
    lx: 0,
    lt: 0,
    vel: 0,         // scrub gesture velocity  (px / ms)
    displayVel: 0,  // settle spring velocity  (value units / s)
  });
  const momentumRef = useRef<number>(0);
  const settleRef = useRef<number>(0);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const releaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const boundaryTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastBoundaryRef = useRef<"min" | "max" | null>(null);
  const cRef = useRef<HTMLDivElement>(null);
  const { rips, add } = useRipples();
  const prevBucket = useRef(Math.floor((value - min) / (tickStep || 1)));

  const clampRaw = useCallback((v: number) => Math.min(max, Math.max(min, v)), [min, max]);
  const clamp = useCallback(
    (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step)),
    [min, max, step]
  );
  const range = max - min || 1;
  const supportsMomentum = range / step >= 40;
  const visibleValue = clamp(displayValue);
  const pct = ((clampRaw(displayValue) - min) / range) * 100;

  const parsedDraft = isAmount ? parseINRInput(draft) : Number.NaN;
  const hint = (() => {
    if (!editing || !isAmount || Number.isNaN(parsedDraft) || parsedDraft <= 0) return "";
    // Show complementary format: shorthand input → expanded, raw digits → compact
    if (/\d\s*(?:cr|l)\s*$/i.test(draft)) return fINR(parsedDraft);
    return humanHint(parsedDraft);
  })();

  const getEdgeResistance = useCallback(
    (currentValue: number, direction: number) => {
      if (direction === 0) return 1;
      const distanceToEdge = direction > 0 ? max - currentValue : currentValue - min;
      const band = Math.max(range * 0.16, step * 8);
      if (distanceToEdge <= 0) return 0.12;
      if (distanceToEdge >= band) return 1;
      // Smooth cubic ease — feels like pushing into resistance, not a wall
      const t = distanceToEdge / band;
      const eased = t * t * (3 - 2 * t); // smoothstep
      return 0.12 + eased * 0.88;
    },
    [max, min, range, step]
  );

  const getStepTravelPx = useCallback(() => {
    const density = range / step;
    if (isAmount) {
      if (density >= 700) return 28;
      if (density >= 300) return 24;
      if (density >= 120) return 18;
      if (density >= 40) return 14;
      return 10;
    }
    if (density >= 150) return 10;
    if (density >= 80) return 9;
    if (density >= 30) return 8;
    return 6;
  }, [isAmount, range, step]);

  const getTravelBoost = useCallback(
    (totalDx: number) => {
      const span = Math.max(window.innerWidth * 0.65, 160);
      const travel = Math.min(Math.abs(totalDx) / span, 1);
      const eased = Math.pow(travel, 1.35);
      return 1 + eased * (isAmount ? 4.5 : 2.5);
    },
    [isAmount]
  );

  const projectDelta = useCallback(
    (deltaPx: number, totalDx: number, currentValue: number, useBoost = true) => {
      if (deltaPx === 0) return 0;
      const direction = Math.sign(deltaPx);
      const resistance = getEdgeResistance(currentValue, direction);
      const boost = useBoost ? getTravelBoost(totalDx) : 1;
      return (deltaPx / getStepTravelPx()) * step * sensitivity * resistance * boost;
    },
    [getEdgeResistance, getStepTravelPx, getTravelBoost, sensitivity, step]
  );

  const commitValue = useCallback(
    (nextRaw: number) => {
      const snapped = clamp(nextRaw);
      if (snapped !== scrubR.current.committed) {
        scrubR.current.committed = snapped;
        onChange(snapped);
      }
    },
    [clamp, onChange]
  );

  const fireBoundaryHit = useCallback(
    (edge: "min" | "max") => {
      if (lastBoundaryRef.current === edge) return; // don't re-fire same edge
      lastBoundaryRef.current = edge;
      Haptic.medium();
      setBoundaryHit(edge);
      globalThis.clearTimeout(boundaryTimeoutRef.current);
      boundaryTimeoutRef.current = globalThis.setTimeout(() => setBoundaryHit(null), 280);
    },
    []
  );

  const clearBoundaryTracking = useCallback(() => {
    lastBoundaryRef.current = null;
  }, []);

  const applyAnimatedValue = useCallback(
    (nextRaw: number) => {
      const bounded = clampRaw(nextRaw);
      scrubR.current.animated = bounded;
      setDisplayValue(bounded);
    },
    [clampRaw]
  );

  const stopSettling = useCallback(() => {
    cancelAnimationFrame(settleRef.current);
    settleRef.current = 0;
  }, []);

  const startSettling = useCallback(() => {
    if (settleRef.current !== 0) return;
    let lastT: number | null = null;

    const animate = (now: number) => {
      lastT ??= now;
      const dt = Math.min((now - lastT) / 1000, 0.033); // s, capped at 33ms
      lastT = now;

      const s = scrubR.current;
      const diff = s.target - s.animated;

      // Settle when both position error and velocity are negligible
      if (Math.abs(diff) < step * 0.12 && Math.abs(s.displayVel) < step * 0.25) {
        applyAnimatedValue(s.target);
        commitValue(s.target);
        s.displayVel = 0;
        settleRef.current = 0;
        return;
      }

      // Spring: F = K·(target − pos) − B·vel
      const accel = SETTLE_K * diff - SETTLE_B * s.displayVel;
      s.displayVel += accel * dt;
      applyAnimatedValue(s.animated + s.displayVel * dt);
      settleRef.current = requestAnimationFrame(animate);
    };

    settleRef.current = requestAnimationFrame(animate);
  }, [applyAnimatedValue, commitValue, step]);

  useEffect(() => {
    if (!tickStep || !scrubbing) {
      prevBucket.current = Math.floor((value - min) / (tickStep || 1));
      return;
    }
    const bucket = Math.floor((value - min) / tickStep);
    if (bucket !== prevBucket.current) {
      prevBucket.current = bucket;
      setDotPulse(true);
      Haptic.light();
      if (onTick) onTick();
      globalThis.clearTimeout(pulseTimeoutRef.current);
      pulseTimeoutRef.current = globalThis.setTimeout(() => setDotPulse(false), SCRUB_TICK_PULSE_MS);
    }
  }, [value, min, tickStep, scrubbing, onTick]);

  useEffect(() => {
    if (value === scrubR.current.committed) return;
    scrubR.current.committed = value;
    scrubR.current.target = value;
    if (!scrubR.current.active && !scrubR.current.momentum) {
      startSettling();
    }
  }, [value, startSettling]);

  const handleDraftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!isAmount) {
      setDraft(raw);
      return;
    }

    // Detect shorthand: digits (with optional dot) followed by L or Cr
    // e.g. "50L", "1.5Cr", "50 L" — but NOT bare letters like "abc"
    if (/\d\s*(?:cr|l)\s*$/i.test(raw)) {
      // Strip to digits, dots, and shorthand suffix only
      const cleaned = raw.replaceAll(/[^0-9.crl]/gi, "");
      // Extract numeric part (before L/Cr) and cap at 6 chars to prevent
      // "50,00,000" + "L" → "5000000L" = 5e12 absurdity
      const match = cleaned.match(/^([\d.]{0,6})\s*((?:cr|l))$/i);
      if (match) {
        setDraft(match[1] + match[2].toUpperCase().replace("CR", "Cr"));
      } else {
        setDraft(cleaned.slice(0, 9));
      }
      return;
    }

    // Cursor-aware comma formatting (digits-only mode)
    const input = inputRef.current;
    const cursorPos = input?.selectionStart ?? raw.length;

    // Count digits before cursor in old string
    const beforeCursor = raw.slice(0, cursorPos);
    const digitsBefore = beforeCursor.replaceAll(/\D/g, "").length;

    // Strip to digits only, cap at 10 digits to prevent absurd numbers
    const digitsOnly = raw.replaceAll(/\D/g, "").slice(0, 10);
    const formatted = toINRCommas(digitsOnly);
    setDraft(formatted);

    // Restore cursor after React flushes
    requestAnimationFrame(() => {
      if (!input) return;
      let digits = 0;
      let newPos = formatted.length;
      if (digitsBefore === 0) {
        newPos = 0;
      } else {
        for (let i = 0; i < formatted.length; i++) {
          if (/\d/.test(formatted[i])) digits++;
          if (digits >= digitsBefore) {
            newPos = i + 1;
            break;
          }
        }
      }
      input.setSelectionRange(newPos, newPos);
    });
  };

  const applyMomentum = useCallback(
    (initialVelocity: number, startValue: number) => {
      cancelAnimationFrame(momentumRef.current);
      scrubR.current.momentum = true;
      let v = initialVelocity;
      scrubR.current.target = startValue;
      let lastT = performance.now();
      const coast = (now: number) => {
        const dt = Math.min(34, now - lastT);
        lastT = now;

        // Velocity-dependent decay: gentle at low speed, tighter at high speed
        // This creates a natural deceleration curve like a ball on grass
        const absV = Math.abs(v);
        const blend = Math.min(absV / MOMENTUM_VEL_KNEE, 1);
        const decayRate = MOMENTUM_DECAY_BASE * (1 - blend) + MOMENTUM_DECAY_FAST * blend;
        const decay = Math.pow(decayRate, dt / 16.6667);
        v *= decay;
        if (Math.abs(v) < 0.01) {
          scrubR.current.momentum = false;
          startSettling();
          return;
        }

        const deltaPx = v * dt;
        const deltaVal = projectDelta(deltaPx, deltaPx, scrubR.current.target, false);
        const unclamped = scrubR.current.target + deltaVal;
        scrubR.current.target = clampRaw(unclamped);

        // Boundary hit during momentum: fire haptic and kill velocity
        if (unclamped <= min || unclamped >= max) {
          fireBoundaryHit(unclamped <= min ? "min" : "max");
          v *= 0.15; // sharp deceleration at boundary
        }

        commitValue(scrubR.current.target);
        startSettling();
        momentumRef.current = requestAnimationFrame(coast);
      };
      momentumRef.current = requestAnimationFrame(coast);
    },
    [clampRaw, commitValue, fireBoundaryHit, min, max, projectDelta, startSettling]
  );

  const onDown = (e: React.PointerEvent) => {
    if (editing) return;
    cancelAnimationFrame(momentumRef.current);
    scrubR.current.momentum = false;
    const s = scrubR.current;
    s.active = true;
    s.pointerId = e.pointerId;
    s.sx = e.clientX;
    s.sy = e.clientY;
    s.target = value;
    s.animated = displayValue;
    s.committed = value;
    s.raw = value;
    s.moved = false;
    s.lx = e.clientX;
    s.lt = performance.now();
    s.vel = 0;
    s.displayVel = 0;
    setReleaseFlash(false);
    if (cRef.current) {
      const r = cRef.current.getBoundingClientRect();
      add(e.clientX - r.left, e.clientY - r.top);
    }
  };

  const onMove = (e: React.PointerEvent) => {
    const s = scrubR.current;
    if (!s.active || e.pointerId !== s.pointerId) return;

    const totalDx = e.clientX - s.sx;
    const totalDy = e.clientY - s.sy;
    if (!s.moved && Math.abs(totalDx) < SCRUB_INTENT_PX && Math.abs(totalDy) < SCRUB_INTENT_PX) {
      return;
    }
    if (!s.moved) {
      if (Math.abs(totalDx) <= Math.abs(totalDy) * 1.15) {
        s.active = false;
        return;
      }
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setScrubbing(true);
      Haptic.light(); // confirm scrub intent
    }
    s.moved = true;

    const deltaPx = e.clientX - s.lx;
    const deltaVal = projectDelta(deltaPx, totalDx, s.raw);
    const unclamped = s.raw + deltaVal;
    s.raw = clampRaw(unclamped);
    s.target = s.raw;
    commitValue(s.target);
    startSettling();

    // Boundary hit detection: fire when drag pushes past limits
    if (unclamped <= min && deltaVal < 0) fireBoundaryHit("min");
    else if (unclamped >= max && deltaVal > 0) fireBoundaryHit("max");
    else if (s.raw > min && s.raw < max) clearBoundaryTracking();

    const now = performance.now();
    const dt = now - s.lt;
    if (dt > 0 && dt < 120) {
      const instant = (e.clientX - s.lx) / dt;
      s.vel = s.vel * 0.3 + instant * 0.7;
      setDragDirection(Math.sign(s.vel || totalDx));
      setDragEnergy(Math.min(1, Math.abs(s.vel) * 1.9));
      if (onVelocity) onVelocity(Math.abs(s.vel) * 16);
    }
    s.lx = e.clientX;
    s.lt = now;
  };

  const onUp = (e: React.PointerEvent) => {
    const s = scrubR.current;
    if (!s.active || e.pointerId !== s.pointerId) return;
    s.active = false;
    setScrubbing(false);
    setDragEnergy(0);
    setDragDirection(0);
    if (onVelocity) onVelocity(0);
    clearBoundaryTracking();
    if (!s.moved) {
      openEditor();
      return;
    }
    setReleaseFlash(true);
    globalThis.clearTimeout(releaseTimeoutRef.current);
    releaseTimeoutRef.current = globalThis.setTimeout(
      () => setReleaseFlash(false),
      SCRUB_RELEASE_FLASH_MS
    );
    if (
      supportsMomentum &&
      s.target > min &&
      s.target < max &&
      Math.abs(s.vel) > MOMENTUM_MIN_VELOCITY
    ) {
      Haptic.light(); // momentum release
      applyMomentum(s.vel, s.target);
      return;
    }
    s.momentum = false;
    startSettling();
  };

  const onCancel = (e: React.PointerEvent) => {
    const s = scrubR.current;
    if (!s.active || e.pointerId !== s.pointerId) return;
    s.active = false;
    s.momentum = false;
    setScrubbing(false);
    setDragEnergy(0);
    setDragDirection(0);
    if (onVelocity) onVelocity(0);
    startSettling();
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      const input = inputRef.current;
      input.focus();
      input.select();
    }
  }, [editing]);

  useEffect(
    () => () => {
      cancelAnimationFrame(momentumRef.current);
      stopSettling();
      globalThis.clearTimeout(pulseTimeoutRef.current);
      globalThis.clearTimeout(releaseTimeoutRef.current);
      globalThis.clearTimeout(shakeTimeoutRef.current);
      globalThis.clearTimeout(boundaryTimeoutRef.current);
    },
    [stopSettling]
  );

  const commit = (fromBlur = false) => {
    const trimmed = draft.trim();
    if (trimmed === "" || trimmed === openDraftRef.current) {
      setEditing(false);
      setShakeError(false);
      return;
    }

    let p: number;
    if (isAmount) p = parseINRInput(trimmed);
    else p = parseInput ? parseInput(trimmed) : Number.parseFloat(trimmed.replaceAll(",", ""));

    if (!Number.isNaN(p) && Number.isFinite(p)) {
      // Clamp to valid range (don't reject out-of-range, just snap)
      const next = clamp(p);
      scrubR.current.target = next;
      scrubR.current.animated = next;
      scrubR.current.committed = next;
      setDisplayValue(next);
      stopSettling();
      onChange(next);
      setEditing(false);
      setShakeError(false);
    } else if (fromBlur) {
      setEditing(false);
      setShakeError(false);
    } else {
      // Clear and re-trigger to allow rapid re-shakes
      globalThis.clearTimeout(shakeTimeoutRef.current);
      setShakeError(false);
      requestAnimationFrame(() => {
        setShakeError(true);
        Haptic.light();
        shakeTimeoutRef.current = window.setTimeout(() => setShakeError(false), 400);
      });
    }
  };

  const nudgeValue = useCallback(
    (direction: number) => {
      const next = clamp(value + direction * step);
      if (next === value) {
        // At boundary — fire boundary feedback
        Haptic.medium();
        setBoundaryHit(direction > 0 ? "max" : "min");
        globalThis.clearTimeout(boundaryTimeoutRef.current);
        boundaryTimeoutRef.current = globalThis.setTimeout(() => setBoundaryHit(null), 280);
        return;
      }
      Haptic.light();
      scrubR.current.target = next;
      scrubR.current.animated = next;
      scrubR.current.committed = next;
      scrubR.current.raw = next;
      scrubR.current.momentum = false;
      setDisplayValue(next);
      stopSettling();
      onChange(next);
    },
    [clamp, onChange, step, stopSettling, value]
  );

  let labelColor = "var(--text-muted)";
  if (editing) labelColor = "var(--text-muted-mid)";
  else if (scrubbing) labelColor = "var(--text-muted-strong)";
  else if (hovered) labelColor = "var(--text-muted-mid)";

  let trackColor = "var(--track-rest)";
  if (editing || scrubbing) trackColor = "var(--track-active)";
  else if (hovered) trackColor = "var(--track-hover)";

  let dotSize = 0;
  if (boundaryHit) dotSize = 8;
  else if (dotPulse) dotSize = 10;
  else if (editing) dotSize = 4;
  else if (scrubbing) dotSize = 5;
  else if (hovered) dotSize = 3;

  let dotShadow = "none";
  if (boundaryHit) dotShadow = "var(--glow-strong)";
  else if (dotPulse) dotShadow = "var(--glow-strong)";
  else if (editing || scrubbing) dotShadow = "var(--glow)";

  const dotTransition = dotPulse
    ? "width 0.12s cubic-bezier(0.16,1,0.3,1), height 0.12s cubic-bezier(0.16,1,0.3,1), box-shadow 0.16s cubic-bezier(0.16,1,0.3,1)"
    : "width 0.34s cubic-bezier(0.16,1,0.3,1), height 0.34s cubic-bezier(0.16,1,0.3,1), box-shadow 0.34s cubic-bezier(0.16,1,0.3,1)";
  const stretch = scrubbing ? dragEnergy * 9 : releaseFlash ? 4 : 0;
  const dotWidth = dotSize + stretch;
  const dotHeight = Math.max(3, dotSize - stretch * 0.22);
  const dotTransform = `translate(-50%,-50%) translateX(${dragDirection * dragEnergy * 2}px) scale(${releaseFlash ? 1.06 : 1})`;
  let cursor = "grab";
  if (editing) cursor = "text";
  else if (scrubbing) cursor = "grabbing";
  const valueText = scrubbing && scrubFormat ? scrubFormat(visibleValue) : format(visibleValue);

  const openEditor = useCallback(() => {
    let initial: string;
    if (isAmount) initial = toINRCommas(String(Math.round(value)));
    else if (typeof value === "number" && value % 1 !== 0) initial = value.toFixed(1);
    else initial = String(Math.round(value));
    setDraft(initial);
    openDraftRef.current = initial;
    setEditing(true);
  }, [isAmount, value]);

  useEffect(() => {
    if (settleRef.current !== 0 || scrubR.current.momentum) return;
    scrubR.current.momentum = false;
  }, [value]);

  return (
    <div
      ref={cRef}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onCancel}
      onKeyDown={(e) => {
        if (editing) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openEditor();
          return;
        }
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          nudgeValue(1);
          return;
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          nudgeValue(-1);
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onContextMenu={(e) => {
        if (!editing) e.preventDefault();
      }}
      tabIndex={editing ? -1 : 0}
      role="slider"
      aria-label={`${label}: ${valueText}`}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={visibleValue}
      aria-valuetext={valueText}
      style={{
        padding: "16px 0 12px",
        cursor,
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "pan-y",
        position: "relative",
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
          overflow: "visible",
        }}
      >
        <div style={{ flexShrink: 1, minWidth: 0, marginRight: 12 }}>
          <span
            style={{
              fontSize: 12,
              color: labelColor,
              letterSpacing: "0.04em",
              transition:
                "color 0.32s cubic-bezier(0.16,1,0.3,1), opacity 0.32s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {label}
          </span>
          <div
            style={{
              fontSize: 10,
              color: "var(--text-muted-mid)",
              marginTop: 2,
              opacity: hint ? 1 : 0,
              maxHeight: hint ? 16 : 0,
              transform: hint ? "translateY(0)" : "translateY(-4px)",
              overflow: "hidden",
              transition:
                "opacity 0.28s cubic-bezier(0.16,1,0.3,1), max-height 0.28s cubic-bezier(0.16,1,0.3,1), transform 0.28s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {hint || "\u00A0"}
          </div>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            minWidth: isAmount ? 180 : 120,
            flexShrink: 0,
            minHeight: isAmount ? 40 : 32,
          }}
        >
          <span
            aria-hidden={editing}
            style={{
              fontSize: 24,
              fontWeight: 200,
              color: scrubbing ? "var(--text-primary)" : "var(--text-secondary)",
              letterSpacing: "-0.03em",
              fontFamily: "var(--font)",
              whiteSpace: "nowrap",
              fontVariantNumeric: "tabular-nums",
              opacity: editing ? 0 : 1,
              transform: editing ? "translateY(-6px) scale(0.985)" : "translateY(0) scale(1)",
              transformOrigin: "right center",
              transition:
                "opacity 0.28s cubic-bezier(0.16,1,0.3,1), transform 0.32s cubic-bezier(0.16,1,0.3,1), color 0.32s cubic-bezier(0.16,1,0.3,1)",
              pointerEvents: editing ? "none" : "auto",
            }}
          >
            {valueText}
          </span>
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              width: "100%",
              opacity: editing ? 1 : 0,
              transform: editing ? "translateY(0) scale(1)" : "translateY(8px) scale(0.985)",
              transformOrigin: "right top",
              transition:
                "opacity 0.28s cubic-bezier(0.16,1,0.3,1), transform 0.32s cubic-bezier(0.16,1,0.3,1)",
              animation: shakeError ? "shake 0.3s ease" : "none",
              pointerEvents: editing ? "auto" : "none",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              inputMode={isAmount ? "text" : "decimal"}
              value={draft}
              onChange={handleDraftChange}
              onBlur={() => commit(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); commit(false); }
                if (e.key === "Escape") {
                  e.preventDefault();
                  setDraft(openDraftRef.current);
                  setEditing(false);
                  setShakeError(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: shakeError
                  ? "1.5px solid var(--error, #e55)"
                  : "1px solid var(--border-strong)",
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
                userSelect: "text",
                WebkitTouchCallout: "none",
                transition:
                  "border-color 0.32s cubic-bezier(0.16,1,0.3,1), color 0.32s cubic-bezier(0.16,1,0.3,1), opacity 0.28s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
            <div
              style={{
                fontSize: 9,
                color: "var(--text-muted-faint)",
                marginTop: 4,
                opacity: editing && isAmount ? 1 : 0,
                maxHeight: editing && isAmount ? 14 : 0,
                transform: editing && isAmount ? "translateY(0)" : "translateY(-4px)",
                overflow: "hidden",
                transition:
                  "opacity 0.28s cubic-bezier(0.16,1,0.3,1), max-height 0.28s cubic-bezier(0.16,1,0.3,1), transform 0.28s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {isAmount ? "type \"50L\" or \"1.5Cr\"" : "\u00A0"}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          height: scrubbing ? 3 : 2,
          position: "relative",
          borderRadius: 1.5,
          overflow: "hidden",
          transition: "height 0.28s cubic-bezier(0.16,1,0.3,1)",
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
            background: trackColor,
            borderRadius: 1,
            transition:
              "background 0.32s cubic-bezier(0.16,1,0.3,1), opacity 0.32s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${Math.max(0, pct - 18)}%`,
            width: "24%",
            minWidth: 36,
            height: "100%",
            opacity: scrubbing ? 0.9 : releaseFlash ? 0.55 : 0,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
            transform: `translateX(${dragDirection * 10}px)`,
            transition:
              "opacity var(--motion-medium) var(--ease-premium), transform var(--motion-medium) var(--ease-premium)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${pct}%`,
            top: "50%",
            transform: dotTransform,
            width: dotWidth,
            height: dotHeight,
            borderRadius: 999,
            background: "var(--dot-color)",
            boxShadow: dotShadow,
            transition: dotTransition,
          }}
        />
      </div>
    </div>
  );
}
