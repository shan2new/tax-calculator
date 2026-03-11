"use client";

import { useCallback, useState } from "react";

interface PremiumPressOptions {
  disabled?: boolean;
}

export function usePremiumPress(options: PremiumPressOptions = {}) {
  const { disabled = false } = options;
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const release = useCallback(() => {
    setPressed(false);
  }, []);

  return {
    pressed,
    hovered,
    bind: {
      onPointerDown: disabled ? undefined : () => setPressed(true),
      onPointerUp: disabled ? undefined : release,
      onPointerLeave: disabled
        ? undefined
        : () => {
            setPressed(false);
            setHovered(false);
          },
      onPointerCancel: disabled ? undefined : release,
      onMouseEnter: disabled ? undefined : () => setHovered(true),
      onMouseLeave: disabled
        ? undefined
        : () => {
            setPressed(false);
            setHovered(false);
          },
      onBlur: disabled
        ? undefined
        : () => {
            setPressed(false);
            setHovered(false);
          },
      onKeyDown: disabled
        ? undefined
        : (e: React.KeyboardEvent) => {
            if (e.key === " " || e.key === "Enter") setPressed(true);
          },
      onKeyUp: disabled
        ? undefined
        : (e: React.KeyboardEvent) => {
            if (e.key === " " || e.key === "Enter") setPressed(false);
          },
    },
  };
}
