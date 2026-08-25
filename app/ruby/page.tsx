import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { ruby } from "@/content/ruby";

export const metadata: Metadata = {
  title: "Ruby",
  description: ruby.description,
  alternates: { canonical: "/ruby" },
  openGraph: {
    title: "Ruby | GemReserve.io",
    description: ruby.description,
    url: "/ruby",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function RubyPage() {
  return <GemstonePage gem={ruby} />;
}
