import type { Metadata } from "next";
import { NavHeader } from "@/components/NavHeader";
import { TaxModule } from "@/modules/IncomeTax";

export const metadata: Metadata = {
  title: "Income Tax Calculator",
  description: "Compare old vs new tax regimes for FY 2025-26 with live take-home and slab breakdowns.",
};

export default function TaxPage() {
  return (
    <>
      <NavHeader title="Income Tax" />
      <TaxModule />
    </>
  );
}
