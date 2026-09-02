<?php
/**
 * Theme setup. Presentation only — content logic belongs to gemreserve-core.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

define('GEMRESERVE_THEME_VERSION', '1.0.0');

require_once get_template_directory() . '/inc-nav.php';
require_once get_template_directory() . '/inc-sections.php';

function gemreserve_theme_setup(): void
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);
    add_theme_support('responsive-embeds');
    add_theme_support('editor-styles');

    register_nav_menus([
        'primary' => 'Primary navigation',
        'footer_platform' => 'Footer — Platform',
        'footer_assets' => 'Footer — Assets',
        'footer_how' => 'Footer — How It Works',
        'footer_technology' => 'Footer — Technology',
        'footer_enterprise' => 'Footer — Enterprise',
        'footer_investors' => 'Footer — Investors',
        'footer_company' => 'Footer — Company',
        'footer_resources' => 'Footer — Resources',
        'footer_participation' => 'Footer — Early Participation',
    ]);
}
add_action('after_setup_theme', 'gemreserve_theme_setup');

/**
 * Assets.
 *
 * One stylesheet, one small script. No jQuery on the front end: the original
 * build shipped none, and adding it here to save a few lines of vanilla JS
 * would undo the performance the design was built around.
 */
function gemreserve_enqueue(): void
{
    $dir = get_template_directory();
    $uri = get_template_directory_uri();

    wp_enqueue_style(
        'gemreserve',
        $uri . '/assets/css/gemreserve.css',
        [],
        (string) filemtime($dir . '/assets/css/gemreserve.css')
    );

    wp_enqueue_script(
        'gemreserve',
        $uri . '/assets/js/gemreserve.js',
        [],
        (string) filemtime($dir . '/assets/js/gemreserve.js'),
        true
    );

    // Behaviour the React client components used to own.
    wp_enqueue_script(
        'gemreserve-interactive',
        $uri . '/assets/js/gemreserve-interactive.js',
        ['gemreserve'],
        (string) filemtime($dir . '/assets/js/gemreserve-interactive.js'),
        true
    );

    // The one flag the front end needs: whether a submitted form is actually
    // delivered. It decides what the success state is allowed to say.
    wp_add_inline_script(
        'gemreserve-interactive',
        'window.GemReserveSettings=' . wp_json_encode([
            'formsEnabled' => gemreserve_flag('forms_enabled'),
        ]) . ';',
        'before'
    );
}
add_action('wp_enqueue_scripts', 'gemreserve_enqueue');

/** The front end never needs jQuery here. */
function gemreserve_dequeue_jquery(): void
{
    if (!is_admin()) {
        wp_deregister_script('jquery');
    }
}
add_action('wp_enqueue_scripts', 'gemreserve_dequeue_jquery', 1);

/** Fonts, matching the original: Playfair Display for display, Inter for UI. */
function gemreserve_fonts(): void
{
    echo '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
    echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap">' . "\n";
    // The ported stylesheet reads these two variables; next/font set them before.
    echo '<style>:root{--font-sans:"Inter";--font-display:"Playfair Display";}</style>' . "\n";
}
add_action('wp_head', 'gemreserve_fonts', 1);

/** Asset URL helper, so templates can reference ported images by their old path. */
function gr_asset(string $path): string
{
    return get_template_directory_uri() . '/assets' . $path;
}

/** Echo a responsive hero picture, reproducing ResponsiveHeroImage. */
function gr_hero_image(string $desktop_base, string $mobile_base): void
{
    if (!$desktop_base) {
        return;
    }
    $d = gr_asset($desktop_base);
    $m = gr_asset($mobile_base ?: $desktop_base);
    ?>
    <picture class="hero__picture">
        <source media="(max-width: 760px)" type="image/avif" srcset="<?php echo esc_url($m . '.avif'); ?>">
        <source media="(max-width: 760px)" type="image/webp" srcset="<?php echo esc_url($m . '.webp'); ?>">
        <source type="image/avif" srcset="<?php echo esc_url($d . '.avif'); ?>">
        <source type="image/webp" srcset="<?php echo esc_url($d . '.webp'); ?>">
        <img class="hero__image" src="<?php echo esc_url($d . '.webp'); ?>" alt="" width="1920" height="822" decoding="async" fetchpriority="high">
    </picture>
    <?php
}

/** Read a gemreserve-core field off the current post. */
function gr_field(string $key, ?int $post_id = null, string $fallback = ''): string
{
    $post_id = $post_id ?: get_the_ID();
    if (!$post_id) {
        return $fallback;
    }
    $value = get_post_meta($post_id, "_gr_{$key}", true);
    return $value !== '' ? (string) $value : $fallback;
}

/** Decoded section JSON for a page, or an empty array. */
function gr_sections(?int $post_id = null): array
{
    $raw = gr_field('section_json', $post_id);
    if (!$raw) {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * SEO head.
 *
 * One implementation, no plugin. The original site's metadata was hand-built
 * and correct; installing Yoast or Rank Math to reproduce it would add a
 * dependency, a settings surface and a recurring upsell for output this theme
 * can emit in thirty lines.
 */
function gemreserve_seo_head(): void
{
    if (!is_singular()) {
        return;
    }
    $id = get_the_ID();
    $title = gr_field('seo_title', $id) ?: get_the_title($id);
    $description = gr_field('seo_description', $id) ?: wp_strip_all_tags(get_the_excerpt($id) ?: '');
    $canonical = gr_field('canonical_url', $id) ?: get_permalink($id);

    if ($description) {
        echo '<meta name="description" content="' . esc_attr($description) . '">' . "\n";
    }
    echo '<link rel="canonical" href="' . esc_url($canonical) . '">' . "\n";
    if (gr_field('noindex', $id) === '1') {
        echo '<meta name="robots" content="noindex,nofollow">' . "\n";
    }
    echo '<meta property="og:type" content="website">' . "\n";
    echo '<meta property="og:site_name" content="GemReserve.io">' . "\n";
    echo '<meta property="og:title" content="' . esc_attr($title) . '">' . "\n";
    if ($description) {
        echo '<meta property="og:description" content="' . esc_attr($description) . '">' . "\n";
    }
    echo '<meta property="og:url" content="' . esc_url($canonical) . '">' . "\n";
    echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
}
add_action('wp_head', 'gemreserve_seo_head', 5);

/**
 * The document title.
 *
 * Core builds a static front page's title from the site name, which turned
 * "Real Gems. Real Value. Real Trust. | GemReserve.io" into the useless
 * "GemReserve.io | GemReserve.io". The page's own title is the right answer on
 * every singular view, so compose it here instead of depending on core's
 * front-page branch. Returning an empty string leaves core's own logic alone,
 * which is what archives and the 404 still want.
 */
function gemreserve_pre_document_title(string $title): string
{
    if (!is_singular()) {
        return $title;
    }
    $id = get_the_ID();
    $own = wp_strip_all_tags((string) (gr_field('seo_title', $id) ?: get_the_title($id)));
    if ($own === '') {
        return $title;
    }
    $site = 'GemReserve.io';

    return $own === $site ? $site : $own . ' | ' . $site;
}
add_filter('pre_get_document_title', 'gemreserve_pre_document_title');

/** Title suffix, matching the original template. */
function gemreserve_document_title(array $parts): array
{
    $parts['site'] = 'GemReserve.io';
    return $parts;
}
add_filter('document_title_parts', 'gemreserve_document_title');

function gemreserve_title_separator(): string
{
    return '|';
}
add_filter('document_title_separator', 'gemreserve_title_separator');

/** Body colour scheme, matching the original meta. */
function gemreserve_meta_theme(): void
{
    echo '<meta name="theme-color" content="#020608">' . "\n";
    echo '<meta name="color-scheme" content="dark">' . "\n";
}
add_action('wp_head', 'gemreserve_meta_theme', 2);

/**
 * robots.txt.
 *
 * The original file allowed everything, disallowed the API prefix and pointed
 * at the sitemap. WordPress adds surfaces the static site did not have, so the
 * dashboard and the JSON API are kept out of the index too — admin-ajax stays
 * allowed because blocking it breaks front-end requests that legitimately use
 * it. The sitemap URL is derived, never hard-coded, so staging does not
 * advertise production.
 */
function gemreserve_robots_txt(string $output, $public): string
{
    if (!$public) {
        return $output;   // "Discourage search engines" is set; core's answer wins.
    }

    return "User-Agent: *\n"
        . "Allow: /\n"
        . "Disallow: /api/\n"
        . "Disallow: /wp-admin/\n"
        . "Allow: /wp-admin/admin-ajax.php\n"
        . "Disallow: /wp-json/\n"
        . "\n"
        . 'Sitemap: ' . home_url('/sitemap.xml') . "\n";
}
add_filter('robots_txt', 'gemreserve_robots_txt', 10, 2);

/**
 * Render a block-based page body.
 *
 * Deliberately `do_blocks()` and not `the_content()`.
 *
 * `the_content` runs the whole content-filter stack, and two of those filters
 * rewrite the approved markup. `wp_filter_content_tags` prepends `auto,` to the
 * `sizes` attribute of every lazy-loaded image, and `wpautop` inserts
 * paragraphs into markup that already has its own. Neither ran on the legacy
 * body, because that was echoed raw — so putting the block body through
 * `the_content` would have changed 30 of the 58 routes on the first deploy,
 * which is exactly the silent design drift this migration exists to avoid. It
 * was caught by comparing every route against its pre-migration bytes.
 *
 * `gemreserve_prepare_body_html()` is still applied, because it is not a
 * WordPress filter but this theme's own: it activates the waitlist and contact
 * forms and fills the news entries. The legacy path applied it, so the block
 * path applies it, and the two produce the same page.
 *
 * The output is not escaped here and does not need to be: every block escapes
 * its own slot values as it renders, and structural tags are re-validated
 * against a closed allowlist before printing.
 */
function gemreserve_render_block_body(): void
{
    $content = get_the_content();
    if (trim($content) === '') {
        return;
    }

    echo gemreserve_prepare_body_html(do_blocks($content)); // phpcs:ignore WordPress.Security.EscapeOutput
}

/**
 * Has this page's body been converted to blocks?
 *
 * The theme asks the plugin rather than sniffing post_content for a block
 * comment. A page could legitimately contain a stray block while its sections
 * still live in the legacy blob, and rendering both would print the page twice.
 * The migration's own provenance flag is the only answer that cannot be
 * ambiguous.
 *
 * Returns false when the plugin is not active, which is what makes deactivating
 * gemreserve-visual-cms a complete rollback: the theme goes straight back to
 * rendering the legacy body, and the blob is still there because the migration
 * never deletes it.
 */
function gemreserve_body_is_blocks(?int $post_id = null): bool
{
    if (!class_exists('GemReserve\\VisualCms\\Migrator')) {
        return false;
    }

    return GemReserve\VisualCms\Migrator::is_migrated($post_id ?: (int) get_the_ID());
}
