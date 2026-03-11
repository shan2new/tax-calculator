"use client";

import type { ReactNode } from "react";

interface HeroStageProps {
  children: ReactNode;
  minHeight?: number;
  paddingBottom?: number;
}

/**
 * Shared presentation wrapper for module top-stage hero areas.
 * Provides consistent centering, min-height, and bottom spacing
 * without encoding any interaction or business logic.
 */
export function HeroStage({
  children,
  minHeight = 260,
  paddingBottom = 4,
}: Readonly<HeroStageProps>) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight,
        paddingBottom,
      }}
    >
      {children}
    </div>
  );
}
