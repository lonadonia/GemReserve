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
    "/aquamarine",
    "/emerald",
    "/peridot",
    "/ruby",
    "/tourmaline",
    "/natural-raw-charoite",
    "/natural-rough-alexandrite",
    "/natural-rough-aquamarine",
    "/redemption-portal",
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
    lastModified: new Date("2026-08-25"),
    changeFrequency: path ? "monthly" : "weekly",
    priority: path ? 0.8 : 1,
  }));
}
