import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/how-it-works", "/assets"].map((path) => ({
    url: `https://gemreserve.io${path}`,
    lastModified: new Date("2026-08-20"),
    changeFrequency: path ? "monthly" : "weekly",
    priority: path ? 0.8 : 1,
  }));
}
