"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function ClientThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed top-6 right-6 sm:top-8 sm:right-8 z-50">
      <ThemeToggle />
    </div>
  );
} 