"use client";

import { NavHeader } from "@/components/NavHeader";
import { LoanModule } from "@/modules/LoanCalculator";
import { useTheme } from "@/lib/theme-context";

export default function LoansPage() {
  const { dark } = useTheme();
  return (
    <>
      <NavHeader title="Loans" />
      <LoanModule dark={dark} />
    </>
  );
}
