export interface NavigationItem {
  readonly label: string;
  readonly href: string | null;
}

export interface NavigationGroup {
  readonly label: string;
  readonly href: string | null;
  readonly items: readonly NavigationItem[];
}

export const navigationGroups = [
  {
    label: "Platform",
    href: "/",
    items: [
      { label: "Overview", href: "/" },
      { label: "Features", href: null },
      { label: "Security", href: null },
      { label: "Proof of Reserves", href: null },
      { label: "Integrations", href: null },
      { label: "API Documentation", href: null },
    ],
  },
  {
    label: "Assets",
    href: "/assets",
    items: [
      { label: "Explore Gemstone Assets", href: "/assets" },
      { label: "All Gemstones", href: "/assets" },
      { label: "Gemstone Programs", href: null },
      { label: "Asset Registry", href: null },
      { label: "Digital Asset Passports", href: "/digital-asset-passports" },
      { label: "Gemstone Gallery", href: null },
    ],
  },
  {
    label: "How It Works",
    href: "/how-it-works",
    items: [
      { label: "Our Process", href: "/how-it-works" },
      { label: "Eligibility & KYC", href: "/eligibility-kyc" },
      { label: "Independent Verification", href: null },
      { label: "Custody & Vaults", href: null },
      { label: "Tokenization", href: "/gemstone-tokenization" },
      { label: "Proof of Reserves", href: null },
      { label: "Physical Redemption", href: "/physical-redemption" },
    ],
  },
  {
    label: "Technology",
    href: "/technology",
    items: [
      { label: "Technology Overview", href: "/technology" },
      { label: "Platform Architecture", href: "/technology" },
      { label: "Gemstone Tokenization", href: "/gemstone-tokenization" },
      {
        label: "Digital Asset Passports",
        href: "/digital-asset-passports",
      },
      { label: "Physical Redemption", href: "/physical-redemption" },
      { label: "Blockchain", href: null },
      { label: "Smart Contracts", href: null },
      { label: "Security", href: null },
      { label: "White-Label Platform", href: null },
    ],
  },
  {
    label: "Enterprise",
    href: "/enterprise",
    items: [
      { label: "Enterprise Solutions", href: "/enterprise" },
      { label: "Enterprise Process", href: "/enterprise" },
      { label: "Tokenization Services", href: null },
      { label: "Owners & Originators", href: null },
      { label: "Buyers & Collectors", href: null },
      { label: "API Integration", href: null },
    ],
  },
  {
    label: "Investors",
    href: "/investors",
    items: [
      { label: "Investor Overview", href: "/investors" },
      { label: "Investor Presentation", href: "/investors" },
      { label: "Roadmap", href: "/investors" },
      { label: "Benefits", href: null },
      { label: "Token Utility", href: null },
      { label: "Documents", href: null },
    ],
  },
  {
    label: "Company",
    href: "/about",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Our Partners", href: null },
      { label: "Governance", href: "/governance" },
      { label: "Careers", href: null },
      { label: "News & Announcements", href: null },
      { label: "Contact Us", href: "/contact" },
    ],
  },
] as const satisfies readonly NavigationGroup[];

/**
 * Annotated rather than `as const satisfies`, because every item now carries a
 * destination and the literal types would narrow the "no destination yet" branch
 * in the header and footer to `never`. The guard has to keep compiling for the
 * day an item is added without a page behind it.
 */
export const earlyParticipationItems: readonly NavigationItem[] = [
  { label: "Early Access", href: "/early-participation" },
  { label: "Waitlist Benefits", href: "/early-participation" },
  { label: "Eligibility & KYC", href: "/eligibility-kyc" },
  { label: "How to Participate", href: "/early-participation" },
  { label: "FAQ", href: "/faq" },
];

export const socialLinks = ["X", "in", "Instagram", "Telegram", "YouTube"];
