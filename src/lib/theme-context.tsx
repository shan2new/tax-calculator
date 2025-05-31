"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Get theme from localStorage or default to system
    const savedTheme = localStorage.getItem("theme") as Theme;
    const initialTheme = savedTheme || "system";
    
    setThemeState(initialTheme);
    updateDocumentClass(initialTheme);
  }, []);

  const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const updateDocumentClass = (newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    
    if (newTheme === "system") {
      const systemTheme = getSystemTheme();
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (mounted) {
      localStorage.setItem("theme", newTheme);
      updateDocumentClass(newTheme);
    }
  };

  const toggleTheme = () => {
    // Cycle through themes: light -> dark -> system -> light
    let newTheme: Theme;
    if (theme === "light") {
      newTheme = "dark";
    } else if (theme === "dark") {
      newTheme = "system";
    } else {
      newTheme = "light";
    }
    setTheme(newTheme);
  };

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (mounted && theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => updateDocumentClass("system");
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, mounted]);

  // Always provide context, but conditionally show content
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
} 