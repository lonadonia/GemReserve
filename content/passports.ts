/**
 * Digital Asset Passports — transcribed from the client's board.
 *
 * The board's two passport records are sample records: it labels its own button
 * "VIEW FULL PASSPORT SAMPLE". They are carried across with their figures intact
 * and marked as samples wherever they appear, so no reader takes the passport
 * IDs, report numbers or transaction hash for a live record.
 *
 * The lab row reads "GRS", the short form the gemstone catalogue already uses,
 * rather than the board's full trading name.
 */

export interface PassportBadge {
  id: string;
  title: string;
  description: string;
}

export interface PassportField {
  id: string;
  label: string;
  value: string;
}

export const passportsHero = {
  breadcrumb: ["Home", "Technology", "Digital Asset Passports"] as const,
  titleLines: ["Digital Asset", "Passports"] as const,
  tagline: "The digital identity for every physical gemstone.",
  description:
    "GemReserve Digital Asset Passports capture the complete story of each gemstone — from origin to current custody — creating a permanent, tamper-proof record you can trust.",
  badges: [
    {
      id: "unique",
      title: "UNIQUE & SECURE",
      description:
        "Each passport is uniquely identified and secured on the blockchain.",
    },
    {
      id: "transparency",
      title: "FULL TRANSPARENCY",
      description:
        "Complete visibility into origin, treatment, custody and ownership.",
    },
    {
      id: "tamper-proof",
      title: "TAMPER-PROOF",
      description: "Immutable records that cannot be altered or deleted.",
    },
    {
      id: "instant",
      title: "INSTANT VERIFICATION",
      description:
        "Verify authenticity and details in seconds from anywhere in the world.",
    },
    {
      id: "accessible",
      title: "ALWAYS ACCESSIBLE",
      description:
        "Your passport is stored forever and accessible 24/7 online.",
    },
  ] as readonly PassportBadge[],
  card: {
    eyebrow: "Digital Asset Passport",
    idLabel: "Passport ID",
    id: "GR-RUB-000245",
    name: "Ruby",
    species: "Natural Corundum",
    imageAlt: "A cushion-cut vivid red ruby",
    fields: [
      { id: "weight", label: "Weight", value: "1.00 ct" },
      { id: "shape", label: "Shape & Cut", value: "Cushion Cut" },
      { id: "origin", label: "Origin", value: "Mozambique" },
      { id: "treatment", label: "Treatment", value: "Heated" },
      { id: "clarity", label: "Clarity", value: "Minor Inclusions" },
      { id: "color", label: "Color", value: "Vivid Red" },
      { id: "issued", label: "Date Issued", value: "May 12, 2024" },
    ] as readonly PassportField[],
    scanNote: "Scan to verify on the blockchain",
    sampleNote: "Sample record",
  },
} as const;

export interface PassportPillar {
  id: string;
  title: string;
  description: string;
}

export const whatIsTitle = "WHAT IS A DIGITAL ASSET PASSPORT?";

export const whatIsIntro =
  "A Digital Asset Passport is a comprehensive digital record that contains all critical information about a gemstone. It is created at the time of verification and updated throughout the asset's lifecycle.";

export const passportPillars: readonly PassportPillar[] = [
  {
    id: "unique-id",
    title: "UNIQUE DIGITAL ID",
    description:
      "Every gemstone gets a unique passport ID for lifetime identification.",
  },
  {
    id: "complete-record",
    title: "COMPLETE RECORD",
    description:
      "All gemological data, images, reports and provenance details.",
  },
  {
    id: "blockchain-secured",
    title: "BLOCKCHAIN SECURED",
    description:
      "Saved on the blockchain for immutability and permanent protection.",
  },
  {
    id: "lifecycle",
    title: "LIFECYCLE TRACKING",
    description: "Tracks ownership, custody, insurance and movement history.",
  },
  {
    id: "global-standard",
    title: "GLOBAL STANDARD",
    description: "Built to international standards for universal recognition.",
  },
];

export interface PassportSection {
  id: string;
  label: string;
  /** What this section of the record holds, shown when the section is open. */
  summary: string;
  fields: readonly PassportField[];
}

export const insidePassportTitle = "INSIDE EVERY PASSPORT";

/**
 * The board draws ten sections down the rail and shows the Overview panel open.
 * The other nine panels are filled from the same sample stone, using only
 * figures the board itself prints for it, so switching sections never invents a
 * detail the client has not published.
 */
export const passportSections: readonly PassportSection[] = [
  {
    id: "overview",
    label: "Overview",
    summary:
      "The identity of the stone and the record that carries it, fixed at the moment of verification.",
    fields: [
      { id: "passport-id", label: "Passport ID", value: "GR-EMR-000125" },
      { id: "weight", label: "Weight", value: "2.45 ct" },
      {
        id: "dimensions",
        label: "Dimensions",
        value: "8.21 × 6.45 × 4.12 mm",
      },
      { id: "shape", label: "Shape & Cut", value: "Emerald Cut" },
      { id: "color", label: "Color", value: "Vivid Green" },
      { id: "clarity", label: "Clarity", value: "Minor Inclusions" },
      { id: "origin", label: "Origin", value: "Zambia" },
      { id: "treatment", label: "Treatment", value: "Minor Oil" },
      { id: "issued", label: "Date Issued", value: "May 12, 2024" },
      { id: "lab", label: "Lab", value: "GRS" },
      { id: "report", label: "Report No.", value: "GRS-2024-EM0125" },
      { id: "tx", label: "Blockchain TX", value: "0x7a3b…9c4f2d" },
    ],
  },
  {
    id: "gemstone-details",
    label: "Gemstone Details",
    summary:
      "The measurable characteristics of the stone, recorded from the laboratory examination.",
    fields: [
      { id: "species", label: "Species", value: "Natural Beryl" },
      { id: "variety", label: "Variety", value: "Emerald" },
      { id: "weight", label: "Weight", value: "2.45 ct" },
      {
        id: "dimensions",
        label: "Dimensions",
        value: "8.21 × 6.45 × 4.12 mm",
      },
      { id: "shape", label: "Shape & Cut", value: "Emerald Cut" },
      { id: "color", label: "Color", value: "Vivid Green" },
      { id: "clarity", label: "Clarity", value: "Minor Inclusions" },
    ],
  },
  {
    id: "origin-mining",
    label: "Origin & Mining",
    summary:
      "Where the stone came from, and the sourcing standard it was accepted under.",
    fields: [
      { id: "origin", label: "Origin", value: "Zambia" },
      { id: "sourcing", label: "Sourcing", value: "Ethically sourced" },
      {
        id: "supplier",
        label: "Supply chain",
        value: "Trusted suppliers and mining partners",
      },
    ],
  },
  {
    id: "treatment",
    label: "Treatment & Enhancement",
    summary:
      "Any treatment the stone has received, disclosed as the laboratory found it.",
    fields: [
      { id: "treatment", label: "Treatment", value: "Minor Oil" },
      { id: "disclosure", label: "Disclosure", value: "Fully disclosed" },
      {
        id: "assessed",
        label: "Assessed by",
        value: "Independent gemological laboratory",
      },
    ],
  },
  {
    id: "report",
    label: "Gemological Report",
    summary:
      "The independent report the stone was graded against, before it entered custody.",
    fields: [
      { id: "lab", label: "Lab", value: "GRS" },
      { id: "report", label: "Report No.", value: "GRS-2024-EM0125" },
      { id: "issued", label: "Date Issued", value: "May 12, 2024" },
      { id: "scope", label: "Scope", value: "Identity, quality, treatment" },
    ],
  },
  {
    id: "images",
    label: "High-Resolution Images",
    summary:
      "The visual record of the stone, captured at verification and stored with the passport.",
    fields: [
      { id: "set", label: "Image set", value: "High-resolution, 360°" },
      { id: "captured", label: "Captured at", value: "Verification" },
      { id: "stored", label: "Stored with", value: "The passport record" },
    ],
  },
  {
    id: "provenance",
    label: "Provenance & History",
    summary:
      "The chain of events behind the stone, from sourcing to its current state.",
    fields: [
      { id: "sourced", label: "Sourced", value: "Zambia" },
      { id: "verified", label: "Verified", value: "GRS-2024-EM0125" },
      { id: "vaulted", label: "Vaulted", value: "Institutional custody" },
      { id: "tokenized", label: "Tokenized", value: "0x7a3b…9c4f2d" },
    ],
  },
  {
    id: "custody",
    label: "Custody & Vault",
    summary:
      "Where the stone is held, and under what standard of custody it is kept.",
    fields: [
      { id: "status", label: "Custody status", value: "In vault" },
      { id: "standard", label: "Standard", value: "Institutional-grade" },
      { id: "access", label: "Access", value: "Strict access controls" },
    ],
  },
  {
    id: "ownership",
    label: "Ownership Record",
    summary:
      "How ownership of the stone is represented, and where that representation lives.",
    fields: [
      { id: "form", label: "Ownership form", value: "Fractional, on-chain" },
      { id: "chain", label: "Recorded on", value: "Ethereum" },
      { id: "status", label: "Status", value: "Active" },
      { id: "redeemable", label: "Redeemable", value: "Yes" },
    ],
  },
  {
    id: "insurance",
    label: "Insurance Information",
    summary:
      "The cover the stone carries for as long as it remains in custody.",
    fields: [
      { id: "cover", label: "Cover", value: "Insured while in custody" },
      { id: "scope", label: "Scope", value: "Vault storage and transit" },
      {
        id: "documented",
        label: "Documented in",
        value: "The passport record",
      },
    ],
  },
];

export const insidePassportSampleName = "Emerald";
export const insidePassportSampleSpecies = "Natural Beryl";
export const insidePassportSampleAlt = "An emerald-cut vivid green emerald";
export const insidePassportSampleNote = "Sample record";
export const insidePassportActionLabel = "View full passport sample";

export const verifyTitle = "VERIFY IN SECONDS";

export const verifyIntro =
  "Enter a Passport ID or scan the QR code to instantly verify any gemstone.";

export const verifyPlaceholder = "Passport ID, e.g. GR-RUB-000245";
export const verifySubmitLabel = "Verify";
export const verifyDividerLabel = "or scan QR code";
export const verifyCameraLabel = "Open camera";

export const validationTitle = "PASSPORT VALIDATION";

export const validationSample = {
  status: "AUTHENTIC & VERIFIED",
  description:
    "This passport is valid and the asset information is verified on the blockchain.",
  fields: [
    { id: "blockchain", label: "Blockchain", value: "Ethereum" },
    {
      id: "verified",
      label: "Verified on",
      value: "May 12, 2024 14:32:18 UTC",
    },
    { id: "status", label: "Status", value: "Active" },
  ] as readonly PassportField[],
  actionLabel: "View on block explorer",
  sampleNote: "Sample validation",
} as const;

export interface PassportBenefit {
  id: string;
  title: string;
  description: string;
}

export const benefitsTitle = "BENEFITS OF DIGITAL ASSET PASSPORTS";

export const passportBenefits: readonly PassportBenefit[] = [
  {
    id: "trust",
    title: "BUILDS TRUST",
    description: "Provides undeniable proof of authenticity and origin.",
  },
  {
    id: "value",
    title: "PROTECTS VALUE",
    description:
      "Accurate documentation preserves and enhances your asset's value.",
  },
  {
    id: "risk",
    title: "REDUCES RISK",
    description: "Helps prevent fraud, theft and misrepresentation.",
  },
  {
    id: "trade",
    title: "FACILITATES TRADE",
    description:
      "Speeds up due diligence for trading, lending and institutional deals.",
  },
  {
    id: "insurance",
    title: "SIMPLIFIES INSURANCE",
    description:
      "Provides the documentation insurers require for accurate coverage.",
  },
  {
    id: "liquidity",
    title: "ENHANCES LIQUIDITY",
    description:
      "Verified assets attract more buyers and better offers globally.",
  },
];

export const passportsCta = {
  titleLines: ["Every Gemstone. Every Detail.", "One Immutable Passport."],
  description:
    "GemReserve Digital Asset Passports bring transparency, trust and technology together to create a new standard for ownership in the gemstone industry.",
  buttonLabel: "Join the Waitlist",
  supportingText:
    "Be among the first to access tokenized gemstone assets backed by real reserves.",
  imageAlt: "An open vault holding six faceted gemstones",
} as const;
