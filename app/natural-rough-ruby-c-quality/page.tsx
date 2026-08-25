import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { naturalRoughRubyCQuality } from "@/content/natural-rough-ruby-c-quality";

export const metadata: Metadata = {
  title: "Natural Rough Ruby — C Quality",
  description: naturalRoughRubyCQuality.description,
  alternates: { canonical: "/natural-rough-ruby-c-quality" },
  openGraph: {
    title: "Natural Rough Ruby — C Quality | GemReserve.io",
    description: naturalRoughRubyCQuality.description,
    url: "/natural-rough-ruby-c-quality",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function NaturalRoughRubyCQualityPage() {
  return <GemstonePage gem={naturalRoughRubyCQuality} />;
}
