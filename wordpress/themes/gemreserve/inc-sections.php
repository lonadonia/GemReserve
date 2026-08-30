<?php
/**
 * The section renderer.
 *
 * The Next.js build stored page content as typed data in content/*.ts and had
 * one React component per section shape. That split is what made the copy
 * auditable against the client's boards, and it is preserved here: the
 * migration writes the same data as JSON into a page field, and this file
 * renders it with the same class names, so the ported stylesheet applies with
 * no changes at all.
 *
 * A section is `{ "type": "...", ... }`. An unknown type renders nothing rather
 * than breaking the page — a page half-migrated is better than a fatal.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

function gemreserve_render_sections(array $sections): void
{
    foreach ($sections as $section) {
        if (!is_array($section) || empty($section['type'])) {
            continue;
        }
        $fn = 'gemreserve_section_' . str_replace('-', '_', (string) $section['type']);
        if (function_exists($fn)) {
            $fn($section);
        }
    }
}

/** Shared heading: gold rule, diamond, rule. */
function gemreserve_section_heading(string $title, ?string $id = null): void
{
    if (!$title) {
        return;
    }
    echo '<div class="section-heading section-heading--center">';
    echo '<div class="section-heading-line" aria-hidden="true"></div>';
    echo '<h2' . ($id ? ' id="' . esc_attr($id) . '"' : '') . '>' . esc_html($title) . '</h2>';
    echo '<div class="section-heading-line" aria-hidden="true"></div>';
    echo '</div>';
}

/** A row of icon/title/description cards in one bordered panel. */
function gemreserve_section_pillars(array $s): void
{
    $items = $s['items'] ?? [];
    if (!$items) {
        return;
    }
    $class = $s['class'] ?? '';
    echo '<section class="container-wide" style="margin-top:var(--section-gap)">';
    echo '<div class="motion-reveal is-visible">';
    gemreserve_section_heading((string) ($s['title'] ?? ''));
    echo '</div><div class="motion-reveal is-visible">';
    echo '<ul class="trust-pillars ' . esc_attr($class) . '">';
    foreach ($items as $item) {
        echo '<li>';
        echo gemreserve_icon((string) ($item['icon'] ?? 'diamond'), 36);
        echo '<h3>' . esc_html((string) ($item['title'] ?? '')) . '</h3>';
        echo '<p>' . esc_html((string) ($item['description'] ?? '')) . '</p>';
        echo '</li>';
    }
    echo '</ul></div></section>';
}

/** A numbered process row. */
function gemreserve_section_steps(array $s): void
{
    $items = $s['items'] ?? [];
    if (!$items) {
        return;
    }
    $class = $s['class'] ?? 'custody-steps';
    echo '<section class="container-wide" style="margin-top:var(--section-gap)">';
    echo '<div class="motion-reveal is-visible">';
    gemreserve_section_heading((string) ($s['title'] ?? ''));
    echo '</div><div class="motion-reveal is-visible"><ol class="' . esc_attr($class) . '">';
    $n = 1;
    foreach ($items as $item) {
        echo '<li>';
        echo '<p class="custody-step__number" aria-hidden="true">' . (int) $n++ . '</p>';
        echo gemreserve_icon((string) ($item['icon'] ?? 'diamond'), 32);
        echo '<h3>' . esc_html((string) ($item['title'] ?? '')) . '</h3>';
        echo '<p>' . esc_html((string) ($item['description'] ?? '')) . '</p>';
        echo '</li>';
    }
    echo '</ol></div></section>';
}

/** A panel of prose with an optional bulleted list. */
function gemreserve_section_panel(array $s): void
{
    echo '<section class="container-wide" style="margin-top:var(--section-gap)">';
    echo '<div class="motion-reveal is-visible verification-card">';
    if (!empty($s['title'])) {
        echo '<h2 class="verification-card__title">' . esc_html((string) $s['title']) . '</h2>';
    }
    foreach ((array) ($s['paragraphs'] ?? []) as $p) {
        echo '<p class="verification-card__intro">' . esc_html((string) $p) . '</p>';
    }
    if (!empty($s['checks'])) {
        echo '<ul class="custody-perils">';
        foreach ((array) $s['checks'] as $c) {
            echo '<li>' . gemreserve_icon('check', 18) . esc_html((string) $c) . '</li>';
        }
        echo '</ul>';
    }
    if (!empty($s['note'])) {
        echo '<p class="verification-card__note" role="note">' . gemreserve_icon('alert-triangle', 22)
            . '<span>' . esc_html((string) $s['note']) . '</span></p>';
    }
    echo '</div></section>';
}

/** The closing call-to-action band. */
function gemreserve_section_cta(array $s): void
{
    echo '<section class="trust-cta container-wide" style="margin-top:var(--section-gap)">';
    if (!empty($s['image'])) {
        echo '<div class="motion-reveal is-visible trust-cta__visual">';
        echo '<div class="image-with-glow trust-cta__image">';
        echo '<img src="' . esc_url(gr_asset('/images/sections/' . $s['image'] . '.webp')) . '" alt="' . esc_attr((string) ($s['imageAlt'] ?? '')) . '" loading="lazy">';
        echo '<span class="image-glint" aria-hidden="true"></span></div></div>';
    }
    echo '<div class="motion-reveal is-visible trust-cta__copy">';
    echo '<h2>' . esc_html((string) ($s['title'] ?? '')) . '</h2>';
    if (!empty($s['description'])) {
        echo '<p>' . esc_html((string) $s['description']) . '</p>';
    }
    echo '</div><div class="motion-reveal is-visible trust-cta__action">';
    $href = (string) ($s['href'] ?? gemreserve_setting('waitlist_href'));
    $label = (string) ($s['buttonLabel'] ?? gemreserve_setting('waitlist_label'));
    echo '<a class="button button--gold" href="' . esc_url($href) . '">' . esc_html($label) . '</a>';
    if (!empty($s['supportingText'])) {
        echo '<p>' . esc_html((string) $s['supportingText']) . '</p>';
    }
    echo '</div></section>';
}

/** Free content from the editor, for pages that are genuinely prose. */
function gemreserve_section_richtext(array $s): void
{
    echo '<section class="container-wide" style="margin-top:var(--section-gap)"><div class="motion-reveal is-visible page-copy">';
    echo wp_kses_post((string) ($s['html'] ?? ''));
    echo '</div></section>';
}

/**
 * Icons.
 *
 * The original shipped one hand-drawn set as a typed union. Rather than inline
 * 60 paths here, the theme keeps the handful the section renderer needs and
 * falls back to the diamond, which is the set's default mark.
 */
function gemreserve_icon(string $name, int $size = 24): string
{
    $paths = [
        'diamond' => '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3l3 18 3-18"/>',
        'check' => '<path d="M20 6 9 17l-5-5"/>',
        'shield-check' => '<path d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7z"/><path d="M9 12l2 2 4-4"/>',
        'lock' => '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/>',
        'globe' => '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 4 3 14 0 18-3-4-3-14 0-18"/>',
        'eye' => '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="3"/>',
        'vault' => '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M12 8v1M12 15v1"/>',
        'alert-triangle' => '<path d="M12 3 2 20h20z"/><path d="M12 9v5M12 17h.01"/>',
        'certificate' => '<rect x="4" y="3" width="16" height="14" rx="2"/><path d="M9 20l3-2 3 2"/>',
        'users' => '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 11a3 3 0 1 0 0-6"/>',
        'chart' => '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
        'cubes' => '<path d="M12 3l4 2v4l-4 2-4-2V5z"/><path d="M6 12l4 2v4l-4 2-4-2v-4z"/><path d="M18 12l4 2v4l-4 2-4-2v-4z"/>',
    ];
    $d = $paths[$name] ?? $paths['diamond'];
    return sprintf(
        '<svg width="%1$d" height="%1$d" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%2$s</svg>',
        $size,
        $d
    );
}
