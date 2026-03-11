import Link from "next/link";

const POPULAR_LOANS = [
  { href: "/loans/home-loan/50-lakh/8.5-percent/20-years", label: "50 Lakh Home Loan EMI" },
  { href: "/loans/home-loan/30-lakh/8.5-percent/15-years", label: "30 Lakh Home Loan EMI" },
  { href: "/loans/home-loan/1-crore/8.5-percent/20-years", label: "1 Crore Home Loan EMI" },
  { href: "/loans/car-loan/10-lakh/9-percent/5-years", label: "10 Lakh Car Loan EMI" },
  { href: "/loans/personal-loan/5-lakh/12-percent/3-years", label: "5 Lakh Personal Loan EMI" },
  { href: "/loans/education-loan/20-lakh/8.5-percent/10-years", label: "20 Lakh Education Loan EMI" },
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
  fontSize: 12,
  color: "var(--text-muted, rgba(255,255,255,0.5))",
  textDecoration: "none",
  padding: "5px 10px",
  borderRadius: 6,
  border: "1px solid var(--border, rgba(255,255,255,0.08))",
  background: "var(--card-bg, rgba(255,255,255,0.03))",
  display: "inline-block",
};

interface SEOFooterProps {
  showLoans?: boolean;
  showTax?: boolean;
}

export function SEOFooter({ showLoans = true, showTax = true }: SEOFooterProps) {
  return (
    <nav
      aria-label="Popular calculators"
      style={{
        marginTop: 32,
        paddingTop: 24,
        paddingBottom: 8,
        borderTop: "1px solid var(--border, rgba(255,255,255,0.08))",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {showLoans && (
        <div>
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
            Popular Loan Calculators
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {POPULAR_LOANS.map((link) => (
              <Link key={link.href} href={link.href} style={linkStyle}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {showTax && (
        <div>
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
            Tax Calculator by Salary
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {POPULAR_TAX.map((link) => (
              <Link key={link.href} href={link.href} style={linkStyle}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
