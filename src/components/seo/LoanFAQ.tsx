import { JsonLd } from "@/components/seo/JsonLd";

interface FAQItem {
  q: string;
  a: string;
}

const BASE_FAQS: FAQItem[] = [
  {
    q: "How is EMI calculated?",
    a: "EMI is calculated using the reducing balance method: EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is the principal loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is the total number of monthly installments.",
  },
  {
    q: "What is the difference between flat rate and reducing balance EMI?",
    a: "In the flat rate method, interest is calculated on the full original loan amount throughout the tenure. In the reducing balance method (used by most banks in India), interest is calculated on the outstanding principal, which decreases with each EMI payment. The reducing balance method results in lower total interest paid.",
  },
  {
    q: "When does principal repayment exceed interest in a home loan?",
    a: "For a typical home loan at 8–9% interest, principal repayment exceeds interest around the midpoint of the loan tenure. For a 20-year home loan at 8.5%, this crossover typically happens around year 12. Before this point, most of your EMI goes toward interest.",
  },
  {
    q: "What are current home loan interest rates in India?",
    a: "As of FY 2025-26, home loan interest rates in India typically range from 8.25% to 9.5% depending on the lender, loan amount, and borrower profile. SBI, HDFC, and ICICI Bank offer rates starting around 8.25–8.50% for salaried individuals.",
  },
  {
    q: "How much home loan can I get on a ₹50,000 salary?",
    a: "Banks typically allow EMI up to 50–60% of your net monthly income. On a ₹50,000 salary, your maximum EMI would be around ₹25,000–30,000. At 8.5% interest for 20 years, this translates to a loan amount of approximately ₹29–35 lakhs, depending on existing liabilities and the bank's policies.",
  },
];

const LOAN_FAQS: Record<string, FAQItem[]> = {
  'home-loan': [
    {
      q: "What is the maximum tenure for a home loan in India?",
      a: "Most banks offer home loans with a maximum tenure of 30 years. Longer tenures reduce your monthly EMI but increase total interest paid. SBI, HDFC, and ICICI Bank all offer 30-year home loan tenures.",
    },
    {
      q: "What documents are required for a home loan?",
      a: "Typically: identity proof (Aadhaar/PAN), address proof, income proof (salary slips or ITR for 2 years), bank statements (6 months), property documents, and employment proof. Self-employed individuals need 2-3 years of business financials.",
    },
  ],
  'car-loan': [
    {
      q: "What is the maximum LTV for a car loan?",
      a: "Banks typically finance up to 80–90% of the on-road price of a car. The remaining 10–20% must be paid as a down payment. Some banks offer 100% financing for electric vehicles.",
    },
    {
      q: "Can I foreclose a car loan without penalty?",
      a: "RBI guidelines allow foreclosure of floating-rate loans without prepayment penalties. For fixed-rate car loans, some lenders charge a foreclosure fee of 2–5% of the outstanding amount. Always check your loan agreement before prepaying.",
    },
  ],
  'personal-loan': [
    {
      q: "What is the maximum personal loan amount I can get?",
      a: "Personal loan amounts in India typically range from ₹50,000 to ₹40 lakh, depending on your income, credit score, and lender. Salaried individuals with a good credit score (750+) can get the highest amounts at competitive rates.",
    },
    {
      q: "What credit score do I need for a personal loan?",
      a: "A CIBIL score of 750 or above is ideal for a personal loan. Scores between 700–750 may still qualify but at higher interest rates. Scores below 700 may face rejection or need a co-applicant.",
    },
  ],
  'education-loan': [
    {
      q: "Is there a moratorium period for education loans?",
      a: "Yes, most education loans include a moratorium period (course duration + 6–12 months after completion) during which you don't need to make EMI payments. Interest may still accrue during this period.",
    },
    {
      q: "Can education loan interest be claimed as a tax deduction?",
      a: "Yes, under Section 80E of the Income Tax Act, interest paid on education loans is fully deductible (no upper limit) for up to 8 years starting from the year you begin repayment. This applies to loans for higher education in India or abroad.",
    },
  ],
};

interface LoanFAQProps {
  loanType: string;
  defaultOpen?: boolean;
}

export function LoanFAQ({ loanType, defaultOpen = false }: LoanFAQProps) {
  const extra = LOAN_FAQS[loanType] ?? [];
  const allFaqs = [...BASE_FAQS.slice(0, 4), ...extra];

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <details
        open={defaultOpen || undefined}
        style={{
          marginTop: 24,
        }}
      >
        <summary
          style={{
            cursor: "pointer",
            listStyle: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
          }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 300,
              color: "var(--text-primary, #e8e4de)",
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            Frequently Asked Questions
          </h2>
          <span
            style={{
              flexShrink: 0,
              fontSize: 12,
              color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
              transition: "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
              display: "inline-block",
            }}
          >
            ▾
          </span>
        </summary>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 12 }}>
          {allFaqs.map((faq, i) => (
            <details
              key={i}
              style={{
                borderBottom: "1px solid var(--border, rgba(255,255,255,0.05))",
                padding: "14px 0",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 300,
                  color: "var(--text-primary, #e8e4de)",
                  lineHeight: 1.5,
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <span>{faq.q}</span>
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: 12,
                    color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
                    transition: "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
                    display: "inline-block",
                  }}
                >
                  ▾
                </span>
              </summary>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted, rgba(255,255,255,0.5))",
                  lineHeight: 1.55,
                  marginTop: 12,
                  marginBottom: 0,
                  fontWeight: 300,
                }}
              >
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </details>
    </>
  );
}
