<?php
/**
 * HTML parsing and serialisation for the migration.
 *
 * Everything here exists to serve one property: parse(x) then serialize() must
 * return x, byte for byte, for the markup this site actually contains. If that
 * does not hold, the migration cannot prove it preserved the design, so this
 * layer is deliberately conservative and the round trip is asserted per section
 * before anything is written.
 *
 * PHP 8.4's Dom\HTMLDocument is a real HTML5 parser — it handles the SVG in
 * every icon, the void elements, and the attribute quoting rules that libxml's
 * HTML mode gets wrong. It is used when available. The libxml fallback exists
 * only so the plugin does not fatal on an older host; it will fail the round
 * trip on SVG-bearing markup, and failing the round trip means "do not migrate
 * this section", which is the safe outcome rather than a corrupted one.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class Html
{
    /** Wrapper element used to hold a fragment while it is being worked on. */
    private const ROOT = 'gr-fragment';

    public static function have_html5(): bool
    {
        return class_exists('Dom\\HTMLDocument');
    }

    /**
     * Parse a fragment and return the element whose children are the fragment.
     *
     * Returns null when the fragment cannot be represented — the caller treats
     * that as "not migratable".
     */
    public static function parse_fragment(string $html): ?object
    {
        if (self::have_html5()) {
            // A custom element is used as the wrapper because the HTML5 parser
            // applies content-model rules to known elements: a <tr> inside a
            // <div> gets hoisted out of the table, a <li> outside a list gets
            // relocated. An unknown element has no content model, so children
            // are kept exactly where they were written.
            $source = '<!DOCTYPE html><html><body><' . self::ROOT . '>' . $html . '</' . self::ROOT . '></body></html>';
            try {
                $doc = \Dom\HTMLDocument::createFromString(
                    $source,
                    LIBXML_NOERROR | LIBXML_HTML_NOIMPLIED
                );
            } catch (\Throwable) {
                return null;
            }
            $nodes = $doc->getElementsByTagName(self::ROOT);
            return $nodes->length > 0 ? $nodes->item(0) : null;
        }

        $doc = new \DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        $ok = $doc->loadHTML(
            '<?xml encoding="UTF-8"><' . self::ROOT . '>' . $html . '</' . self::ROOT . '>',
            LIBXML_NOERROR | LIBXML_NOWARNING | LIBXML_HTML_NODEFDTD | LIBXML_HTML_NOIMPLIED
        );
        libxml_clear_errors();
        libxml_use_internal_errors($previous);
        if (!$ok) {
            return null;
        }
        $nodes = $doc->getElementsByTagName(self::ROOT);

        return $nodes->length > 0 ? $nodes->item(0) : null;
    }

    /**
     * Serialise the children of a wrapper produced by parse_fragment().
     */
    public static function serialize_fragment(object $wrapper): string
    {
        $out = '';
        $doc = $wrapper->ownerDocument;
        if ($doc === null) {
            return '';
        }

        foreach ($wrapper->childNodes as $child) {
            if (self::have_html5() && method_exists($doc, 'saveHtml')) {
                $out .= $doc->saveHtml($child);
                continue;
            }
            $out .= $doc->saveHTML($child);
        }

        return $out;
    }

    /**
     * Is this node an element?
     *
     * PHP 8.4's Dom\Element and the classic DOMElement are unrelated class
     * hierarchies, and this code has to walk trees from either one.
     */
    public static function is_element(object $node): bool
    {
        return $node instanceof \DOMElement
            || (class_exists('Dom\\Element') && $node instanceof \Dom\Element);
    }

    /** Is this node a text node? See is_element() for why this is not an instanceof. */
    public static function is_text(object $node): bool
    {
        return $node instanceof \DOMText
            || (class_exists('Dom\\Text') && $node instanceof \Dom\Text);
    }

    /**
     * Read an attribute as a string.
     *
     * DOMElement::getAttribute returns '' for a missing attribute; Dom\Element
     * returns null. Every caller here wants a string.
     */
    public static function attr(object $el, string $name): string
    {
        if (!method_exists($el, 'getAttribute')) {
            return '';
        }

        return (string) ($el->getAttribute($name) ?? '');
    }

    /**
     * Decode character references in a text value.
     *
     * Slot values are stored decoded — an editor typing "Vaults & Custody"
     * should see exactly that — and re-encoded by esc_html on the way out.
     */
    public static function decode(string $text): string
    {
        return html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }

    /**
     * Does parse+serialise reproduce the input exactly?
     *
     * Used as a precondition before any section is migrated. It is checked on
     * the real markup rather than assumed from the parser's reputation.
     */
    public static function round_trips(string $html): bool
    {
        $node = self::parse_fragment($html);
        if ($node === null) {
            return false;
        }

        return self::serialize_fragment($node) === $html;
    }
}
