<?php
/**
 * Turning a migrated page body into a tree of blocks.
 *
 * The slot engine (class-slot-template.php) makes the *content* of a markup
 * fragment editable. This file decides how a page is cut into fragments, which
 * is what decides whether a marketing user can add a section, remove one,
 * reorder them, or duplicate a card — the operations the client asked for by
 * name.
 *
 * The cut is driven by the markup, not by a per-page list. Four block shapes
 * come out of it:
 *
 *   section     one `<section>`. Top-level, so the editor's own move/duplicate/
 *               delete controls are section operations.
 *   wrapper     a structural element that exists to group or animate its
 *               children (`div.motion-reveal` and friends). Locked; it carries
 *               design, and descending through it is what exposes the editable
 *               things inside.
 *   repeatable  a list whose children are the same shape repeated — the cards,
 *               the pillars, the numbered steps. Items can be added, removed,
 *               duplicated and reordered.
 *   content     a leaf: a well-formed chunk of markup with its text, links and
 *               images lifted into slots.
 *
 * Anything that cannot be cut safely is not cut. `preserved` markup is the
 * escape hatch, and it is counted and reported rather than hidden.
 *
 * The invariant, asserted per page by the migration and by the test suite:
 * concatenating the rendered output of the tree reproduces the original body
 * byte for byte.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class Decomposer
{
    /**
     * Minimum sibling count before a list is treated as repeatable.
     *
     * Two is deliberate. A one-item list is a layout choice, not a collection,
     * and offering "add another" against it invites an editor to break a design
     * that was drawn for exactly one thing.
     */
    private const MIN_REPEAT = 2;

    /**
     * Elements worth descending into rather than treating as a single leaf.
     *
     * These are the grouping and animation wrappers this site's markup uses. An
     * element outside this set becomes a content leaf, which keeps the block
     * tree shallow enough to read in the editor sidebar.
     */
    private const DESCEND_TAGS = ['div', 'ul', 'ol', 'article', 'aside', 'header', 'footer', 'figure'];

    private int $preserved_count = 0;
    private int $slot_count = 0;
    private int $repeatable_count = 0;

    /** @var string[] Human-readable notes about anything that could not be structured. */
    private array $notes = [];

    /**
     * Cut a page body into top-level blocks.
     *
     * @return array<int,array> Block descriptors: ['name'=>..., 'attrs'=>[...], 'inner'=>[...]]
     */
    public function decompose_body(string $html): array
    {
        $this->preserved_count = 0;
        $this->slot_count = 0;
        $this->repeatable_count = 0;
        $this->notes = [];

        $root = Html::parse_fragment($html);
        if ($root === null) {
            $this->note('Page body could not be parsed; preserved whole.');

            return [$this->preserved($html)];
        }

        $blocks = [];
        foreach ($this->child_nodes($root) as $node) {
            if (Html::is_text($node)) {
                // Whitespace between sections. Carried on a marker block so the
                // output can be reassembled exactly; it renders as itself.
                if (trim($node->data) !== '') {
                    $blocks[] = $this->content_leaf($node->data);
                    continue;
                }
                $blocks[] = ['name' => 'gemreserve/gap', 'attrs' => ['text' => $node->data], 'inner' => []];
                continue;
            }
            if (!Html::is_element($node)) {
                continue;
            }
            $blocks[] = $this->block_for($node, true);
        }

        return $blocks;
    }

    public function stats(): array
    {
        return [
            'preserved' => $this->preserved_count,
            'slots' => $this->slot_count,
            'repeatables' => $this->repeatable_count,
            'notes' => $this->notes,
        ];
    }

    /**
     * Choose a block shape for one element.
     */
    private function block_for(object $el, bool $top_level = false): array
    {
        $tag = strtolower($el->localName);
        $markup = $this->outer_html($el);

        if ($top_level && $tag === 'section') {
            return $this->section_block($el, $markup);
        }

        // A repeatable list is the most useful thing we can find; look first.
        if ($this->is_repeatable_list($el)) {
            $block = $this->repeatable_block($el, $markup);
            if ($block !== null) {
                return $block;
            }
        }

        if (in_array($tag, self::DESCEND_TAGS, true) && $this->worth_descending($el)) {
            return $this->wrapper_block($el, $markup);
        }

        return $this->content_leaf($markup);
    }

    private function section_block(object $el, string $markup): array
    {
        [$open, $close] = $this->split_tags($el, $markup);
        if ($open === null) {
            return $this->content_leaf($markup);
        }

        $inner = [];
        foreach ($this->child_nodes($el) as $node) {
            $inner[] = $this->node_block($node);
        }
        $inner = array_values(array_filter($inner));

        return [
            'name' => 'gemreserve/section',
            'attrs' => [
                'open' => $open,
                'close' => $close,
                'label' => $this->section_label($el),
                'variant' => $this->design_variant($el),
                'anchor' => Html::attr($el, 'id') ?: '',
            ],
            'inner' => $inner,
        ];
    }

    private function wrapper_block(object $el, string $markup): array
    {
        [$open, $close] = $this->split_tags($el, $markup);
        if ($open === null) {
            return $this->content_leaf($markup);
        }

        $inner = [];
        foreach ($this->child_nodes($el) as $node) {
            $inner[] = $this->node_block($node);
        }
        $inner = array_values(array_filter($inner));

        return [
            'name' => 'gemreserve/wrapper',
            'attrs' => [
                'open' => $open,
                'close' => $close,
                'variant' => $this->design_variant($el),
            ],
            'inner' => $inner,
        ];
    }

    private function node_block(object $node): ?array
    {
        if (Html::is_text($node)) {
            if (trim($node->data) === '') {
                return ['name' => 'gemreserve/gap', 'attrs' => ['text' => $node->data], 'inner' => []];
            }

            return $this->content_leaf($node->data);
        }
        if (!Html::is_element($node)) {
            return null;
        }

        return $this->block_for($node);
    }

    /**
     * A list is repeatable when it has enough element children and they are all
     * the same tag. The children do not have to be internally identical — the
     * slot engine copes with variation inside an item — but a `<ul>` mixing
     * `<li>` with something else is not a collection and is left alone.
     */
    private function is_repeatable_list(object $el): bool
    {
        $tag = strtolower($el->localName);
        if (!in_array($tag, ['ul', 'ol'], true)) {
            return false;
        }

        $items = [];
        foreach ($this->child_nodes($el) as $c) {
            if (Html::is_element($c)) {
                $items[] = strtolower($c->localName);
            } elseif (Html::is_text($c) && trim($c->data) !== '') {
                return false; // Loose text between items: not a clean collection.
            }
        }

        return count($items) >= self::MIN_REPEAT && count(array_unique($items)) === 1;
    }

    /**
     * Build a repeatable block.
     *
     * The first item supplies the template. Every item is then matched against
     * that template: an item whose slot count differs cannot be represented by
     * it, so the whole list falls back to a plain wrapper rather than silently
     * rendering the wrong markup for that one item. That check is what keeps
     * "add a card" honest — a new card is a clone of a template that is known
     * to fit every existing card.
     */
    private function repeatable_block(object $el, string $markup): ?array
    {
        [$open, $close] = $this->split_tags($el, $markup);
        if ($open === null) {
            return null;
        }

        $item_nodes = [];
        $separators = [];
        $pending = '';
        foreach ($this->child_nodes($el) as $c) {
            if (Html::is_text($c)) {
                $pending .= $c->data;
                continue;
            }
            if (!Html::is_element($c)) {
                continue;
            }
            $separators[] = $pending;
            $pending = '';
            $item_nodes[] = $c;
        }
        $trailing = $pending;

        if (count($item_nodes) < self::MIN_REPEAT) {
            return null;
        }

        $engine = new SlotEngine();
        $first = $engine->extract($this->outer_html($item_nodes[0]), 'i');
        if ($first->slots === []) {
            return null; // Nothing editable inside; a plain wrapper is more honest.
        }

        $items = [];
        foreach ($item_nodes as $node) {
            $extracted = $engine->extract($this->outer_html($node), 'i');
            if ($extracted->template !== $first->template) {
                // Items differ structurally, not just in content.
                return null;
            }
            $items[] = $extracted->values();
        }

        $this->repeatable_count++;
        $this->slot_count += count($first->slots) * count($items);

        return [
            'name' => 'gemreserve/repeatable',
            'attrs' => [
                'open' => $open,
                'close' => $close,
                'itemTemplate' => $first->template,
                'itemSlots' => array_map(static fn(Slot $s): array => $s->to_array(), $first->slots),
                'items' => $items,
                'separators' => $separators,
                'trailing' => $trailing,
                'variant' => $this->design_variant($el),
            ],
            'inner' => [],
        ];
    }

    private function content_leaf(string $markup): array
    {
        $engine = new SlotEngine();
        $extracted = $engine->extract($markup, 'c');

        // A gap is *whitespace*, and nothing else.
        //
        // An earlier version routed anything without text into a gap, on the
        // reasoning that markup with no words is decoration. That was wrong in a
        // way the byte-identity check caught: `<p class="id-lookup__status"
        // role="status" aria-live="polite"></p>` has no text because a script
        // fills it at runtime, and `<i></i><i></i><i></i>` draws the three dots
        // of a window chrome. Both are structure, both matter, and both were
        // being erased by the gap renderer's narrow allowlist.
        //
        // Empty structure is a content leaf with zero slots, which renders its
        // template verbatim. That is the correct answer and it is byte-safe.
        if (!str_contains($markup, '<')) {
            return ['name' => 'gemreserve/gap', 'attrs' => ['text' => $markup], 'inner' => []];
        }

        // The leaf must render back to what it was, or it is not safe to store
        // as a template. This is the same check the migration makes per page,
        // applied here so a single bad fragment does not condemn a whole page.
        $rendered = SlotEngine::render($extracted->template, $extracted->slots);
        if ($rendered !== $markup) {
            $this->note('A fragment did not re-render identically and was preserved verbatim.');

            return $this->preserved($markup);
        }

        $this->slot_count += count($extracted->slots);

        return [
            'name' => 'gemreserve/content',
            'attrs' => [
                'template' => $extracted->template,
                'slots' => array_map(static fn(Slot $s): array => $s->to_array(), $extracted->slots),
            ],
            'inner' => [],
        ];
    }

    private function preserved(string $markup): array
    {
        $this->preserved_count++;

        return ['name' => 'gemreserve/preserved', 'attrs' => ['html' => $markup], 'inner' => []];
    }

    /**
     * Descending is only worth it when it exposes something editable that a
     * single leaf would hide: a repeatable collection, or more than one text
     * region. A `<div>` wrapping one paragraph is better left as one leaf.
     */
    private function worth_descending(object $el): bool
    {
        foreach ($this->descendants($el) as $d) {
            if ($this->is_repeatable_list($d)) {
                return true;
            }
        }

        $elements = 0;
        foreach ($this->child_nodes($el) as $c) {
            if (Html::is_element($c)) {
                $elements++;
            }
        }

        return $elements >= 2;
    }

    /** @return object[] */
    private function child_nodes(object $node): array
    {
        $out = [];
        foreach ($node->childNodes as $c) {
            $out[] = $c;
        }

        return $out;
    }

    /** @return object[] */
    private function descendants(object $node): array
    {
        $out = [];
        foreach ($this->child_nodes($node) as $c) {
            if (!Html::is_element($c)) {
                continue;
            }
            $out[] = $c;
            foreach ($this->descendants($c) as $d) {
                $out[] = $d;
            }
        }

        return $out;
    }

    private function outer_html(object $el): string
    {
        $doc = $el->ownerDocument;

        return $doc->saveHtml($el);
    }

    /**
     * Split an element's markup into its start tag and end tag.
     *
     * Done by serialising the element with and without its children rather than
     * by pattern-matching the start tag, so attribute quoting and ordering come
     * from the same serialiser that produced the template.
     */
    private function split_tags(object $el, string $markup): array
    {
        $inner = '';
        foreach ($this->child_nodes($el) as $c) {
            $inner .= $el->ownerDocument->saveHtml($c);
        }

        if ($inner === '') {
            // Empty element: everything is the open tag.
            return [$markup, ''];
        }

        $at = strpos($markup, $inner);
        if ($at === false) {
            return [null, null];
        }

        return [substr($markup, 0, $at), substr($markup, $at + strlen($inner))];
    }

    /**
     * The design variant carried by an element's class attribute.
     *
     * Stored so the renderer can reproduce it and so the editor can show a
     * human label for the section. It is never presented to a marketing user as
     * an editable string — a class name is a technical identifier, and the
     * brief is explicit that those stay out of the editing surface.
     */
    private function design_variant(object $el): string
    {
        return trim(Html::attr($el, 'class'));
    }

    /**
     * A readable name for a section, for the editor's list view.
     *
     * Prefers the section's own accessible label, then its first heading, then
     * a de-slugged form of its design class. The point is that a marketing user
     * scanning the block list sees "How the asset registry works", not
     * "gemreserve/section".
     */
    private function section_label(object $el): string
    {
        $label = trim(Html::attr($el, 'aria-label'));
        if ($label !== '') {
            return $label;
        }

        foreach ($this->descendants($el) as $d) {
            if (in_array(strtolower($d->localName), ['h1', 'h2', 'h3'], true)) {
                $text = trim((string) $d->textContent);
                if ($text !== '') {
                    return $text;
                }
            }
        }

        $class = $this->design_variant($el);
        foreach (explode(' ', $class) as $token) {
            if ($token !== '' && $token !== 'container-wide') {
                return ucfirst(str_replace(['-', '_'], ' ', $token));
            }
        }

        return 'Section';
    }

    private function note(string $message): void
    {
        if (!in_array($message, $this->notes, true)) {
            $this->notes[] = $message;
        }
    }
}
