/**
 * Renderer parity: WordPress theme output vs the Next.js block renderer.
 *
 * Both renderers consume the same block tree — one in PHP for the live site,
 * one in React for the headless path. This asserts they agree, section by
 * section, on the real content of all 58 routes. Without it, "the Next.js
 * renderer is ready for cutover" would be an opinion.
 *
 * Three differences are normalised, and each is a serialisation artefact rather
 * than a rendering one. They are named here rather than quietly stripped,
 * because a comparison that hides differences proves nothing:
 *
 *   `/>` vs `>`      React self-closes void elements (`<br/>`); the PHP
 *                    serialiser writes `<br>`. Identical to every HTML parser.
 *
 *   `<!-- -->`       React emits a comment between adjacent text nodes so it
 *                    can find them again when hydrating. Not rendered.
 *
 *   gr_t / gr_nonce  The form issue timestamp and CSRF nonce, both stamped per
 *                    request. Two captures taken seconds apart legitimately
 *                    differ; a page whose nonce never changed would be the bug.
 *
 *   display:contents A `<div style="display:contents">` React inserts where a
 *                    container holds a mix of injected markup and child
 *                    elements. React cannot render a fragment of HTML without
 *                    a host element, and `display: contents` removes that
 *                    element from the layout box tree entirely, so it has no
 *                    effect on layout, and none on the accessibility tree —
 *                    it carries no role and no name. Where a container's
 *                    children are all markup, the renderer injects into the
 *                    container itself and no wrapper appears at all; this
 *                    normalisation covers only the mixed case.
 *
 * Nothing else is normalised. Attribute order, class lists, whitespace, SVG
 * path data, `srcset` contents and generated ids are compared exactly.
 *
 * Usage:
 *   node qa/cms/renderer-parity.mjs <wordpress-base> <next-base> [routes-file]
 */

import { readFileSync } from "node:fs";

const wordpressBase = (process.argv[2] ?? "http://127.0.0.1:8899").replace(/\/$/, "");
const nextBase = (process.argv[3] ?? "http://127.0.0.1:3400").replace(/\/$/, "");
const routesFile = process.argv[4];

async function get(url) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

/** Top-level <section> elements, in document order. */
function sections(html) {
  const out = [];
  let index = 0;
  for (;;) {
    const start = html.indexOf("<section", index);
    if (start === -1) {
      break;
    }
    let depth = 0;
    let end = html.length;
    const tags = /<\/?section\b/g;
    tags.lastIndex = start;
    let match;
    while ((match = tags.exec(html)) !== null) {
      depth += match[0].startsWith("</") ? -1 : 1;
      if (depth === 0) {
        end = html.indexOf(">", match.index) + 1;
        break;
      }
    }
    out.push(html.slice(start, end));
    index = end;
  }
  return out;
}

/**
 * Remove React's `display:contents` wrappers and their matching closers.
 *
 * Each wrapper's own `</div>` has to be found by balancing, not guessed at. An
 * earlier version removed one `</div>` per wrapper from the end of the string,
 * on the reasoning that the run's own closers are all inside the wrapper. That
 * is true and still wrong: the wrapper is not the last thing in the section, so
 * the closer removed belonged to a later sibling. Every comparison then failed
 * one `</div>` after the wrapper, with both sides the same length — which is
 * exactly what a normalisation bug looks like from the outside, and why this
 * one is worth spelling out.
 */
function stripWrappers(markup) {
  const OPEN = '<div style="display:contents">';
  let out = markup;

  for (;;) {
    const start = out.indexOf(OPEN);
    if (start === -1) {
      return out;
    }

    // Walk forward from just after the wrapper's start tag, tracking div depth,
    // to find the `</div>` that closes it.
    let depth = 1;
    const tags = /<div\b[^>]*>|<\/div>/g;
    tags.lastIndex = start + OPEN.length;
    let close = -1;
    let match;
    while ((match = tags.exec(out)) !== null) {
      depth += match[0] === "</div>" ? -1 : 1;
      if (depth === 0) {
        close = match.index;
        break;
      }
    }

    if (close === -1) {
      // Unbalanced: leave it alone rather than corrupt the comparison.
      return out;
    }

    out =
      out.slice(0, start) +
      out.slice(start + OPEN.length, close) +
      out.slice(close + "</div>".length);
  }
}

/**
 * Values that legitimately differ between two captures taken seconds apart.
 *
 * `gr_t` is the form's issue timestamp, used for the submission time window,
 * and it is stamped per request. The CSRF nonce beside it is normalised for the
 * same reason, though in practice it matches — WordPress nonces are stable
 * within their tick, so a difference there would be worth looking at rather
 * than hiding, and normalising it costs nothing while making the tool correct
 * across a tick boundary.
 */
function normaliseVolatile(markup) {
  return markup
    .replace(/(name="gr_t"[^>]*value=")[^"]*"/g, '$1NORMALISED"')
    .replace(/(name="gr_nonce"[^>]*value=")[^"]*"/g, '$1NORMALISED"')
    .replace(/(id="gr_nonce"[^>]*value=")[^"]*"/g, '$1NORMALISED"');
}

function canonical(markup) {
  return normaliseVolatile(stripWrappers(markup.replace(/\s*\/>/g, ">").replaceAll("<!-- -->", "")));
}

const routes = routesFile
  ? readFileSync(routesFile, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
  : ["/governance/", "/about/", "/faq/"];

let totalSections = 0;
let identical = 0;
let mismatchedRoutes = 0;
const failures = [];

for (const route of routes) {
  const slug = route.replace(/^\/|\/$/g, "");
  let wpHtml;
  let nextHtml;
  try {
    wpHtml = await get(`${wordpressBase}${route}`);
    nextHtml = await get(`${nextBase}/cms/${slug}`);
  } catch (error) {
    failures.push(`${route}: ${error.message}`);
    mismatchedRoutes += 1;
    continue;
  }

  // The claim under test is about the *block* sections, and a WordPress page
  // renders more than those: the hero, the gemstone specification panel, and
  // any editor prose all come from the template rather than from post_content.
  // Comparing index by index therefore fails on a difference that is not a
  // difference — it just means WordPress drew something the block renderer was
  // never asked to draw.
  //
  // So the assertion is a subsequence one: every section the renderer produces
  // must appear among WordPress's, byte-identical, in the same order. That is
  // the strongest true statement, and it still catches a single wrong
  // character anywhere in any block-rendered section.
  const wpSections = sections(wpHtml).map(canonical);
  const nextSections = sections(nextHtml).map(canonical);

  let cursor = 0;
  let matched = 0;
  let firstMissing = -1;

  for (let i = 0; i < nextSections.length; i += 1) {
    totalSections += 1;
    const at = wpSections.indexOf(nextSections[i], cursor);
    if (at === -1) {
      if (firstMissing === -1) {
        firstMissing = i;
      }
      continue;
    }
    cursor = at + 1;
    matched += 1;
    identical += 1;
  }

  if (matched !== nextSections.length || nextSections.length === 0) {
    mismatchedRoutes += 1;
    failures.push(
      nextSections.length === 0
        ? `${route}: the renderer produced no sections (wp=${wpSections.length})`
        : `${route}: ${matched}/${nextSections.length} rendered sections found in the WordPress output (wp had ${wpSections.length}); first unmatched at index ${firstMissing}`,
    );
  }
}

console.log(`routes checked   : ${routes.length}`);
console.log(`sections compared: ${totalSections}`);
console.log(`sections identical: ${identical}`);
console.log(`routes with a mismatch: ${mismatchedRoutes}`);
if (failures.length > 0) {
  console.log("\nmismatches:");
  for (const line of failures.slice(0, 20)) {
    console.log(`  ${line}`);
  }
}

process.exit(mismatchedRoutes === 0 ? 0 : 1);
