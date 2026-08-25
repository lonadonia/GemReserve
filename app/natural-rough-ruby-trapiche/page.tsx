import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { naturalRoughRubyTrapiche } from "@/content/natural-rough-ruby-trapiche";

export const metadata: Metadata = {
  title: "Natural Rough Ruby — Trapiche",
  description: naturalRoughRubyTrapiche.description,
  alternates: { canonical: "/natural-rough-ruby-trapiche" },
  openGraph: {
    title: "Natural Rough Ruby — Trapiche | GemReserve.io",
    description: naturalRoughRubyTrapiche.description,
    url: "/natural-rough-ruby-trapiche",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function NaturalRoughRubyTrapichePage() {
  return <GemstonePage gem={naturalRoughRubyTrapiche} />;
}
