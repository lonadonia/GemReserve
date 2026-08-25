import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { naturalRoughEmerald } from "@/content/natural-rough-emerald";

export const metadata: Metadata = {
  title: "Natural Rough Emerald",
  description: naturalRoughEmerald.description,
  alternates: { canonical: "/natural-rough-emerald" },
  openGraph: {
    title: "Natural Rough Emerald | GemReserve.io",
    description: naturalRoughEmerald.description,
    url: "/natural-rough-emerald",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function NaturalRoughEmeraldPage() {
  return <GemstonePage gem={naturalRoughEmerald} />;
}
