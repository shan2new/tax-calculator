import type { Metadata } from "next";
import Link from "next/link";
import { NavHeader } from "@/components/NavHeader";
import { LoanModule } from "@/modules/LoanCalculator";
import { AmortizationTable } from "@/components/seo/AmortizationTable";
import { LoanInsights } from "@/components/seo/LoanInsights";
import { LoanFAQ } from "@/components/seo/LoanFAQ";
import { RelatedLoanLinks } from "@/components/seo/RelatedLoanLinks";
import { LoanContent } from "@/components/seo/LoanContent";
import { SEOFooter } from "@/components/seo/SEOFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  LOAN_CONFIGS,
  parseAmountSlug,
  parseRateSlug,
  parseTenureSlug,
  parseLoanTypeSlug,
  formatAmountForTitle,
} from "@/lib/seo-utils";
import { emiCalc, generateYearlyAmortization } from "@/lib/calc";

export const dynamicParams = true;
export const revalidate = 86400;

interface PageParams {
  type: string;
  amount: string;
  rate: string;
  tenure: string;
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const params: PageParams[] = [];
  for (const config of LOAN_CONFIGS) {
    for (const amount of config.amounts.slice(0, 5)) {
      for (const rate of config.rates.slice(0, 3)) {
        for (const tenure of config.tenures.slice(0, 3)) {
          params.push({
            type: config.slug,
            amount,
            rate: `${rate}-percent`,
            tenure: `${tenure}-years`,
          });
        }
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const p = await params;
  const config = parseLoanTypeSlug(p.type);
  const amount = parseAmountSlug(p.amount);
  const rate = parseRateSlug(p.rate);
  const tenure = parseTenureSlug(p.tenure);

  if (!config || !amount || !rate || !tenure) {
    return { title: "Loan EMI Calculator | Claros" };
  }

  const emi = emiCalc(amount, rate, tenure);
  const total = emi * tenure * 12;
  const interest = total - amount;
  const emiStr = `₹${Math.round(emi).toLocaleString("en-IN")}`;
  const amountStr = formatAmountForTitle(amount);
  const interestStr =
    interest >= 1e7
      ? `₹${(interest / 1e7).toFixed(1)} Cr`
      : `₹${(interest / 1e5).toFixed(1)}L`;

  const title = `${amountStr} ${config.label} EMI at ${rate}% for ${tenure} Years — EMI Calculator | Claros`;
  const description = `${emiStr}/month EMI for ${amountStr} ${config.label.toLowerCase()} at ${rate}% interest for ${tenure} years. Total interest: ${interestStr}. View full amortization schedule with year-by-year breakdown.`;
  const canonical = `https://getclaros.in/loans/${p.type}/${p.amount}/${p.rate}/${p.tenure}`;

  return {
    title,
    description,
    keywords: `${amountStr} ${config.label.toLowerCase()} emi, ${config.label.toLowerCase()} emi calculator, emi at ${rate}%, ${tenure} year ${config.label.toLowerCase()}, home loan emi calculator india`,
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

export default async function LoanDetailPage({ params }: { params: Promise<PageParams> }) {
  const p = await params;
  const config = parseLoanTypeSlug(p.type);
  const amount = parseAmountSlug(p.amount);
  const rate = parseRateSlug(p.rate);
  const tenure = parseTenureSlug(p.tenure);

  if (!config || !amount || !rate || !tenure) {
    return (
      <>
        <NavHeader title="Loans" />
        <div style={{ padding: "24px", color: "var(--text-muted)" }}>
          Invalid loan parameters. Please check the URL.
        </div>
      </>
    );
  }

  const emi = emiCalc(amount, rate, tenure);
  const total = emi * tenure * 12;
  const interest = total - amount;
  const amountStr = formatAmountForTitle(amount);
  const emiStr = `₹${Math.round(emi).toLocaleString("en-IN")}`;
  const canonical = `https://getclaros.in/loans/${p.type}/${p.amount}/${p.rate}/${p.tenure}`;

  const years = generateYearlyAmortization(amount, rate, tenure, emi);
  const crossoverIndex = years.findIndex((y) => y.p > y.i);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://getclaros.in" },
      { "@type": "ListItem", position: 2, name: "EMI Calculator", item: "https://getclaros.in/loans" },
      { "@type": "ListItem", position: 3, name: config.label, item: `https://getclaros.in/loans/${p.type}` },
      { "@type": "ListItem", position: 4, name: `${amountStr} at ${rate}% for ${tenure} Years` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumb} />
      <NavHeader
        title={`${amountStr} ${config.label} EMI`}
        subtitle={`${emiStr}/mo · ${rate}% · ${tenure} yrs`}
      />

      <div style={{
        padding: "0 24px 24px",
        opacity: 0,
        animation: "navIn 0.65s cubic-bezier(0.16,1,0.3,1) 120ms both",
      }}>

        <LoanInsights
          amount={amount}
          rate={rate}
          tenure={tenure}
          emi={emi}
          total={total}
          interest={interest}
          years={years}
          crossoverIndex={crossoverIndex}
          loanLabel={config.label}
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

      <LoanModule
        initialType={config.typeIndex}
        initialAmount={amount}
        initialRate={rate}
        initialTenure={tenure}
      />

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
          Calculations are indicative. Actual EMI may vary based on lender policies, processing fees, and GST.
        </p>
        <hr style={{ border: "none", borderTop: "1px solid var(--border, rgba(255,255,255,0.08))", margin: "20px 0 16px" }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Link href="/loans" style={pillStyle}>Try a different amount</Link>
          <Link href="/tax" style={pillStyle}>Income Tax Calculator</Link>
        </div>
      </div>

      {/* SEO Content Zone */}
      <div style={{
        padding: "0 24px 40px",
        fontSize: "0.9em",
        color: "var(--text-muted)",
        marginTop: 32,
        borderTop: "1px solid var(--border, rgba(255,255,255,0.08))",
        paddingTop: 8,
        opacity: 0,
        animation: "navIn 0.5s cubic-bezier(0.16,1,0.3,1) 680ms both",
      }}>
        <details
          open
          style={{ marginTop: 24 }}
        >
          <summary
            style={{
              cursor: "pointer",
              listStyle: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "4px 0",
            }}
          >
            <h2
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "var(--text-primary, #e8e4de)",
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              Year-by-Year Amortization Schedule
            </h2>
            <span
              style={{
                flexShrink: 0,
                fontSize: 14,
                color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
                transition: "transform 0.2s ease",
              }}
            >
              ▾
            </span>
          </summary>
          <div style={{ marginTop: 12 }}>
            <AmortizationTable years={years} crossoverIndex={crossoverIndex} />
          </div>
        </details>

        <LoanContent />
        <LoanFAQ loanType={p.type} />
        <RelatedLoanLinks
          currentType={p.type}
          currentAmount={p.amount}
          currentRate={rate.toString()}
          currentTenure={tenure.toString()}
        />
        <SEOFooter showLoans={false} showTax={true} />
      </div>
    </>
  );
}
