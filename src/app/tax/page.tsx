import type { Metadata } from "next";
import { NavHeader } from "@/components/NavHeader";
import { TaxModule } from "@/modules/IncomeTax";
import { TaxSlabTable } from "@/components/seo/TaxSlabTable";
import { TaxFAQ } from "@/components/seo/TaxFAQ";
import { TaxContent } from "@/components/seo/TaxContent";
import { SEOFooter } from "@/components/seo/SEOFooter";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Income Tax Calculator FY 2025-26 — Old vs New Regime Comparison | Claros",
  description:
    "Compare old and new income tax regime for FY 2025-26 (AY 2026-27). See monthly take-home, effective tax rate, slab-wise breakdown, and which regime saves more for your salary.",
  keywords:
    "income tax calculator, old vs new regime, tax calculator india, fy 2025-26, income tax slabs, tax regime comparison, tax saving calculator",
  alternates: {
    canonical: "https://getclaros.in/tax",
    languages: { "en-IN": "https://getclaros.in/tax" },
  },
  openGraph: {
    type: "website",
    url: "https://getclaros.in/tax",
    title: "Income Tax Calculator FY 2025-26 — Old vs New Regime Comparison | Claros",
    description:
      "Compare old and new income tax regime for FY 2025-26. See monthly take-home, effective tax rate, and which regime saves more for your salary.",
    siteName: "Claros",
    locale: "en_IN",
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://getclaros.in" },
    { "@type": "ListItem", position: 2, name: "Income Tax Calculator", item: "https://getclaros.in/tax" },
  ],
};

export default function TaxPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />
      <NavHeader title="Income Tax" />
      <div style={{ padding: "0 24px 8px", paddingTop: 12 }}>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 200,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
            margin: "0 0 4px 0",
            lineHeight: 1.2,
            fontFamily: "var(--font)",
          }}
        >
          Income Tax Calculator
        </h1>
        <p
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            margin: 0,
            fontWeight: 300,
          }}
        >
          Old vs New Regime — FY 2025-26
        </p>
      </div>
      <TaxModule />
      <div style={{ padding: "0 24px 40px" }}>
        <TaxSlabTable />
        <TaxContent />
        <TaxFAQ />
        <SEOFooter showLoans={true} showTax={false} />
      </div>
    </>
  );
}
