/**
 * Proof of Gemstone Reserves — transcribed from the client's supplied board.
 *
 * This is the page where the difference between a capability and a fact is the
 * whole subject, so two things on the board had to change.
 *
 * Its "ON-CHAIN RESERVE TRANSPARENCY" panel draws a live dashboard: a total
 * reserve value of $186,742,531, 2,841 assets, 15,752 gemstones, 186,742,531
 * tokens and a composition chart reading Emerald 28.4%, Ruby 22.1%, Sapphire
 * 20.3%, Diamond 15.7%, Others 13.5%. GemReserve holds none of it. A proof of
 * reserves figure is worth exactly as much as its provenance, so rather than
 * dressing invented numbers in the language of attestation, the panel is
 * rendered as the dashboard it will be, with no figures in it, and states its
 * own status: no attestation has been published. It is gated on
 * `features.proofOfReserves`, which is off, and the figures appear when a real
 * attestation source is connected — never before, and never without an as-of
 * date and the name of the party that signed it.
 *
 * Its "RESERVE VERIFICATION PARTNERS" panel names a gemological laboratory, an
 * insurance market, an audit firm and two logistics companies as organizations
 * GemReserve works with. None of those relationships is supported. The panel
 * describes the roles instead, exactly as the Independent Verification page
 * does — see content/verification.ts, which carries the reasoning in full.
 *
 * The seven-step process, the passport checklist and the six guarantees are the
 * board's own copy. Two sentences in the guarantees were written in the present
 * tense about things that are not running yet ("reflected on-chain and in our
 * public dashboards"); those state what the system is built to do.
 */

export interface ReservesHeroContent {
  readonly breadcrumb: readonly [string, string, string];
  readonly titleLines: readonly [string, string];
  readonly tagline: string;
  readonly description: string;
  readonly cards: readonly {
    readonly id: string;
    readonly title: string;
    readonly description: string;
  }[];
}

export const reservesHero: ReservesHeroContent = {
  breadcrumb: ["Home", "Technology", "Proof of Gemstone Reserves"],
  titleLines: ["Proof of", "Gemstone Reserves"],
  tagline: "Every Gem. Verified. Every Time.",
  description:
    "Proof of reserves is the commitment that every token in circulation is matched by a real gemstone that an independent party has counted. This is how that proof is produced, and what it will show.",
  cards: [
    {
      id: "backed",
      title: "100% REAL ASSETS",
      description:
        "Every token is backed 1:1 by a physical gemstone in secure custody.",
    },
    {
      id: "verified",
      title: "INDEPENDENTLY VERIFIED",
      description: "Verified by leading gemological laboratories and auditors.",
    },
    {
      id: "on-chain",
      title: "ON-CHAIN TRANSPARENT",
      description: "Ownership, reserves and transfers recorded on-chain.",
    },
    {
      id: "secure",
      title: "SECURE & INSURED",
      description: "Institutional-grade security with all-risk cover.",
    },
  ],
};

export const processSectionTitle = "THE PROOF OF GEMSTONE RESERVES PROCESS";

export interface ReserveStep {
  readonly id: string;
  readonly step: string;
  readonly title: string;
  readonly description: string;
  readonly marker: string;
}

export const reserveSteps: readonly ReserveStep[] = [
  {
    id: "sourcing",
    step: "1",
    title: "SOURCING",
    description:
      "Ethically sourced gemstones from trusted suppliers and mines. All suppliers are KYC/AML verified.",
    marker: "Vetted supply",
  },
  {
    id: "gemological",
    step: "2",
    title: "GEMOLOGICAL VERIFICATION",
    description:
      "Each gemstone is examined by independent gemological laboratories for authenticity and quality.",
    marker: "Independent report",
  },
  {
    id: "custody",
    step: "3",
    title: "CUSTODY & VAULTING",
    description:
      "Verified gemstones are securely stored in insured, high-security vaults with 24/7 monitoring and environmental controls.",
    marker: "Insured custody",
  },
  {
    id: "recording",
    step: "4",
    title: "DIGITAL RECORDING",
    description:
      "Each gemstone is scanned, photographed in 360° and weighed. A unique Digital Asset Passport is created.",
    marker: "360° high-res imaging",
  },
  {
    id: "tokenization",
    step: "5",
    title: "ON-CHAIN TOKENIZATION",
    description:
      "A fractional ownership token is minted on Ethereum (ERC-20) and permanently linked to the asset.",
    marker: "ERC-20 compliant",
  },
  {
    id: "audit",
    step: "6",
    title: "INDEPENDENT AUDIT",
    description:
      "Third-party audit firms regularly verify reserves, vaults, records and on-chain data reconciliation.",
    marker: "Audited",
  },
  {
    id: "disclosure",
    step: "7",
    title: "CONTINUOUS DISCLOSURE",
    description:
      "Reserve reporting and updates are published on a fixed cadence, so the count is never older than the interval.",
    marker: "Published on a cadence",
  },
];

export interface PassportCheck {
  readonly id: string;
  readonly label: string;
}

export const passportPanel = {
  title: "DIGITAL ASSET PASSPORT",
  intro: "What every stone in the reserve carries with it.",
  checks: [
    { id: "id", label: "Unique asset ID" },
    { id: "report", label: "Gemological report" },
    { id: "images", label: "High-resolution images (360°)" },
    { id: "weight", label: "Weight & measurements" },
    { id: "origin", label: "Origin & provenance" },
    { id: "treatment", label: "Treatment disclosure" },
    { id: "vault", label: "Vault & insurance details" },
    { id: "on-chain", label: "On-chain verification" },
  ] as const satisfies readonly PassportCheck[],
  link: { label: "View a sample passport", href: "/digital-asset-passports" },
  imageAlt: "A tablet standing on a dark plinth beside a brilliant-cut diamond",
};

export interface ReserveRole {
  readonly id: string;
  readonly role: string;
  readonly responsibility: string;
}

export const rolesPanel = {
  title: "WHO DOES THE COUNTING",
  intro:
    "A reserve figure signed by the platform that issued the tokens proves nothing. Each part of the count belongs to a party that does not answer to GemReserve.io.",
  roles: [
    {
      id: "laboratory",
      role: "Gemological laboratory",
      responsibility: "Confirms each stone is what its record says it is",
    },
    {
      id: "custodian",
      role: "Custody provider",
      responsibility: "Confirms the stone is present and intact",
    },
    {
      id: "auditor",
      role: "Reserve auditor",
      responsibility:
        "Reconciles tokens issued against stones held, and signs the result",
    },
    {
      id: "contract",
      role: "Smart contract auditor",
      responsibility:
        "Confirms the supply on-chain is the supply that was minted",
    },
  ] as const satisfies readonly ReserveRole[],
  disclosure:
    "No laboratory, auditor, insurer or custodian is named as a partner of GemReserve.io. Each is published here, with its engagement, once appointed.",
};

export interface DashboardField {
  readonly id: string;
  readonly label: string;
}

export const dashboardPanel = {
  title: "ON-CHAIN RESERVE TRANSPARENCY",
  intro: "What the public reserve report will carry, and how to read it.",
  statusLabel: "No attestation published",
  statusDetail:
    "GemReserve.io has not yet published a reserve attestation. Nothing is shown here in place of one — not a projection, not a target, and not a previous figure. Every number below appears with the date it was taken and the name of the party that signed it, or it does not appear at all.",
  fields: [
    { id: "value", label: "Total reserve value" },
    { id: "assets", label: "Tokenized assets" },
    { id: "gemstones", label: "Gemstones held" },
    { id: "tokens", label: "Tokens in circulation" },
  ] as const satisfies readonly DashboardField[],
  compositionLabel: "Composition by gemstone type",
  metaFields: [
    { id: "as-of", label: "As of" },
    { id: "attested-by", label: "Attested by" },
    { id: "method", label: "Method" },
  ] as const satisfies readonly DashboardField[],
  pending: "Pending first attestation",
};

export interface Guarantee {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const guaranteePanel = {
  title: "OUR PROOF OF RESERVES GUARANTEE",
  guarantees: [
    {
      id: "backed",
      title: "100% BACKED",
      description:
        "Every token is backed 1:1 by a real, physical gemstone in secure custody.",
    },
    {
      id: "transparency",
      title: "FULL TRANSPARENCY",
      description:
        "Ownership, reserves and history are verifiable on-chain by anyone.",
    },
    {
      id: "third-party",
      title: "THIRD-PARTY VERIFIED",
      description:
        "Regular audits and gemological verification by independent firms.",
    },
    {
      id: "custody",
      title: "SECURE CUSTODY",
      description:
        "Institutional-grade vaults with insurance, 24/7 security and strict access controls.",
    },
    {
      id: "updates",
      title: "DATED, NOT LIVE-LOOKING",
      description:
        "Every published figure carries its as-of date and its source. A stale count is shown as stale rather than as current.",
    },
    {
      id: "trust",
      title: "BUILT FOR TRUST",
      description:
        "The system is designed to deliver integrity, transparency and confidence.",
    },
  ] as const satisfies readonly Guarantee[],
};

export const reservesCta = {
  titleLines: [
    "Real Gems. Real Value. Real Proof.",
    "Backed by the Highest Standards.",
  ] as const,
  description:
    "GemReserve.io sets a benchmark for transparency in the gemstone industry. Proof of Gemstone Reserves is how you will be able to check it for yourself rather than take our word for it.",
  buttonLabel: "Join the Waitlist",
  supportingText: "Be told when the first attestation is published.",
  imageAlt: "An open vault door with a lit display of faceted gemstones",
};
