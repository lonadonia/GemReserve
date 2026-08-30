/**
 * Independent Verification — transcribed from the client's supplied board.
 *
 * The board carries one claim this site cannot make. Its middle panel is titled
 * "INDEPENDENT VERIFICATION PARTNERS", says "we work exclusively with
 * world-class independent organizations", and then names five firms — a
 * gemological laboratory, an insurance market, an audit firm, a law firm and a
 * smart-contract auditor — as GemReserve's partners. Nothing in the approved
 * project material supports any of those relationships, and naming a real firm
 * as a partner it has not agreed to be is the one error on this page that would
 * matter to that firm as much as to a reader. The panel is therefore kept in
 * place and kept doing its job — telling a reader which independent parties the
 * framework depends on — but it describes the five roles rather than naming
 * five companies, and says plainly that providers are named once engagements
 * are in place.
 *
 * That is the same line the rest of the site already holds: a laboratory may be
 * named on a stone's record as the issuer of its report, because that is what a
 * report is; no firm is described as a partner of GemReserve anywhere.
 *
 * Two smaller corrections. The board's hero draws a gemological report card and
 * an on-chain bar carrying an asset ID, a transaction hash and a verification
 * date; those are illustration, and the card is labelled a sample record here
 * the way the registry and passport samples already are. And "our framework
 * meets global regulatory and institutional standards" is written as "is
 * designed to meet" — the framework is not yet operating, so it cannot be
 * said to meet anything today.
 */

export interface VerificationHeroContent {
  readonly breadcrumb: readonly [string, string, string];
  readonly titleLines: readonly [string, string];
  readonly tagline: string;
  readonly description: string;
  readonly sample: {
    readonly eyebrow: string;
    readonly title: string;
    readonly note: string;
    readonly checks: readonly string[];
    readonly bar: {
      readonly title: string;
      readonly rows: readonly {
        readonly label: string;
        readonly value: string;
      }[];
    };
    readonly seal: readonly [string, string];
  };
}

export const verificationHero: VerificationHeroContent = {
  breadcrumb: ["Home", "Technology", "Independent Verification"],
  titleLines: ["Independent", "Verification"],
  tagline: "Trust is not a claim. It is proven.",
  description:
    "GemReserve.io is built on full transparency and independent verification at every level — from asset authenticity and ownership to custody, reserves and on-chain tokenization.",
  sample: {
    eyebrow: "Gemological report",
    title: "Independent verification",
    note: "Sample record — the fields a report carries, not a stone held today.",
    checks: [
      "Authenticity verified",
      "Natural gemstone",
      "No treatments detected",
      "Weight & measurements verified",
      "Origin confirmed",
    ],
    // The board lays the on-chain data on a separate brass plate below the
    // report card, dark type on gold, with a QR block at its left. It is a
    // second object in the photograph rather than a footer to the first, and it
    // is built that way here.
    bar: {
      title: "On-chain verified",
      rows: [
        { label: "Asset ID", value: "GR-SAP-0007842" },
        { label: "Blockchain TX", value: "0x7a3b…c82f" },
        { label: "Verified", value: "Sample record" },
      ],
    },
    seal: ["Independently", "Verified"],
  },
};

export const frameworkSectionTitle =
  "MULTI-LAYER INDEPENDENT VERIFICATION FRAMEWORK";

export interface VerificationLayer {
  readonly id: string;
  readonly step: string;
  readonly title: string;
  readonly description: string;
  readonly checks: readonly string[];
}

export const verificationLayers: readonly VerificationLayer[] = [
  {
    id: "gemological",
    step: "1",
    title: "GEMOLOGICAL VERIFICATION",
    description:
      "Each gemstone is examined and certified by leading independent gemological laboratories.",
    checks: [
      "Identity",
      "Authenticity",
      "Origin",
      "Treatments",
      "Quality characteristics",
    ],
  },
  {
    id: "custody",
    step: "2",
    title: "CUSTODY VERIFICATION",
    description:
      "Assets are securely stored in independent, institutional-grade vaults and physically verified.",
    checks: [
      "Vault existence",
      "Asset presence",
      "Condition check",
      "Seal & integrity",
    ],
  },
  {
    id: "reserve",
    step: "3",
    title: "RESERVE VERIFICATION",
    description:
      "Independent audit firms are engaged to attest that tokenized assets are linked 1:1 to physical gemstones.",
    checks: [
      "Proof of reserves",
      "Reconciliation",
      "Sample inspection",
      "Audit certification",
    ],
  },
  {
    id: "legal",
    step: "4",
    title: "LEGAL & OWNERSHIP VERIFICATION",
    description:
      "Legal due diligence confirms clear ownership, no liens and enforceable rights over all gemstones.",
    checks: [
      "Title & ownership",
      "No encumbrances",
      "Legal compliance",
      "Documentation review",
    ],
  },
  {
    id: "on-chain",
    step: "5",
    title: "ON-CHAIN VERIFICATION",
    description:
      "All critical data is recorded on-chain and independently verifiable in real time.",
    checks: [
      "Immutable records",
      "Smart contract audit",
      "Token traceability",
      "Public verification",
    ],
  },
  {
    id: "monitoring",
    step: "6",
    title: "CONTINUOUS MONITORING",
    description:
      "Ongoing monitoring and periodic re-verification ensure long-term transparency.",
    checks: [
      "Real-time alerts",
      "Inventory updates",
      "Periodic audits",
      "Market surveillance",
    ],
  },
];

export interface IndependentRole {
  readonly id: string;
  readonly role: string;
  readonly responsibility: string;
  readonly scope: string;
}

export const independentRoles = {
  title: "THE INDEPENDENT PARTIES",
  intro:
    "Five roles sit outside GemReserve.io, each accountable for one layer.",
  roles: [
    {
      id: "laboratory",
      role: "Gemological lab",
      responsibility: "Identification, grading and treatment analysis",
      scope: "Issues the report a stone's record is built on",
    },
    {
      id: "custodian",
      role: "Custody provider",
      responsibility: "Storage, physical inspection and seal integrity",
      scope: "Holds the stone; does not value or tokenize it",
    },
    {
      id: "auditor",
      role: "Reserve auditor",
      responsibility: "Reconciliation of tokens issued against stones held",
      scope: "Reports to the public, not to the platform",
    },
    {
      id: "counsel",
      role: "Legal counsel",
      responsibility: "Title, encumbrance and enforceability review",
      scope: "Confirms what a token holder actually owns",
    },
    {
      id: "security",
      role: "Contract auditor",
      responsibility: "Contract review and blockchain security assessment",
      scope: "Reviews the code before it holds anything",
    },
  ] as const satisfies readonly IndependentRole[],
  disclosure:
    "No laboratory, auditor, insurer, custodian or law firm is named as a partner. Each is published here, with its engagement, once appointed.",
};

export interface TransparencyNode {
  readonly id: string;
  readonly label: string;
}

export const onChainPanel = {
  title: "ON-CHAIN TRANSPARENCY",
  intro: "Every token is permanently linked to verified data.",
  // Ordered as the board draws them: three down the left of the ring, three
  // down the right. The renderer places them from this order.
  nodes: [
    { id: "report", label: "Gemological Report" },
    { id: "custody", label: "Custody Location" },
    { id: "history", label: "Transaction History" },
    { id: "reserves", label: "Proof of Reserves" },
    { id: "ownership", label: "Ownership Details" },
    { id: "certificates", label: "Audit Certificates" },
  ] as const satisfies readonly TransparencyNode[],
  gemImageAlt: "An emerald-cut green gemstone",
  scanLabel: "Scan to verify on-chain",
  footnote: "Verification opens with the platform.",
};

export interface MeaningPoint {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const meaningPanel = {
  title: "WHAT THIS MEANS FOR YOU",
  points: [
    {
      id: "confidence",
      title: "COMPLETE CONFIDENCE",
      description: "Every gemstone is verification-gated before it is admitted.",
    },
    {
      id: "risk",
      title: "RISK MITIGATION",
      description:
        "Independent verification minimizes fraud, misrepresentation and risk.",
    },
    {
      id: "regulatory",
      title: "REGULATORY ALIGNMENT",
      description:
        "The framework is designed to meet global regulatory and institutional standards.",
    },
    {
      id: "transparency",
      title: "TOTAL TRANSPARENCY",
      description: "All data is verifiable on-chain, anytime, anywhere.",
    },
    {
      id: "institutional",
      title: "INSTITUTIONAL GRADE",
      description:
        "Built for institutional investors, family offices and sovereign funds.",
    },
  ] as const satisfies readonly MeaningPoint[],
};

export const verificationCta = {
  titleLines: [
    "Verified. Backed. Transparent.",
    "That is the GemReserve Standard.",
  ] as const,
  description:
    "Independent verification is not optional — it is the foundation of our platform. From the mine to your wallet, every step is verified, recorded and immutable.",
  panel: {
    title: "PHYSICAL GEMSTONE LINKAGE",
    lines: ["Independently verified.", "On-chain secured."] as const,
  },
  buttonLabel: "See how the platform works",
  buttonHref: "/how-it-works",
  imageAlt:
    "An open vault door with a tiered display of faceted gemstones lit from within",
};
