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

import { naturalRawCharoite } from "./natural-raw-charoite";
import { naturalRoughAlexandrite } from "./natural-rough-alexandrite";
import { naturalRoughAquamarine } from "./natural-rough-aquamarine";
import { naturalRoughChrysoprase } from "./natural-rough-chrysoprase";
import { naturalRoughEmerald } from "./natural-rough-emerald";
import { naturalRoughItalianJade } from "./natural-rough-italian-jade";
import { naturalRoughJasper } from "./natural-rough-jasper";
import { naturalRoughPeridot } from "./natural-rough-peridot";
import { naturalRoughRubyCQuality } from "./natural-rough-ruby-c-quality";
import { naturalRoughRubyGemQuality } from "./natural-rough-ruby-gem-quality";
import { naturalRoughRubyTrapiche } from "./natural-rough-ruby-trapiche";
import { naturalRoughRutilatedQuartz } from "./natural-rough-rutilated-quartz";
import { naturalRoughTourmaline } from "./natural-rough-tourmaline";

export const programsHero = {
  breadcrumb: ["Home", "Assets", "All Gemstone Programs"] as const,
  // The board sets only the middle word in gold, so the line is held as three
  // parts rather than as stacked lines the way the other heroes are.
  title: { before: "All", accent: "Gemstone", after: "Programs" },
  tagline: "RARE BY NATURE. VERIFIED BY SCIENCE. ASSET-BACKED BY DESIGN.",
  description:
    "Discover our complete suite of tokenized gemstone programs. Each gemstone is designed to link to a real, physical asset, securely vaulted and independently verified. Choose from the world's most desirable gemstones, each tokenized for true ownership, liquidity and global accessibility.",
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
    title: "ASSET-BACKED MODEL",
    description: "Each token is designed to link to a real, physical gemstone.",
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
  href?: string;
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
    href: "/ruby",
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
    href: "/emerald",
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
    href: "/aquamarine",
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

export interface RoughGemstoneProgram {
  readonly id: string;
  readonly name: string;
  readonly epithet: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly swatch: string;
  readonly href: string;
}

export const roughProgramsSectionTitle = "NATURAL ROUGH GEMSTONE PROGRAMS";

/**
 * The rough-program index is derived from the pages themselves: each card takes
 * its name, its epithet and its link straight out of that stone's content
 * module, so the catalogue cannot drift from the board it was transcribed from
 * and no new claim is introduced here. Only the card's art direction — which
 * cut-out to show and which accent dot to set beside the name — is stated here,
 * and the dot matches the page's own accent token.
 */
const roughProgramCards = [
  {
    gem: naturalRawCharoite,
    imageSrc: "/images/gems/charoite-rough.webp",
    imageAlt: "Natural raw purple charoite specimen",
    swatch: "#b77ae7",
  },
  {
    gem: naturalRoughAlexandrite,
    imageSrc: "/images/gems/alexandrite-rough.webp",
    imageAlt: "Natural rough alexandrite specimen",
    swatch: "#61d2d8",
  },
  {
    gem: naturalRoughAquamarine,
    imageSrc: "/images/gems/rough-aquamarine.webp",
    imageAlt: "Natural rough blue aquamarine crystal",
    swatch: "#5ed8ee",
  },
  {
    gem: naturalRoughChrysoprase,
    imageSrc: "/images/gems/chrysoprase-rough.webp",
    imageAlt: "Natural rough green chrysoprase specimen",
    swatch: "#7ed957",
  },
  {
    gem: naturalRoughItalianJade,
    imageSrc: "/images/gems/italian-jade-rough.webp",
    imageAlt: "Natural rough Italian jade specimen",
    swatch: "#71c94b",
  },
  {
    gem: naturalRoughJasper,
    imageSrc: "/images/gems/jasper-rough.webp",
    imageAlt: "Natural rough red-brown jasper stones",
    swatch: "#f1ad08",
  },
  {
    gem: naturalRoughRubyCQuality,
    imageSrc: "/images/gems/ruby-c-quality-rough.webp",
    imageAlt: "Natural rough C-quality ruby specimen",
    swatch: "#ff2947",
  },
  {
    gem: naturalRoughRubyTrapiche,
    imageSrc: "/images/gems/ruby-trapiche-rough.webp",
    imageAlt: "Natural rough trapiche ruby specimen",
    swatch: "#ef4778",
  },
  {
    gem: naturalRoughRubyGemQuality,
    imageSrc: "/images/gems/ruby-gem-quality-rough.webp",
    imageAlt: "Natural rough gem-quality ruby specimen",
    swatch: "#ff3854",
  },
  {
    gem: naturalRoughRutilatedQuartz,
    imageSrc: "/images/gems/rutilated-quartz-rough.webp",
    imageAlt: "Natural rough rutilated quartz crystal",
    swatch: "#e7a916",
  },
  {
    gem: naturalRoughTourmaline,
    imageSrc: "/images/gems/tourmaline-rough.webp",
    imageAlt: "Natural rough multicolored tourmaline crystals",
    swatch: "#df5c99",
  },
  {
    gem: naturalRoughPeridot,
    imageSrc: "/images/gems/peridot-rough.webp",
    imageAlt: "Natural rough vivid green peridot crystal",
    swatch: "#8bd52d",
  },
  {
    gem: naturalRoughEmerald,
    imageSrc: "/images/gems/rough-emerald.webp",
    imageAlt: "Natural rough green emerald crystal",
    swatch: "#49d274",
  },
] as const;

/**
 * A page's tagline is stored line-by-line as the board sets it, so the first
 * line is not always the whole first sentence — the C Quality ruby board breaks
 * "The Timeless Flame in Natural Form." across two lines. Take lines until one
 * closes a sentence so the card always shows the board's opening line in full.
 */
function epithetFromTagline(tagline: readonly string[]): string {
  const lines: string[] = [];
  for (const line of tagline) {
    lines.push(line);
    if (/[.!?]$/.test(line)) break;
  }
  return lines.join(" ");
}

export const roughGemstonePrograms: readonly RoughGemstoneProgram[] =
  roughProgramCards.map(({ gem, imageSrc, imageAlt, swatch }) => ({
    id: gem.slug,
    name: gem.breadcrumb[3],
    epithet: epithetFromTagline(gem.tagline),
    imageSrc,
    imageAlt,
    swatch,
    href: `/${gem.slug}`,
  }));

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

/**
 * The complete index of published gemstone programme pages.
 *
 * The board's "OUR GEMSTONE PROGRAMS" grid above is transcribed exactly as
 * drawn: ten stones, of which only three have a detail page. But the Peridot
 * and Tourmaline boards both set their breadcrumb to "Home > Assets > All
 * Gemstone Programs", so this page is their declared parent and was not linking
 * back to them — the two of eighteen that no route reached from here.
 *
 * Rather than add cards the board does not draw (and for which no faceted
 * artwork exists), the index closes the gap as a plain list. It is generated
 * from the two programme collections above plus the polished pages the board's
 * grid omits, so a stone added later cannot fall out of it.
 */
export interface ProgramIndexEntry {
  readonly label: string;
  readonly href: string;
}

const polishedProgramPages: readonly ProgramIndexEntry[] = [
  { label: "Aquamarine", href: "/aquamarine" },
  { label: "Emerald", href: "/emerald" },
  { label: "Peridot", href: "/peridot" },
  { label: "Ruby", href: "/ruby" },
  { label: "Tourmaline", href: "/tourmaline" },
];

export const programIndex = {
  title: "Every published program",
  intro:
    "All eighteen gemstone programs with a page of their own, polished and natural rough.",
  polishedLabel: "Polished",
  roughLabel: "Natural rough",
  polished: polishedProgramPages,
  rough: roughGemstonePrograms.map((program) => ({
    label: program.name,
    href: program.href,
  })) as readonly ProgramIndexEntry[],
};

export interface ProgramHighlight {
  id: string;
  value: string;
  label: string;
  /** These four are the figures /assets publishes; they carry its same flag. */
  requiresClientVerification?: boolean;
}

// Four figures were published here: "10+ Gemstone Programs", "25+ Gemstone
// Types Available", "18 Countries Served" and "100% Backed by Real Assets",
// alongside "1,850+ Verified Assets in Vaults" which went earlier.
//
// None survives contact with the record. The programs are illustrative rather
// than running; the type count depends on how a type is counted; no country of
// operation is recorded anywhere; and "100% backed" is a solvency claim, which
// is the last thing a site should assert without an attestation behind it.
//
// The ids are load-bearing — highlightIcons keys off them — so each card keeps
// its id, its icon and its place. Only the claim changed. See content/assets.ts.
export const programHighlights: readonly ProgramHighlight[] = [
  {
    id: "programs",
    value: "Illustrative",
    label: "Gemstone programs, pending launch",
    requiresClientVerification: true,
  },
  {
    id: "types",
    value: "Listed",
    label: "Gemstone types in the catalogue",
    requiresClientVerification: true,
  },
  {
    id: "countries",
    value: "Pre-launch",
    label: "Jurisdiction eligibility",
    requiresClientVerification: true,
  },
  {
    id: "backed",
    value: "Pending",
    label: "Independent reserve attestation",
    requiresClientVerification: true,
  },
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
