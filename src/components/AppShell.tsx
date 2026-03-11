"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { APP_MAX_CONTENT_WIDTH, APP_STORAGE_KEYS } from "@/lib/constants";
import { ThemeProvider, useTheme } from "@/providers/ThemeProvider";
import { Particles } from "@/components/canvas/Particles";
import { WelcomeOverlay } from "@/screens/Welcome";

function Shell({ children }: Readonly<{ children: ReactNode }>) {
  const { dark } = useTheme();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [entered, setEntered] = useState(false);
  const prevPath = useRef(pathname);

  // Trigger entrance animation on route change
  useEffect(() => {
    if (pathname !== prevPath.current) {
      setEntered(false);
      prevPath.current = pathname;
    }
    // Use rAF to ensure the browser paints the initial state before animating
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  const [welcomed, setWelcomed] = useState(true);

  useEffect(() => {
    setWelcomed(localStorage.getItem(APP_STORAGE_KEYS.welcomed) === "1");
  }, []);

  const handleAccept = () => {
    localStorage.setItem(APP_STORAGE_KEYS.welcomed, "1");
    setWelcomed(true);
  };

  // Home gets a dramatic 0.4s container reveal that pairs with its own per-section stagger.
  // Sub-pages use a fast 0.25s reveal so their section-level stagger plays in full visibility.
  const exitTransform = isHome ? "translateY(8px) scale(0.992)" : "translateY(6px) scale(0.997)";
  const enterTransition = isHome
    ? "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
    : "opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";

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

      {!welcomed && <WelcomeOverlay onAccept={handleAccept} />}

      <div
        style={{
          width: "100%",
          maxWidth: APP_MAX_CONTENT_WIDTH,
          padding: "0 24px 48px",
          paddingTop: isHome ? 0 : "max(12px, env(safe-area-inset-top))",
          paddingBottom: "max(48px, env(safe-area-inset-bottom))",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          key={pathname}
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0) scale(1)" : exitTransform,
            transformOrigin: isHome ? "center top" : "center 24px",
            transition: entered ? enterTransition : "none",
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

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ThemeProvider>
      <Shell>{children}</Shell>
    </ThemeProvider>
  );
}
