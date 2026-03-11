import Link from "next/link";
import { LOAN_CONFIGS } from "@/lib/seo-utils";

interface RelatedLoanLinksProps {
  currentType: string;
  currentAmount: string;
  currentRate: string;
  currentTenure: string;
}

const linkStyle: React.CSSProperties = {
  fontSize: 12,
  color: "var(--text-muted, rgba(255,255,255,0.5))",
  textDecoration: "none",
  lineHeight: 1.5,
  fontWeight: 300,
  letterSpacing: "0.01em",
};

export function RelatedLoanLinks({
  currentType,
  currentAmount,
  currentRate,
  currentTenure,
}: RelatedLoanLinksProps) {
  const config = LOAN_CONFIGS.find((c) => c.slug === currentType);
  if (!config) return null;

  const rateNum = parseFloat(currentRate);
  const tenureNum = parseInt(currentTenure, 10);

  const altRates = config.rates
    .filter((r) => parseFloat(r) !== rateNum)
    .slice(0, 3)
    .map((r) => ({
      href: `/loans/${currentType}/${currentAmount}/${r}-percent/${currentTenure}-years`,
      label: `At ${r}%`,
    }));

  const altTenures = config.tenures
    .filter((t) => parseInt(t, 10) !== tenureNum)
    .slice(0, 3)
    .map((t) => ({
      href: `/loans/${currentType}/${currentAmount}/${currentRate}-percent/${t}-years`,
      label: `${t} yr tenure`,
    }));

  const altTypes = LOAN_CONFIGS.filter((c) => c.slug !== currentType)
    .filter((c) => c.amounts.includes(currentAmount))
    .map((c) => ({
      href: `/loans/${c.slug}/${currentAmount}/${c.rates[1]}-percent/${c.tenures[1]}-years`,
      label: c.label,
    }));

  const allLinks = [...altRates, ...altTenures, ...altTypes];
  if (allLinks.length === 0) return null;

  return (
    <nav
      aria-label="Related calculations"
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
        {allLinks.map((link) => (
          <Link key={link.href} href={link.href} style={linkStyle}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
