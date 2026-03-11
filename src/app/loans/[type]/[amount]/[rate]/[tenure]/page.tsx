import type { Metadata } from "next";
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
      <NavHeader title="Loans" />

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
            {amountStr} {config.label} EMI at {rate}% for {tenure} Years
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
            Your monthly EMI is <strong style={{ color: "var(--text-primary)", fontWeight: 400 }}>{emiStr}</strong>.
            {" "}Over {tenure} years, you'll pay{" "}
            {interest >= 1e7
              ? `₹${(interest / 1e7).toFixed(1)} Cr`
              : `₹${(interest / 1e5).toFixed(1)}L`}{" "}
            in interest — use the calculator below to adjust and explore.
          </p>
        </div>

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

      <LoanModule
        initialType={config.typeIndex}
        initialAmount={amount}
        initialRate={rate}
        initialTenure={tenure}
      />

      <div style={{ padding: "0 24px 40px" }}>
        <section style={{ marginTop: 24 }}>
          <h2
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              margin: "0 0 12px 0",
            }}
          >
            Year-by-Year Amortization Schedule
          </h2>
          <AmortizationTable years={years} crossoverIndex={crossoverIndex} />
        </section>

        <LoanContent />
        <LoanFAQ loanType={p.type} />
        <RelatedLoanLinks
          currentType={p.type}
          currentAmount={p.amount}
          currentRate={rate.toString()}
          currentTenure={tenure.toString()}
        />
        <SEOFooter showLoans={false} showTax={true} />

        <p
          style={{
            marginTop: 32,
            fontSize: 11,
            color: "var(--text-muted-faint)",
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          Calculations are indicative only. Actual EMI may vary based on lender policies, processing fees, and GST.
          Not financial advice. · <a href={canonical} style={{ color: "inherit" }}>{canonical}</a>
        </p>
      </div>
    </>
  );
}
