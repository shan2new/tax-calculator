import type { Metadata } from "next";
import Link from "next/link";
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

const pillStyle: React.CSSProperties = {
  fontSize: 12,
  color: "var(--text-muted, rgba(255,255,255,0.5))",
  textDecoration: "none",
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid var(--border, rgba(255,255,255,0.08))",
  background: "var(--card-bg, rgba(255,255,255,0.03))",
  letterSpacing: "0.01em",
  fontWeight: 300,
};

export default function TaxPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />
      <NavHeader title="Income Tax Calculator" subtitle="Old vs New Regime — FY 2025-26" />
      <TaxModule />

      {/* SEO Content Zone */}
      <div style={{
        padding: "0 24px 40px",
        fontSize: "0.9em",
        color: "var(--text-muted)",
        marginTop: 32,
        borderTop: "1px solid var(--border, rgba(255,255,255,0.08))",
        paddingTop: 8,
        opacity: 0,
        animation: "navIn 0.5s cubic-bezier(0.16,1,0.3,1) 560ms both",
      }}>
        <TaxSlabTable />
        <TaxContent />
        <TaxFAQ />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
          <Link href="/loans" style={pillStyle}>EMI Calculator</Link>
        </div>
        <SEOFooter showLoans={true} showTax={false} />
      </div>
    </>
  );
}
