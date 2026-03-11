"use client";

import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { MiniRing } from "@/components/MiniRing";
import { MiniTaxViz } from "@/components/MiniTaxViz";
import { PressableCard } from "@/components/PressableCard";
import { Haptic } from "@/hooks/useHaptic";
import { usePremiumPress } from "@/hooks/usePremiumPress";

interface HomeScreenProps {
  dark: boolean;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Late night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good evening";
}

export function HomeScreen({ dark }: Readonly<HomeScreenProps>) {
  const router = useRouter();
  const legalPress = usePremiumPress();
  const modules = [
    { id: "/loans", title: "Loans", desc: "See what your money really costs", viz: <MiniRing dark={dark} /> },
    { id: "/tax", title: "Income Tax", desc: "Old vs New — find what saves more", viz: <MiniTaxViz dark={dark} /> },
  ];

  const greeting = getGreeting();

  return (
    <div
      style={{
        padding: "0 24px",
        paddingTop: "max(48px, env(safe-area-inset-top))",
        display: "flex",
        flexDirection: "column",
        minHeight: "80vh",
      }}
    >
      {/* Brand mark + greeting */}
      <div
        style={{
          marginBottom: 52,
          opacity: 0,
          animation: "homeIn 0.8s cubic-bezier(0.16,1,0.3,1) 100ms forwards",
        }}
      >
        <BrandMark dark={dark} />
        <div
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            letterSpacing: "0.01em",
            fontWeight: 300,
            marginBottom: 6,
          }}
        >
          {greeting}
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 200,
            color: "var(--text-primary)",
            letterSpacing: "-0.04em",
            fontFamily: "var(--font)",
            lineHeight: 1,
          }}
        >
          Claros
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--text-muted-faint)",
            marginTop: 8,
            letterSpacing: "0.02em",
            fontWeight: 300,
          }}
        >
          Financial clarity, one decision at a time.
        </div>
      </div>

      {/* Module cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {modules.map((m, idx) => (
          <PressableCard
            key={m.id}
            onClick={() => {
              Haptic.medium();
              router.push(m.id);
            }}
            delay={idx * 120 + 300}
          >
            {({ pressed, hovered }) => (
              <>
                <div
                  style={{
                    position: "relative",
                    flexShrink: 0,
                    transform: pressed
                      ? "translateX(-2px) scale(0.985)"
                      : hovered
                        ? "translateX(2px) scale(1.02)"
                        : "translateX(0) scale(1)",
                    transition: "transform var(--motion-slow) var(--ease-premium)",
                  }}
                >
                  {m.viz}
                </div>
                <div
                  style={{
                    position: "relative",
                    flex: 1,
                    transform: pressed ? "translateY(1px)" : hovered ? "translateY(-1px)" : "translateY(0)",
                    transition: "transform var(--motion-medium) var(--ease-premium)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 300,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em",
                      marginBottom: 5,
                    }}
                  >
                    {m.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      letterSpacing: "0.01em",
                      lineHeight: 1.4,
                    }}
                  >
                    {m.desc}
                  </div>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-muted-faint)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  style={{
                    position: "relative",
                    flexShrink: 0,
                    transform: pressed
                      ? "translateX(1px) scale(0.96)"
                      : hovered
                        ? "translateX(4px)"
                        : "translateX(0)",
                    opacity: hovered || pressed ? 1 : 0.82,
                    transition: "transform var(--motion-medium) var(--ease-premium), opacity var(--motion-medium) var(--ease-premium)",
                  }}
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </>
            )}
          </PressableCard>
        ))}
      </div>

      {/* Bottom — legal link + version */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 48,
          paddingBottom: 16,
          textAlign: "center",
          opacity: 0,
          animation: "homeIn 0.6s ease 700ms forwards",
        }}
      >
        <button
          {...legalPress.bind}
          onClick={() => {
            Haptic.light();
            router.push("/legal");
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 10,
            color: "var(--text-muted-faint)",
            letterSpacing: "0.04em",
            fontFamily: "inherit",
            padding: "8px 12px",
            marginBottom: 4,
            opacity: legalPress.pressed ? 0.78 : 1,
            transform: legalPress.pressed
              ? "translateY(1px) scale(0.97)"
              : legalPress.hovered
                ? "translateY(-1px)"
                : "translateY(0)",
            transition:
              "color var(--motion-medium) var(--ease-premium), opacity var(--motion-medium) var(--ease-premium), transform var(--motion-medium) var(--ease-premium)",
          }}
        >
          About & Legal
        </button>
        <div
          style={{
            fontSize: 9,
            color: "var(--text-muted-faint)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          v1.0
        </div>
      </div>
    </div>
  );
}
