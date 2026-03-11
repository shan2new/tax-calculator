import type { Metadata } from "next";
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
      <NavHeader title="Income Tax" />

      <div style={{ padding: "0 24px 40px" }}>
        <div style={{ paddingTop: 16, paddingBottom: 8 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 200,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              margin: "0 0 8px 0",
              lineHeight: 1.2,
              fontFamily: "var(--font)",
            }}
          >
            Income Tax on {incomeLabel} Salary — {fy}
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              margin: 0,
              lineHeight: 1.5,
              fontWeight: 300,
            }}
          >
            {betterRegime === "same"
              ? `Both old and new regime result in the same tax for a ${incomeLabel} salary.`
              : `The ${betterRegime} saves more tax for a ${incomeLabel} salary under ${fy}.`}{" "}
            Your monthly take-home is approximately{" "}
            <strong style={{ color: "var(--text-primary)", fontWeight: 400 }}>
              ₹{takeHome.toLocaleString("en-IN")}
            </strong>
            . Adjust the calculator below to account for your deductions.
          </p>
        </div>

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

      <TaxModule initialIncome={income} initialDeductions={DEFAULT_DEDUCTIONS} />

      <div style={{ padding: "0 24px 40px" }}>
        <TaxSlabTable />
        <TaxContent />
        <TaxFAQ />
        <RelatedTaxLinks currentIncome={p.income} fyYear={p.fyYear} />
        <SEOFooter showLoans={true} showTax={false} />

        <p
          style={{
            marginTop: 32,
            fontSize: 11,
            color: "var(--text-muted-faint)",
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          Calculations are indicative for FY 2025-26. Excludes surcharge above ₹50L, special incomes, and state levies.
          Not tax advice. · <a href={canonical} style={{ color: "inherit" }}>{canonical}</a>
        </p>
      </div>
    </>
  );
}
