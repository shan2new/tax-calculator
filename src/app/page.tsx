import type { Metadata } from "next";
import { HomePageClient } from "@/screens/HomePageClient";
import { SEOFooter } from "@/components/seo/SEOFooter";

export const metadata: Metadata = {
  title: "Claros — Free EMI Calculator & Income Tax Comparator for India",
  description:
    "Calculate loan EMI for home, car, personal & education loans. Compare old vs new income tax regime for FY 2025-26. Fast, private, entirely on-device.",
  alternates: {
    canonical: "https://getclaros.in/",
    languages: { "en-IN": "https://getclaros.in/" },
  },
  openGraph: {
    type: "website",
    url: "https://getclaros.in/",
    title: "Claros — Free EMI Calculator & Income Tax Comparator for India",
    description:
      "Calculate loan EMI for home, car, personal & education loans. Compare old vs new income tax regime for FY 2025-26. Fast, private, entirely on-device.",
    siteName: "Claros",
    locale: "en_IN",
  },
};

export default function HomePage() {
  return (
    <>
      <HomePageClient />
      <div style={{ padding: "0 24px 40px", marginTop: 80 }}>
        <div
          style={{
            borderTop: "1px solid var(--border, rgba(255,255,255,0.08))",
            paddingTop: 24,
          }}
        >
          <SEOFooter />
        </div>
      </div>
    </>
  );
}
