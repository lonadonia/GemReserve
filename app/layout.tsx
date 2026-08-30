import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { siteUrl } from "@/lib/config";

import "./globals.css";

// Playfair Display carries the higher stroke contrast and heavier stems the
// mockups use for editorial headlines; Cormorant Garamond read too fine here.
const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Inter holds up far better than Manrope at the small label and spec-row sizes
// this interface leans on.
const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GemReserve.io | Real Gems. Real Value. Real Trust.",
    template: "%s | GemReserve.io",
  },
  description:
    "Explore the GemReserve.io preview: asset-backed gemstone records, independent verification, secure custody and transparent ownership infrastructure.",
  applicationName: "GemReserve.io",
  keywords: [
    "gemstones",
    "real-world assets",
    "gemstone ownership",
    "GemReserve",
  ],
  openGraph: {
    type: "website",
    siteName: "GemReserve.io",
    title: "GemReserve.io | Real Gems. Real Value. Real Trust.",
    description: "A preview of the GemReserve.io gemstone ownership platform.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GemReserve.io",
    description: "Real Gems. Real Value. Real Trust.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020608",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
