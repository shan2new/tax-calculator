"use client";

import { HomeScreen } from "@/screens/Home";
import { useTheme } from "@/providers/ThemeProvider";

export function HomePageClient() {
  const { dark, toggle } = useTheme();
  return <HomeScreen dark={dark} onToggleTheme={toggle} />;
}
