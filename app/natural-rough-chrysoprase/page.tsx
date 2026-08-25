import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { naturalRoughChrysoprase } from "@/content/natural-rough-chrysoprase";

export const metadata: Metadata = {
  title: "Natural Rough Chrysoprase",
  description: naturalRoughChrysoprase.description,
  alternates: { canonical: "/natural-rough-chrysoprase" },
  openGraph: {
    title: "Natural Rough Chrysoprase | GemReserve.io",
    description: naturalRoughChrysoprase.description,
    url: "/natural-rough-chrysoprase",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function NaturalRoughChrysoprasePage() {
  return <GemstonePage gem={naturalRoughChrysoprase} />;
}
