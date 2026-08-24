import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { emerald } from "@/content/emerald";

export const metadata: Metadata = {
  title: "Emerald",
  description: emerald.description,
  alternates: { canonical: "/emerald" },
  openGraph: {
    title: "Emerald | GemReserve.io",
    description: emerald.description,
    url: "/emerald",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function EmeraldPage() {
  return <GemstonePage gem={emerald} />;
}
