import { JsonLd } from "@/components/seo/JsonLd";

const TAX_FAQS = [
  {
    q: "Which is better — old or new tax regime for FY 2025-26?",
    a: "For FY 2025-26, the new tax regime is better for most taxpayers earning up to ₹12 lakh (zero tax due to Section 87A rebate). The old regime may be better if your total deductions under 80C, 80D, HRA, etc. exceed ₹3–4 lakh. Use Claros to compare both regimes for your exact salary.",
  },
  {
    q: "What are the income tax slabs for FY 2025-26 under the new regime?",
    a: "New regime slabs for FY 2025-26: Up to ₹4L — Nil; ₹4L to ₹8L — 5%; ₹8L to ₹12L — 10%; ₹12L to ₹16L — 15%; ₹16L to ₹20L — 20%; ₹20L to ₹24L — 25%; Above ₹24L — 30%. Standard deduction of ₹75,000 is available. Income up to ₹12L is tax-free due to rebate.",
  },
  {
    q: "What is Section 87A rebate in the new tax regime?",
    a: "Under Section 87A for FY 2025-26, resident individuals with taxable income up to ₹12 lakh get a rebate of up to ₹60,000, making their tax liability zero. This means salaried individuals earning up to ₹12.75 lakh (₹12L + ₹75K standard deduction) pay zero tax under the new regime.",
  },
  {
    q: "How much tax do I pay on a 15 LPA salary?",
    a: "On a ₹15 LPA salary under the new tax regime for FY 2025-26: Taxable income after ₹75K standard deduction = ₹14.25L. Tax = ₹0 (up to 4L) + ₹20K (4–8L) + ₹40K (8–12L) + ₹33,750 (12–14.25L) = ₹93,750 + 4% cess = ~₹97,500. Monthly take-home is approximately ₹1.16L.",
  },
  {
    q: "Is the new tax regime mandatory for FY 2025-26?",
    a: "The new tax regime is the default regime for FY 2025-26, but it is not mandatory. Salaried individuals can opt out and choose the old regime by informing their employer. Self-employed individuals can choose at the time of filing their ITR.",
  },
  {
    q: "What deductions are available under the old tax regime?",
    a: "Key deductions under the old regime: Section 80C (₹1.5L — PPF, ELSS, EPF, life insurance), Section 80D (₹25K–75K — health insurance), HRA exemption, LTA, Section 80E (education loan interest), Section 24 (₹2L — home loan interest), NPS (₹50K additional under 80CCD(1B)), and standard deduction of ₹50,000.",
  },
];

export function TaxFAQ() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: TAX_FAQS.map((faq) => ({
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
      <section
        style={{
          marginTop: 32,
          paddingTop: 24,
          borderTop: "1px solid var(--border, rgba(255,255,255,0.08))",
        }}
      >
        <h2
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "var(--text-primary, #e8e4de)",
            letterSpacing: "-0.01em",
            marginBottom: 16,
            marginTop: 0,
          }}
        >
          Frequently Asked Questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {TAX_FAQS.map((faq, i) => (
            <details
              key={i}
              style={{
                borderBottom: "1px solid var(--border, rgba(255,255,255,0.05))",
                padding: "12px 0",
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
                    fontSize: 16,
                    color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
                    lineHeight: 1,
                    marginTop: 2,
                  }}
                >
                  +
                </span>
              </summary>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted, rgba(255,255,255,0.5))",
                  lineHeight: 1.7,
                  marginTop: 10,
                  marginBottom: 0,
                  fontWeight: 300,
                }}
              >
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
