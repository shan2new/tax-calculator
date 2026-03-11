import Link from "next/link";
import { LOAN_CONFIGS } from "@/lib/seo-utils";

interface RelatedLoanLinksProps {
  currentType: string;
  currentAmount: string;
  currentRate: string;
  currentTenure: string;
}

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
      label: `At ${r}% interest`,
    }));

  const altTenures = config.tenures
    .filter((t) => parseInt(t, 10) !== tenureNum)
    .slice(0, 3)
    .map((t) => ({
      href: `/loans/${currentType}/${currentAmount}/${currentRate}-percent/${t}-years`,
      label: `${t} year tenure`,
    }));

  const altTypes = LOAN_CONFIGS.filter((c) => c.slug !== currentType)
    .filter((c) => c.amounts.includes(currentAmount))
    .map((c) => ({
      href: `/loans/${c.slug}/${currentAmount}/${c.rates[1]}-percent/${c.tenures[1]}-years`,
      label: `${c.label}`,
    }));

  return (
    <nav
      aria-label="Related calculations"
      style={{
        marginTop: 32,
        paddingTop: 24,
        borderTop: "1px solid var(--border, rgba(255,255,255,0.08))",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {altRates.length > 0 && (
        <LinkGroup title="Compare different rates" links={altRates} />
      )}
      {altTenures.length > 0 && (
        <LinkGroup title="Compare different tenures" links={altTenures} />
      )}
      {altTypes.length > 0 && (
        <LinkGroup title="Other loan types" links={altTypes} />
      )}
    </nav>
  );
}

function LinkGroup({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3
        style={{
          fontSize: 11,
          fontWeight: 400,
          color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          margin: "0 0 8px 0",
        }}
      >
        {title}
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontSize: 12,
              color: "var(--text-muted, rgba(255,255,255,0.5))",
              textDecoration: "none",
              padding: "5px 10px",
              borderRadius: 6,
              border: "1px solid var(--border, rgba(255,255,255,0.08))",
              background: "var(--card-bg, rgba(255,255,255,0.03))",
              transition: "color 0.15s, border-color 0.15s",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
