/**
 * Asset Registry — transcribed from the client's board.
 *
 * The record on the board is the same sample stone the Digital Asset Passports
 * page shows, GR-EMR-000125, down to the report number and the transaction hash.
 * It is carried across with its figures intact and labelled a sample wherever it
 * appears, so no reader takes it for a live holding. The lab reads "GRS", the
 * short form the gemstone catalogue already uses.
 *
 * ERC-721 here against the ERC-20 on the programs page is the board's own
 * distinction and a coherent one: the registry entry is the unique record of a
 * single stone, while the tokens sold against that stone are fungible.
 *
 * The board's lookup and its "download passport" button both need a registry
 * behind them and there is not one yet, so they behave the way every other
 * pre-launch control on this site behaves — see components/ui/AssetLookup.tsx.
 */

export const registryHero = {
  breadcrumb: ["Home", "Assets", "Asset Registry"] as const,
  titleLines: ["Asset", "Registry"] as const,
  tagline: "Every Asset. Every Detail. On-Chain. Verifiable. Permanent.",
  description:
    "The GemReserve Asset Registry is the authoritative, immutable record of every physical gemstone in our ecosystem. Each asset is uniquely identified, independently verified and permanently recorded on the blockchain for complete transparency and trust.",
  imageAlt: "A round brilliant diamond held in tweezers before a vault dial",
} as const;

export interface RegistryBadge {
  id: string;
  title: string;
  description: string;
}

export const registryBadges: readonly RegistryBadge[] = [
  {
    id: "immutable",
    title: "IMMUTABLE RECORD",
    description:
      "Every asset record is written on the blockchain and cannot be altered.",
  },
  {
    id: "verified",
    title: "INDEPENDENTLY VERIFIED",
    description:
      "Gemological verification by leading laboratories and industry experts.",
  },
  {
    id: "unique",
    title: "UNIQUE IDENTIFICATION",
    description:
      "Each gemstone has a unique Asset ID for global traceability and authenticity.",
  },
  {
    id: "global",
    title: "GLOBAL ACCESS",
    description:
      "Access verified asset data anytime, anywhere through our public registry.",
  },
  {
    id: "transparency",
    title: "FULL TRANSPARENCY",
    description:
      "Complete visibility of origin, ownership history and custody status.",
  },
  {
    id: "trust",
    title: "TRUST BY DESIGN",
    description:
      "Built on security, compliance and the highest standards of integrity.",
  },
];

export interface RegistryStep {
  id: string;
  step: number;
  title: string;
  description: string;
}

export const registryProcessTitle = "HOW THE ASSET REGISTRY WORKS";

export const registryProcess: readonly RegistryStep[] = [
  {
    id: "creation",
    step: 1,
    title: "ASSET CREATION",
    description: "A gemstone is selected and physically documented.",
  },
  {
    id: "lab",
    step: 2,
    title: "LAB VERIFICATION",
    description: "Verified by independent gemological laboratories.",
  },
  {
    id: "capture",
    step: 3,
    title: "DIGITAL CAPTURE",
    description:
      "High-resolution images, measurements and key attributes recorded.",
  },
  {
    id: "registration",
    step: 4,
    title: "ON-CHAIN REGISTRATION",
    description:
      "Asset data is hashed and recorded on the blockchain with a unique Asset ID.",
  },
  {
    id: "custody",
    step: 5,
    title: "SECURE CUSTODY",
    description: "The gemstone is stored in insured, high-security vaults.",
  },
  {
    id: "ownership",
    step: 6,
    title: "OWNERSHIP RECORD",
    description: "Ownership transfers and events are updated on-chain.",
  },
  {
    id: "public",
    step: 7,
    title: "PUBLIC VERIFICATION",
    description: "Anyone can verify the authenticity and details of the asset.",
  },
];

export interface RecordField {
  id: string;
  label: string;
  value: string;
}

export const recordExampleTitle = "ASSET RECORD EXAMPLE";

export const recordExample = {
  sampleNote: "Sample record",
  imageAlt: "An emerald-cut vivid green emerald",
  imageActionLabel: "View high-resolution image",
  statusLabel: "Current Status",
  statusValue: "In vault",
  fields: [
    { id: "asset-id", label: "Asset ID", value: "GR-EMR-000125" },
    { id: "type", label: "Gemstone Type", value: "Emerald" },
    { id: "variety", label: "Variety", value: "Natural Emerald" },
    { id: "weight", label: "Weight", value: "2.45 ct" },
    { id: "dimensions", label: "Dimensions", value: "8.21 × 6.45 × 4.12 mm" },
    { id: "shape", label: "Shape & Cut", value: "Emerald Cut" },
    { id: "color", label: "Color", value: "Vivid Green" },
    { id: "clarity", label: "Clarity", value: "Minor Inclusions" },
    { id: "origin", label: "Origin", value: "Zambia" },
    { id: "treatment", label: "Treatment", value: "Minor Oil" },
    { id: "certificate", label: "Certificate", value: "GRS-2024-EM0125" },
    { id: "lab", label: "Lab", value: "GRS" },
    { id: "registered", label: "Date Registered", value: "May 12, 2024" },
  ] as readonly RecordField[],
} as const;

export const blockchainDetailsTitle = "BLOCKCHAIN DETAILS";

export const blockchainDetails: readonly RecordField[] = [
  { id: "chain", label: "Blockchain", value: "Ethereum" },
  { id: "standard", label: "Token Standard", value: "ERC-721" },
  { id: "contract", label: "Contract Address", value: "0x7a3b…9c4f2d" },
  { id: "token-id", label: "Token ID", value: "125" },
  { id: "tx", label: "Tx Hash", value: "0x8f2d…a41b7e" },
  { id: "block", label: "Block Number", value: "19284567" },
  {
    id: "recorded",
    label: "Date Recorded",
    value: "May 12, 2024 14:32:18 UTC",
  },
];

export const blockchainActionLabel = "View on block explorer";

export const passportPanel = {
  title: "DIGITAL ASSET PASSPORT",
  description:
    "Download the complete Digital Asset Passport with gemological report, images and all details.",
  actionLabel: "Download passport",
  note: "Available when the registry opens",
} as const;

export const accessTitle = "WHAT YOU CAN ACCESS";

export const accessItems: readonly string[] = [
  "Complete gemstone details and specifications",
  "Gemological certificates and reports",
  "High-resolution images and 360° views",
  "Origin and provenance information",
  "Treatment and enhancement disclosures",
  "Custody and vault location",
  "Ownership history and transfer events",
  "Insurance coverage information",
];

export interface RegistryReason {
  id: string;
  title: string;
}

export const whyTitle = "WHY IT MATTERS";

export const whyItems: readonly RegistryReason[] = [
  { id: "fraud", title: "Eliminates fraud and misrepresentation" },
  { id: "investors", title: "Protects investors and owners" },
  { id: "liquidity", title: "Increases liquidity and market confidence" },
  { id: "provenance", title: "Provides verifiable provenance" },
  { id: "trade", title: "Enables seamless global trade" },
  { id: "legacy", title: "Creates a permanent legacy of ownership" },
];

export const searchTitle = "SEARCH THE REGISTRY";

export const searchIntro =
  "Look up any Asset ID to view verified details on the blockchain.";

export const searchPlaceholder = "Asset ID, e.g. GR-RUB-000245";
export const searchSubmitLabel = "Search";
export const searchExploreLabel = "or explore by gemstone type";

export interface RegistryTypeChip {
  id: string;
  label: string;
  /** Where the catalogue filter for this type lives. */
  href: string;
}

export const searchTypeChips: readonly RegistryTypeChip[] = [
  { id: "ruby", label: "Ruby", href: "/assets" },
  { id: "sapphire", label: "Sapphire", href: "/assets" },
  { id: "emerald", label: "Emerald", href: "/assets" },
  { id: "diamond", label: "Diamond", href: "/assets" },
  { id: "other", label: "Other Gemstones", href: "/assets" },
];

export const registryCta = {
  titleLines: [
    "Transparency is our foundation.",
    "The blockchain is our ledger. Trust is our promise.",
  ] as const,
  description:
    "The GemReserve Asset Registry ensures every gemstone is real, every record is verifiable and every ownership is protected.",
  buttonLabel: "Join the Waitlist",
  supportingText: "Be among the first to access tokenized gemstone assets.",
  imageAlt: "An open vault holding six faceted gemstones",
} as const;
