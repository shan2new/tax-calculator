"use client";

import { NavHeader } from "@/components/NavHeader";
import { LegalScreen } from "@/screens/Legal";
import { useTheme } from "@/lib/theme-context";

export default function LegalPage() {
  const { dark } = useTheme();
  return (
    <>
      <NavHeader title="About & Legal" />
      <LegalScreen dark={dark} />
    </>
  );
}
