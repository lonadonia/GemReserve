import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { peridot } from "@/content/peridot";

export const metadata: Metadata = {
  title: "Peridot",
  description: peridot.description,
  alternates: { canonical: "/peridot" },
  openGraph: {
    title: "Peridot | GemReserve.io",
    description: peridot.description,
    url: "/peridot",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function PeridotPage() {
  return <GemstonePage gem={peridot} />;
}
