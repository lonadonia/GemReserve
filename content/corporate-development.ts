/**
 * Corporate Development — transcribed from the client's supplied board.
 *
 * Four things on this board state facts about the company that are either no
 * longer true or were never established, and this is the page a reader will
 * treat as GemReserve's own account of itself, so each one is dealt with
 * openly rather than quietly softened.
 *
 * 1. "COMPANY ESTABLISHED — GemReserve.io SA incorporated in Switzerland" and
 *    "LEGAL & COMPLIANCE FRAMEWORK — Swiss legal structure established". The
 *    operating company is UAB GemVault Capital, a Lithuanian company; see
 *    content/company.ts, which every corporate reference on the site reads
 *    from. Both cards carry the current entity.
 *
 * 2. "INSTITUTIONAL INFRASTRUCTURE — Partnerships initiated with vaulting,
 *    security, and gemological laboratories" and "ADVISORY BOARD & TEAM —
 *    Industry experts and blockchain specialists onboarded". No partner and no
 *    person is named anywhere on this site, and a page about corporate progress
 *    is the last place to start asserting relationships and hires that cannot
 *    be checked. Both cards describe the work rather than claiming counterparts.
 *
 * 3. The status table carried a completion percentage for every initiative —
 *    78%, 72%, 65%, 45%, 20%, 15%. A percentage is a measurement, and there is
 *    nothing behind these. The table keeps the board's own three-state
 *    vocabulary (completed, in progress, planned) and drops the numbers, and
 *    the three initiatives the board marked complete on the strength of Swiss
 *    incorporation and vault partnerships are marked for what they are.
 *
 * 4. "OUR IMPACT IN NUMBERS (AND GROWING)" gave 500+ verified gemstones in the
 *    pipeline, 20+ gemstone types, 5 secure vault partners, 50+ industry
 *    experts and team members, 10+ countries. None is supported. The strip is
 *    replaced by the thing a reader actually wants from a progress page: the
 *    published pages where the claims on this one can be checked.
 *
 * The mission, the four marks and the milestone sequence are the board's own.
 * The board dated its milestones from Q2 2025 to Q3 2026 and titled them
 * "upcoming"; several of those quarters are now in the past, so the sequence is
 * kept and the stale quarters are not, which leaves it consistent with the
 * roadmap already published on /investors and /future-infrastructure.
 */

import { company } from "./company";

export interface CorporateHeroContent {
  readonly breadcrumb: readonly [string, string];
  readonly titleLines: readonly [string, string, string];
  readonly description: string;
}

export const corporateHero: CorporateHeroContent = {
  breadcrumb: ["Company", "Corporate Development"],
  titleLines: ["Corporate", "Development", "Status"],
  description:
    "Transparency is at the core of GemReserve.io. We are building a world-class platform with measurable progress, real milestones, and an unwavering commitment to excellence, security, and long-term value.",
};

export const missionPanel = {
  title: "OUR MISSION",
  statement:
    "To become the global standard for gemstone ownership and investment by combining the timeless value of natural gems with the efficiency, liquidity, and accessibility of digital assets.",
  marks: [
    { id: "assets", label: "REAL ASSETS" },
    { id: "trust", label: "REAL TRUST" },
    { id: "access", label: "REAL ACCESS" },
    { id: "value", label: "REAL VALUE" },
  ] as const satisfies readonly {
    readonly id: string;
    readonly label: string;
  }[],
};

export interface Achievement {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const achievementsSectionTitle = "WHERE THINGS STAND";

export const achievementsIntro =
  "Seven strands of work, described as they are rather than as a scoreboard.";

export const achievements: readonly Achievement[] = [
  {
    id: "company",
    title: "OPERATING COMPANY",
    description: `${company.legalName}, ${company.companyCodeLabel} ${company.companyCode}, registered in ${company.city}, ${company.country}.`,
  },
  {
    id: "legal",
    title: "LEGAL & COMPLIANCE FRAMEWORK",
    description: `A ${company.countryAdjective} legal structure with a compliance roadmap covering KYC, AML and jurisdictional restrictions.`,
  },
  {
    id: "infrastructure",
    title: "INSTITUTIONAL INFRASTRUCTURE",
    description:
      "The custody, verification and audit requirements a provider must meet are specified and published. No provider is appointed yet.",
  },
  {
    id: "supply",
    title: "GEMSTONE ASSET PROGRAMS",
    description:
      "Eighteen gemstone programs are defined and published, each with its own specification, provenance and verification approach.",
  },
  {
    id: "platform",
    title: "PLATFORM DEVELOPMENT",
    description:
      "Core platform architecture is complete; the asset registry, passport and tokenization layers are in build.",
  },
  {
    id: "security",
    title: "SECURITY & CUSTODY FRAMEWORK",
    description:
      "Multi-layer security protocols and the custody model are designed and documented ahead of any stone being accepted.",
  },
  {
    id: "governance",
    title: "GOVERNANCE",
    description:
      "The governance model, principles and decision rights are published and in force.",
  },
];

export type InitiativeStatus = "complete" | "in-progress" | "planned";

export interface Initiative {
  readonly id: string;
  readonly initiative: string;
  readonly description: string;
  readonly status: InitiativeStatus;
  readonly target: string;
}

/** Marks for the table's first column, as the board sets one against each row. */
export const initiativeIconIds = [
  "legal",
  "supply",
  "custody",
  "platform",
  "tokenization",
  "marketplace",
  "mobile",
  "expansion",
  "redemption",
] as const;

export const statusTable = {
  title: "DEVELOPMENT STATUS OVERVIEW",
  columns: ["Initiative", "Description", "Status", "Target"] as const,
  statusLabels: {
    complete: "Completed",
    "in-progress": "In progress",
    planned: "Planned",
  } as Readonly<Record<InitiativeStatus, string>>,
  note: "No completion percentage is shown against any initiative. There is no measurement behind one, and a bar that fills itself is not progress.",
  initiatives: [
    {
      id: "legal",
      initiative: "Legal & regulatory framework",
      description:
        "Corporate structure, KYC/AML policy, jurisdictional restrictions",
      status: "in-progress",
      target: "Before participation opens",
    },
    {
      id: "supply",
      initiative: "Gemstone supply & verification",
      description: "Supplier vetting, gemological verification, grading",
      status: "in-progress",
      target: "Before the first stone is accepted",
    },
    {
      id: "custody",
      initiative: "Vaulting & custody infrastructure",
      description: "Custody agreements, insurance, secure logistics",
      status: "in-progress",
      target: "Before the first stone is accepted",
    },
    {
      id: "platform",
      initiative: "Platform core development",
      description: "Core platform, participant accounts, asset registry",
      status: "in-progress",
      target: "Phase two",
    },
    {
      id: "tokenization",
      initiative: "Tokenization engine",
      description: "Smart contracts, token issuance, on-chain records",
      status: "in-progress",
      target: "Phase two",
    },
    {
      id: "marketplace",
      initiative: "Marketplace development",
      description: "Primary and secondary marketplace, trading engine",
      status: "planned",
      target: "Phase three",
    },
    {
      id: "mobile",
      initiative: "Mobile applications",
      description: "iOS and Android apps for investors and collectors",
      status: "planned",
      target: "Phase three",
    },
    {
      id: "expansion",
      initiative: "Global expansion",
      description: "Enterprise and institutional distribution",
      status: "planned",
      target: "Phase four",
    },
    {
      id: "redemption",
      initiative: "Physical redemption network",
      description: "Global logistics, insured shipping, redemption centres",
      status: "planned",
      target: "Phase four",
    },
  ] as const satisfies readonly Initiative[],
};

export interface Milestone {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const milestonePanel = {
  title: "THE SEQUENCE AHEAD",
  intro:
    "In order, not on dates. Each milestone depends on the one before it, and none of them is announced before it has happened.",
  milestones: [
    {
      id: "beta",
      title: "Platform beta",
      description: "Participant accounts, asset registry and passport lookup.",
    },
    {
      id: "tokenization",
      title: "Tokenization engine live",
      description: "Audited contracts, token issuance and on-chain records.",
    },
    {
      id: "marketplace",
      title: "Marketplace launch",
      description: "Primary issuance, then a secondary market.",
    },
    {
      id: "mobile",
      title: "Mobile applications",
      description: "iOS and Android access to holdings and passports.",
    },
    {
      id: "expansion",
      title: "Global expansion",
      description: "Enterprise integrations and institutional distribution.",
    },
    {
      id: "redemption",
      title: "Physical redemption network",
      description: "Insured shipping and redemption in more jurisdictions.",
    },
  ] as const satisfies readonly Milestone[],
  footnote: {
    lead: "The same sequence, dated as far as it can honestly be dated, is on the",
    links: [
      { label: "Investor Presentation", href: "/investors" },
      {
        label: "Future of Gemstone Asset Infrastructure",
        href: "/future-infrastructure",
      },
    ] as const,
    trail: "pages.",
  },
};

export interface CheckPoint {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly href: string;
}

export const verifyPanel = {
  title: "CHECK IT YOURSELF",
  intro:
    "A progress page is worth what its reader can verify. Nothing on this one asks to be taken on trust; each claim above has a page behind it.",
  points: [
    {
      id: "governance",
      title: "Governance",
      description: "How decisions are made, and who is accountable for them.",
      href: "/governance",
    },
    {
      id: "registry",
      title: "Asset Registry",
      description: "The record every tokenized stone will appear in.",
      href: "/asset-registry",
    },
    {
      id: "programs",
      title: "Gemstone Programs",
      description: "The eighteen published programs and their specifications.",
      href: "/gemstone-programs",
    },
    {
      id: "documents",
      title: "Documents",
      description: "What is published, what is in preparation, and when.",
      href: "/documents",
    },
  ] as const satisfies readonly CheckPoint[],
};

export const corporateCta = {
  title: "BUILT IN THE OPEN",
  description:
    "Progress is reported here as it happens, and only once it has happened. Join the waitlist to be told when each milestone is reached.",
  buttonLabel: "Join the Waitlist",
  supportingText: "No allocation, no place in a queue — updates only.",
  imageAlt:
    "Six faceted gemstones and a jeweller's loupe on dark slate veined with gold",
};
