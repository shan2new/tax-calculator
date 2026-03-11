"use client";

import { useState } from "react";
import { Particles } from "@/components/Particles";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavHeader } from "@/components/NavHeader";
import { HomeScreen } from "@/screens/Home";
import { WelcomeOverlay } from "@/screens/Welcome";
import { LegalScreen } from "@/screens/Legal";
import { LoanModule } from "@/modules/LoanCalculator";
import { TaxModule } from "@/modules/IncomeTax";

type Screen = "home" | "loans" | "tax" | "legal";

export default function Claros() {
  const [dark, setDark] = useState(true);
  const [screen, setScreen] = useState<Screen>("home");
  const [transition, setTransition] = useState("");
  const [welcomed, setWelcomed] = useState(false);

  const navigate = (to: string) => {
    setTransition("out");
    setTimeout(() => {
      setScreen(to as Screen);
      setTransition("in");
      setTimeout(() => setTransition(""), 450);
    }, 200);
  };

  const goHome = () => navigate("home");

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
          "background 0.7s cubic-bezier(0.16,1,0.3,1), color 0.7s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <Particles intensity={0.4} dark={dark} />
      <ThemeToggle dark={dark} onToggle={() => setDark((d) => !d)} />

      {!welcomed && <WelcomeOverlay onAccept={() => setWelcomed(true)} dark={dark} />}

      <div
        style={{
          width: "100%",
          maxWidth: 400,
          padding: "0 24px 48px",
          paddingTop: screen === "home" ? 0 : "max(12px, env(safe-area-inset-top))",
          paddingBottom: "max(48px, env(safe-area-inset-bottom))",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className={
            transition === "out" ? "nav-out" : transition === "in" ? "nav-in" : ""
          }
        >
          {screen === "home" && <HomeScreen onNavigate={navigate} dark={dark} />}
          {screen === "loans" && (
            <>
              <NavHeader title="Loans" onBack={goHome} />
              <LoanModule dark={dark} />
            </>
          )}
          {screen === "tax" && (
            <>
              <NavHeader title="Income Tax" onBack={goHome} />
              <TaxModule dark={dark} />
            </>
          )}
          {screen === "legal" && (
            <>
              <NavHeader title="About & Legal" onBack={goHome} />
              <LegalScreen dark={dark} />
            </>
          )}
        </div>

        <div style={{ textAlign: "center", paddingTop: 36 }}>
          <span
            style={{
              fontSize: 9,
              color: "var(--text-muted-faint)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              transition: "color 0.7s",
            }}
          >
            Claros
          </span>
        </div>
      </div>
    </div>
  );
}
