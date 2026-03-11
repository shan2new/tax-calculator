import type { Metadata } from "next";
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

export default function LoansPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />
      <NavHeader title="Loans" />
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
          EMI Calculator
        </h1>
        <p
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            margin: 0,
            fontWeight: 300,
          }}
        >
          Home, Car, Personal &amp; Education Loans
        </p>
      </div>
      <LoanModule />
      <div style={{ padding: "0 24px 40px" }}>
        <LoanContent />
        <LoanFAQ loanType="home-loan" />
        <SEOFooter showLoans={false} showTax={true} />
      </div>
    </>
  );
}
