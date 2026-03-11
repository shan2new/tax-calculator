import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claros — Financial clarity, one decision at a time",
  description:
    "Loan EMI calculator and Income Tax comparator for India. Intuitive, private, and entirely on-device.",
  keywords:
    "emi calculator, loan calculator, income tax calculator, old vs new regime, home loan, car loan, india",
  authors: [{ name: "shan2new", url: "https://github.com/shan2new" }],
  creator: "shan2new",
  robots: "index, follow",
  metadataBase: new URL("https://claros.app"),
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
    url: "https://claros.app",
    title: "Claros — Financial clarity, one decision at a time",
    description: "Loan EMI calculator and Income Tax comparator for India.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
