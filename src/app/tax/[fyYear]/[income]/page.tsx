import type { Metadata } from "next";
import Link from "next/link";
import { NavHeader } from "@/components/NavHeader";
import { TaxModule } from "@/modules/IncomeTax";
import { TaxInsights } from "@/components/seo/TaxInsights";
import { TaxSlabTable } from "@/components/seo/TaxSlabTable";
import { TaxFAQ } from "@/components/seo/TaxFAQ";
import { RelatedTaxLinks } from "@/components/seo/RelatedTaxLinks";
import { TaxContent } from "@/components/seo/TaxContent";
import { SEOFooter } from "@/components/seo/SEOFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { TAX_INCOMES, parseIncomeSlug, formatIncomeForTitle, formatFyYear } from "@/lib/seo-utils";
import { calcTaxNew, calcTaxOld } from "@/lib/calc";

export const dynamicParams = true;
export const revalidate = 86400;

interface PageParams {
  fyYear: string;
  income: string;
}

export async function generateStaticParams(): Promise<PageParams[]> {
  return TAX_INCOMES.map((income) => ({ fyYear: "fy-2025-26", income }));
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const p = await params;
  const income = parseIncomeSlug(p.income);
  const fy = formatFyYear(p.fyYear);

  if (!income) return { title: "Income Tax Calculator | Claros" };

  const taxNew = calcTaxNew(income);
  const taxOld = calcTaxOld(income, 200000);
  const totalNew = taxNew * 1.04;
  const totalOld = taxOld * 1.04;
  const bestTax = Math.min(totalNew, totalOld);
  const takeHome = Math.round((income - bestTax) / 12);
  const savings = totalOld - totalNew;
  const betterRegime = savings > 0 ? "new regime" : savings < 0 ? "old regime" : "both regimes";
  const absSavings = Math.abs(savings);
  const incomeLabel = formatIncomeForTitle(p.income);
  const takeHomeStr = `₹${takeHome.toLocaleString("en-IN")}`;
  const savingsStr =
    absSavings >= 1e5
      ? `₹${(absSavings / 1e5).toFixed(1)}L`
      : `₹${Math.round(absSavings).toLocaleString("en-IN")}`;

  const canonical = `https://getclaros.in/tax/${p.fyYear}/${p.income}`;
  const title = `Income Tax on ${incomeLabel} Salary — Old vs New Regime ${fy} | Claros`;
  const description =
    savings !== 0
      ? `Tax comparison for ${incomeLabel} salary under old and new regime for ${fy}. Monthly take-home: ${takeHomeStr}. Tax saved with ${betterRegime}: ${savingsStr}.`
      : `Tax comparison for ${incomeLabel} salary under old and new regime for ${fy}. Monthly take-home: ${takeHomeStr}. Both regimes result in the same tax.`;

  return {
    title,
    description,
    keywords: `income tax ${incomeLabel}, tax calculator india, old vs new regime ${incomeLabel}, ${fy} tax, tax on ${incomeLabel}`,
    alternates: {
      canonical,
      languages: { "en-IN": canonical },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: "Claros",
      locale: "en_IN",
    },
  };
}

const DEFAULT_DEDUCTIONS = 200000;

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

export default async function TaxDetailPage({ params }: { params: Promise<PageParams> }) {
  const p = await params;
  const income = parseIncomeSlug(p.income);
  const fy = formatFyYear(p.fyYear);

  if (!income) {
    return (
      <>
        <NavHeader title="Income Tax" />
        <div style={{ padding: "24px", color: "var(--text-muted)" }}>
          Invalid income parameter. Please check the URL.
        </div>
      </>
    );
  }

  const taxNew = calcTaxNew(income);
  const taxOld = calcTaxOld(income, DEFAULT_DEDUCTIONS);
  const totalNew = taxNew * 1.04;
  const totalOld = taxOld * 1.04;
  const savings = totalOld - totalNew;
  const bestTax = Math.min(totalNew, totalOld);
  const takeHome = Math.round((income - bestTax) / 12);
  const effectiveRate = income > 0 ? (bestTax / income) * 100 : 0;
  const betterRegime: "new" | "old" | "same" = savings > 0 ? "new" : savings < 0 ? "old" : "same";
  const incomeLabel = formatIncomeForTitle(p.income);
  const canonical = `https://getclaros.in/tax/${p.fyYear}/${p.income}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://getclaros.in" },
      { "@type": "ListItem", position: 2, name: "Income Tax Calculator", item: "https://getclaros.in/tax" },
      { "@type": "ListItem", position: 3, name: `Tax on ${incomeLabel} — ${fy}` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumb} />
      <NavHeader
        title={`Income Tax on ${incomeLabel} Salary`}
        subtitle={betterRegime === "same"
          ? `Both regimes equal · ${fy}`
          : `${betterRegime === "new" ? "New" : "Old"} regime saves more · ${fy}`}
      />

      <div style={{
        padding: "0 24px 24px",
        opacity: 0,
        animation: "navIn 0.65s cubic-bezier(0.16,1,0.3,1) 120ms both",
      }}>

        <TaxInsights
          income={income}
          totalNew={totalNew}
          totalOld={totalOld}
          takeHome={takeHome}
          effectiveRate={effectiveRate}
          savings={savings}
          betterRegime={betterRegime}
          deductions={DEFAULT_DEDUCTIONS}
        />
      </div>

      <p
        style={{
          fontSize: 11,
          color: "var(--text-muted-faint)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          margin: "0 0 8px",
          padding: "0 24px",
          opacity: 0,
          animation: "navIn 0.5s cubic-bezier(0.16,1,0.3,1) 260ms both",
        }}
      >
        Adjust &amp; Recalculate
      </p>

      <TaxModule initialIncome={income} initialDeductions={DEFAULT_DEDUCTIONS} />

      {/* Tool Terminus */}
      <div style={{ padding: "0 24px", opacity: 0, animation: "navIn 0.5s cubic-bezier(0.16,1,0.3,1) 560ms both" }}>
        <p
          style={{
            fontSize: 11,
            color: "var(--text-muted-faint)",
            lineHeight: 1.6,
            margin: "16px 0 0",
          }}
        >
          Calculations are indicative for FY 2025-26. Excludes surcharge above ₹50L, special incomes, and state levies. Not tax advice.
        </p>
        <hr style={{ border: "none", borderTop: "1px solid var(--border, rgba(255,255,255,0.08))", margin: "20px 0 16px" }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Link href="/tax" style={pillStyle}>Try a different salary</Link>
          <Link href="/loans" style={pillStyle}>EMI Calculator</Link>
        </div>
      </div>

      {/* SEO Content Zone */}
      <div style={{
        padding: "0 24px 40px",
        fontSize: "0.9em",
        color: "var(--text-muted)",
        marginTop: 48,
        opacity: 0,
        animation: "navIn 0.5s cubic-bezier(0.16,1,0.3,1) 680ms both",
      }}>
        <TaxSlabTable defaultOpen />
        <TaxContent />
        <TaxFAQ />
        <RelatedTaxLinks currentIncome={p.income} fyYear={p.fyYear} />
        <SEOFooter showLoans={true} showTax={false} />
      </div>
    </>
  );
}
