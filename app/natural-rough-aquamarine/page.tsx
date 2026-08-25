import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { naturalRoughAquamarine } from "@/content/natural-rough-aquamarine";

export const metadata: Metadata = {
  title: "Natural Rough Aquamarine",
  description: naturalRoughAquamarine.description,
  alternates: { canonical: "/natural-rough-aquamarine" },
  openGraph: {
    title: "Natural Rough Aquamarine | GemReserve.io",
    description: naturalRoughAquamarine.description,
    url: "/natural-rough-aquamarine",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function NaturalRoughAquamarinePage() {
  return <GemstonePage gem={naturalRoughAquamarine} />;
}
