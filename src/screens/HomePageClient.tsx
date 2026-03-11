"use client";

import { HomeScreen } from "@/screens/Home";
import { useTheme } from "@/providers/ThemeProvider";

export function HomePageClient() {
  const { dark } = useTheme();
  return <HomeScreen dark={dark} />;
}
