"use client";

import { HomeScreen } from "@/screens/Home";
import { useTheme } from "@/providers/ThemeProvider";

export default function HomePage() {
  const { dark } = useTheme();
  return <HomeScreen dark={dark} />;
}
