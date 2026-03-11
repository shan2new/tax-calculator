"use client";

import { useState, useCallback } from "react";

export interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function useRipples() {
  const [rips, setRips] = useState<Ripple[]>([]);

  const add = useCallback((x: number, y: number) => {
    const id = Date.now() + Math.random();
    setRips((p) => [...p, { id, x, y }]);
    setTimeout(() => setRips((p) => p.filter((r) => r.id !== id)), 700);
  }, []);

  return { rips, add };
}
