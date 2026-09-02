/**
 * The CMS content contract, as types plus runtime validators.
 *
 * These are the shapes `/wp-json/gemreserve/v1/` promises. The types alone
 * would be a comment: TypeScript erases at build time, and the data arrives at
 * runtime over the network from a system that deploys on its own schedule. So
 * every type here is paired with a validator, and nothing reaches a component
 * without passing one.
 *
 * The validators are hand-written rather than pulled from zod or valibot. The
 * reason is proportion, not principle: this is one response shape with a dozen
 * node kinds, the project has no schema library in its dependency tree today,
 * and adding one to validate a single contract would put a runtime dependency
 * — and its supply chain — into a marketing website to save about eighty lines.
 *
 * The validators are deliberately *narrowing*, not *coercing*. A node that does
 * not match is dropped and reported, never patched into shape. A renderer that
 * quietly repairs bad input is a renderer that hides a broken migration.
 */

/**
 * The block schema version this renderer understands.
 *
 * WordPress publishes `schemaVersion` on every response. A major mismatch means
 * the CMS has moved on and this build was not rebuilt with it; rendering
 * anyway would produce a page whose errors are invisible. See
 * `isCompatibleSchema`.
 */
export const SUPPORTED_SCHEMA_MAJOR = 1;

export type SlotKind = "text" | "attr" | "url" | "icon";

export interface CmsField {
  readonly key: string;
  readonly kind: SlotKind;
  readonly label: string;
  readonly value: string;
}

export interface CmsContentNode {
  readonly type: "content";
  /** Design markup with slot values already substituted and escaped by WordPress. */
  readonly html: string;
  readonly fields: readonly CmsField[];
}

export interface CmsCollectionItem {
  readonly html: string;
  readonly fields: readonly CmsField[];
}

export interface CmsCollectionNode {
  readonly type: "collection";
  readonly tag: string;
  readonly variant: readonly string[];
  readonly attributes: CmsAttributes;
  readonly items: readonly CmsCollectionItem[];
}

/**
 * Presentation attributes a container element carries.
 *
 * Published by WordPress so a consumer reproduces the element the CMS renders
 * rather than reconstructing one. Closed to inert names — class, id, style,
 * role, ARIA and data-* — so they can be spread onto an element directly.
 */
export type CmsAttributes = Readonly<Record<string, string>>;

export interface CmsSectionNode {
  readonly type: "section";
  readonly label: string;
  readonly tag: string;
  readonly variant: readonly string[];
  readonly anchor: string;
  readonly attributes: CmsAttributes;
  readonly children: readonly CmsNode[];
}

export interface CmsGroupNode {
  readonly type: "group";
  readonly tag: string;
  readonly variant: readonly string[];
  readonly attributes: CmsAttributes;
  readonly children: readonly CmsNode[];
}

export interface CmsPreservedNode {
  readonly type: "preserved";
  readonly html: string;
}

export interface CmsCoreNode {
  readonly type: "core";
  readonly name: string;
  readonly html: string;
}

export type CmsNode =
  | CmsSectionNode
  | CmsGroupNode
  | CmsCollectionNode
  | CmsContentNode
  | CmsPreservedNode
  | CmsCoreNode;

export interface CmsHero {
  readonly eyebrow: string;
  readonly titleLines: readonly string[];
  readonly tagline: string;
  readonly description: string;
  readonly imageDesktop: string;
  readonly imageMobile: string;
  readonly variant: string;
}

export interface CmsSeo {
  readonly title: string;
  readonly description: string;
  readonly canonical: string;
  readonly noindex: boolean;
  readonly nofollow: boolean;
  readonly openGraph: {
    readonly title: string;
    readonly description: string;
    readonly image: string;
    readonly type: string;
  };
  readonly twitter: {
    readonly card: string;
    readonly title: string;
    readonly description: string;
  };
  readonly structuredData: Record<string, string>;
  readonly inSitemap: boolean;
}

export interface CmsPage {
  readonly schemaVersion: string;
  readonly id: number;
  readonly slug: string;
  readonly route: string;
  readonly title: string;
  readonly excerpt: string;
  readonly updatedAt: string | null;
  readonly publishedAt: string | null;
  readonly hero: CmsHero;
  readonly seo: CmsSeo;
  readonly blocks: readonly CmsNode[];
  readonly migrated: boolean;
  /** Present only on the authenticated preview endpoint. */
  readonly preview?: {
    readonly isPreview: boolean;
    readonly expiresAt: string;
    readonly status: string;
  };
}

export interface CmsRouteEntry {
  readonly id: number;
  readonly route: string;
  readonly type: string;
  readonly updatedAt: string | null;
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export interface ValidationResult<T> {
  readonly value: T | null;
  /** Human-readable problems, for logging. Never shown to a visitor. */
  readonly problems: readonly string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function strArray(value: unknown): readonly string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

function bool(value: unknown): boolean {
  return value === true;
}

/**
 * Is the CMS speaking a version this build understands?
 *
 * Major version only. A minor bump is additive by contract, and refusing to
 * render a whole site because WordPress gained an optional field would be a
 * self-inflicted outage.
 */
export function isCompatibleSchema(version: unknown): boolean {
  const major = Number.parseInt(str(version).split(".")[0] ?? "", 10);
  return Number.isFinite(major) && major === SUPPORTED_SCHEMA_MAJOR;
}

const KNOWN_FIELD_KINDS: readonly SlotKind[] = ["text", "attr", "url", "icon"];

/**
 * Narrow container attributes to inert names.
 *
 * WordPress already restricts what it publishes, but this is the boundary
 * between two independently deployed systems: a name that arrives here and is
 * spread onto a React element must be one that cannot navigate or execute, and
 * that has to be checked on the side doing the spreading. `on*` handlers,
 * `href`, `src`, `srcdoc` and `formaction` are excluded by construction.
 */
function validateAttributes(raw: unknown): CmsAttributes {
  if (!isRecord(raw)) {
    return {};
  }
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(raw)) {
    if (typeof value !== "string") {
      continue;
    }
    const lower = name.toLowerCase();
    const inert =
      ["class", "id", "style", "role", "tabindex", "hidden", "lang", "dir"].includes(lower) ||
      lower.startsWith("aria-") ||
      lower.startsWith("data-");
    if (inert) {
      out[lower] = value;
    }
  }
  return out;
}

function validateFields(raw: unknown): readonly CmsField[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: CmsField[] = [];
  for (const entry of raw) {
    if (!isRecord(entry) || typeof entry.key !== "string") {
      continue;
    }
    const kind = KNOWN_FIELD_KINDS.includes(entry.kind as SlotKind)
      ? (entry.kind as SlotKind)
      : "text";
    out.push({
      key: entry.key,
      kind,
      label: str(entry.label),
      value: str(entry.value),
    });
  }
  return out;
}

/**
 * Validate one node.
 *
 * Returns null for anything unrecognised or malformed. The caller records it;
 * see `validateNodes`.
 */
function validateNode(raw: unknown, path: string, problems: string[]): CmsNode | null {
  if (!isRecord(raw)) {
    problems.push(`${path}: not an object`);
    return null;
  }

  switch (raw.type) {
    case "section": {
      if (typeof raw.tag !== "string") {
        problems.push(`${path}: section without a tag`);
        return null;
      }
      return {
        type: "section",
        label: str(raw.label),
        tag: raw.tag,
        variant: strArray(raw.variant),
        anchor: str(raw.anchor),
        attributes: validateAttributes(raw.attributes),
        children: validateNodes(raw.children, `${path}/children`, problems),
      };
    }
    case "group": {
      if (typeof raw.tag !== "string") {
        problems.push(`${path}: group without a tag`);
        return null;
      }
      return {
        type: "group",
        tag: raw.tag,
        variant: strArray(raw.variant),
        attributes: validateAttributes(raw.attributes),
        children: validateNodes(raw.children, `${path}/children`, problems),
      };
    }
    case "collection": {
      if (!Array.isArray(raw.items)) {
        problems.push(`${path}: collection without items`);
        return null;
      }
      const items: CmsCollectionItem[] = [];
      raw.items.forEach((item, index) => {
        if (!isRecord(item) || typeof item.html !== "string") {
          problems.push(`${path}/items[${index}]: missing html`);
          return;
        }
        items.push({ html: item.html, fields: validateFields(item.fields) });
      });
      return {
        type: "collection",
        tag: str(raw.tag, "ul"),
        variant: strArray(raw.variant),
        attributes: validateAttributes(raw.attributes),
        items,
      };
    }
    case "content": {
      if (typeof raw.html !== "string") {
        problems.push(`${path}: content without html`);
        return null;
      }
      return { type: "content", html: raw.html, fields: validateFields(raw.fields) };
    }
    case "preserved": {
      if (typeof raw.html !== "string") {
        problems.push(`${path}: preserved without html`);
        return null;
      }
      return { type: "preserved", html: raw.html };
    }
    case "core": {
      if (typeof raw.html !== "string" || typeof raw.name !== "string") {
        problems.push(`${path}: core block without name/html`);
        return null;
      }
      return { type: "core", name: raw.name, html: raw.html };
    }
    default:
      problems.push(`${path}: unknown node type ${JSON.stringify(raw.type)}`);
      return null;
  }
}

export function validateNodes(raw: unknown, path: string, problems: string[]): readonly CmsNode[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: CmsNode[] = [];
  raw.forEach((entry, index) => {
    const node = validateNode(entry, `${path}[${index}]`, problems);
    if (node !== null) {
      out.push(node);
    }
  });
  return out;
}

export function validatePage(raw: unknown): ValidationResult<CmsPage> {
  const problems: string[] = [];

  if (!isRecord(raw)) {
    return { value: null, problems: ["response was not an object"] };
  }
  if (!isCompatibleSchema(raw.schemaVersion)) {
    return {
      value: null,
      problems: [
        `incompatible schema ${JSON.stringify(raw.schemaVersion)}; this build understands major ${SUPPORTED_SCHEMA_MAJOR}`,
      ],
    };
  }
  if (typeof raw.id !== "number" || typeof raw.slug !== "string") {
    return { value: null, problems: ["response is missing id or slug"] };
  }

  const heroRaw = isRecord(raw.hero) ? raw.hero : {};
  const seoRaw = isRecord(raw.seo) ? raw.seo : {};
  const ogRaw = isRecord(seoRaw.openGraph) ? seoRaw.openGraph : {};
  const twRaw = isRecord(seoRaw.twitter) ? seoRaw.twitter : {};
  const sdRaw = isRecord(seoRaw.structuredData) ? seoRaw.structuredData : {};

  const structuredData: Record<string, string> = {};
  for (const [key, value] of Object.entries(sdRaw)) {
    if (typeof value === "string") {
      structuredData[key] = value;
    }
  }

  const page: CmsPage = {
    schemaVersion: str(raw.schemaVersion),
    id: raw.id,
    slug: raw.slug,
    route: str(raw.route, `/${raw.slug}/`),
    title: str(raw.title),
    excerpt: str(raw.excerpt),
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : null,
    publishedAt: typeof raw.publishedAt === "string" ? raw.publishedAt : null,
    hero: {
      eyebrow: str(heroRaw.eyebrow),
      titleLines: strArray(heroRaw.titleLines),
      tagline: str(heroRaw.tagline),
      description: str(heroRaw.description),
      imageDesktop: str(heroRaw.imageDesktop),
      imageMobile: str(heroRaw.imageMobile),
      variant: str(heroRaw.variant),
    },
    seo: {
      title: str(seoRaw.title, str(raw.title)),
      description: str(seoRaw.description),
      canonical: str(seoRaw.canonical),
      noindex: bool(seoRaw.noindex),
      nofollow: bool(seoRaw.nofollow),
      openGraph: {
        title: str(ogRaw.title, str(seoRaw.title)),
        description: str(ogRaw.description, str(seoRaw.description)),
        image: str(ogRaw.image),
        type: str(ogRaw.type, "website"),
      },
      twitter: {
        card: str(twRaw.card, "summary_large_image"),
        title: str(twRaw.title, str(seoRaw.title)),
        description: str(twRaw.description, str(seoRaw.description)),
      },
      structuredData,
      inSitemap: bool(seoRaw.inSitemap),
    },
    blocks: validateNodes(raw.blocks, "blocks", problems),
    migrated: bool(raw.migrated),
    preview: isRecord(raw.preview)
      ? {
          isPreview: bool(raw.preview.isPreview),
          expiresAt: str(raw.preview.expiresAt),
          status: str(raw.preview.status),
        }
      : undefined,
  };

  return { value: page, problems };
}

export function validateRouteIndex(raw: unknown): ValidationResult<readonly CmsRouteEntry[]> {
  const problems: string[] = [];
  if (!isRecord(raw) || !Array.isArray(raw.routes)) {
    return { value: null, problems: ["route index was not an object with a routes array"] };
  }
  if (!isCompatibleSchema(raw.schemaVersion)) {
    return { value: null, problems: [`incompatible schema ${JSON.stringify(raw.schemaVersion)}`] };
  }

  const out: CmsRouteEntry[] = [];
  raw.routes.forEach((entry, index) => {
    if (!isRecord(entry) || typeof entry.route !== "string" || typeof entry.id !== "number") {
      problems.push(`routes[${index}]: missing id or route`);
      return;
    }
    out.push({
      id: entry.id,
      route: entry.route,
      type: str(entry.type, "page"),
      updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : null,
    });
  });

  return { value: out, problems };
}
