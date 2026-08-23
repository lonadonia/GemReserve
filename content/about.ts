export interface AboutHeroContent {
  breadcrumb: readonly [string, string];
  eyebrow: string;
  titleLead: string;
  titleAccentOne: string;
  titleJoin: string;
  titleAccentTwo: string;
  description: string;
}

export const aboutHero: AboutHeroContent = {
  breadcrumb: ["Home", "About Us"],
  eyebrow: "ABOUT GEMRESERVE",
  titleLead: "Building the Bridge Between",
  titleAccentOne: "Real Gems",
  titleJoin: "and",
  titleAccentTwo: "Digital Assets.",
  description:
    "GemReserve.io is a Lithuanian company at the forefront of real-world asset tokenization, transforming the trillion-dollar gemstone industry through blockchain technology, institutional grade custody, and unparalleled transparency.",
};

export interface AboutPillar {
  id: string;
  title: string;
  description: string;
}

export const aboutHeroPillars: readonly AboutPillar[] = [
  {
    id: "real-assets",
    title: "REAL ASSETS",
    description: "Physically backed by verified, natural gemstones.",
  },
  {
    id: "real-value",
    title: "REAL VALUE",
    description: "Independent verification ensures authenticity and quality.",
  },
  {
    id: "real-access",
    title: "REAL ACCESS",
    description: "Global marketplace accessible to everyone, anywhere.",
  },
  {
    id: "real-trust",
    title: "REAL TRUST",
    description: "Built on transparency, security, and accountability.",
  },
];

/** The mission statement is shared word for word with the Governance board. */
export const missionTitle = "OUR MISSION";

export const missionStatement =
  "To become the global standard for gemstone ownership and investment by combining the timeless value of natural gems with the efficiency, liquidity, and accessibility of digital assets.";

export const storyTitle = "OUR STORY";

export const storyParagraphs: readonly string[] = [
  "Founded in Lithuania, GemReserve.io was born from the vision of combining centuries-old gemstone heritage with cutting-edge blockchain innovation.",
  "We saw an industry full of incredible value, yet held back by opacity, limited access, and inefficiency. Our mission is to unlock this value and create a more transparent, inclusive, and liquid market for generations to come.",
];

export const visionTitle = "OUR VISION";

export const visionStatement =
  "A world where owning, trading, and redeeming the world's most exquisite gemstones is as simple, secure, and accessible as digital assets.";

export const valuesTitle = "OUR VALUES";

export const aboutValues: readonly AboutPillar[] = [
  {
    id: "integrity",
    title: "INTEGRITY",
    description: "We do what is right, always.",
  },
  {
    id: "transparency",
    title: "TRANSPARENCY",
    description: "Full visibility in every step.",
  },
  {
    id: "innovation",
    title: "INNOVATION",
    description: "Technology serving value.",
  },
  {
    id: "security",
    title: "SECURITY",
    description: "Institutional grade protection.",
  },
  {
    id: "excellence",
    title: "EXCELLENCE",
    description: "Pursuing the highest standards.",
  },
];

export interface AboutCapability {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  /** Portrait artwork is anchored to its top so a wide crop keeps the subject. */
  anchorTop?: boolean;
}

export const capabilitiesSectionTitle = "BUILT ON TRUST. BACKED BY EXPERTS.";

/**
 * Four of the five plates already exist in the section library, so only the
 * gemological one is newly generated; reusing the rest keeps the page in the
 * same photographic register as the pages already shipped.
 */
export const aboutCapabilities: readonly AboutCapability[] = [
  {
    id: "gemological-verification",
    title: "GEMOLOGICAL VERIFICATION",
    description:
      "Each gemstone is verified by leading independent gemological labs.",
    image: "/images/sections/gemological-verification.webp",
    alt: "Jeweller's tweezers holding a round brilliant diamond",
  },
  {
    id: "institutional-custody",
    title: "INSTITUTIONAL CUSTODY",
    description: "Secure storage in world-class vaults with full insurance.",
    image: "/images/sections/vault-security.webp",
    alt: "An open institutional vault holding a lit gemstone",
  },
  {
    id: "digital-asset-passport",
    title: "DIGITAL ASSET PASSPORT",
    description: "Every gem has a unique digital identity and on-chain record.",
    image: "/images/sections/asset-passport.webp",
    alt: "A specimen digital asset passport card for an emerald",
    anchorTop: true,
  },
  {
    id: "on-chain-transparency",
    title: "ON-CHAIN TRANSPARENCY",
    description: "Immutable records on the blockchain ensure full provenance.",
    image: "/images/sections/blockchain-network.webp",
    alt: "A gemstone on a pedestal at the centre of a lit network lattice",
  },
  {
    id: "physical-redemption",
    title: "PHYSICAL REDEMPTION",
    description: "Redeem your gemstones in physical form, anytime.",
    image: "/images/sections/vault-tray.webp",
    alt: "An open vault case holding a tray of coloured gemstones",
  },
];

export interface AboutStat {
  id: string;
  value: string;
  label: string;
  caption: string;
}

/**
 * Every figure here is transcribed from the client's own board rather than
 * estimated. They are stated on that board as present-tense operating numbers,
 * not projections, so they are the client's claims to stand behind.
 */
export const aboutStats: readonly AboutStat[] = [
  {
    id: "real-gemstones",
    value: "100%",
    label: "REAL GEMSTONES",
    caption: "Physically backed by real assets",
  },
  {
    id: "verified-gems",
    value: "500+",
    label: "VERIFIED GEMS",
    caption: "Independently verified and graded",
  },
  {
    id: "gemstone-types",
    value: "20+",
    label: "GEMSTONE TYPES",
    caption: "A diverse collection of precious stones",
  },
  {
    id: "secure-vaults",
    value: "5",
    label: "SECURE VAULTS",
    caption: "Institutional grade security",
  },
  {
    id: "countries-served",
    value: "50+",
    label: "COUNTRIES SERVED",
    caption: "A global community of investors",
  },
  {
    id: "transparent",
    value: "24/7",
    label: "TRANSPARENT",
    caption: "Real-time data and on-chain access",
  },
];

export interface AboutCta {
  eyebrow: string;
  title: string;
  description: string;
}

export const aboutCta: AboutCta = {
  eyebrow: "JOIN THE FUTURE",
  title: "Be Part of the Next Gemstone Revolution",
  description:
    "Early access to exclusive gemstone offerings, insights, and platform updates.",
};

export const aboutHeroImageAlt =
  "Loose faceted gemstones on a jeweller's slate beside a loupe and tweezers";

export const storyImage = "/images/sections/lithuania-square.webp";

export const storyImageAlt =
  "The Lithuanian flag before Trakai Island Castle at sunset";
