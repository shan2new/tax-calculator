import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/lib/theme-context";
import { NavigationProvider } from "@/lib/navigation-context";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Calcq - Indian Tax Calculator FY 2025-26 | Free Income Tax Calculator",
  description: "Calcq: Free Indian Income Tax Calculator for FY 2025-26 under New Tax Regime. Calculate your tax liability, tax savings, and take-home salary instantly. Updated with latest tax slabs and rates.",
  keywords: [
    "calcq",
    "indian tax calculator",
    "income tax calculator india", 
    "tax calculator FY 2025-26",
    "new tax regime calculator",
    "india tax calculator",
    "income tax calculation",
    "tax slab calculator",
    "salary tax calculator",
    "indian income tax",
    "tax planning calculator"
  ].join(", "),
  authors: [{ name: "shan2new", url: "https://github.com/shan2new" }],
  creator: "shan2new",
  publisher: "shan2new",
  robots: "index, follow",
  metadataBase: new URL("https://calcq.tech"),
  alternates: {
    canonical: "https://calcq.tech",
  },
  openGraph: {
    type: "website",
    url: "https://calcq.tech",
    title: "Calcq - Indian Tax Calculator FY 2025-26",
    description: "Calcq: Free Indian Income Tax Calculator for FY 2025-26. Calculate your tax liability and take-home salary under the New Tax Regime instantly.",
    siteName: "Calcq",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calcq - Indian Tax Calculator FY 2025-26",
    description: "Calcq: Free Indian Income Tax Calculator for FY 2025-26. Calculate your tax liability and take-home salary under the New Tax Regime instantly.",
  },
  other: {
    "theme-color": "#2563EB",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
    "geo.region": "IN",
    "geo.country": "India",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="icon" href="/logo.svg" sizes="32x32" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body className="font-inter antialiased bg-background text-foreground">
        <ThemeProvider>
          <NavigationProvider>
            <Navbar />
            {children}
            <Toaster 
              position="top-right"
              closeButton={true}
              richColors={true}
              duration={4000}
            />
            <Analytics />
          </NavigationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
