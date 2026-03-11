"use client";

import { useRouter } from "next/navigation";
import { Haptic } from "@/hooks/useHaptic";

interface NavHeaderProps {
  title: string;
}

export function NavHeader({ title }: NavHeaderProps) {
  const router = useRouter();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 0 8px",
        minHeight: 44,
        gap: 12,
      }}
    >
      <button
        onClick={() => {
          Haptic.light();
          router.push("/");
        }}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "8px 4px 8px 0",
          display: "flex",
          alignItems: "center",
          color: "var(--text-muted-mid)",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <span
        style={{
          fontSize: 17,
          fontWeight: 300,
          color: "var(--text-primary)",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </span>
    </div>
  );
}
