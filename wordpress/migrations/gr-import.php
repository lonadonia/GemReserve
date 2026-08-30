<?php
/**
 * Content migration: Next.js -> WordPress.
 *
 * Run with wp-cli:  wp eval-file gr-import.php <extracted.json> --path=.
 *
 * Input is the JSON produced by reading the live Next.js DOM, so what lands in
 * WordPress is what the approved site actually publishes — the factual-safety
 * corrections included, because those live in the copy.
 *
 * The script is idempotent: a route already imported is updated in place, keyed
 * on slug, so it can be re-run after a content change without duplicating.
 */

// No strict_types: wp-cli's eval-file evaluates this, and a declare() cannot
// lead an eval'd script.

if (!defined('WP_CLI') || !WP_CLI) {
    fwrite(STDERR, "Run through wp-cli.\n");
    exit(1);
}

$file = $args[0] ?? '';
if (!$file || !file_exists($file)) {
    WP_CLI::error("Usage: wp eval-file gr-import.php <extracted.json>");
}
$pages = json_decode((string) file_get_contents($file), true);
if (!is_array($pages)) {
    WP_CLI::error('Could not parse the extract.');
}

/** Routes that become the `gemstone` post type rather than pages. */
$gemstoneRoutes = [
    '/aquamarine', '/emerald', '/peridot', '/ruby', '/tourmaline',
    '/natural-raw-charoite', '/natural-rough-alexandrite', '/natural-rough-aquamarine',
    '/natural-rough-chrysoprase', '/natural-rough-italian-jade', '/natural-rough-jasper',
    '/natural-rough-ruby-c-quality', '/natural-rough-ruby-trapiche',
    '/natural-rough-ruby-gem-quality', '/natural-rough-rutilated-quartz',
    '/natural-rough-tourmaline', '/natural-rough-peridot', '/natural-rough-emerald',
];

/** Parent/child structure, so the WordPress hierarchy carries the site's own. */
$parents = [
    '/gemstone-programs' => '/assets',
    '/asset-registry' => '/assets',
    '/independent-verification' => '/technology',
    '/custody-vault-structure' => '/technology',
    '/proof-of-reserves' => '/technology',
    '/gemstone-tokenization' => '/technology',
    '/physical-redemption' => '/technology',
    '/digital-asset-passports' => '/technology',
    '/platform-infrastructure' => '/technology',
    '/redemption-portal' => '/technology',
    '/licensing-white-label' => '/technology',
    '/enterprise-tokenization' => '/enterprise',
    '/gemstone-owners' => '/enterprise',
    '/gemstone-buyers' => '/enterprise',
    '/future-infrastructure' => '/enterprise',
    '/corporate-development' => '/about',
    '/governance' => '/about',
    '/news' => '/about',
    '/contact' => '/about',
    '/documents' => '/resources',
    '/whitepaper' => '/resources',
    '/risk-disclosure' => '/resources',
    '/anti-fraud-notice' => '/resources',
    '/participant-portal' => '/resources',
    '/faq' => '/resources',
    '/program-overview' => '/early-participation',
    '/discount-methodology' => '/early-participation',
    '/token-acquisition' => '/early-participation',
    '/eligibility-kyc' => '/early-participation',
    '/restricted-jurisdictions' => '/early-participation',
    '/early-participation-program' => '/early-participation',
];

$report = ['pages' => 0, 'gemstones' => 0, 'updated' => 0, 'created' => 0, 'front' => 0, 'skipped' => []];
$idBySlug = [];

/** Pass one: create or update every record. */
foreach ($pages as $p) {
    $route = (string) $p['route'];
    $slug = $route === '/' ? 'home' : trim($route, '/');
    $isGemstone = in_array($route, $gemstoneRoutes, true);
    $type = $isGemstone ? 'gemstone' : 'page';

    $existing = get_posts([
        'name' => $slug, 'post_type' => $type, 'post_status' => 'any',
        'numberposts' => 1, 'fields' => 'ids',
    ]);

    $title = trim(preg_replace('/\s*\|\s*GemReserve\.io\s*$/', '', (string) $p['title'])) ?: $slug;

    $postarr = [
        'post_title' => $title,
        'post_name' => $slug,
        'post_type' => $type,
        'post_status' => 'publish',
        'post_content' => '',
    ];

    if ($existing) {
        $postarr['ID'] = $existing[0];
        $id = wp_update_post($postarr, true);
        $report['updated']++;
    } else {
        $id = wp_insert_post($postarr, true);
        $report['created']++;
    }
    if (is_wp_error($id)) {
        $report['skipped'][] = "{$route}: " . $id->get_error_message();
        continue;
    }

    $idBySlug[$slug] = $id;
    $isGemstone ? $report['gemstones']++ : $report['pages']++;

    // Hero and SEO, straight from the rendered page.
    update_post_meta($id, '_gr_hero_title_lines', implode("\n", (array) $p['heroLines']));
    update_post_meta($id, '_gr_hero_tagline', (string) $p['heroTagline']);
    update_post_meta($id, '_gr_hero_description', (string) $p['heroDescription']);
    update_post_meta($id, '_gr_seo_title', $title);
    update_post_meta($id, '_gr_seo_description', (string) $p['metaDescription']);

    if (!empty($p['heroImage'])) {
        update_post_meta($id, '_gr_hero_image_desktop', (string) $p['heroImage']);
        update_post_meta($id, '_gr_hero_image_mobile', $p['heroImage'] . '-mobile');
    }

    // The trail's second entry names the section, where the board had one.
    if (!empty($p['breadcrumb'][1])) {
        update_post_meta($id, '_gr_hero_eyebrow', (string) $p['breadcrumb'][1]);
    }

    // Gemstone records start illustrative. Nothing on the current site claims a
    // held stone, and the migration must not silently promote one.
    if ($isGemstone) {
        if (!get_post_meta($id, '_gr_evidence_state', true)) {
            update_post_meta($id, '_gr_evidence_state', 'illustrative');
            update_post_meta($id, '_gr_custody_state', 'not_scheduled');
        }
        $form = str_starts_with($slug, 'natural-') ? 'Natural rough' : 'Polished';
        wp_set_object_terms($id, $form, 'gemstone_form');
        update_post_meta($id, '_gr_inventory_form', $form === 'Polished' ? 'polished' : 'rough');
    }

    // Section skeleton, recording what the source page carried. The renderer
    // ignores unknown shapes, so this is a migration record an editor can fill
    // rather than a half-built page that breaks.
    update_post_meta($id, '_gr_section_json', wp_json_encode([
        'migrated_from' => $route,
        'source_sections' => $p['sections'],
    ]));
}

/** Pass two: hierarchy, once every ID exists. */
foreach ($parents as $child => $parent) {
    $c = $idBySlug[trim($child, '/')] ?? null;
    $pId = $idBySlug[trim($parent, '/')] ?? null;
    if ($c && $pId && get_post_type($c) === 'page') {
        wp_update_post(['ID' => $c, 'post_parent' => $pId]);
    }
}

/** The homepage. */
if (!empty($idBySlug['home'])) {
    update_option('show_on_front', 'page');
    update_option('page_on_front', $idBySlug['home']);
    $report['front'] = $idBySlug['home'];
}

update_option('permalink_structure', '/%postname%/');
flush_rewrite_rules(false);

WP_CLI::success(sprintf(
    'Imported %d pages and %d gemstones (%d created, %d updated).',
    $report['pages'], $report['gemstones'], $report['created'], $report['updated']
));
if ($report['skipped']) {
    WP_CLI::warning('Skipped: ' . implode('; ', $report['skipped']));
}
file_put_contents(__DIR__ . '/gr-import-report.json', wp_json_encode($report, JSON_PRETTY_PRINT));
