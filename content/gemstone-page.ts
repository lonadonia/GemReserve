/**
 * The shape a single-gemstone page takes.
 *
 * Aquamarine and Emerald are the same page with different data and a different
 * accent colour, so the layout is written once against this type and each stone
 * is a content file. A third stone is a content file, not a page.
 *
 * The two boards order their sections differently — Aquamarine leads with the
 * spec table and its origin map, Emerald leads with an at-a-glance strip and its
 * prose — so the sections a stone does not have are simply absent and the page
 * skips them.
 */

export interface GemHighlight {
  id: string;
  title: string;
  description: string;
}

export interface GemFact {
  id: string;
  label: string;
  value: string;
}

export interface GemOriginPin {
  id: string;
  country: string;
  region: string;
}

export interface GemGalleryItem {
  id: string;
  label: string;
  src: string;
  alt: string;
}

export interface GemGlanceItem {
  id: string;
  label: string;
  value: string;
  /** A second line beneath the value, where the board sets one. */
  note?: string;
}

export interface GemProcessStep {
  id: string;
  step: number;
  title: string;
  description: string;
}

export interface GemstonePageContent {
  /** Drives the accent tokens, the body class and nothing else. */
  readonly slug: string;
  readonly accent: "aqua" | "emerald";

  readonly breadcrumb: readonly string[];
  readonly title: string;
  readonly tagline: readonly string[];
  readonly description: string;
  readonly heroBase: string;
  readonly heroImageAlt: string;

  /** The card the board floats over the hero. */
  readonly highlightsTitle: string;
  readonly highlights: readonly GemHighlight[];

  /** The assurance strip beneath the hero. */
  readonly assurances: readonly GemHighlight[];

  /** Emerald's promise panel; Aquamarine has none. */
  readonly promise?: {
    readonly title: string;
    readonly description: string;
  };

  /** Emerald's "at a glance" row; Aquamarine has none. */
  readonly glance?: {
    readonly title: string;
    readonly items: readonly GemGlanceItem[];
  };

  /** Aquamarine's spec table; Emerald's prose stands in its place. */
  readonly details?: {
    readonly title: string;
    readonly facts: readonly GemFact[];
    readonly imageSrc: string;
    readonly imageAlt: string;
    readonly imageActionLabel: string;
  };

  /** Emerald's prose panel; Aquamarine has none. */
  readonly about?: {
    readonly title: string;
    readonly paragraphs: readonly string[];
    readonly imageSrc: string;
    readonly imageAlt: string;
  };

  /** Aquamarine's origin map; Emerald names its origins in the glance row. */
  readonly origin?: {
    readonly title: string;
    readonly description: string;
    readonly mapSrc: string;
    readonly mapAlt: string;
    readonly pins: readonly GemOriginPin[];
    readonly note: string;
  };

  readonly investment: {
    readonly title: string;
    readonly items: readonly GemHighlight[];
  };

  /** The sample record. Labelled a sample wherever it is drawn. */
  readonly sample?: {
    readonly title: string;
    readonly note: string;
    readonly facts: readonly GemFact[];
  };

  /** Emerald's quality factors; Aquamarine has none. */
  readonly quality?: {
    readonly title: string;
    readonly items: readonly GemHighlight[];
  };

  readonly certificate?: {
    readonly title: string;
    readonly description: string;
    readonly imageSrc: string;
    readonly imageAlt: string;
    readonly actionLabel: string;
  };

  readonly gallery?: {
    readonly title: string;
    readonly items: readonly GemGalleryItem[];
  };

  /** Emerald's custody panel; Aquamarine folds custody into its assurances. */
  readonly custody?: {
    readonly title: string;
    readonly intro: string;
    readonly items: readonly string[];
    readonly imageSrc: string;
    readonly imageAlt: string;
  };

  /** Emerald's tokenization ladder; Aquamarine has none. */
  readonly process?: {
    readonly title: string;
    readonly steps: readonly GemProcessStep[];
  };

  /** Emerald's market figure; Aquamarine has none. */
  readonly market?: {
    readonly title: string;
    readonly description: string;
    readonly caption: string;
    readonly points: readonly {
      readonly year: string;
      readonly value: number;
    }[];
    readonly projectedFrom: string;
  };

  /** Aquamarine's closing feature row; Emerald's is its trust strip. */
  readonly features?: readonly GemHighlight[];

  readonly cta: {
    readonly title: string;
    readonly description: string;
    readonly buttonLabel: string;
    readonly supportingText: string;
    readonly imageSrc: string;
    readonly imageAlt: string;
  };

  /** Emerald's closing trust strip; Aquamarine has none. */
  readonly trust?: readonly GemHighlight[];
}
