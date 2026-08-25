import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { tourmaline } from "@/content/tourmaline";

export const metadata: Metadata = {
  title: "Tourmaline",
  description: tourmaline.description,
  alternates: { canonical: "/tourmaline" },
  openGraph: {
    title: "Tourmaline | GemReserve.io",
    description: tourmaline.description,
    url: "/tourmaline",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function TourmalinePage() {
  return <GemstonePage gem={tourmaline} />;
}
