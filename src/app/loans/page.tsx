import type { Metadata } from "next";
import Link from "next/link";
import { NavHeader } from "@/components/NavHeader";
import { LoanModule } from "@/modules/LoanCalculator";
import { LoanContent } from "@/components/seo/LoanContent";
import { LoanFAQ } from "@/components/seo/LoanFAQ";
import { SEOFooter } from "@/components/seo/SEOFooter";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "EMI Calculator India — Home, Car, Personal & Education Loan | Claros",
  description:
    "Free EMI calculator with year-by-year amortization breakdown. See total interest paid, when principal overtakes interest, and monthly EMI for any loan amount. Supports ₹ shortcuts like 50L and 1.5Cr.",
  keywords:
    "emi calculator, loan emi calculator, home loan emi calculator, car loan calculator, personal loan emi, education loan calculator, amortization schedule india",
  alternates: {
    canonical: "https://getclaros.in/loans",
    languages: { "en-IN": "https://getclaros.in/loans" },
  },
  openGraph: {
    type: "website",
    url: "https://getclaros.in/loans",
    title: "EMI Calculator India — Home, Car, Personal & Education Loan | Claros",
    description:
      "Free EMI calculator with year-by-year amortization breakdown. See total interest paid and monthly EMI for any loan amount.",
    siteName: "Claros",
    locale: "en_IN",
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://getclaros.in" },
    { "@type": "ListItem", position: 2, name: "EMI Calculator", item: "https://getclaros.in/loans" },
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

export default function LoansPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />
      <NavHeader title="EMI Calculator" subtitle="Home, Car, Personal & Education Loans" />
      <LoanModule />

      {/* SEO Content Zone */}
      <div style={{
        padding: "0 24px 40px",
        fontSize: "0.9em",
        color: "var(--text-muted)",
        marginTop: 48,
        opacity: 0,
        animation: "navIn 0.5s cubic-bezier(0.16,1,0.3,1) 560ms both",
      }}>
        <LoanContent />
        <LoanFAQ loanType="home-loan" />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
          <Link href="/tax" style={pillStyle}>Income Tax Calculator</Link>
        </div>
        <SEOFooter showLoans={false} showTax={true} />
      </div>
    </>
  );
}
