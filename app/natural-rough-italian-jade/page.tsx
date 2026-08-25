import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { naturalRoughItalianJade } from "@/content/natural-rough-italian-jade";

export const metadata: Metadata = {
  title: "Natural Rough Italian Jade",
  description: naturalRoughItalianJade.description,
  alternates: { canonical: "/natural-rough-italian-jade" },
  openGraph: {
    title: "Natural Rough Italian Jade | GemReserve.io",
    description: naturalRoughItalianJade.description,
    url: "/natural-rough-italian-jade",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function NaturalRoughItalianJadePage() {
  return <GemstonePage gem={naturalRoughItalianJade} />;
}
