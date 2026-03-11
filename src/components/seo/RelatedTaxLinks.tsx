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

const linkStyle: React.CSSProperties = {
  fontSize: 12,
  color: "var(--text-muted, rgba(255,255,255,0.5))",
  textDecoration: "none",
  lineHeight: 1.5,
  fontWeight: 300,
  letterSpacing: "0.01em",
};

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
        marginTop: 24,
        background: "var(--card-bg, rgba(255,255,255,0.03))",
        border: "1px solid var(--border, rgba(255,255,255,0.08))",
        borderRadius: 12,
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 400,
          color: "var(--text-muted-faint, rgba(255,255,255,0.25))",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        Explore More
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px 16px",
        }}
      >
        {nearby.map((income) => (
          <Link key={income} href={`/tax/${fyYear}/${income}`} style={linkStyle}>
            {formatIncomeLabel(income)}
          </Link>
        ))}
      </div>
    </nav>
  );
}
