<?php
/**
 * Import each route's body sections.
 *
 * Stored in a dedicated field rather than post_content so the block editor
 * never rewrites this markup — Gutenberg would happily reformat it into
 * paragraphs and destroy the layout. It renders through the theme's
 * `gr_body_html` field, and post_content stays free for editor prose.
 *
 * Asset URLs are rewritten from the Next.js paths to the theme's copies, and
 * the Next.js image optimiser URLs are unwrapped back to the plain file.
 *
 * Run: wp eval-file gr-import-sections.php <sections.json> --path=.
 */

if (!defined('WP_CLI') || !WP_CLI) {
    fwrite(STDERR, "Run through wp-cli.\n");
    exit(1);
}

$file = $args[0] ?? '';
if (!$file || !file_exists($file)) {
    WP_CLI::error('Usage: wp eval-file gr-import-sections.php <sections.json>');
}
$sections = json_decode((string) file_get_contents($file), true);
if (!is_array($sections)) {
    WP_CLI::error('Could not parse the section extract.');
}

$themeAssets = get_template_directory_uri() . '/assets';
$applied = 0;
$missing = [];
$bytes = 0;

foreach ($sections as $route => $html) {
    $slug = $route === '/' ? null : trim((string) $route, '/');
    if ($slug === null) {
        $id = (int) get_option('page_on_front');
    } else {
        $found = get_posts([
            'name' => $slug, 'post_type' => ['page', 'gemstone'],
            'post_status' => 'publish', 'numberposts' => 1, 'fields' => 'ids',
        ]);
        $id = $found[0] ?? 0;
    }
    if (!$id) {
        $missing[] = $route;
        continue;
    }

    // Unwrap Next.js's image optimiser: /_next/image?url=%2Fimages%2F... -> /images/...
    $html = preg_replace_callback(
        '#/_next/image\?url=([^"&\s]+)[^"\s]*#',
        static fn($m) => urldecode($m[1]),
        (string) $html
    );

    // Point every asset at the theme's copy.
    //
    // A srcset holds several URLs separated by commas, so anchoring the match to
    // the start of the attribute rewrites only the first and leaves the rest
    // 404ing. These paths are absolute and only ever appear as asset
    // references, so every occurrence is rewritten wherever it sits.
    $html = str_replace(
        ['"/images/', '"/brand/', ' /images/', ' /brand/'],
        ['"' . $themeAssets . '/images/', '"' . $themeAssets . '/brand/',
         ' ' . $themeAssets . '/images/', ' ' . $themeAssets . '/brand/'],
        $html
    );

    // Internal links keep working under WordPress's trailing-slash permalinks.
    $html = preg_replace('#href="(/[a-z0-9-]+)"#', 'href="$1/"', $html);

    update_post_meta($id, '_gr_body_html', $html);
    $bytes += strlen($html);
    $applied++;
}

WP_CLI::success(sprintf('Imported sections for %d routes (%s).', $applied, size_format($bytes)));
if ($missing) {
    WP_CLI::warning('No post for: ' . implode(', ', $missing));
}
