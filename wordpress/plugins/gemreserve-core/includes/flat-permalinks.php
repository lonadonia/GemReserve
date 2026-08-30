<?php
/**
 * Flat page URLs, hierarchical admin.
 *
 * The 58 public URLs are flat — /independent-verification, not
 * /technology/independent-verification — and they carry SEO and internal
 * linking value the migration is not allowed to spend. The parent/child
 * hierarchy is still worth having: it organises the admin list and drives the
 * breadcrumb trail. So the hierarchy stays and the URL is flattened.
 *
 * Resolution is done on the raw request path rather than through a rewrite
 * rule. A rule is the tidier mechanism but it has to win against the page and
 * post-type rules WordPress generates from the same one-segment pattern, and
 * ordering that reliably across two post types is more fragile than reading the
 * path once and answering it directly.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Emit the bare slug as a page's permalink. */
function gemreserve_flat_page_link(string $link, int $post_id): string
{
    $post = get_post($post_id);
    if (!$post || $post->post_type !== 'page') {
        return $link;
    }
    if ((int) get_option('page_on_front') === $post_id) {
        return home_url('/');
    }
    return home_url('/' . $post->post_name . '/');
}
add_filter('page_link', 'gemreserve_flat_page_link', 10, 2);

/**
 * Answer a one-segment request directly.
 *
 * Runs before WordPress builds its own query vars. Anything with a slash, a
 * query string of its own, or an admin/feed prefix is left alone.
 */
function gemreserve_resolve_flat_request(WP $wp): void
{
    $path = trim((string) $wp->request, '/');
    if ($path === '' || str_contains($path, '/')) {
        return;
    }
    // Reserved: let WordPress own its own surfaces.
    if (in_array($path, ['wp-admin', 'wp-login', 'wp-json', 'feed'], true)) {
        return;
    }

    // robots.txt and sitemap.xml need answering, not just leaving alone.
    //
    // A %postname% permalink structure puts a greedy one-segment rule above
    // core's own root rules, so `robots\.txt$ => index.php?robots=1` is never
    // reached: both paths matched `index.php?name=robots.txt` and 404ed. The
    // rules array is shared with every other rewrite, so reordering it to fix
    // two paths is a wide change for a narrow problem. Naming the query vars
    // here is the same answer core would have given, one rule earlier.
    //
    // /sitemap.xml is the URL the static site published and the one the
    // robots.txt below advertises; core generates the identical document at
    // /wp-sitemap.xml, which keeps working.
    if ($path === 'robots.txt') {
        $wp->query_vars = ['robots' => 1];
        return;
    }
    if ($path === 'sitemap.xml') {
        $wp->query_vars = ['sitemap' => 'index'];
        return;
    }

    $slug = sanitize_title($path);

    $page = get_posts([
        'name' => $slug, 'post_type' => 'page', 'post_status' => 'publish',
        'numberposts' => 1, 'fields' => 'ids',
    ]);
    if ($page) {
        $wp->query_vars = ['page_id' => $page[0]];
        return;
    }

    $gem = get_posts([
        'name' => $slug, 'post_type' => 'gemstone', 'post_status' => 'publish',
        'numberposts' => 1, 'fields' => 'ids',
    ]);
    if ($gem) {
        $wp->query_vars = ['p' => $gem[0], 'post_type' => 'gemstone'];
    }
}
add_action('parse_request', 'gemreserve_resolve_flat_request', 1);

/** Gemstone permalinks are the bare slug too. */
function gemreserve_gemstone_link(string $link, WP_Post $post): string
{
    if ($post->post_type !== 'gemstone') {
        return $link;
    }
    return home_url('/' . $post->post_name . '/');
}
add_filter('post_type_link', 'gemreserve_gemstone_link', 10, 2);

/**
 * WordPress canonicalises a page it thinks lives at a nested URL, which would
 * bounce every flat URL straight back to the hierarchical one. Suppress that
 * for our two types; the flat URL is the canonical one here.
 */
function gemreserve_disable_nested_redirect(string $redirect_url, string $requested_url): string|false
{
    if (is_singular(['page', 'gemstone'])) {
        return false;
    }
    // Core canonicalises /sitemap.xml to /wp-sitemap.xml. The static site
    // published /sitemap.xml and search engines already hold that URL, so it
    // renders in place instead of redirecting. /wp-sitemap.xml still serves the
    // same document for anything that asks for it by core's name.
    if (get_query_var('sitemap')) {
        return false;
    }
    return $redirect_url;
}
add_filter('redirect_canonical', 'gemreserve_disable_nested_redirect', 10, 2);

/**
 * A sitemap is not a 404.
 *
 * WP::handle_404() decides on the main query's post count, and a sitemap
 * request carries no posts of its own. It stayed a 200 only while the default
 * "Hello world!" post existed and the underlying home query happened to return
 * something; deleting that sample post turned every sitemap URL into a valid
 * XML document served with a 404, which crawlers discard. Answer the question
 * core asks, at the filter it provides for it.
 */
function gemreserve_sitemap_is_not_a_404($preempt, WP_Query $query)
{
    if ($query->get('sitemap') || $query->get('sitemap-stylesheet')) {
        return true;
    }
    return $preempt;
}
add_filter('pre_handle_404', 'gemreserve_sitemap_is_not_a_404', 10, 2);

/**
 * An announcement's own URL.
 *
 * A %postname% permalink structure generates a greedy two-segment attachment
 * rule, `[^/]+/([^/]+)/?$`, which sits above every post-type rule and matched
 * /news/<slug>/ first — so a published announcement resolved to a non-existent
 * attachment and 404ed, while the admin's "View" link pointed straight at it.
 * Registering at 'top' puts the rule in extra_rules_top, ahead of the generated
 * set. /news itself stays the migrated page: one-segment requests are resolved
 * before the rewrite array is consulted at all.
 */
function gemreserve_news_permalink_rule(): void
{
    add_rewrite_rule(
        '^news/([^/]+)/?$',
        'index.php?post_type=gr_news&name=$matches[1]',
        'top'
    );
}
add_action('init', 'gemreserve_news_permalink_rule', 20);
