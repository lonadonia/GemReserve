import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { naturalRoughRutilatedQuartz } from "@/content/natural-rough-rutilated-quartz";

export const metadata: Metadata = {
  title: "Natural Rough Rutilated Quartz",
  description: naturalRoughRutilatedQuartz.description,
  alternates: { canonical: "/natural-rough-rutilated-quartz" },
  openGraph: {
    title: "Natural Rough Rutilated Quartz | GemReserve.io",
    description: naturalRoughRutilatedQuartz.description,
    url: "/natural-rough-rutilated-quartz",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function NaturalRoughRutilatedQuartzPage() {
  return <GemstonePage gem={naturalRoughRutilatedQuartz} />;
}
