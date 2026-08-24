import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { aquamarine } from "@/content/aquamarine";

export const metadata: Metadata = {
  title: "Aquamarine",
  description: aquamarine.description,
  alternates: { canonical: "/aquamarine" },
  openGraph: {
    title: "Aquamarine | GemReserve.io",
    description: aquamarine.description,
    url: "/aquamarine",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function AquamarinePage() {
  return <GemstonePage gem={aquamarine} />;
}
