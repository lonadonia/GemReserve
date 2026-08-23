export interface GovernanceHeroContent {
  breadcrumb: readonly [string, string, string];
  titleLines: readonly [string, string, string];
  description: string;
}

export const governanceHero: GovernanceHeroContent = {
  breadcrumb: ["Home", "Company", "Governance"],
  titleLines: ["Governance", "Built on Integrity.", "Guided by Transparency."],
  description:
    "At GemReserve.io, governance is the foundation of trust. We are committed to the highest standards of ethics, transparency, and accountability in everything we do. Our governance framework ensures that GemReserve.io operates for the long-term benefit of our stakeholders, the gemstone industry, and future generations.",
};

export interface GovernanceItem {
  id: string;
  title: string;
  description: string;
}

export const principlesSectionTitle = "OUR GOVERNANCE PRINCIPLES";

export const governancePrinciples: readonly GovernanceItem[] = [
  {
    id: "integrity",
    title: "INTEGRITY",
    description: "We do what is right, always.",
  },
  {
    id: "transparency",
    title: "TRANSPARENCY",
    description: "Full visibility and open communication.",
  },
  {
    id: "accountability",
    title: "ACCOUNTABILITY",
    description: "We take responsibility for our actions.",
  },
  {
    id: "fairness",
    title: "FAIRNESS",
    description: "We treat all stakeholders equitably.",
  },
  {
    id: "security",
    title: "SECURITY",
    description: "We protect assets, data, and privacy.",
  },
  {
    id: "long-term-value",
    title: "LONG-TERM VALUE",
    description: "We build for sustainable growth.",
  },
];

export const structureSectionTitle = "GOVERNANCE STRUCTURE";

export interface GovernanceTier {
  id: string;
  /** The label drawn inside the pyramid band. */
  label: string;
  /** The second line inside the band, where the board carries one. */
  members?: string;
  /** The heading of the matching row beside the pyramid. */
  title: string;
  description: string;
  /** Gold bands are the two operating tiers; the ends are drawn dark. */
  tone: "dark" | "gold";
}

export const governanceTiers: readonly GovernanceTier[] = [
  {
    id: "board",
    label: "BOARD",
    members: "OF DIRECTORS",
    title: "BOARD OF DIRECTORS",
    description:
      "Provides strategic oversight, ensures fiduciary responsibility, and upholds our mission and values.",
    tone: "dark",
  },
  {
    id: "executive",
    label: "EXECUTIVE MANAGEMENT",
    title: "EXECUTIVE MANAGEMENT",
    description:
      "Responsible for day-to-day operations, execution of strategy, and operational excellence.",
    tone: "gold",
  },
  {
    id: "advisory",
    label: "ADVISORY COUNCILS",
    members: "Industry • Technology • Compliance",
    title: "ADVISORY COUNCILS",
    description:
      "Composed of experts in gemstones, blockchain, finance, law, and technology to guide and advise.",
    tone: "gold",
  },
  {
    id: "community",
    label: "COMMUNITY & STAKEHOLDERS",
    members: "Investors • Partners • Users",
    title: "COMMUNITY & STAKEHOLDERS",
    description:
      "Our ecosystem of investors, partners, and users whose feedback and participation shape our future.",
    tone: "dark",
  },
];

export const decisionSectionTitle = "DECISION-MAKING PROCESS";

export interface DecisionStep {
  id: string;
  step: number;
  title: string;
  description: string;
}

export const decisionSteps: readonly DecisionStep[] = [
  {
    id: "proposal",
    step: 1,
    title: "PROPOSAL",
    description:
      "Ideas and proposals are submitted by management, advisors, or community members.",
  },
  {
    id: "review",
    step: 2,
    title: "REVIEW & EVALUATION",
    description:
      "Proposals are reviewed by the appropriate council and evaluated for impact and feasibility.",
  },
  {
    id: "approval",
    step: 3,
    title: "APPROVAL",
    description:
      "Decisions are approved by the Board or relevant council based on governance policies.",
  },
  {
    id: "implementation",
    step: 4,
    title: "IMPLEMENTATION",
    description:
      "Approved initiatives are executed with clear timelines and accountability.",
  },
  {
    id: "monitoring",
    step: 5,
    title: "MONITORING & REPORTING",
    description:
      "Performance is continuously monitored and reported to stakeholders.",
  },
];

export const accountabilitySectionTitle = "TRANSPARENCY & ACCOUNTABILITY";

export const accountabilityItems: readonly GovernanceItem[] = [
  {
    id: "on-chain-transparency",
    title: "ON-CHAIN TRANSPARENCY",
    description:
      "All tokenization, transfers, and redemptions are recorded on-chain and verifiable by anyone.",
  },
  {
    id: "regular-reporting",
    title: "REGULAR REPORTING",
    description:
      "We publish regular reports on reserves, operations, financials, and governance updates.",
  },
  {
    id: "independent-audits",
    title: "INDEPENDENT AUDITS",
    description:
      "Our reserves, smart contracts, and processes are audited by leading independent firms.",
  },
  {
    id: "compliance-ethics",
    title: "COMPLIANCE & ETHICS",
    description:
      "We adhere to global regulations, AML/KYC standards, and the highest ethical practices.",
  },
  {
    id: "stakeholder-engagement",
    title: "STAKEHOLDER ENGAGEMENT",
    description:
      "We value open dialogue and actively engage with our community and partners.",
  },
];

export interface CommitmentBand {
  title: string;
  description: string;
  marks: readonly { id: string; label: string }[];
}

export const governanceCommitment: CommitmentBand = {
  title: "OUR COMMITMENT",
  description:
    "Governance is not just a framework—it is our promise. We are committed to operating with integrity, fostering trust, and creating lasting value for all our stakeholders.",
  marks: [
    { id: "trust", label: "BUILT ON TRUST" },
    { id: "experts", label: "BACKED BY EXPERTS" },
    { id: "transparency", label: "DRIVEN BY TRANSPARENCY" },
    { id: "future", label: "FOCUSED ON THE FUTURE" },
  ],
};

export const governanceHeroImageAlt =
  "The GemReserve crest standing among loose faceted gemstones on dark slate";
