"use client";

import { ActionButton, PaginationDots } from "@/components/ui";
import { TAX_HERO_VIEW_COUNT } from "@/lib/constants";

interface TaxActionsProps {
  heroView: number;
  shareVisible: boolean;
  onShare: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function TaxActions({
  heroView,
  shareVisible,
  onShare,
}: Readonly<TaxActionsProps>) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: "4px 0 4px",
      }}
    >
      <PaginationDots count={TAX_HERO_VIEW_COUNT} activeIndex={heroView} />

      <ActionButton active={shareVisible} onClick={onShare}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          {shareVisible ? (
            <div
              style={{
                position: "absolute",
                bottom: -20,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 9,
                color: "var(--text-muted-mid)",
                whiteSpace: "nowrap",
                animation: "hintFade 0.2s ease",
              }}
            >
              Copied
            </div>
          ) : null}
        </div>
      </ActionButton>
    </div>
  );
}
