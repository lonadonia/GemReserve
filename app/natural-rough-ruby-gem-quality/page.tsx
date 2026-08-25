import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { naturalRoughRubyGemQuality } from "@/content/natural-rough-ruby-gem-quality";

export const metadata: Metadata = {
  title: "Natural Rough Ruby — Gem Quality",
  description: naturalRoughRubyGemQuality.description,
  alternates: { canonical: "/natural-rough-ruby-gem-quality" },
  openGraph: {
    title: "Natural Rough Ruby — Gem Quality | GemReserve.io",
    description: naturalRoughRubyGemQuality.description,
    url: "/natural-rough-ruby-gem-quality",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function NaturalRoughRubyGemQualityPage() {
  return <GemstonePage gem={naturalRoughRubyGemQuality} />;
}
