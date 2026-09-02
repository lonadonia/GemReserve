<?php
/**
 * The slot template engine.
 *
 * This is the load-bearing idea of the whole remediation, so it is worth being
 * explicit about the problem it solves.
 *
 * The 40 migrated pages carry 187 hand-designed sections between them. Those
 * sections are not built from a small vocabulary of repeated shapes: a survey
 * of the 1,135 list items across the site found more than thirty distinct
 * internal structures — svg+h3+p, span+svg+h3+p, div+img+span+div+h3+p, and so
 * on down a long tail. That is what a bespoke design looks like, and it is the
 * design the client approved.
 *
 * So there are two obvious approaches, and both are wrong:
 *
 *   1. Map every section onto a handful of clean semantic blocks. This is what
 *      "proper" Gutenberg work looks like, and it would silently redesign the
 *      site: thirty structures do not survive being flattened into six, and the
 *      differences are exactly the details a designer was paid for.
 *
 *   2. Drop each section into one locked HTML block. Fidelity is perfect and
 *      the marketing team is no better off than they are today, which is the
 *      complaint this work exists to answer.
 *
 * The third way is to separate the *design* of a section from its *content*.
 * The markup — tags, classes, SVG paths, attribute order, whitespace — is
 * design, and it is preserved verbatim as a template. Everything a marketing
 * user would reasonably want to change — heading text, paragraph copy, link
 * targets, button labels, image sources and alt text — is lifted out into
 * typed, individually-editable slots. Rendering substitutes the slots back
 * into the template.
 *
 * The consequence worth stating plainly: a section that is extracted and then
 * re-rendered with its slot values unchanged produces the original bytes. Not
 * "visually identical" — the same string. That property is asserted for every
 * section during migration, and any section that fails it is not migrated at
 * all; it falls back to preserved markup and is reported. Fidelity is therefore
 * a checked invariant rather than a claim.
 *
 * Repeated structures (the `<li>` of a list, the cards of a grid) are detected
 * as such, which is what makes "add a card" and "reorder the cards" real
 * operations rather than developer tickets: a new item is a clone of the
 * template with empty slots.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * A single editable value lifted out of the design markup.
 */
final class Slot
{
    public const KIND_TEXT = 'text';   // A text node. HTML5 text escaping on render.
    public const KIND_ATTR = 'attr';   // An attribute value. HTML5 attribute escaping on render.
    public const KIND_URL  = 'url';    // A URL attribute. Scheme-checked, then attribute-escaped.

    /**
     * A whole inline `<svg>` icon.
     *
     * This is the one slot kind whose value is markup rather than a string, and
     * it exists for a measured reason: of the 220 repeatable lists on this site,
     * 111 have items that are structurally identical *except* for their icon.
     * Treating the icon as design would make those 111 lists un-repeatable, and
     * "add another card" would stop working on half the site. Treating it as a
     * slot makes them repeatable, at the cost of one markup-valued field.
     *
     * The cost is contained by sanitising on render against a closed element
     * and attribute list (see Renderer::sanitize_icon), so a hand-edited or
     * API-injected icon cannot carry script, event handlers or an external
     * reference. In the editor the field is an icon picker, not a text box.
     */
    public const KIND_ICON = 'icon';

    public function __construct(
        public readonly string $key,
        public readonly string $kind,
        public readonly string $label,
        public readonly string $value,
        /** Dotted path describing where the slot came from, for editor grouping. */
        public readonly string $path = ''
    ) {
    }

    public function to_array(): array
    {
        return [
            'key' => $this->key,
            'kind' => $this->kind,
            'label' => $this->label,
            'value' => $this->value,
            'path' => $this->path,
        ];
    }

    public static function from_array(array $a): self
    {
        return new self(
            (string) ($a['key'] ?? ''),
            (string) ($a['kind'] ?? self::KIND_TEXT),
            (string) ($a['label'] ?? ''),
            (string) ($a['value'] ?? ''),
            (string) ($a['path'] ?? '')
        );
    }
}

/**
 * The result of lifting slots out of a markup fragment.
 */
final class SlotTemplate
{
    /**
     * @param string $template Markup with `{{gr_key}}` placeholders.
     * @param Slot[] $slots
     */
    public function __construct(
        public readonly string $template,
        public readonly array $slots
    ) {
    }

    /** @return array<string,string> */
    public function values(): array
    {
        $out = [];
        foreach ($this->slots as $s) {
            $out[$s->key] = $s->value;
        }

        return $out;
    }

    public function to_array(): array
    {
        return [
            'template' => $this->template,
            'slots' => array_map(static fn(Slot $s): array => $s->to_array(), $this->slots),
        ];
    }
}

final class SlotEngine
{
    /**
     * Placeholder form.
     *
     * `{{gr_key}}`, and the underscore is load-bearing. The original form was
     * `{{gr:key}}`, which is more readable and is silently destroyed on save.
     *
     * The path is worth recording because nothing about it is obvious.
     * WordPress's `wp_filter_post_kses` runs on `content_save_pre` for any user
     * without `unfiltered_html` — which is every marketing role, by design. Its
     * comment branch recursively re-filters the contents of an HTML comment,
     * and a block's attributes live in one. Inside that recursion `gr:` is read
     * as a URL scheme, is not on the safe-protocol list, and is stripped along
     * with everything before it: `href="{{gr:c1}}"` became `href="c1}}"`, and
     * the block rendered a dead link.
     *
     * Verified directly: with `{{gr:` the serialised block does not survive
     * `wp_filter_post_kses`; with `{{gr_` it survives byte for byte.
     */
    private const OPEN = '{{gr_';
    private const CLOSE = '}}';

    /**
     * Attributes whose values are content rather than design.
     *
     * `src`/`href` are URLs; `alt`/`title` are prose. `srcset` is deliberately
     * absent: the migrated markup carries Next.js-generated srcsets that all
     * point at the same file, and letting an editor near them would produce
     * broken responsive images for no gain. It stays part of the template and
     * is rewritten wholesale when the image slot changes.
     */
    private const CONTENT_ATTRS = [
        'href' => Slot::KIND_URL,
        'src' => Slot::KIND_URL,
        'alt' => Slot::KIND_ATTR,
        'title' => Slot::KIND_ATTR,
        'aria-label' => Slot::KIND_ATTR,
        'value' => Slot::KIND_ATTR,
        'placeholder' => Slot::KIND_ATTR,
    ];

    /**
     * Elements whose text content is design, not content, and must not become
     * an editable slot. `<style>`/`<script>` never appear in this markup, but
     * lifting their contents would be a stored-XSS route if they ever did.
     */
    private const OPAQUE = ['style', 'script', 'svg', 'template'];

    private int $counter = 0;

    /**
     * Lift editable content out of a markup fragment.
     *
     * @param string $html   The fragment, e.g. one `<section>` or one `<li>`.
     * @param string $prefix Key prefix, so slots from different blocks never collide.
     */
    public function extract(string $html, string $prefix = 's'): SlotTemplate
    {
        $this->counter = 0;
        $doc = Html::parse_fragment($html);
        if ($doc === null) {
            // Unparseable: no slots, template is the original. The caller will
            // see zero slots and route the section to preserved markup.
            return new SlotTemplate($html, []);
        }

        $slots = [];
        $this->walk($doc, $prefix, $slots, '');

        $template = Html::serialize_fragment($doc);

        return new SlotTemplate($template, $slots);
    }

    /**
     * @param Slot[] $slots
     */
    private function walk(object $node, string $prefix, array &$slots, string $path): void
    {
        // Inside an opaque element nothing is content.
        if (Html::is_element($node) && in_array(strtolower($node->localName), self::OPAQUE, true)) {
            return;
        }

        // Lift whole `<svg>` children as single icon slots before descending,
        // so the icon becomes one field rather than a scatter of path data.
        if (Html::is_element($node)) {
            foreach ($this->element_children($node) as $child) {
                if (strtolower($child->localName) !== 'svg') {
                    continue;
                }
                $markup = $child->ownerDocument->saveHtml($child);
                if (str_contains($markup, self::OPEN)) {
                    continue;
                }
                // An SVG carrying <text> is a diagram, not an icon — the
                // governance pyramid and the lifecycle ring are the two on this
                // site. Their labels are drawn at fixed coordinates, so they are
                // part of the drawing rather than content an editor can retype
                // without breaking the layout. They stay in the design template
                // verbatim, which also keeps them out of the icon picker where
                // a 420-unit diagram alongside 24-unit icons would be nonsense.
                if (stripos($markup, '<text') !== false) {
                    continue;
                }
                $key = $prefix . (++$this->counter);
                $slots[] = new Slot(
                    $key,
                    Slot::KIND_ICON,
                    'Icon',
                    $markup,
                    $path . '/svg'
                );
                $placeholder = $child->ownerDocument->createTextNode(self::OPEN . $key . self::CLOSE);
                $child->parentNode->replaceChild($placeholder, $child);
            }
        }

        if (Html::is_element($node)) {
            $tag = strtolower($node->localName);
            foreach (self::CONTENT_ATTRS as $attr => $kind) {
                if (!$node->hasAttribute($attr)) {
                    continue;
                }
                $value = Html::attr($node, $attr);
                if (trim($value) === '') {
                    continue;
                }
                // A placeholder already substituted in is not a fresh slot.
                if (str_contains($value, self::OPEN)) {
                    continue;
                }
                $key = $prefix . (++$this->counter);
                $slots[] = new Slot(
                    $key,
                    $kind,
                    self::attr_label($tag, $attr),
                    $value,
                    $path . '/' . $tag . '@' . $attr
                );
                $node->setAttribute($attr, self::OPEN . $key . self::CLOSE);
            }
        }

        // Iterate over a snapshot: replacing text nodes mutates the child list.
        $children = [];
        foreach ($node->childNodes as $c) {
            $children[] = $c;
        }

        foreach ($children as $child) {
            if (Html::is_text($child)) {
                $text = $child->data;
                if (trim($text) === '') {
                    continue; // Whitespace is layout, not content.
                }
                // A placeholder this pass already wrote — an icon lifted out of
                // this element a moment ago leaves one behind. Lifting it again
                // would nest a slot inside a slot, and the inner key would then
                // be stripped as unresolved when the block rendered.
                if (str_contains($text, self::OPEN)) {
                    continue;
                }
                $key = $prefix . (++$this->counter);
                $parent_tag = Html::is_element($node) ? strtolower($node->localName) : 'text';
                // Preserve the leading/trailing whitespace exactly; only the
                // trimmed core is editable. Without this, re-rendering shifts
                // indentation and the byte-identity check fails on formatting.
                preg_match('/^(\s*)(.*?)(\s*)$/us', $text, $m);
                $slots[] = new Slot(
                    $key,
                    Slot::KIND_TEXT,
                    self::text_label($parent_tag),
                    Html::decode($m[2]),
                    $path . '/' . $parent_tag . '#text'
                );
                $child->data = $m[1] . self::OPEN . $key . self::CLOSE . $m[3];
                continue;
            }

            if (Html::is_element($child)) {
                $this->walk($child, $prefix, $slots, $path . '/' . strtolower($child->localName));
            }
        }
    }

    /**
     * Substitute values back into a template.
     *
     * Escaping is per slot kind, decided when the slot was lifted, so a value
     * that was a text node can never be rendered into an attribute position and
     * vice versa. An unknown or missing key renders empty rather than leaving
     * the placeholder visible on the public page.
     *
     * On the choice of escaper: this uses the HTML5 serialisation algorithm
     * rather than esc_html/esc_attr. That is not a weakening. WordPress's
     * helpers escape a superset — esc_attr turns `'` into `&#039;` and esc_html
     * turns `"` into `&quot;` — which is harmless in isolation but destroys the
     * byte-identity the migration is verified against: every apostrophe in the
     * approved copy would come back re-encoded, and a re-render would no longer
     * equal the original. The serialisation rules escape exactly what makes a
     * value inert in its own context (`&`, `<`, `>` in text; `&` and `"` inside
     * a double-quoted attribute), which is the same guarantee, and it is the
     * rule the parser on the other side of the round trip already applies.
     *
     * @param Slot[]                $slots
     * @param array<string,string>  $values Overrides, keyed by slot key.
     */
    public static function render(string $template, array $slots, array $values = []): string
    {
        $search = [];
        $replace = [];

        foreach ($slots as $slot) {
            $raw = array_key_exists($slot->key, $values) ? (string) $values[$slot->key] : $slot->value;

            $out = match ($slot->kind) {
                Slot::KIND_URL => self::escape_attr(self::safe_url($raw)),
                Slot::KIND_ATTR => self::escape_attr($raw),
                Slot::KIND_ICON => Renderer::sanitize_icon($raw),
                default => self::escape_text($raw),
            };

            $search[] = self::OPEN . $slot->key . self::CLOSE;
            $replace[] = $out;
        }

        $html = str_replace($search, $replace, $template);

        // Any placeholder left over refers to a slot the block no longer
        // declares. Blank it rather than printing `{{gr_s7}}` to a visitor.
        return preg_replace('/\{\{gr_[A-Za-z0-9_]+\}\}/', '', $html) ?? $html;
    }

    /**
     * Escape a value for a text node, per the HTML5 serialisation algorithm.
     *
     * `&`, `<` and `>` plus the non-breaking space. Quotes are left alone:
     * nothing in text position can be terminated by one.
     */
    private static function escape_text(string $value): string
    {
        return strtr($value, [
            '&' => '&amp;',
            '<' => '&lt;',
            '>' => '&gt;',
            "\u{00A0}" => '&nbsp;',
        ]);
    }

    /**
     * Escape a value for a double-quoted attribute, per the same algorithm.
     *
     * `&` and `"` plus the non-breaking space. `<`, `>` and `'` cannot end a
     * double-quoted attribute, and every attribute this engine writes into is
     * double-quoted by the serialiser that produced the template.
     */
    private static function escape_attr(string $value): string
    {
        return strtr($value, [
            '&' => '&amp;',
            '"' => '&quot;',
            "\u{00A0}" => '&nbsp;',
        ]);
    }

    /**
     * URL escaping with a closed protocol list.
     *
     * The value returned is *not* HTML-escaped — render() applies attribute
     * escaping to it afterwards, and double-escaping would turn every `&` in a
     * query string into `&amp;amp;`. What this does is decide whether the URL
     * is allowed to appear at all.
     *
     * The rejection of javascript:/data:/vbscript: is the part that matters:
     * those are the stored-XSS routes a link slot would otherwise open, and an
     * editor pasting one should get a dead link, not script execution. Relative
     * and root-relative URLs (which is most of this site's internal linking)
     * carry no scheme and are allowed through.
     */
    private static function safe_url(string $url): string
    {
        $trimmed = trim($url);

        // Control characters are stripped before the scheme is read, because
        // "java\nscript:alert(1)" is a scheme to a browser and is not one to
        // parse_url. Comparing the flattened form closes that gap.
        $flat = strtolower(preg_replace('/[\s\x00-\x1F\x7F]+/', '', $trimmed) ?? '');
        foreach (['javascript:', 'data:', 'vbscript:', 'file:'] as $bad) {
            if (str_starts_with($flat, $bad)) {
                return '';
            }
        }

        $scheme = strtolower((string) parse_url($trimmed, PHP_URL_SCHEME));
        if ($scheme !== '' && !in_array($scheme, self::ALLOWED_SCHEMES, true)) {
            return '';
        }

        return $trimmed;
    }

    /** Schemes a link or media slot may carry. Anything else renders empty. */
    private const ALLOWED_SCHEMES = ['http', 'https', 'mailto', 'tel'];

    /** @return object[] Element children, snapshotted so replacement is safe mid-loop. */
    private function element_children(object $node): array
    {
        $out = [];
        foreach ($node->childNodes as $c) {
            if (Html::is_element($c)) {
                $out[] = $c;
            }
        }

        return $out;
    }

    private static function text_label(string $tag): string
    {
        return match ($tag) {
            'h1', 'h2' => 'Heading',
            'h3' => 'Subheading',
            'h4', 'h5', 'h6' => 'Minor heading',
            'p' => 'Paragraph',
            'li' => 'List item',
            'a' => 'Link text',
            'button' => 'Button label',
            'span' => 'Label',
            'strong', 'b' => 'Emphasised text',
            'td', 'th' => 'Table cell',
            'figcaption' => 'Caption',
            default => 'Text',
        };
    }

    private static function attr_label(string $tag, string $attr): string
    {
        return match ($attr) {
            'href' => 'Link destination',
            'src' => $tag === 'img' ? 'Image' : 'Source',
            'alt' => 'Image description (alt text)',
            'title' => 'Tooltip',
            'aria-label' => 'Accessible label',
            'placeholder' => 'Field placeholder',
            default => ucfirst($attr),
        };
    }
}
