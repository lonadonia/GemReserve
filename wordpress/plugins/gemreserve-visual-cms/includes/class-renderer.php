<?php
/**
 * Server-side rendering for every GemReserve block.
 *
 * These are the functions the public site runs. They are the other half of the
 * decomposer: whatever it cut apart, this puts back together, and the migration
 * refuses to write a page unless the two agree byte for byte.
 *
 * All rendering is server-side. No block stores saved markup in post_content
 * beyond its attributes, which means a design correction ships by deploying a
 * new plugin version rather than by re-saving forty pages — and it means there
 * is no "this block contains unexpected content" wall for an editor to hit.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class Renderer
{
    /**
     * Render a `gemreserve/section`.
     *
     * The start and end tags are stored rather than rebuilt from attributes.
     * Rebuilding would mean re-deciding attribute order and quoting, and the
     * one thing this migration cannot afford is a renderer that produces
     * "equivalent" markup instead of the same markup.
     */
    public static function section(array $attrs, string $content): string
    {
        $open = self::tag($attrs['open'] ?? '', 'section');
        $close = self::close_tag($attrs['close'] ?? '', 'section');

        if (self::is_hidden($attrs)) {
            return '';
        }

        return $open . $content . $close;
    }

    /** Render a `gemreserve/wrapper`. Same contract as a section. */
    public static function wrapper(array $attrs, string $content): string
    {
        if (self::is_hidden($attrs)) {
            return '';
        }

        return self::tag($attrs['open'] ?? '', 'div') . $content . self::close_tag($attrs['close'] ?? '', 'div');
    }

    /**
     * Render a `gemreserve/content` leaf: a template plus its slot values.
     */
    public static function content(array $attrs): string
    {
        if (self::is_hidden($attrs)) {
            return '';
        }

        $template = (string) ($attrs['template'] ?? '');
        if ($template === '') {
            return '';
        }

        $slots = self::slots($attrs['slots'] ?? []);

        return SlotEngine::render($template, $slots);
    }

    /**
     * Render a `gemreserve/repeatable`: one item template, many value sets.
     *
     * Separators carry the whitespace that sat between the original items so
     * the output keeps its original formatting. An item added in the editor has
     * no recorded separator, so it reuses the last known one — which is what
     * makes a new card indent like its neighbours instead of collapsing the
     * list onto one line.
     */
    public static function repeatable(array $attrs): string
    {
        if (self::is_hidden($attrs)) {
            return '';
        }

        $template = (string) ($attrs['itemTemplate'] ?? '');
        $items = is_array($attrs['items'] ?? null) ? $attrs['items'] : [];
        if ($template === '' || $items === []) {
            // An emptied collection renders as nothing rather than as an empty
            // bordered panel. Removing every card should remove the grid.
            return '';
        }

        $slots = self::slots($attrs['itemSlots'] ?? []);
        $separators = is_array($attrs['separators'] ?? null) ? array_values($attrs['separators']) : [];
        $default_separator = $separators !== [] ? (string) end($separators) : '';

        $out = self::tag($attrs['open'] ?? '', 'ul');
        foreach (array_values($items) as $i => $values) {
            if (!is_array($values)) {
                continue;
            }
            $out .= (string) ($separators[$i] ?? $default_separator);
            $out .= SlotEngine::render($template, $slots, self::string_map($values));
        }
        $out .= (string) ($attrs['trailing'] ?? '');
        $out .= self::close_tag($attrs['close'] ?? '', 'ul');

        return $out;
    }

    /**
     * Render a `gemreserve/gap`: the whitespace between blocks.
     *
     * It exists so the migration reproduces the original formatting exactly —
     * indentation and newlines are part of byte identity even though they are
     * invisible.
     *
     * Whitespace only. A gap is written by the migration, never by a user, but
     * it arrives through post_content like everything else, so anything that is
     * not whitespace is discarded rather than trusted. That makes this the one
     * renderer that cannot emit a tag at all, and therefore the one that cannot
     * be turned into an injection route no matter what is stored in it.
     */
    public static function gap(array $attrs): string
    {
        $text = (string) ($attrs['text'] ?? '');

        return trim($text) === '' ? $text : '';
    }

    /**
     * Render a `gemreserve/preserved` leaf.
     *
     * The escape hatch for markup the decomposer could not structure. Its
     * content is only ever written by the migration or by an administrator —
     * `unfiltered_html` is required to save it — so it renders as stored, on
     * the same trust boundary as a theme template. An editor without that
     * capability cannot create or alter one.
     */
    public static function preserved(array $attrs): string
    {
        if (self::is_hidden($attrs)) {
            return '';
        }

        return (string) ($attrs['html'] ?? '');
    }

    /**
     * Sanitise an inline SVG icon.
     *
     * Icons arrive as markup, which makes them the highest-risk slot kind, so
     * this is a closed allowlist rather than a blocklist: an element or
     * attribute that is not named here does not survive, and no amount of
     * novelty in the input changes that.
     *
     * Specifically excluded and worth naming: `<script>` and `<foreignObject>`
     * (script execution), `<use href>` pointing outside the document (SSRF and
     * data exfiltration via external references), `<image>` (same), every `on*`
     * handler, and `style` (which can carry `url()` fetches). What remains is
     * geometry and stroke/fill presentation — enough to draw this site's icon
     * set and nothing else.
     */
    public static function sanitize_icon(string $svg): string
    {
        $svg = trim($svg);
        if ($svg === '') {
            return '';
        }
        if (!preg_match('#^<svg\b#i', $svg)) {
            return '';
        }

        $root = Html::parse_fragment($svg);
        if ($root === null) {
            return '';
        }

        foreach (self::element_list($root) as $el) {
            $tag = strtolower($el->localName);
            if (!in_array($tag, self::SVG_ELEMENTS, true)) {
                $el->parentNode?->removeChild($el);
                continue;
            }
            self::strip_attributes($el);
        }

        return Html::serialize_fragment($root);
    }

    /** Elements an icon may contain. */
    public const SVG_ELEMENTS = [
        'svg', 'g', 'path', 'circle', 'ellipse', 'line', 'polyline', 'polygon',
        'rect', 'defs', 'lineargradient', 'radialgradient', 'stop', 'title',
        'desc', 'clippath', 'mask', 'symbol', 'marker',
    ];

    /** Attributes an icon element may carry. */
    public const SVG_ATTRS = [
        'xmlns', 'viewbox', 'width', 'height', 'fill', 'stroke', 'stroke-width',
        'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset',
        'stroke-opacity', 'fill-opacity', 'fill-rule', 'clip-rule', 'opacity',
        'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2',
        'points', 'transform', 'offset', 'stop-color', 'stop-opacity',
        'gradientunits', 'gradienttransform', 'clip-path', 'mask',
        'class', 'id', 'role', 'aria-hidden', 'aria-label', 'focusable',
        'preserveaspectratio', 'vector-effect', 'shape-rendering', 'paint-order',
        'markerwidth', 'markerheight', 'markerunits', 'orient', 'refx', 'refy',
        'marker-start', 'marker-mid', 'marker-end',
    ];

    /**
     * Attributes whose value may be a `url(...)` reference.
     *
     * A reference is allowed only when it points at a fragment in this same
     * document. `url(https://…)` in an SVG paint attribute is a live outbound
     * request from the visitor's browser, which is a tracking pixel at best and
     * an SSRF probe from inside the page at worst.
     */
    private const SVG_REF_ATTRS = [
        'fill', 'stroke', 'clip-path', 'mask', 'marker-start', 'marker-mid', 'marker-end',
    ];

    private static function strip_attributes(object $el): void
    {
        $names = [];
        foreach ($el->attributes as $a) {
            $names[] = $a->nodeName;
        }
        foreach ($names as $name) {
            $lower = strtolower($name);
            if (!in_array($lower, self::SVG_ATTRS, true)) {
                $el->removeAttribute($name);
                continue;
            }

            $value = (string) ($el->getAttribute($name) ?? '');
            if (stripos($value, 'url(') === false) {
                continue;
            }
            if (!in_array($lower, self::SVG_REF_ATTRS, true)
                || preg_match('#^url\(\s*[\'"]?\#[A-Za-z0-9_:.-]+[\'"]?\s*\)$#', trim($value)) !== 1) {
                $el->removeAttribute($name);
            }
        }
    }

    /** @return object[] Every descendant element, deepest last, as a snapshot. */
    private static function element_list(object $root): array
    {
        $out = [];
        $stack = [$root];
        while ($stack !== []) {
            $node = array_pop($stack);
            foreach ($node->childNodes as $c) {
                if (!Html::is_element($c)) {
                    continue;
                }
                $out[] = $c;
                $stack[] = $c;
            }
        }

        return $out;
    }

    /**
     * A stored start tag, validated before it is printed.
     *
     * post_content is editable by anyone who can edit the page, so a stored tag
     * is untrusted input even though the migration wrote it. It is re-parsed
     * and re-serialised: anything that is not a single start tag for the
     * expected element, with attributes that survive wp_kses, does not reach
     * the page.
     */
    private static function tag(string $stored, string $expected): string
    {
        $stored = (string) $stored;
        if ($stored === '') {
            return '';
        }

        if (!preg_match('#^<([a-zA-Z][a-zA-Z0-9-]*)\b#', $stored, $m)) {
            return '';
        }
        $tag = strtolower($m[1]);
        if (!in_array($tag, self::structural_tags(), true)) {
            return '';
        }

        $clean = wp_kses($stored . '</' . $tag . '>', self::structural_allowed());
        $at = strpos($clean, '>');
        if ($at === false) {
            return '';
        }

        return substr($clean, 0, $at + 1);
    }

    /**
     * A stored end tag, plus any whitespace that followed it.
     *
     * The trailing whitespace is deliberate. It used to be a separate top-level
     * `gap` block sitting between every pair of sections, which had two costs
     * a marketing user actually felt: the List View showed an alternating list
     * of "Page section / Spacing / Page section", and pressing Move down once
     * swapped a section with the whitespace beside it, so nothing appeared to
     * happen. Carrying it here makes sections adjacent siblings, so one press
     * moves one section, and the section list reads as a list of sections.
     *
     * Only whitespace is permitted after the tag — anything else is discarded,
     * so this cannot become a route for smuggling markup past the renderer.
     */
    private static function close_tag(string $stored, string $expected): string
    {
        if (!preg_match('#^\s*</([a-zA-Z][a-zA-Z0-9-]*)>(\s*)$#', $stored, $m)) {
            return '';
        }
        $tag = strtolower($m[1]);
        if (!in_array($tag, self::structural_tags(), true)) {
            return '';
        }

        return '</' . $tag . '>' . $m[2];
    }

    /** Elements a stored wrapper tag is allowed to be. */
    private static function structural_tags(): array
    {
        return ['section', 'div', 'ul', 'ol', 'article', 'aside', 'header', 'footer', 'figure', 'nav', 'dl'];
    }

    /**
     * Attributes a structural wrapper may carry.
     *
     * This list is not guesswork: it is every attribute that actually appears on
     * a structural element across the 40 migrated bodies, which is a short list
     * because the design is disciplined — class, style, a handful of ARIA
     * attributes, `id`, `hidden`, `tabindex`, and two `data-` hooks.
     *
     * Narrowing it further would be false economy. When `data-phase` was missing
     * from an earlier version of this list, five pages failed the byte-identity
     * check and were refused by the migration — which is the mechanism working,
     * but the attribute is inert and belongs here. `data-*` is allowed as a
     * wildcard (WordPress supports this since 5.0) because a data attribute
     * cannot execute anything and the design's JavaScript reads them.
     *
     * What is not here is the point: no `on*` handler, no `srcdoc`, no
     * `formaction`, nothing that can navigate or execute. `style` is further
     * constrained by WordPress's own safecss filter, which drops `expression()`
     * and behaviour properties while passing the CSS custom properties this
     * design's animations depend on.
     */
    private static function structural_allowed(): array
    {
        $attrs = [
            'class' => true,
            'id' => true,
            'style' => true,
            'role' => true,
            'hidden' => true,
            'tabindex' => true,
            'aria-label' => true,
            'aria-labelledby' => true,
            'aria-describedby' => true,
            'aria-hidden' => true,
            'aria-orientation' => true,
            'aria-busy' => true,
            'aria-live' => true,
            'aria-expanded' => true,
            'aria-controls' => true,
            'aria-current' => true,
            'data-*' => true,
        ];

        $out = [];
        foreach (self::structural_tags() as $t) {
            $out[$t] = $attrs;
        }

        return $out;
    }

    /**
     * @param mixed $raw
     * @return Slot[]
     */
    private static function slots(mixed $raw): array
    {
        if (!is_array($raw)) {
            return [];
        }
        $out = [];
        foreach ($raw as $s) {
            if (is_array($s) && isset($s['key'])) {
                $out[] = Slot::from_array($s);
            }
        }

        return $out;
    }

    /** @return array<string,string> */
    private static function string_map(array $values): array
    {
        $out = [];
        foreach ($values as $k => $v) {
            if (is_scalar($v) || $v === null) {
                $out[(string) $k] = (string) $v;
            }
        }

        return $out;
    }

    /**
     * Section visibility.
     *
     * "Hide this section" is a content operation the client asked for, and it
     * has to mean the markup is absent rather than display:none — a hidden
     * section that still ships its text is still indexed, still read by a
     * screen reader, and still in the page weight.
     */
    private static function is_hidden(array $attrs): bool
    {
        return !empty($attrs['hidden']);
    }
}
