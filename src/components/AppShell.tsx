"use client";

import { useState, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider, useTheme } from "@/lib/theme-context";
import { Particles } from "@/components/Particles";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WelcomeOverlay } from "@/screens/Welcome";

function Shell({ children }: Readonly<{ children: ReactNode }>) {
  const { dark, toggle } = useTheme();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [welcomed, setWelcomed] = useState(true);

  useEffect(() => {
    setWelcomed(localStorage.getItem("claros_welcomed") === "1");
  }, []);

  const handleAccept = () => {
    localStorage.setItem("claros_welcomed", "1");
    setWelcomed(true);
  };

  return (
    <div
      data-theme={dark ? "dark" : "light"}
      style={{
        minHeight: "100dvh",
        background: "var(--bg)",
        color: "var(--text-primary)",
        fontFamily: "var(--font)",
        display: "flex",
        justifyContent: "center",
        overflowX: "hidden",
        position: "relative",
        WebkitFontSmoothing: "antialiased",
        transition:
          "background var(--motion-theme) var(--ease-premium), color var(--motion-theme) var(--ease-premium)",
      }}
    >
      <Particles intensity={0.4} dark={dark} />
      <ThemeToggle dark={dark} onToggle={toggle} />

      {!welcomed && <WelcomeOverlay onAccept={handleAccept} />}

      <div
        style={{
          width: "100%",
          maxWidth: 400,
          padding: "0 24px 48px",
          paddingTop: isHome ? 0 : "max(12px, env(safe-area-inset-top))",
          paddingBottom: "max(48px, env(safe-area-inset-bottom))",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          key={pathname}
          className="nav-in"
          style={{
            transformOrigin: isHome ? "center top" : "center 24px",
            willChange: "transform, opacity",
          }}
        >
          {children}
        </div>

        <div
          style={{
            textAlign: "center",
            paddingTop: 36,
            opacity: welcomed ? 1 : 0.4,
            transform: welcomed ? "translateY(0)" : "translateY(4px)",
            transition: "opacity var(--motion-slow) var(--ease-premium), transform var(--motion-slow) var(--ease-premium)",
          }}
        >
          <span
            style={{
              fontSize: 9,
              color: "var(--text-muted-faint)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              transition: "color var(--motion-theme) var(--ease-premium)",
            }}
          >
            Claros
          </span>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <Shell>{children}</Shell>
    </ThemeProvider>
  );
}
