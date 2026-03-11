import Link from "next/link";
import { TAX_INCOMES } from "@/lib/seo-utils";

interface RelatedTaxLinksProps {
  currentIncome: string;
  fyYear: string;
}

function formatIncomeLabel(slug: string): string {
  if (slug === "1-crore") return "₹1 Crore";
  if (slug.endsWith("-lpa")) return `₹${slug.replace("-lpa", "")} LPA`;
  return slug;
}

export function RelatedTaxLinks({ currentIncome, fyYear }: RelatedTaxLinksProps) {
  const currentIdx = TAX_INCOMES.indexOf(currentIncome);
  const nearby = TAX_INCOMES.filter((_, i) => {
    if (i === currentIdx) return false;
    return Math.abs(i - currentIdx) <= 3;
  }).slice(0, 5);

  if (nearby.length === 0) return null;

  return (
    <nav
      aria-label="Related tax calculations"
      style={{
        marginTop: 32,
        paddingTop: 24,
        borderTop: "1px solid var(--border, rgba(255,255,255,0.08))",
      }}
    >
      <h3
        style={{
          fontSize: 11,
          fontWeight: 400,
          color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          margin: "0 0 10px 0",
        }}
      >
        See also
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {nearby.map((income) => (
          <Link
            key={income}
            href={`/tax/${fyYear}/${income}`}
            style={{
              fontSize: 12,
              color: "var(--text-muted, rgba(255,255,255,0.5))",
              textDecoration: "none",
              padding: "5px 10px",
              borderRadius: 6,
              border: "1px solid var(--border, rgba(255,255,255,0.08))",
              background: "var(--card-bg, rgba(255,255,255,0.03))",
            }}
          >
            {formatIncomeLabel(income)}
          </Link>
        ))}
      </div>
    </nav>
  );
}
