"use client";

import { HomeScreen } from "@/screens/Home";
import { useTheme } from "@/lib/theme-context";

export default function HomePage() {
  const { dark } = useTheme();
  return <HomeScreen dark={dark} />;
}
