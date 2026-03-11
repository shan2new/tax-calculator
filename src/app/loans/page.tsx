import type { Metadata } from "next";
import { NavHeader } from "@/components/NavHeader";
import { LoanModule } from "@/modules/LoanCalculator";

export const metadata: Metadata = {
  title: "Loan Calculator",
  description: "Calculate EMI, total payable, and interest split for Indian loans with live comparison.",
};

export default function LoansPage() {
  return (
    <>
      <NavHeader title="Loans" />
      <LoanModule />
    </>
  );
}
