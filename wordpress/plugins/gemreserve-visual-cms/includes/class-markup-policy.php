<?php
/**
 * What markup a block may carry.
 *
 * A `gemreserve/content` block renders its `template` attribute, and a
 * `gemreserve/section` renders its stored start tag. Both are attributes in
 * `post_content`, which means anyone with `edit_pages` can set them through the
 * REST API. Without a policy, "edit this page's words" would be
 * indistinguishable from "run JavaScript on gemreserve.io".
 *
 * WordPress's own defence does not cover this. `wp_filter_post_kses` sanitises
 * post content for users without `unfiltered_html`, but block attributes are
 * serialised with `<` and `>` escaped as `<` / `>` precisely so that
 * kses leaves the block comment alone — the escaping that protects legitimate
 * block attributes from being mangled is the same escaping that carries a
 * `<script>` straight past the filter. This was verified rather than assumed:
 * an `<img src=x onerror=alert(1)>` in a template reached the rendered page.
 *
 * So this is the policy, applied on save to every markup-bearing attribute of
 * every block, for every user who does not hold `unfiltered_html`:
 *
 *   - a closed element allowlist covering exactly what the approved design uses
 *   - a closed attribute allowlist per element
 *   - `data-*` and `aria-*` allowed as wildcards; both are inert
 *   - no `script`, `iframe`, `object`, `embed`, `link`, `meta`, `base`, `style`
 *   - no `on*` handlers, which follows from the attribute allowlist
 *   - `href`/`src`/`action` restricted to safe schemes by wp_kses's own
 *     `wp_kses_bad_protocol`
 *
 * The list is derived from the markup on the site, not from imagination: it was
 * built by enumerating every element and attribute across the 40 migrated page
 * bodies, then checked by confirming that running all 1,854 migrated templates
 * through this filter leaves every one of them byte-identical. A policy that
 * silently rewrote the approved design would be worse than no policy, because
 * the damage would be invisible.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class MarkupPolicy
{
    /**
     * Attributes every element may carry.
     *
     * @return array<string,bool>
     */
    private static function common(): array
    {
        return [
            'class' => true,
            'id' => true,
            'style' => true,
            'title' => true,
            'role' => true,
            'hidden' => true,
            'tabindex' => true,
            'lang' => true,
            'dir' => true,
            'spellcheck' => true,
            'translate' => true,
            'inert' => true,
            'data-*' => true,
        ] + self::aria();
    }

    /**
     * ARIA attributes.
     *
     * Listed rather than wildcarded because wp_kses supports a `data-*`
     * wildcard and nothing equivalent for `aria-*`. That is not obvious, and
     * getting it wrong is quiet: an `aria-*` wildcard is simply ignored, the
     * attributes are stripped, and the site loses its accessible labelling
     * without any error. It was caught by asserting that the policy leaves the
     * real markup unchanged — 675 attributes were being rewritten, almost all
     * of them ARIA.
     *
     * This is every ARIA attribute the approved design uses, plus the handful a
     * new section would plausibly need.
     *
     * @return array<string,bool>
     */
    private static function aria(): array
    {
        $names = [
            'label', 'labelledby', 'describedby', 'hidden', 'live', 'atomic',
            'busy', 'controls', 'expanded', 'selected', 'disabled', 'pressed',
            'checked', 'current', 'orientation', 'invalid', 'required',
            'haspopup', 'level', 'modal', 'placeholder', 'readonly',
            'roledescription', 'setsize', 'posinset', 'valuemin', 'valuemax',
            'valuenow', 'valuetext', 'owns', 'flowto', 'details', 'errormessage',
            'keyshortcuts', 'relevant', 'sort', 'multiselectable',
        ];

        $out = [];
        foreach ($names as $name) {
            $out['aria-' . $name] = true;
        }

        return $out;
    }

    /**
     * The allowed elements and their attributes.
     *
     * @return array<string,array<string,bool>>
     */
    public static function allowed(): array
    {
        $common = self::common();

        $structural = [
            'section', 'div', 'span', 'p', 'article', 'aside', 'header', 'footer',
            'nav', 'figure', 'figcaption', 'main', 'blockquote', 'address',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'dl', 'dt', 'dd',
            'strong', 'b', 'em', 'i', 'small', 'sup', 'sub', 'mark', 'u', 's',
            'br', 'hr', 'code', 'pre', 'abbr', 'time', 'cite', 'q', 'del', 'ins',
            'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
            'colgroup', 'col', 'details', 'summary', 'picture', 'label', 'fieldset', 'legend',
        ];

        $allowed = [];
        foreach ($structural as $tag) {
            $allowed[$tag] = $common;
        }

        // Per-element extras. Everything here is presentational or structural;
        // nothing accepts a URL that is not run through wp_kses_bad_protocol.
        $allowed['a'] = $common + ['href' => true, 'target' => true, 'rel' => true, 'download' => true, 'hreflang' => true];
        $allowed['img'] = $common + [
            'src' => true, 'alt' => true, 'width' => true, 'height' => true,
            'srcset' => true, 'sizes' => true, 'loading' => true, 'decoding' => true,
            'fetchpriority' => true, 'referrerpolicy' => true,
        ];
        $allowed['source'] = $common + ['src' => true, 'srcset' => true, 'sizes' => true, 'type' => true, 'media' => true];
        $allowed['video'] = $common + ['src' => true, 'poster' => true, 'width' => true, 'height' => true, 'controls' => true, 'autoplay' => true, 'loop' => true, 'muted' => true, 'playsinline' => true, 'preload' => true];
        $allowed['audio'] = $common + ['src' => true, 'controls' => true, 'preload' => true, 'loop' => true, 'muted' => true];
        $allowed['track'] = $common + ['src' => true, 'kind' => true, 'srclang' => true, 'label' => true, 'default' => true];
        $allowed['th'] += ['scope' => true, 'colspan' => true, 'rowspan' => true, 'abbr' => true];
        $allowed['td'] += ['colspan' => true, 'rowspan' => true, 'headers' => true];
        $allowed['col'] += ['span' => true];
        $allowed['colgroup'] += ['span' => true];
        $allowed['time'] += ['datetime' => true];
        $allowed['ol'] += ['start' => true, 'reversed' => true, 'type' => true];
        $allowed['details'] += ['open' => true];
        $allowed['label'] += ['for' => true];
        $allowed['blockquote'] += ['cite' => true];
        $allowed['q'] += ['cite' => true];
        $allowed['del'] += ['cite' => true, 'datetime' => true];
        $allowed['ins'] += ['cite' => true, 'datetime' => true];

        /*
         * Forms.
         *
         * The waitlist, contact and ID-lookup forms are part of the approved
         * design and are activated by gemreserve-core's form handler, so form
         * elements have to survive. `action` and `formaction` are deliberately
         * absent: gemreserve-core sets the action itself, and allowing an editor
         * to set one would let a page post its visitors' details to any host.
         */
        $allowed['form'] = $common + ['method' => true, 'novalidate' => true, 'autocomplete' => true, 'name' => true, 'target' => true];
        $allowed['input'] = $common + [
            'type' => true, 'name' => true, 'value' => true, 'placeholder' => true,
            'required' => true, 'disabled' => true, 'readonly' => true, 'checked' => true,
            'min' => true, 'max' => true, 'step' => true, 'maxlength' => true, 'minlength' => true,
            'pattern' => true, 'autocomplete' => true, 'inputmode' => true, 'list' => true,
        ];
        $allowed['textarea'] = $common + ['name' => true, 'rows' => true, 'cols' => true, 'placeholder' => true, 'required' => true, 'maxlength' => true, 'disabled' => true, 'readonly' => true, 'autocomplete' => true];
        $allowed['select'] = $common + ['name' => true, 'required' => true, 'multiple' => true, 'disabled' => true, 'size' => true, 'autocomplete' => true];
        $allowed['option'] = $common + ['value' => true, 'selected' => true, 'disabled' => true, 'label' => true];
        $allowed['optgroup'] = $common + ['label' => true, 'disabled' => true];
        $allowed['button'] = $common + ['type' => true, 'name' => true, 'value' => true, 'disabled' => true];
        $allowed['datalist'] = $common;

        /*
         * SVG.
         *
         * Every icon on this site is inline SVG, so stripping it would erase the
         * design. The element and attribute lists are the same closed ones
         * Renderer::sanitize_icon uses, for the same reasons: no `script`, no
         * `foreignObject`, no `use`, no `image`, no external references.
         */
        $svg_common = ['class' => true, 'id' => true, 'role' => true, 'data-*' => true, 'focusable' => true] + self::aria();
        $svg = [
            'svg' => $svg_common + ['xmlns' => true, 'viewbox' => true, 'width' => true, 'height' => true, 'fill' => true, 'stroke' => true, 'stroke-width' => true, 'stroke-linecap' => true, 'stroke-linejoin' => true, 'preserveaspectratio' => true],
            'g' => $svg_common + ['fill' => true, 'stroke' => true, 'transform' => true, 'opacity' => true, 'clip-path' => true, 'mask' => true],
            'path' => $svg_common + ['d' => true, 'fill' => true, 'stroke' => true, 'stroke-width' => true, 'stroke-linecap' => true, 'stroke-linejoin' => true, 'stroke-dasharray' => true, 'stroke-dashoffset' => true, 'opacity' => true, 'fill-rule' => true, 'clip-rule' => true, 'transform' => true, 'marker-end' => true, 'marker-start' => true, 'marker-mid' => true],
            'circle' => $svg_common + ['cx' => true, 'cy' => true, 'r' => true, 'fill' => true, 'stroke' => true, 'stroke-width' => true, 'stroke-dasharray' => true, 'opacity' => true, 'transform' => true, 'marker-end' => true],
            'ellipse' => $svg_common + ['cx' => true, 'cy' => true, 'rx' => true, 'ry' => true, 'fill' => true, 'stroke' => true, 'stroke-width' => true, 'transform' => true],
            'rect' => $svg_common + ['x' => true, 'y' => true, 'width' => true, 'height' => true, 'rx' => true, 'ry' => true, 'fill' => true, 'stroke' => true, 'stroke-width' => true, 'transform' => true, 'opacity' => true],
            'line' => $svg_common + ['x1' => true, 'y1' => true, 'x2' => true, 'y2' => true, 'stroke' => true, 'stroke-width' => true, 'stroke-linecap' => true, 'stroke-dasharray' => true, 'transform' => true],
            'polyline' => $svg_common + ['points' => true, 'fill' => true, 'stroke' => true, 'stroke-width' => true, 'stroke-linejoin' => true, 'stroke-linecap' => true],
            'polygon' => $svg_common + ['points' => true, 'fill' => true, 'stroke' => true, 'stroke-width' => true, 'stroke-linejoin' => true, 'opacity' => true],
            'text' => $svg_common + ['x' => true, 'y' => true, 'dx' => true, 'dy' => true, 'fill' => true, 'text-anchor' => true, 'dominant-baseline' => true, 'font-size' => true, 'font-family' => true, 'font-weight' => true, 'letter-spacing' => true, 'transform' => true],
            'tspan' => $svg_common + ['x' => true, 'y' => true, 'dx' => true, 'dy' => true, 'fill' => true, 'font-size' => true, 'font-weight' => true],
            'defs' => $svg_common,
            'lineargradient' => $svg_common + ['x1' => true, 'y1' => true, 'x2' => true, 'y2' => true, 'gradientunits' => true, 'gradienttransform' => true],
            'radialgradient' => $svg_common + ['cx' => true, 'cy' => true, 'r' => true, 'fx' => true, 'fy' => true, 'gradientunits' => true],
            'stop' => $svg_common + ['offset' => true, 'stop-color' => true, 'stop-opacity' => true],
            'clippath' => $svg_common,
            'mask' => $svg_common,
            'marker' => $svg_common + ['markerwidth' => true, 'markerheight' => true, 'markerunits' => true, 'orient' => true, 'refx' => true, 'refy' => true, 'viewbox' => true],
            'symbol' => $svg_common + ['viewbox' => true],
            'title' => $svg_common,
            'desc' => $svg_common,
        ];

        return $allowed + $svg;
    }

    /**
     * Apply the policy to a markup string.
     *
     * Slot placeholders are masked before filtering and restored afterwards.
     * They have to be: an unmasked placeholder in `src=` is examined by
     * `wp_kses_bad_protocol`, which finds no safe scheme and truncates the
     * value. That silently broke 265 image templates before the mask was
     * added. (The placeholder syntax itself was also changed for a related
     * reason — see SlotEngine::OPEN.) The mask is a plain
     * alphanumeric token, which is inert in text, attribute and URL positions
     * alike, so kses has no opinion about it.
     */
    public static function filter(string $markup): string
    {
        if ($markup === '') {
            return '';
        }

        $masked = self::mask($markup);
        $filtered = wp_kses($masked, self::allowed(), ['http', 'https', 'mailto', 'tel']);

        return self::unmask(self::restore_svg_case($filtered));
    }

    /**
     * Put the camel case back into SVG names that kses lowercased.
     *
     * wp_kses normalises element and attribute names to lower case, which is
     * correct for HTML and wrong for SVG, where `viewBox` and `viewbox` are
     * different names. Browsers paper over it — the HTML parser has a case
     * adjustment table for foreign content — so the rendered result is the same
     * either way, but the *bytes* are not, and byte identity is the property
     * this whole migration is verified against. Restoring the case keeps the
     * policy genuinely non-destructive rather than merely harmless.
     */
    private static function restore_svg_case(string $markup): string
    {
        static $names = [
            'viewbox' => 'viewBox',
            'preserveaspectratio' => 'preserveAspectRatio',
            'gradientunits' => 'gradientUnits',
            'gradienttransform' => 'gradientTransform',
            'markerwidth' => 'markerWidth',
            'markerheight' => 'markerHeight',
            'markerunits' => 'markerUnits',
            'refx' => 'refX',
            'refy' => 'refY',
            'clippathunits' => 'clipPathUnits',
            'maskunits' => 'maskUnits',
            'maskcontentunits' => 'maskContentUnits',
            'patternunits' => 'patternUnits',
            'patterntransform' => 'patternTransform',
            'spreadmethod' => 'spreadMethod',
            'startoffset' => 'startOffset',
            'textlength' => 'textLength',
            'lengthadjust' => 'lengthAdjust',
            'pathlength' => 'pathLength',
        ];

        static $elements = [
            'lineargradient' => 'linearGradient',
            'radialgradient' => 'radialGradient',
            'clippath' => 'clipPath',
            'foreignobject' => 'foreignObject', // Not allowed through; listed for completeness.
            'textpath' => 'textPath',
        ];

        foreach ($names as $lower => $proper) {
            $markup = (string) preg_replace('/\b' . $lower . '=/', $proper . '=', $markup);
        }
        foreach ($elements as $lower => $proper) {
            $markup = (string) preg_replace('#<' . $lower . '\b#', '<' . $proper, $markup);
            $markup = (string) str_replace('</' . $lower . '>', '</' . $proper . '>', $markup);
        }

        return $markup;
    }

    private static function mask(string $markup): string
    {
        return (string) preg_replace('/\{\{gr_([A-Za-z0-9_]+)\}\}/', 'grxslot$1xslotend', $markup);
    }

    private static function unmask(string $markup): string
    {
        // Non-greedy: two adjacent placeholders mask to
        // `grxslotc1xslotendgrxslotc3xslotend`, and a greedy match swallows the
        // boundary and returns one mangled key instead of two.
        return (string) preg_replace('/grxslot([A-Za-z0-9_]+?)xslotend/', '{{gr_$1}}', $markup);
    }

    /**
     * Apply the policy to a fragment that may be an unbalanced tag.
     *
     * `gemreserve/section` and `gemreserve/wrapper` store their start and end
     * tags separately, so neither is a well-formed fragment on its own. kses
     * discards a lone `</div>` and mangles a lone `<section …>`, so each is
     * temporarily balanced, filtered, and cut back down.
     */
    public static function filter_fragment(string $fragment): string
    {
        $trimmed = trim($fragment);
        if ($trimmed === '') {
            return $fragment;
        }

        // A closing tag on its own: allow it if the element is allowed at all.
        if (preg_match('#^</([a-zA-Z][a-zA-Z0-9-]*)>$#', $trimmed, $m)) {
            return array_key_exists(strtolower($m[1]), self::allowed()) ? $fragment : '';
        }

        // A start tag on its own: balance it, filter, then take the start tag back.
        if (preg_match('#^<([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>$#', $trimmed, $m)) {
            $tag = strtolower($m[1]);
            $balanced = self::filter($trimmed . '</' . $tag . '>');
            $at = strpos($balanced, '>');

            return $at === false ? '' : substr($balanced, 0, $at + 1);
        }

        return self::filter($fragment);
    }

    /**
     * Would this markup survive the policy unchanged?
     *
     * Used by the test suite to assert that the policy never rewrites the
     * approved design.
     */
    public static function is_clean(string $markup): bool
    {
        return self::filter_fragment($markup) === $markup;
    }
}
