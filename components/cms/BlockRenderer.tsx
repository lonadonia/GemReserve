/**
 * The block renderer.
 *
 * One component per node type, dispatched through an allowlist. A node type
 * that is not in the map does not render — it is not passed through, not
 * stringified, and not guessed at.
 *
 * On `dangerouslySetInnerHTML`, which appears here and needs justifying rather
 * than apologising for.
 *
 * The alternative is reconstructing each section's markup in JSX from the
 * `fields` array. That sounds safer and is not: the approved design is 30-plus
 * distinct item structures deep (see CMS_TARGET_ARCHITECTURE.md §2), so a JSX
 * reconstruction would be a second, hand-written implementation of a design
 * that already has one — free to drift from it, and drifting silently.
 *
 * What makes injecting the markup acceptable is that it is not arbitrary. It
 * has passed three gates before it arrives:
 *
 *   1. On save, WordPress filters every markup-bearing block attribute through
 *      a closed element and attribute allowlist for any user without
 *      `unfiltered_html` (MarkupPolicy). No script, no event handlers, no
 *      `iframe`/`object`/`embed`, no `javascript:` URLs.
 *   2. On render, WordPress escapes every slot value by kind — text values with
 *      HTML text escaping, attribute values with attribute escaping, URLs
 *      scheme-checked, icons through a closed SVG allowlist.
 *   3. Here, `assertTrustedHtml` re-checks the result before it is injected,
 *      because a defence that lives only in another codebase is a defence this
 *      one is trusting on faith.
 *
 * Gate 3 is the one that earns its place. WordPress and this renderer deploy
 * separately; a regression there should degrade a section here, not execute in
 * a visitor's browser.
 */

import type {
  CmsAttributes,
  CmsCollectionNode,
  CmsContentNode,
  CmsCoreNode,
  CmsGroupNode,
  CmsNode,
  CmsPreservedNode,
  CmsSectionNode,
} from "@/lib/cms/schema";

/**
 * Patterns that must never appear in CMS-supplied markup.
 *
 * A blocklist is the wrong tool for sanitising untrusted input and the right
 * one for detecting that upstream sanitising has failed — which is what this
 * is. It does not make the markup safe; it notices when the thing that was
 * supposed to make it safe did not, and drops the section rather than
 * rendering it.
 */
const FORBIDDEN: readonly { readonly pattern: RegExp; readonly what: string }[] = [
  { pattern: /<\s*script\b/i, what: "<script>" },
  { pattern: /<\s*iframe\b/i, what: "<iframe>" },
  { pattern: /<\s*object\b/i, what: "<object>" },
  { pattern: /<\s*embed\b/i, what: "<embed>" },
  { pattern: /<\s*base\b/i, what: "<base>" },
  { pattern: /<\s*(link|meta)\b/i, what: "<link>/<meta>" },
  { pattern: /<\s*form\b[^>]*\bformaction\s*=/i, what: "formaction" },
  { pattern: /\son[a-z]+\s*=\s*["']?[^"'>\s]/i, what: "an inline event handler" },
  { pattern: /(?:href|src|action|xlink:href)\s*=\s*["']?\s*(?:javascript|vbscript|data)\s*:/i, what: "a script-bearing URL" },
];

function assertTrustedHtml(html: string, where: string): string | null {
  for (const { pattern, what } of FORBIDDEN) {
    if (pattern.test(html)) {
      // Loud on the server, absent from the page. §11: fail safely and
      // observably, without taking down the rest of the page.
      console.error(
        `[cms] Refused to render ${where}: content contained ${what}, which the CMS should have removed on save. The section was dropped.`,
      );
      return null;
    }
  }
  return html;
}

/**
 * Elements a CMS node is allowed to render as.
 *
 * The tag name comes from the CMS, so it is input. Without this, a crafted
 * `tag` of `script` would have this renderer build the very element the markup
 * checks exist to prevent.
 */
const ALLOWED_TAGS: ReadonlySet<string> = new Set([
  "section",
  "div",
  "article",
  "aside",
  "header",
  "footer",
  "nav",
  "figure",
  "ul",
  "ol",
  "dl",
  "p",
  "span",
]);

function safeTag(tag: string, fallback: string): string {
  const lower = tag.toLowerCase();
  return ALLOWED_TAGS.has(lower) ? lower : fallback;
}

/**
 * Class names from the CMS.
 *
 * Joined and filtered to the character set a design token can legitimately
 * use. This is not a security boundary — `class` cannot execute — it is a
 * correctness one: a stray quote or angle bracket in a class attribute would
 * be a sign of corrupted content, and passing it through would produce markup
 * nobody intended.
 */
function safeClassName(variant: readonly string[]): string | undefined {
  const tokens = variant.filter((token) => /^[A-Za-z0-9_-]+$/.test(token));
  return tokens.length > 0 ? tokens.join(" ") : undefined;
}

/**
 * Turn the CMS's attribute map into React props.
 *
 * The attributes are reproduced rather than reconstructed. An earlier version
 * synthesised `aria-label` from the section's editor label, which quietly
 * replaced the design's `aria-labelledby` and changed the accessible name of
 * every section on the site. Copying what WordPress renders removes the class
 * of bug entirely.
 *
 * `style` is parsed into an object because React rejects a string there. The
 * CSS custom properties this design animates with (`--reveal-delay`) must be
 * passed through under their own names, which React supports.
 */
function toReactProps(attributes: CmsAttributes): Record<string, unknown> {
  const props: Record<string, unknown> = {};

  for (const [name, value] of Object.entries(attributes)) {
    if (name === "class") {
      props.className = value;
    } else if (name === "style") {
      props.style = parseStyle(value);
    } else if (name === "tabindex") {
      const index = Number.parseInt(value, 10);
      if (Number.isFinite(index)) {
        props.tabIndex = index;
      }
    } else if (name === "hidden") {
      props.hidden = true;
    } else {
      props[name] = value;
    }
  }

  return props;
}

function parseStyle(value: string): Record<string, string> {
  const style: Record<string, string> = {};
  for (const declaration of value.split(";")) {
    const at = declaration.indexOf(":");
    if (at < 1) {
      continue;
    }
    const property = declaration.slice(0, at).trim();
    const setting = declaration.slice(at + 1).trim();
    if (property === "") {
      continue;
    }
    style[
      property.startsWith("--")
        ? property
        : property.replace(/-([a-z])/g, (_, character: string) => character.toUpperCase())
    ] = setting;
  }
  return style;
}

/**
 * Render a container's children.
 *
 * When every child is a leaf that carries its own resolved markup — which is
 * the common case, since the design's wrappers hold content rather than more
 * wrappers — the markup is injected into the container element itself. That
 * produces exactly the element tree WordPress produces.
 *
 * The alternative, wrapping each leaf in its own element, inserts a `<div>`
 * that the approved stylesheet has no rule for. `display: contents` keeps it
 * out of the layout box tree so it does no visible harm, but "does no visible
 * harm" is a weaker claim than "is not there", and this renderer is verified
 * against WordPress's output section by section.
 */
function renderChildren(children: readonly CmsNode[]): {
  readonly html: string | null;
  readonly nodes: React.ReactElement;
} {
  const leaves = children.every(
    (child) => child.type === "content" || child.type === "preserved" || child.type === "core",
  );

  if (leaves && children.length > 0) {
    const combined = children.map((child) => (child as { html: string }).html).join("");
    return { html: assertTrustedHtml(combined, "container contents"), nodes: <BlockList nodes={children} /> };
  }

  return { html: null, nodes: <BlockList nodes={children} /> };
}

function SectionNode({ node }: { readonly node: CmsSectionNode }): React.ReactElement {
  const Tag = safeTag(node.tag, "section") as "section";
  const props = toReactProps(node.attributes);
  if (props.className === undefined) {
    props.className = safeClassName(node.variant);
  }

  const { html, nodes } = renderChildren(node.children);
  if (html !== null) {
    return <Tag {...props} dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return <Tag {...props}>{nodes}</Tag>;
}

function GroupNode({ node }: { readonly node: CmsGroupNode }): React.ReactElement {
  const Tag = safeTag(node.tag, "div") as "div";
  const props = toReactProps(node.attributes);
  if (props.className === undefined) {
    props.className = safeClassName(node.variant);
  }

  const { html, nodes } = renderChildren(node.children);
  if (html !== null) {
    return <Tag {...props} dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return <Tag {...props}>{nodes}</Tag>;
}

function CollectionNode({ node }: { readonly node: CmsCollectionNode }): React.ReactElement | null {
  // An emptied collection renders nothing, matching the PHP renderer: removing
  // every card should remove the grid, not leave an empty bordered panel.
  if (node.items.length === 0) {
    return null;
  }

  const Tag = safeTag(node.tag, "ul") as "ul";
  const props = toReactProps(node.attributes);
  if (props.className === undefined) {
    props.className = safeClassName(node.variant);
  }

  // The items are complete `<li>` elements, so their markup is concatenated and
  // injected into the list itself. Wrapping each one would put a `<div>`
  // between the `<ul>` and its `<li>`, which is invalid and breaks the grid.
  const html = assertTrustedHtml(node.items.map((item) => item.html).join(""), "collection items");
  if (html === null) {
    return null;
  }

  return <Tag {...props} dangerouslySetInnerHTML={{ __html: html }} />;
}

function ContentNode({ node }: { readonly node: CmsContentNode }): React.ReactElement | null {
  const html = assertTrustedHtml(node.html, "content block");
  return html === null ? null : <CmsFragment html={html} />;
}

function PreservedNode({ node }: { readonly node: CmsPreservedNode }): React.ReactElement | null {
  const html = assertTrustedHtml(node.html, "preserved markup");
  return html === null ? null : <CmsFragment html={html} />;
}

function CoreNode({ node }: { readonly node: CmsCoreNode }): React.ReactElement | null {
  const html = assertTrustedHtml(node.html, `core block ${node.name}`);
  return html === null ? null : <CmsFragment html={html} />;
}

/**
 * Inject a complete markup fragment.
 *
 * React has no way to render a fragment of HTML without a host element, so a
 * `<div>` here would insert a wrapper the approved stylesheet does not expect —
 * enough to break a grid or a flex row. `dangerouslySetInnerHTML` on a
 * container is unavoidable; what is avoidable is *which* container, so this
 * uses `display: contents`, which removes the wrapper from the layout box tree
 * entirely while keeping it in the DOM.
 */
function CmsFragment({ html }: { readonly html: string }): React.ReactElement {
  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** The allowlist. A node type absent from here does not render. */
function renderNode(node: CmsNode, key: number): React.ReactElement | null {
  switch (node.type) {
    case "section":
      return <SectionNode key={key} node={node} />;
    case "group":
      return <GroupNode key={key} node={node} />;
    case "collection":
      return <CollectionNode key={key} node={node} />;
    case "content":
      return <ContentNode key={key} node={node} />;
    case "preserved":
      return <PreservedNode key={key} node={node} />;
    case "core":
      return <CoreNode key={key} node={node} />;
    default: {
      // Exhaustiveness: if a node type is added to the schema and not handled
      // here, this fails to compile rather than silently dropping content in
      // production.
      const unreachable: never = node;
      console.error(`[cms] Unhandled node type`, unreachable);
      return null;
    }
  }
}

export function BlockList({ nodes }: { readonly nodes: readonly CmsNode[] }): React.ReactElement {
  return <>{nodes.map((node, index) => renderNode(node, index))}</>;
}

export function BlockRenderer({ blocks }: { readonly blocks: readonly CmsNode[] }): React.ReactElement {
  return <BlockList nodes={blocks} />;
}

export default BlockRenderer;
