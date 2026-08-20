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
      { label: "Digital Asset Passports", href: null },
      { label: "Gemstone Gallery", href: null },
    ],
  },
  {
    label: "How It Works",
    href: "/how-it-works",
    items: [
      { label: "Our Process", href: "/how-it-works" },
      { label: "Independent Verification", href: null },
      { label: "Custody & Vaults", href: null },
      { label: "Tokenization", href: null },
      { label: "Proof of Reserves", href: null },
      { label: "Physical Redemption", href: null },
    ],
  },
  {
    label: "Technology",
    href: null,
    items: [
      { label: "Blockchain", href: null },
      { label: "Smart Contracts", href: null },
      { label: "Platform Infrastructure", href: null },
      { label: "Security", href: null },
      { label: "Transparency", href: null },
      { label: "White-Label Platform", href: null },
    ],
  },
  {
    label: "Enterprise",
    href: null,
    items: [
      { label: "Enterprise Solutions", href: null },
      { label: "Tokenization Services", href: null },
      { label: "Owners & Originators", href: null },
      { label: "Buyers & Collectors", href: null },
      { label: "API Integration", href: null },
      { label: "Technology Licensing", href: null },
    ],
  },
  {
    label: "Investors",
    href: null,
    items: [
      { label: "Investor Overview", href: null },
      { label: "Benefits", href: null },
      { label: "Token Utility", href: null },
      { label: "Roadmap", href: null },
      { label: "Investor Presentation", href: null },
      { label: "Documents", href: null },
    ],
  },
  {
    label: "Company",
    href: null,
    items: [
      { label: "About Us", href: null },
      { label: "Our Partners", href: null },
      { label: "Governance", href: null },
      { label: "Careers", href: null },
      { label: "News & Announcements", href: null },
      { label: "Contact Us", href: null },
    ],
  },
] as const satisfies readonly NavigationGroup[];

export const earlyParticipationItems = [
  { label: "Early Access", href: null },
  { label: "Waitlist Benefits", href: null },
  { label: "Eligibility & KYC", href: null },
  { label: "How to Participate", href: null },
  { label: "FAQ", href: null },
] as const satisfies readonly NavigationItem[];

export const socialLinks = ["X", "in", "Instagram", "Telegram", "YouTube"];
