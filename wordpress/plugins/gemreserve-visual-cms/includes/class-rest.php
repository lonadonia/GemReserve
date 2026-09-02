<?php
/**
 * The versioned content API.
 *
 * `/wp-json/gemreserve/v1/`.
 *
 * The rule that shapes every route here: **the public endpoints serve published
 * public content and nothing else.** Not "published content plus a status field
 * a client should ignore" — draft, pending, scheduled, private and
 * password-protected content is absent from the public responses entirely, and
 * reaching it requires the signed preview path in class-preview.php.
 *
 * That is stricter than WordPress's own `wp/v2` behaviour with `context=edit`,
 * and deliberately so: this API is designed to be consumed by a static site
 * generator that caches what it fetches, and an endpoint that can be talked
 * into returning a draft is an endpoint that can get a draft cached on a CDN.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class Rest
{
    public const NAMESPACE = 'gemreserve/v1';

    public static function boot(): void
    {
        add_action('rest_api_init', [self::class, 'register']);
    }

    public static function register(): void
    {
        register_rest_route(self::NAMESPACE, '/pages', [
            'methods' => \WP_REST_Server::READABLE,
            'callback' => [self::class, 'index'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route(self::NAMESPACE, '/page', [
            'methods' => \WP_REST_Server::READABLE,
            'callback' => [self::class, 'page'],
            'permission_callback' => '__return_true',
            'args' => [
                'route' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => [self::class, 'sanitize_route'],
                ],
                'id' => [
                    'type' => 'integer',
                    'required' => false,
                    'sanitize_callback' => 'absint',
                ],
            ],
        ]);

        register_rest_route(self::NAMESPACE, '/globals', [
            'methods' => \WP_REST_Server::READABLE,
            'callback' => [self::class, 'globals'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route(self::NAMESPACE, '/health', [
            'methods' => \WP_REST_Server::READABLE,
            'callback' => [self::class, 'health'],
            'permission_callback' => '__return_true',
        ]);
    }

    /**
     * A route as stored: leading slash, trailing slash, no scheme or host.
     *
     * Normalised rather than validated-and-rejected because a consumer asking
     * for `about` and a consumer asking for `/about/` mean the same page. What
     * is stripped is anything that could make this a lookup outside the site.
     */
    public static function sanitize_route(mixed $value): string
    {
        $route = (string) $value;

        // A full URL is accepted but reduced to its path, so a caller cannot
        // use this parameter to point the lookup at another host.
        $path = parse_url($route, PHP_URL_PATH);
        if (is_string($path)) {
            $route = $path;
        }

        $route = '/' . trim($route, "/ \t\n\r\0\x0B");
        $route = preg_replace('#/{2,}#', '/', $route) ?? '/';

        // No traversal. There is no filesystem behind this, but a route
        // containing ../ is malformed and should not reach a query.
        $route = str_replace(['..', "\0"], '', $route);

        return $route === '/' ? '/' : rtrim($route, '/') . '/';
    }

    /**
     * Route index, for static generation.
     */
    public static function index(\WP_REST_Request $request): \WP_REST_Response
    {
        $routes = [];

        foreach (self::public_posts() as $post) {
            $routes[] = [
                'id' => $post->ID,
                'route' => Normaliser::route($post),
                'type' => $post->post_type,
                'updatedAt' => get_post_modified_time('c', true, $post) ?: null,
            ];
        }

        return self::respond([
            'schemaVersion' => SCHEMA_VERSION,
            'count' => count($routes),
            'routes' => $routes,
        ]);
    }

    public static function page(\WP_REST_Request $request): \WP_REST_Response|\WP_Error
    {
        $id = (int) $request->get_param('id');
        $route = (string) $request->get_param('route');

        $post = $id > 0 ? get_post($id) : self::find_by_route($route);

        if (!$post instanceof \WP_Post) {
            return new \WP_Error(
                'gemreserve_not_found',
                __('No published page matches that route.', 'gemreserve-visual-cms'),
                ['status' => 404]
            );
        }

        // The single gate for the public path. Everything else about this
        // endpoint is presentation.
        if (!self::is_publicly_readable($post)) {
            return new \WP_Error(
                'gemreserve_not_found',
                __('No published page matches that route.', 'gemreserve-visual-cms'),
                ['status' => 404]
            );
        }

        return self::respond(Normaliser::page($post, false));
    }

    /**
     * Site-wide editorial content.
     *
     * Navigation, footer, identity and the announcement — the things §13 asks
     * WordPress to manage. Read from gemreserve-core's settings and from
     * WordPress's own menus, so this endpoint publishes what the site already
     * uses rather than a second copy that could disagree with it.
     */
    public static function globals(\WP_REST_Request $request): \WP_REST_Response
    {
        $locations = get_nav_menu_locations();
        $menus = [];

        foreach ($locations as $location => $menu_id) {
            if (!$menu_id) {
                continue;
            }
            $items = wp_get_nav_menu_items($menu_id);
            if (!is_array($items)) {
                continue;
            }
            $menus[$location] = self::menu_tree($items);
        }

        return self::respond([
            'schemaVersion' => SCHEMA_VERSION,
            'announcement' => [
                'message' => self::setting('announcement_message'),
                'enabled' => self::setting('announcement_enabled') !== '0',
            ],
            'identity' => [
                'legalName' => self::setting('company_legal_name'),
                'companyCode' => self::setting('company_code'),
                'addressLine1' => self::setting('company_address_1'),
                'addressLine2' => self::setting('company_address_2'),
                'city' => self::setting('company_city'),
                'country' => self::setting('company_country'),
                'countryAdjective' => self::setting('company_country_adjective'),
            ],
            'contact' => [
                'general' => self::setting('email_general'),
                'investor' => self::setting('email_investor'),
                'media' => self::setting('email_media'),
                'partnerships' => self::setting('email_partnerships'),
            ],
            'footer' => [
                'blurb' => self::setting('footer_blurb'),
                'motto' => self::setting('footer_motto'),
                'tagline' => self::setting('footer_tagline'),
                'copyright' => self::setting('footer_copyright'),
            ],
            'menus' => $menus,
            'seoDefaults' => [
                'siteName' => get_bloginfo('name'),
                'description' => get_bloginfo('description'),
                'home' => home_url('/'),
            ],
        ]);
    }

    /**
     * Liveness and contract information.
     *
     * Exists so a deployment smoke test has something to assert against that is
     * not a content page: the schema version a consumer must match, and whether
     * the migration has run.
     */
    public static function health(\WP_REST_Request $request): \WP_REST_Response
    {
        $candidates = Migrator::candidates();
        $migrated = 0;
        foreach ($candidates as $id) {
            if (Migrator::is_migrated($id)) {
                $migrated++;
            }
        }

        return self::respond([
            'schemaVersion' => SCHEMA_VERSION,
            'pluginVersion' => VERSION,
            'pagesWithLegacyBody' => count($candidates),
            'pagesMigrated' => $migrated,
            'blocks' => Blocks::names(),
        ]);
    }

    /**
     * @param array<int,\WP_Post|object> $items
     * @return array<int,array<string,mixed>>
     */
    private static function menu_tree(array $items, int $parent = 0): array
    {
        $out = [];
        foreach ($items as $item) {
            if ((int) $item->menu_item_parent !== $parent) {
                continue;
            }
            $out[] = [
                'id' => (int) $item->ID,
                'label' => $item->title,
                'url' => $item->url,
                'target' => $item->target ?: null,
                'description' => $item->description ?: null,
                'children' => self::menu_tree($items, (int) $item->ID),
            ];
        }

        return $out;
    }

    private static function setting(string $key): string
    {
        return (string) get_option('gr_' . $key, '');
    }

    /**
     * Is this post safe to serve on an unauthenticated endpoint?
     *
     * Every clause is a distinct way content that is not public could otherwise
     * escape: a scheduled post whose date has not arrived, a private page, a
     * password-protected page, a revision, and a post type that is not part of
     * the public site.
     */
    private static function is_publicly_readable(\WP_Post $post): bool
    {
        if (!in_array($post->post_type, ['page', 'gemstone'], true)) {
            return false;
        }
        if ($post->post_status !== 'publish') {
            return false;
        }
        if ($post->post_password !== '') {
            return false;
        }
        if (wp_is_post_revision($post->ID) || wp_is_post_autosave($post->ID)) {
            return false;
        }

        $type = get_post_type_object($post->post_type);

        return $type !== null && $type->public;
    }

    /** @return \WP_Post[] */
    private static function public_posts(): array
    {
        $posts = get_posts([
            'post_type' => ['page', 'gemstone'],
            'post_status' => 'publish',
            'numberposts' => -1,
            'orderby' => 'ID',
            'order' => 'ASC',
        ]);

        return array_values(array_filter($posts, [self::class, 'is_publicly_readable']));
    }

    private static function find_by_route(string $route): ?\WP_Post
    {
        if ($route === '' || $route === '/') {
            $front = (int) get_option('page_on_front');

            return $front ? get_post($front) : null;
        }

        $slug = trim($route, '/');
        // Flat permalinks mean the last segment identifies the page.
        if (str_contains($slug, '/')) {
            $parts = explode('/', $slug);
            $slug = (string) end($parts);
        }

        foreach (['page', 'gemstone'] as $type) {
            $found = get_posts([
                'post_type' => $type,
                'post_status' => 'publish',
                'name' => $slug,
                'numberposts' => 1,
            ]);
            if ($found) {
                return $found[0];
            }
        }

        return null;
    }

    /**
     * A public, cacheable response.
     *
     * The cache headers are on the response rather than left to the edge on
     * purpose: this content changes only on publish, and publish sends a
     * revalidation webhook, so a short shared cache with a long
     * stale-while-revalidate is both correct and cheap. `public` is safe here
     * precisely because the endpoint cannot return non-public content.
     *
     * @param array<string,mixed> $data
     */
    private static function respond(array $data): \WP_REST_Response
    {
        $response = new \WP_REST_Response($data, 200);
        $response->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=600');
        $response->header('X-GemReserve-Schema', SCHEMA_VERSION);

        return $response;
    }
}
