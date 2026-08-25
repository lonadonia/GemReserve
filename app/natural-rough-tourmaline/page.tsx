import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { naturalRoughTourmaline } from "@/content/natural-rough-tourmaline";

export const metadata: Metadata = {
  title: "Natural Rough Tourmaline",
  description: naturalRoughTourmaline.description,
  alternates: { canonical: "/natural-rough-tourmaline" },
  openGraph: {
    title: "Natural Rough Tourmaline | GemReserve.io",
    description: naturalRoughTourmaline.description,
    url: "/natural-rough-tourmaline",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function NaturalRoughTourmalinePage() {
  return <GemstonePage gem={naturalRoughTourmaline} />;
}
