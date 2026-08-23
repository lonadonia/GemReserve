/**
 * Platform Infrastructure — transcribed from the client's board.
 *
 * The board names AWS as the primary cloud provider and lists ISO 27001 and
 * SOC 2. Both are carried across because the site already publishes them: the
 * Technology board named AWS too, and /technology has shipped "Hosted on AWS
 * with multi-region redundancy" and a MULTI-REGION / AWS INFRASTRUCTURE metric
 * since that page was built. The compliance line keeps the board's own wording —
 * infrastructure *aligned with* those standards — rather than claiming
 * certification, which is a different assertion the client has not made.
 *
 * The architecture layers are the same five /technology already draws, so this
 * page imports them rather than restating them; only the security and
 * governance band that runs beneath them is new.
 */

export const infrastructureHero = {
  breadcrumb: ["Home", "Technology", "Platform Infrastructure"] as const,
  titleLines: ["Platform", "Infrastructure"] as const,
  description:
    "GemReserve.io is built on a secure, scalable and resilient infrastructure designed to support global operations, institutional-grade security, real-time asset data and transparent tokenization at enterprise scale.",
  imageAlt:
    "A gemstone-set shield on a lit dais, linked by gold traces to four server nodes",
} as const;

export interface InfrastructureBadge {
  id: string;
  title: string;
  description: string;
}

export const infrastructureBadges: readonly InfrastructureBadge[] = [
  {
    id: "enterprise-grade",
    title: "ENTERPRISE GRADE",
    description: "Built to the highest institutional standards.",
  },
  {
    id: "global-scalable",
    title: "GLOBAL & SCALABLE",
    description: "Designed for worldwide access and growth.",
  },
  {
    id: "secure-resilient",
    title: "SECURE & RESILIENT",
    description: "Multi-layer security with 99.99% uptime target.",
  },
  {
    id: "real-time",
    title: "REAL-TIME & TRANSPARENT",
    description: "Live data, on-chain proofs and full auditability.",
  },
  {
    id: "future-ready",
    title: "FUTURE READY",
    description: "Modular architecture built for innovation.",
  },
];

export const architectureOverviewTitle = "PLATFORM ARCHITECTURE OVERVIEW";

export const securityLayerTitle = "SECURITY & GOVERNANCE LAYER";
export const securityLayerNote = "(Across All Layers)";

export const securityLayerItems: readonly string[] = [
  "Identity & Access Management",
  "Encryption & Key Management",
  "Monitoring & Threat Detection",
  "Governance & Compliance Controls",
];

export interface InfrastructureItem {
  id: string;
  title: string;
  description: string;
}

export const reliabilityTitle = "SECURITY & RELIABILITY";

export const reliabilityItems: readonly InfrastructureItem[] = [
  {
    id: "multi-layer",
    title: "MULTI-LAYER SECURITY",
    description:
      "Defense-in-depth architecture with firewalls, WAF, intrusion detection and DDoS protection.",
  },
  {
    id: "encryption",
    title: "DATA ENCRYPTION",
    description:
      "All data encrypted at rest and in transit using AES-256 and TLS 1.3 protocols.",
  },
  {
    id: "access",
    title: "ACCESS CONTROLS",
    description:
      "Role-based access with MFA, least privilege and strict authorization policies.",
  },
  {
    id: "monitoring",
    title: "CONTINUOUS MONITORING",
    description:
      "24/7 security monitoring, SIEM, log management and anomaly detection.",
  },
  {
    id: "continuity",
    title: "BUSINESS CONTINUITY",
    description:
      "Automated backups, disaster recovery sites and tested recovery procedures.",
  },
  {
    id: "compliance",
    title: "COMPLIANCE READY",
    description:
      "Infrastructure aligned with ISO 27001, SOC 2 and relevant financial regulations.",
  },
];

export const cloudTitle = "CLOUD & DATA CENTERS";

export const cloudMapAlt =
  "A world map with deployment markers across three regions";

export const cloudItems: readonly InfrastructureItem[] = [
  {
    id: "provider",
    title: "PRIMARY CLOUD PROVIDER",
    description: "AWS (Amazon Web Services).",
  },
  {
    id: "regions",
    title: "GLOBAL REGIONS",
    description:
      "Multi-region deployment for high availability and low-latency access.",
  },
  {
    id: "residency",
    title: "DATA RESIDENCY",
    description:
      "Compliant with data residency laws and institutional requirements.",
  },
  {
    id: "redundancy",
    title: "REDUNDANCY",
    description:
      "Active-active architecture with automated failover and load balancing.",
  },
];

export const componentsTitle = "CORE INFRASTRUCTURE COMPONENTS";

export const componentItems: readonly InfrastructureItem[] = [
  {
    id: "blockchain",
    title: "BLOCKCHAIN NETWORK",
    description:
      "Secure, decentralized and immutable ledger for tokenized asset ownership and transactions.",
  },
  {
    id: "contracts",
    title: "SMART CONTRACTS",
    description:
      "Audited and upgradeable smart contracts managing tokens, rules and redemptions.",
  },
  {
    id: "custody",
    title: "CUSTODY & VAULT INTEGRATION",
    description:
      "Integration with approved vaults, insurers and custodians via secure APIs.",
  },
  {
    id: "oracle",
    title: "ORACLE SERVICES",
    description:
      "Real-time price feeds, market data and external data verification.",
  },
  {
    id: "api",
    title: "API & INTEGRATIONS",
    description:
      "Robust APIs for partners, exchanges, institutions and enterprise solutions.",
  },
  {
    id: "analytics",
    title: "ANALYTICS & REPORTING",
    description:
      "Real-time dashboards, portfolio analytics and institutional reporting tools.",
  },
];

export interface InfrastructureMetric {
  id: string;
  value: string;
  label: string;
}

export const infrastructureCta = {
  titleLines: ["BUILT ON TRUST.", "BACKED BY TECHNOLOGY."] as const,
  description:
    "Our infrastructure is the foundation of our promise to deliver security, transparency, liquidity and real value backed by the world's most exquisite gemstones.",
  imageAlt: "An open vault door with faceted gemstones inside",
  metrics: [
    { id: "uptime", value: "99.99%", label: "Uptime Target" },
    { id: "encryption", value: "256-BIT", label: "Encryption" },
    { id: "monitoring", value: "24/7", label: "Monitoring" },
    { id: "global", value: "GLOBAL", label: "Infrastructure" },
  ] as readonly InfrastructureMetric[],
} as const;
