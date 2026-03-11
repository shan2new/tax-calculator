import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { AppShell } from "@/components/AppShell";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claros — Free EMI Calculator & Income Tax Comparator for India",
  description:
    "Calculate loan EMI for home, car, personal & education loans. Compare old vs new income tax regime for FY 2025-26. Fast, private, entirely on-device.",
  keywords:
    "emi calculator, loan calculator, income tax calculator, old vs new regime, home loan emi, car loan emi, tax calculator india, FY 2025-26",
  authors: [{ name: "Shantanu Sinha", url: "https://github.com/shan2new" }],
  creator: "Shantanu Sinha",
  robots: "index, follow",
  metadataBase: new URL("https://getclaros.in"),
  alternates: {
    canonical: "https://getclaros.in/",
    languages: { "en-IN": "https://getclaros.in/" },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: "/favicon.ico" }],
  },
  openGraph: {
    type: "website",
    url: "https://getclaros.in",
    title: "Claros — Free EMI Calculator & Income Tax Comparator for India",
    description:
      "Calculate loan EMI for home, car, personal & education loans. Compare old vs new income tax regime for FY 2025-26. Fast, private, entirely on-device.",
    siteName: "Claros",
    locale: "en_IN",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
    { media: "(prefers-color-scheme: light)", color: "#f7f3ed" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const webAppSchema = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Claros",
    url: "https://getclaros.in",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
      "Free EMI calculator and income tax comparator for India. Compare old vs new tax regime, calculate loan EMI with amortization schedule.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    creator: { "@type": "Person", name: "Shantanu Sinha", url: "https://github.com/shan2new" },
    featureList: [
      "Loan EMI calculation with amortization schedule",
      "Old vs New income tax regime comparison",
      "Support for Home, Car, Personal, Education loans",
      "FY 2025-26 tax slabs",
      "Entirely on-device computation — no data sent to servers",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Claros",
    url: "https://getclaros.in",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://getclaros.in/loans?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body>
        <JsonLd data={webAppSchema} />
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
