/**
 * All Gemstone Programs — transcribed from the client's board.
 *
 * The board's fourth card is a white round brilliant, hardness 10 Mohs, origin
 * "Global", captioned "Eternity, Strength, Purity" — a diamond in everything but
 * its heading, which repeats "Emerald" from the card beside it. The asset pack
 * ships exactly ten stone cut-outs and the tenth is a diamond, so the heading is
 * a copy-paste slip and the card is titled Diamond here.
 *
 * The four highlight figures are the ones /assets already publishes, carried
 * across from the same source rather than restated at new values. They remain
 * flagged for client verification, as they are there.
 */

export const programsHero = {
  breadcrumb: ["Home", "Assets", "All Gemstone Programs"] as const,
  // The board sets only the middle word in gold, so the line is held as three
  // parts rather than as stacked lines the way the other heroes are.
  title: { before: "All", accent: "Gemstone", after: "Programs" },
  tagline: "RARE BY NATURE. VERIFIED BY SCIENCE. BACKED BY REAL ASSETS.",
  description:
    "Discover our complete suite of tokenized gemstone programs. Every gemstone is 100% backed by real, physical assets securely vaulted and independently verified. Choose from the world's most desirable gemstones, each tokenized for true ownership, liquidity and global accessibility.",
  imageAlt: "Six faceted gemstones on black pedestals before an open vault",
} as const;

export interface ProgramBadge {
  id: string;
  title: string;
  description: string;
}

export const programBadges: readonly ProgramBadge[] = [
  {
    id: "backed",
    title: "100% BACKED",
    description: "Every token is backed by real, physical gemstones.",
  },
  {
    id: "verified",
    title: "INDEPENDENTLY VERIFIED",
    description: "Gemological reports from leading laboratories and auditors.",
  },
  {
    id: "borderless",
    title: "LIQUID & BORDERLESS",
    description:
      "Own, trade and transfer tokenized gemstones anywhere in the world.",
  },
  {
    id: "redeemable",
    title: "REDEEMABLE",
    description: "Redeem your gemstone and receive the physical asset you own.",
  },
  {
    id: "vaults",
    title: "SECURE VAULTS",
    description:
      "Institutional-grade vaults with 24/7 monitoring and insurance.",
  },
  {
    id: "transparent",
    title: "TRANSPARENT",
    description: "On-chain data, digital asset passports and full audit trail.",
  },
];

export interface GemstoneProgram {
  id: string;
  name: string;
  epithet: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  /** The swatch beside the name, taken from the stone itself. */
  swatch: string;
  origin: string;
  hardness: string;
  typicalSize: string;
  tokenStandard: string;
}

export const programsSectionTitle = "OUR GEMSTONE PROGRAMS";

export const gemstonePrograms: readonly GemstoneProgram[] = [
  {
    id: "ruby",
    name: "Ruby",
    epithet: "The King of Gemstones",
    description:
      "Symbol of passion, power and prosperity. Finest rubies from Mozambique and Myanmar.",
    imageSrc: "/images/gems/ruby.webp",
    imageAlt: "A cushion-cut deep red ruby",
    swatch: "#c9202f",
    origin: "Mozambique / Myanmar",
    hardness: "9 Mohs",
    typicalSize: "0.50 – 10+ ct",
    tokenStandard: "ERC-20",
  },
  {
    id: "blue-sapphire",
    name: "Blue Sapphire",
    epithet: "Wisdom. Loyalty. Nobility.",
    description: "Exceptional blue sapphires from Sri Lanka and Madagascar.",
    imageSrc: "/images/gems/blue-sapphire.webp",
    imageAlt: "An oval-cut deep blue sapphire",
    swatch: "#1f4fc4",
    origin: "Sri Lanka / Madagascar",
    hardness: "9 Mohs",
    typicalSize: "0.50 – 10+ ct",
    tokenStandard: "ERC-20",
  },
  {
    id: "emerald",
    name: "Emerald",
    epithet: "Growth. Renewal. Legacy.",
    description:
      "Premium emeralds from Zambia and Colombia, renowned for their vibrant green color.",
    imageSrc: "/images/gems/emerald.webp",
    imageAlt: "An emerald-cut vivid green emerald",
    swatch: "#0f9b63",
    origin: "Zambia / Colombia",
    hardness: "7.5 – 8 Mohs",
    typicalSize: "0.50 – 8+ ct",
    tokenStandard: "ERC-20",
  },
  {
    id: "diamond",
    name: "Diamond",
    epithet: "Eternity. Strength. Purity.",
    description:
      "Certified natural diamonds with D color and excellent cut from trusted sources worldwide.",
    imageSrc: "/images/gems/diamond.webp",
    imageAlt: "A round brilliant white diamond",
    swatch: "#cfd6dc",
    origin: "Global",
    hardness: "10 Mohs",
    typicalSize: "0.30 – 10+ ct",
    tokenStandard: "ERC-20",
  },
  {
    id: "pink-sapphire",
    name: "Pink Sapphire",
    epithet: "Love. Compassion. Grace.",
    description: "Rare pink sapphires from Madagascar and Tanzania.",
    imageSrc: "/images/gems/pink-sapphire.webp",
    imageAlt: "An oval-cut pink sapphire",
    swatch: "#d9508f",
    origin: "Madagascar / Tanzania",
    hardness: "9 Mohs",
    typicalSize: "0.50 – 8+ ct",
    tokenStandard: "ERC-20",
  },
  {
    id: "yellow-sapphire",
    name: "Yellow Sapphire",
    epithet: "Prosperity. Energy. Joy.",
    description: "Vibrant yellow sapphires from Thailand and Madagascar.",
    imageSrc: "/images/gems/yellow-sapphire.webp",
    imageAlt: "An oval-cut golden yellow sapphire",
    swatch: "#e0a218",
    origin: "Thailand / Madagascar",
    hardness: "9 Mohs",
    typicalSize: "0.50 – 8+ ct",
    tokenStandard: "ERC-20",
  },
  {
    id: "amethyst",
    name: "Amethyst",
    epithet: "Calm. Clarity. Protection.",
    description:
      "Fine amethysts from Brazil and Uruguay with deep natural color.",
    imageSrc: "/images/gems/amethyst.webp",
    imageAlt: "An oval-cut purple amethyst",
    swatch: "#8a44c8",
    origin: "Brazil / Uruguay",
    hardness: "7 Mohs",
    typicalSize: "1.00 – 20+ ct",
    tokenStandard: "ERC-20",
  },
  {
    id: "aquamarine",
    name: "Aquamarine",
    epithet: "Tranquility. Courage. Clarity.",
    description: "Premium aquamarines from Brazil and Mozambique.",
    imageSrc: "/images/gems/aquamarine.webp",
    imageAlt: "An emerald-cut pale blue aquamarine",
    swatch: "#4aa6bd",
    origin: "Brazil / Mozambique",
    hardness: "7.5 – 8 Mohs",
    typicalSize: "1.00 – 20+ ct",
    tokenStandard: "ERC-20",
  },
  {
    id: "spinel",
    name: "Spinel",
    epithet: "Vitality. Endurance. Renewal.",
    description:
      "Exceptional spinels from Tanzania and Myanmar in vivid natural colors.",
    imageSrc: "/images/gems/spinel.webp",
    imageAlt: "A cushion-cut red spinel",
    swatch: "#d0304f",
    origin: "Tanzania / Myanmar",
    hardness: "8 Mohs",
    typicalSize: "0.50 – 8+ ct",
    tokenStandard: "ERC-20",
  },
  {
    id: "tsavorite-garnet",
    name: "Tsavorite Garnet",
    epithet: "Abundance. Vitality. Growth.",
    description: "Rare tsavorites from Kenya with exceptional green vibrancy.",
    imageSrc: "/images/gems/tsavorite-garnet.webp",
    imageAlt: "A round-cut vivid green tsavorite garnet",
    swatch: "#4ea82a",
    origin: "Kenya",
    hardness: "7 – 7.5 Mohs",
    typicalSize: "0.50 – 5+ ct",
    tokenStandard: "ERC-20",
  },
];

export const programSpecLabels = {
  origin: "Origin",
  hardness: "Hardness",
  typicalSize: "Typical Size",
  tokenStandard: "Token Standard",
} as const;

export const programActionLabel = "View Program";

export const everyGemstone = {
  title: "Every Gemstone. Every Detail. Every Time.",
  description:
    "Each gemstone in our programs is carefully selected, gemologically verified, and securely vaulted. Our Digital Asset Passport provides complete transparency including origin, treatment, weight, images, and certification — all recorded on-chain.",
  imageAlt:
    "A gemological report with a ruby on the page, beside a camera lens and loupe",
  checks: [
    "Gemological Certificate",
    "Weight & Measurements",
    "High Resolution Images (360°)",
    "Treatment Disclosure",
    "Origin & Provenance",
    "Vault & Insurance Details",
  ],
  highlightsTitle: "Program Highlights",
} as const;

export interface ProgramHighlight {
  id: string;
  value: string;
  label: string;
  /** These four are the figures /assets publishes; they carry its same flag. */
  requiresClientVerification?: boolean;
}

export const programHighlights: readonly ProgramHighlight[] = [
  { id: "programs", value: "10+", label: "Gemstone Programs" },
  {
    id: "types",
    value: "25+",
    label: "Gemstone Types Available",
    requiresClientVerification: true,
  },
  {
    id: "assets",
    value: "1,850+",
    label: "Verified Assets in Vaults",
    requiresClientVerification: true,
  },
  {
    id: "countries",
    value: "18",
    label: "Countries Served",
    requiresClientVerification: true,
  },
  { id: "backed", value: "100%", label: "Backed by Real Assets" },
];

export const programsCta = {
  titleLines: ["Own the World's Most", "Precious Gemstones"] as const,
  // The board reads "Join thousands of investors building real wealth". The
  // platform has not launched and the waitlist form is careful to say that no
  // place has been reserved, so the line keeps its invitation without asserting
  // an investor count that would contradict the rest of the site.
  description:
    "Be part of the movement building real wealth with tokenized gemstone assets.",
  buttonLabel: "Join the Waitlist",
  supportingText: "Early access. Exclusive benefits.",
} as const;
