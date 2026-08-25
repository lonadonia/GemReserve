import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { naturalRoughAlexandrite } from "@/content/natural-rough-alexandrite";

export const metadata: Metadata = {
  title: "Natural Rough Alexandrite",
  description: naturalRoughAlexandrite.description,
  alternates: { canonical: "/natural-rough-alexandrite" },
  openGraph: {
    title: "Natural Rough Alexandrite | GemReserve.io",
    description: naturalRoughAlexandrite.description,
    url: "/natural-rough-alexandrite",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function NaturalRoughAlexandritePage() {
  return <GemstonePage gem={naturalRoughAlexandrite} />;
}
