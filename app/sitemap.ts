import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/how-it-works",
    "/assets",
    "/technology",
    "/platform-infrastructure",
    "/gemstone-programs",
    "/asset-registry",
    "/gemstone-tokenization",
    "/physical-redemption",
    "/digital-asset-passports",
    "/enterprise",
    "/investors",
    "/about",
    "/governance",
    "/contact",
    "/early-participation",
    "/eligibility-kyc",
    "/faq",
  ].map((path) => ({
    url: `https://gemreserve.io${path}`,
    lastModified: new Date("2026-08-24"),
    changeFrequency: path ? "monthly" : "weekly",
    priority: path ? 0.8 : 1,
  }));
}
