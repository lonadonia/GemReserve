import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { naturalRawCharoite } from "@/content/natural-raw-charoite";

export const metadata: Metadata = {
  title: "Natural Raw Charoite",
  description: naturalRawCharoite.description,
  alternates: { canonical: "/natural-raw-charoite" },
  openGraph: {
    title: "Natural Raw Charoite | GemReserve.io",
    description: naturalRawCharoite.description,
    url: "/natural-raw-charoite",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function NaturalRawCharoitePage() {
  return <GemstonePage gem={naturalRawCharoite} />;
}
