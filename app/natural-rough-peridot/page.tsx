import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { naturalRoughPeridot } from "@/content/natural-rough-peridot";

export const metadata: Metadata = {
  title: "Natural Rough Peridot",
  description: naturalRoughPeridot.description,
  alternates: { canonical: "/natural-rough-peridot" },
  openGraph: {
    title: "Natural Rough Peridot | GemReserve.io",
    description: naturalRoughPeridot.description,
    url: "/natural-rough-peridot",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function NaturalRoughPeridotPage() {
  return <GemstonePage gem={naturalRoughPeridot} />;
}
