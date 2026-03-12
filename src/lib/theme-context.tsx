"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface ThemeCtx {
  dark: boolean;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx>({ dark: true, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("claros_theme") === "light") setDark(false);
  }, []);

  const toggle = () =>
    setDark((d) => {
      localStorage.setItem("claros_theme", d ? "light" : "dark");
      return !d;
    });

  return <Ctx.Provider value={{ dark, toggle }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
