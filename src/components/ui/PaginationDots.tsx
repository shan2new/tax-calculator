"use client";

import { memo } from "react";

interface PaginationDotsProps {
  count: number;
  activeIndex: number;
}

export const PaginationDots = memo(function PaginationDots({
  count,
  activeIndex,
}: Readonly<PaginationDotsProps>) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={`dot-${index}`}
          style={{
            width: 10,
            height: 4,
            borderRadius: 2,
            background: index === activeIndex ? "var(--text-muted-mid)" : "var(--text-muted-faint)",
            opacity: index === activeIndex ? 1 : 0.72,
            transform: index === activeIndex ? "scaleX(1)" : "scaleX(0.4)",
            transformOrigin: "center",
            transition:
              "background var(--motion-medium) var(--ease-premium), opacity var(--motion-medium) var(--ease-premium), transform var(--motion-medium) var(--ease-premium)",
          }}
        />
      ))}
    </div>
  );
});
