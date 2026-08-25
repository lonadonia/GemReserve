import type { Metadata } from "next";

import { GemstonePage } from "@/components/sections/GemstonePage";
import { naturalRoughJasper } from "@/content/natural-rough-jasper";

export const metadata: Metadata = {
  title: "Natural Rough Jasper",
  description: naturalRoughJasper.description,
  alternates: { canonical: "/natural-rough-jasper" },
  openGraph: {
    title: "Natural Rough Jasper | GemReserve.io",
    description: naturalRoughJasper.description,
    url: "/natural-rough-jasper",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function NaturalRoughJasperPage() {
  return <GemstonePage gem={naturalRoughJasper} />;
}
