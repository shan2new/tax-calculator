import Link from "next/link";

const POPULAR_LOANS = [
  { href: "/loans/home-loan/50-lakh/8.5-percent/20-years", label: "50L Home Loan" },
  { href: "/loans/home-loan/30-lakh/8.5-percent/15-years", label: "30L Home Loan" },
  { href: "/loans/home-loan/1-crore/8.5-percent/20-years", label: "1Cr Home Loan" },
  { href: "/loans/car-loan/10-lakh/9-percent/5-years", label: "10L Car Loan" },
  { href: "/loans/personal-loan/5-lakh/12-percent/3-years", label: "5L Personal Loan" },
  { href: "/loans/education-loan/20-lakh/8.5-percent/10-years", label: "20L Education Loan" },
];

const POPULAR_TAX = [
  { href: "/tax/fy-2025-26/10-lpa", label: "Tax on ₹10 LPA" },
  { href: "/tax/fy-2025-26/12-lpa", label: "Tax on ₹12 LPA" },
  { href: "/tax/fy-2025-26/15-lpa", label: "Tax on ₹15 LPA" },
  { href: "/tax/fy-2025-26/20-lpa", label: "Tax on ₹20 LPA" },
  { href: "/tax/fy-2025-26/25-lpa", label: "Tax on ₹25 LPA" },
  { href: "/tax/fy-2025-26/50-lpa", label: "Tax on ₹50 LPA" },
];

const linkStyle: React.CSSProperties = {
  fontSize: 11,
  color: "var(--text-muted-faint, rgba(255,255,255,0.3))",
  textDecoration: "none",
  lineHeight: 1.5,
  fontWeight: 300,
  letterSpacing: "0.01em",
};

interface SEOFooterProps {
  showLoans?: boolean;
  showTax?: boolean;
}

export function SEOFooter({ showLoans = true, showTax = true }: SEOFooterProps) {
  const links = [
    ...(showLoans ? POPULAR_LOANS : []),
    ...(showTax ? POPULAR_TAX : []),
  ];

  if (links.length === 0) return null;

  return (
    <nav
      aria-label="Popular calculators"
      style={{
        marginTop: 24,
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
        Related Calculators
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px 12px",
        }}
      >
        {links.map((link) => (
          <Link key={link.href} href={link.href} style={linkStyle}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
