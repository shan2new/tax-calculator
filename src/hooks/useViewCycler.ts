"use client";

import { useCallback, useEffect, useState } from "react";
import { VIEW_SWAP_DELAY_MS } from "@/lib/constants";

interface UseViewCyclerOptions {
  viewCount: number;
  initialView?: number;
  skipAnimation?: boolean;
}

export function useViewCycler({
  viewCount,
  initialView = 0,
  skipAnimation = false,
}: Readonly<UseViewCyclerOptions>) {
  const [view, setView] = useState(initialView);
  const [displayView, setDisplayView] = useState(initialView);
  const [visible, setVisible] = useState(true);

  const cycle = useCallback(() => {
    setView((current) => (current + 1) % viewCount);
  }, [viewCount]);

  useEffect(() => {
    if (skipAnimation) {
      setDisplayView(view);
      setVisible(true);
      return;
    }
    if (displayView === view) return;

    setVisible(false);
    const timer = globalThis.setTimeout(() => {
      setDisplayView(view);
      setVisible(true);
    }, VIEW_SWAP_DELAY_MS);

    return () => globalThis.clearTimeout(timer);
  }, [displayView, skipAnimation, view]);

  return {
    view,
    setView,
    displayView,
    visible,
    cycle,
  };
}
