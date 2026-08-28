/**
 * News & Announcements — transcribed from the client's supplied board.
 *
 * The board is a populated newsroom. It carries five articles dated between 30
 * June and 24 July 2026, and every one of them announces something that has not
 * happened: an institutional platform launch, a strategic partnership with
 * gemological laboratories, a vaulting and custody infrastructure that is "now
 * fully operational", a private investor platform alpha, and the establishment
 * of Swiss headquarters in Zug. The last of those is also the wrong country —
 * the operating company is UAB GemVault Capital in Vilnius.
 *
 * A newsroom is a record. Filling one with announcements that were never made
 * is not a design decision, it is a false statement with a date attached, and
 * dated false statements are the ones that get quoted back. So no article is
 * carried across. The page keeps everything else the board draws — the subject
 * areas it will publish under, the highlights rail, the subscribe panel, the
 * media contact — and says plainly that nothing has been published yet.
 *
 * The board's "LATEST HIGHLIGHTS" rail asserted traction ("our verified
 * gemstone inventory continues to grow", "strong interest from qualified
 * investors around the world"). The rail keeps its place and its purpose —
 * where to look for progress — but points at pages that carry the progress
 * rather than at claims about it.
 *
 * media@gemreserve.io is the client's own published press address, transcribed
 * on the Contact board and already on /contact. It is the only channel this
 * page names, because it is the only one the project is known to control.
 */

export interface NewsHeroContent {
  readonly breadcrumb: readonly [string, string, string];
  readonly titleLines: readonly [string, string];
  readonly description: string;
}

export const newsHero: NewsHeroContent = {
  breadcrumb: ["Home", "Company", "News & Announcements"],
  titleLines: ["News &", "Announcements"],
  description:
    "The latest updates on GemReserve.io — our milestones, platform developments and the record of what we have actually done.",
};

export interface NewsCategory {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const categoriesSectionTitle = "WHAT WILL BE PUBLISHED HERE";

export const newsCategories: readonly NewsCategory[] = [
  {
    id: "corporate",
    title: "CORPORATE ANNOUNCEMENTS",
    description:
      "Changes to the operating company, its structure, its licences and its governance.",
  },
  {
    id: "partnerships",
    title: "PARTNERSHIPS",
    description:
      "Custody, laboratory, audit and legal engagements, published when signed and named when they are.",
  },
  {
    id: "platform",
    title: "PLATFORM UPDATES",
    description:
      "Releases, audited contracts, registry and passport capability as each goes live.",
  },
  {
    id: "milestones",
    title: "MILESTONES",
    description:
      "The roadmap sequence, reported after a milestone is reached rather than before.",
  },
  {
    id: "press",
    title: "PRESS RELEASES",
    description: "Statements issued for publication, with the date of issue.",
  },
  {
    id: "reserves",
    title: "RESERVE ATTESTATIONS",
    description:
      "Each published reserve report, with its as-of date and the party that signed it.",
  },
];

export const newsroomState = {
  title: "NOTHING PUBLISHED YET",
  paragraphs: [
    "GemReserve.io is pre-launch. No announcement, press release or milestone report has been issued, so there is nothing in this newsroom — not an archive, not a placeholder, and not an article written to fill the space.",
    "The first entry will appear here on the day it is issued, dated, and it will stay in the record afterwards. Until then, the pages below carry the current state of the project.",
  ] as readonly string[],
  note: "Any GemReserve.io announcement you encounter elsewhere that does not appear on this page did not come from us.",
  noteLink: { label: "Read the Anti-Fraud Notice", href: "/anti-fraud-notice" },
};

export interface HighlightLink {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly href: string;
}

export const highlightsPanel = {
  title: "WHERE TO FOLLOW PROGRESS",
  links: [
    {
      id: "corporate",
      title: "Corporate Development",
      description: "Every strand of work and its current status.",
      href: "/corporate-development",
    },
    {
      id: "registry",
      title: "Asset Registry",
      description: "The public record tokenized stones will appear in.",
      href: "/asset-registry",
    },
    {
      id: "reserves",
      title: "Proof of Gemstone Reserves",
      description: "How reserves will be attested, and by whom.",
      href: "/proof-of-reserves",
    },
    {
      id: "roadmap",
      title: "The Future of Gemstone Asset Infrastructure",
      description: "The roadmap, with each phase marked for what it is.",
      href: "/future-infrastructure",
    },
  ] as const satisfies readonly HighlightLink[],
};

export const subscribePanel = {
  title: "STAY INFORMED",
  description:
    "Subscribe to receive announcements from GemReserve.io as they are issued.",
  buttonLabel: "Subscribe",
  placeholder: "Enter your email address",
  privacyNote: "We respect your privacy.",
};

export const followPanel = {
  title: "FOLLOW US",
  description:
    "GemReserve.io does not yet operate any social media, messaging or community channel. When official accounts open, they are listed here and on the Anti-Fraud Notice — and until then, any account presenting itself as ours is not.",
  link: { label: "Read the Anti-Fraud Notice", href: "/anti-fraud-notice" },
};

export const mediaPanel = {
  title: "MEDIA INQUIRIES",
  description:
    "For press inquiries and media opportunities, please contact us.",
  email: "media@gemreserve.io",
  linkLabel: "Other ways to reach us",
  href: "/contact",
};
