"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { APP_STORAGE_KEYS } from "@/lib/constants";

interface ThemeContextValue {
  dark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  dark: true,
  toggle: () => {},
});

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(APP_STORAGE_KEYS.theme) === "light") {
      setDark(false);
    }
  }, []);

  const toggle = () =>
    setDark((current) => {
      localStorage.setItem(APP_STORAGE_KEYS.theme, current ? "light" : "dark");
      return !current;
    });

  const value = useMemo(
    () => ({
      dark,
      toggle,
    }),
    [dark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
