"use client";

import { NavHeader } from "@/components/NavHeader";
import { TaxModule } from "@/modules/IncomeTax";

export default function TaxPage() {
  return (
    <>
      <NavHeader title="Income Tax" />
      <TaxModule />
    </>
  );
}
