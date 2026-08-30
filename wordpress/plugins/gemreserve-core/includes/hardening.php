<?php
/**
 * Hardening applied in code, so it travels with the deployment rather than
 * living only in a server config someone has to remember to reapply.
 *
 * Nothing here touches the server beyond this site: no global nginx rules, no
 * firewall changes. The existing CSP and HSTS on the host are left alone.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Version strings tell an attacker which exploits to try. */
remove_action('wp_head', 'wp_generator');
add_filter('the_generator', '__return_empty_string');

/** WordPress's discovery endpoints, none of which this site uses. */
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'wp_shortlink_wp_head');

/**
 * XML-RPC is off. It is the usual route for credential stuffing and pingback
 * amplification, and nothing on this site needs it: no Jetpack, no mobile app,
 * no remote publishing.
 */
add_filter('xmlrpc_enabled', '__return_false');
add_filter('pings_open', '__return_false');

/**
 * Enumeration. `?author=1` normally redirects to a username, which hands over
 * half of a login. It is refused here.
 *
 * Priority 0 matters. redirect_canonical is registered on template_redirect at
 * priority 10 while WordPress loads its default filters, so a guard added at
 * the same priority later in the request runs second — and by then the 301 to
 * /author/<username>/ has already been sent. Verified: the redirect leaked
 * gr_admin until this ran first.
 */
function gemreserve_block_author_enumeration(): void
{
    if (!is_admin() && isset($_GET['author']) && !is_user_logged_in()) {
        wp_safe_redirect(home_url('/'), 301);
        exit;
    }
}
add_action('template_redirect', 'gemreserve_block_author_enumeration', 0);

/**
 * Author archives do not exist on this site. Nothing here is bylined, so the
 * archive's only function is to publish a valid username. Requests 404 rather
 * than redirect, which says nothing about whether the user exists.
 */
function gemreserve_disable_author_archives(WP_Query $query): void
{
    if (!is_admin() && $query->is_main_query() && $query->is_author()) {
        $query->set_404();
        status_header(404);
        nocache_headers();
    }
}
add_action('pre_get_posts', 'gemreserve_disable_author_archives');

/** The REST user endpoint leaks the same thing; close it to the public. */
function gemreserve_restrict_rest_users($result)
{
    if (!empty($result)) {
        return $result;
    }
    $route = $GLOBALS['wp']->query_vars['rest_route'] ?? '';
    if (str_starts_with((string) $route, '/wp/v2/users') && !current_user_can('list_users')) {
        return new WP_Error('rest_forbidden', 'Not available.', ['status' => 401]);
    }
    return $result;
}
add_filter('rest_authentication_errors', 'gemreserve_restrict_rest_users');

/**
 * Login errors that distinguish "no such user" from "wrong password" confirm
 * which usernames exist. One message for both.
 */
function gemreserve_login_error(): string
{
    return 'Those details were not recognised.';
}
add_filter('login_errors', 'gemreserve_login_error');

/**
 * Login rate limiting.
 *
 * Five failures from one address buys a fifteen-minute lockout. Transient-based
 * and deliberately simple: it stops credential stuffing without adding a
 * plugin, and it is not a substitute for MFA, which is recommended at handover.
 */
function gemreserve_login_throttle_key(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    return 'gr_login_fail_' . md5((string) $ip);
}

function gemreserve_check_login_throttle($user)
{
    $fails = (int) get_transient(gemreserve_login_throttle_key());
    if ($fails >= 5) {
        return new WP_Error('gr_throttled', 'Too many attempts. Try again in fifteen minutes.');
    }
    return $user;
}
add_filter('authenticate', 'gemreserve_check_login_throttle', 30);

function gemreserve_record_login_failure(): void
{
    $key = gemreserve_login_throttle_key();
    set_transient($key, ((int) get_transient($key)) + 1, 15 * MINUTE_IN_SECONDS);
}
add_action('wp_login_failed', 'gemreserve_record_login_failure');

function gemreserve_clear_login_failures(): void
{
    delete_transient(gemreserve_login_throttle_key());
}
add_action('wp_login', 'gemreserve_clear_login_failures');

/**
 * Security headers are set at the edge, not here.
 *
 * deploy/nginx-wordpress.conf sends the full set — CSP, HSTS, nosniff,
 * X-Frame-Options, Referrer-Policy, Permissions-Policy — with `always`, so it
 * covers every response including the 403s for blocked paths and the 404s
 * WordPress never sees. This filter used to add four of those a second time,
 * which put two X-Frame-Options and two Referrer-Policy headers on every page
 * and, worse, two DIFFERENT Permissions-Policy values: the vhost also denies
 * usb=(), and a browser reading two policies for the same feature set is
 * being asked to guess. One header, one place to change it.
 *
 * If this site is ever served by something other than that vhost, the header
 * set has to move with it.
 */

/** Uploads: no SVG, which is a script-execution vector dressed as an image. */
function gemreserve_restrict_uploads(array $mimes): array
{
    unset($mimes['svg'], $mimes['svgz']);
    return $mimes;
}
add_filter('upload_mimes', 'gemreserve_restrict_uploads');

/**
 * The sitemap lists the site, not the software.
 *
 * Core adds a users provider (which publishes usernames) and a taxonomy
 * provider (which publishes /category/uncategorized/, a page with no content
 * and no place in the information architecture). Neither existed on the static
 * site. Pages, gemstones and News posts are what belongs in the index.
 */
function gemreserve_sitemap_providers($provider, string $name)
{
    return in_array($name, ['users', 'taxonomies'], true) ? false : $provider;
}
add_filter('wp_sitemaps_add_provider', 'gemreserve_sitemap_providers', 10, 2);
