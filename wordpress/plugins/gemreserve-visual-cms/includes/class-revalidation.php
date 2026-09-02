<?php
/**
 * Publish-time cache revalidation.
 *
 * When a page is published, updated or scheduled into existence, the renderer's
 * cached copy is stale. This sends a signed webhook naming the routes that
 * changed.
 *
 * Two decisions are worth stating because they are the ones that usually go
 * wrong:
 *
 * **The webhook names routes, not "everything".** Publishing one page
 * invalidates that page, its parent, and — only when global content changed —
 * the whole site. §16 asks for exactly this: a copy fix on one page must not
 * trigger a full rebuild of 58 routes.
 *
 * **Failure is visible and non-fatal.** A revalidation that cannot be delivered
 * must not prevent the publish: the editor's job is done, the content is
 * correct in WordPress, and the renderer will pick it up on its own TTL. So the
 * failure is recorded and surfaced in the admin rather than thrown at the
 * person who pressed Update.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class Revalidation
{
    private const FAILURE_OPTION = 'gemreserve_vcms_revalidate_failures';
    private const MAX_FAILURES = 20;

    public static function boot(): void
    {
        add_action('transition_post_status', [self::class, 'on_transition'], 20, 3);
        add_action('gemreserve_vcms_retry_revalidate', [self::class, 'deliver'], 10, 1);
        add_action('admin_notices', [self::class, 'failure_notice']);

        // Global content: menus and the corporate settings. A footer change is
        // site-wide, so it invalidates everything.
        add_action('wp_update_nav_menu', [self::class, 'on_globals_changed']);
        add_action('update_option', [self::class, 'maybe_globals'], 10, 1);

        add_action('rest_api_init', [self::class, 'register']);
    }

    public static function register(): void
    {
        // A signature-verification endpoint with no side effects, so the
        // shared secret can be confirmed end to end during deployment without
        // publishing anything or invalidating any cache.
        register_rest_route(Rest::NAMESPACE, '/revalidate-test', [
            'methods' => \WP_REST_Server::CREATABLE,
            'callback' => [self::class, 'verify_endpoint'],
            'permission_callback' => '__return_true',
        ]);
    }

    public static function on_transition(string $new, string $old, \WP_Post $post): void
    {
        if (!in_array($post->post_type, ['page', 'gemstone', 'gr_news'], true)) {
            return;
        }
        // Autosaves and revisions are not publications.
        if (wp_is_post_revision($post->ID) || wp_is_post_autosave($post->ID)) {
            return;
        }
        if ($new === 'auto-draft' || ($new === $old && $new !== 'publish')) {
            return;
        }

        // Unpublishing matters as much as publishing: the route has to stop
        // being served from cache.
        $relevant = in_array($new, ['publish', 'trash', 'draft', 'private'], true)
            || in_array($old, ['publish'], true);

        if (!$relevant) {
            return;
        }

        self::queue(self::routes_for($post), 'post:' . $post->ID . ':' . $new);
    }

    public static function on_globals_changed(): void
    {
        self::queue(['*'], 'globals:' . time());
    }

    public static function maybe_globals(string $option): void
    {
        if (str_starts_with($option, 'gr_')) {
            self::on_globals_changed();
        }
    }

    /**
     * Routes affected by a change to this post.
     *
     * @return string[]
     */
    private static function routes_for(\WP_Post $post): array
    {
        $routes = [Normaliser::route($post)];

        // A child page appears in its parent's navigation and listings.
        if ($post->post_parent) {
            $parent = get_post($post->post_parent);
            if ($parent instanceof \WP_Post) {
                $routes[] = Normaliser::route($parent);
            }
        }

        // News and gemstones appear on their index pages.
        if ($post->post_type === 'gr_news') {
            $routes[] = '/news/';
        }
        if ($post->post_type === 'gemstone') {
            $routes[] = '/assets/';
            $routes[] = '/gemstone-programs/';
        }

        return array_values(array_unique($routes));
    }

    /**
     * @param string[] $routes
     */
    public static function queue(array $routes, string $event_id): void
    {
        if (self::endpoint() === '') {
            return;
        }

        $payload = [
            'schemaVersion' => SCHEMA_VERSION,
            'eventId' => $event_id,
            'issuedAt' => time(),
            'routes' => array_values($routes),
        ];

        self::deliver($payload);
    }

    /**
     * Deliver one webhook.
     *
     * @param array<string,mixed> $payload
     */
    public static function deliver(array $payload): void
    {
        $endpoint = self::endpoint();
        $secret = self::secret();
        if ($endpoint === '' || $secret === '') {
            return;
        }

        $body = wp_json_encode($payload);
        if (!is_string($body)) {
            return;
        }

        $timestamp = (string) ($payload['issuedAt'] ?? time());
        // The timestamp is inside the signed material, not merely sent
        // alongside it. Signing only the body would let an interceptor replay a
        // captured request forever by reusing its headers.
        $signature = hash_hmac('sha256', $timestamp . '.' . $body, $secret);

        $response = wp_remote_post($endpoint, [
            'timeout' => 5,
            'blocking' => true,
            'headers' => [
                'Content-Type' => 'application/json',
                'X-GemReserve-Signature' => 'sha256=' . $signature,
                'X-GemReserve-Timestamp' => $timestamp,
                'X-GemReserve-Event' => (string) ($payload['eventId'] ?? ''),
            ],
            'body' => $body,
        ]);

        if (is_wp_error($response)) {
            self::record_failure($payload, $response->get_error_message());

            return;
        }

        $code = (int) wp_remote_retrieve_response_code($response);
        if ($code >= 200 && $code < 300) {
            return;
        }

        self::record_failure($payload, 'HTTP ' . $code);
    }

    /**
     * Record a delivery failure and schedule one retry.
     *
     * One retry, not an escalating chain: the renderer has its own TTL, so a
     * webhook that fails twice costs a slightly stale page for a few minutes,
     * not a broken site. An unbounded retry queue would be a bigger operational
     * liability than the problem it solves.
     *
     * @param array<string,mixed> $payload
     */
    private static function record_failure(array $payload, string $reason): void
    {
        $failures = get_option(self::FAILURE_OPTION, []);
        if (!is_array($failures)) {
            $failures = [];
        }

        $already_retried = !empty($payload['retry']);

        $failures[] = [
            'at' => gmdate('c'),
            'eventId' => (string) ($payload['eventId'] ?? ''),
            'routes' => $payload['routes'] ?? [],
            'reason' => $reason,
            'retried' => $already_retried,
        ];
        if (count($failures) > self::MAX_FAILURES) {
            $failures = array_slice($failures, -self::MAX_FAILURES);
        }
        update_option(self::FAILURE_OPTION, $failures, false);

        // The reason is logged; the payload is not. It contains no secrets, but
        // logging request bodies as a habit is how secrets eventually get
        // logged.
        error_log(sprintf(
            'GemReserve: cache revalidation failed (%s) for event %s.',
            $reason,
            (string) ($payload['eventId'] ?? 'unknown')
        ));

        if (!$already_retried) {
            $payload['retry'] = true;
            wp_schedule_single_event(time() + 60, 'gemreserve_vcms_retry_revalidate', [$payload]);
        }
    }

    /**
     * Verify a signature without doing anything.
     *
     * Same verification path a real consumer implements, so a deployment can
     * prove the secret matches on both sides before anything depends on it.
     */
    public static function verify_endpoint(\WP_REST_Request $request): \WP_REST_Response
    {
        $secret = self::secret();
        $body = $request->get_body();
        $timestamp = (string) $request->get_header('x-gemreserve-timestamp');
        $provided = (string) $request->get_header('x-gemreserve-signature');

        $valid = false;
        $reason = 'no shared secret configured';

        if ($secret !== '' && $timestamp !== '' && $provided !== '') {
            $age = abs(time() - (int) $timestamp);
            if ($age > 300) {
                $reason = 'timestamp outside the 300s window';
            } else {
                $expected = 'sha256=' . hash_hmac('sha256', $timestamp . '.' . $body, $secret);
                $valid = hash_equals($expected, $provided);
                $reason = $valid ? 'ok' : 'signature mismatch';
            }
        }

        $response = new \WP_REST_Response(['valid' => $valid, 'reason' => $reason], $valid ? 200 : 401);
        $response->header('Cache-Control', 'no-store');

        return $response;
    }

    public static function failure_notice(): void
    {
        if (!current_user_can('gr_manage_globals') && !current_user_can('manage_options')) {
            return;
        }
        $failures = get_option(self::FAILURE_OPTION, []);
        if (!is_array($failures) || $failures === []) {
            return;
        }

        $latest = end($failures);
        printf(
            '<div class="notice notice-warning is-dismissible"><p><strong>%s</strong> %s</p></div>',
            esc_html__('The website cache was not refreshed after a recent change.', 'gemreserve-visual-cms'),
            esc_html(sprintf(
                /* translators: 1: failure reason, 2: ISO timestamp. */
                __('Your content is saved and correct. The public site may show the previous version for a few minutes. Reason: %1$s (at %2$s).', 'gemreserve-visual-cms'),
                (string) ($latest['reason'] ?? 'unknown'),
                (string) ($latest['at'] ?? '')
            ))
        );
    }

    /** @return array<int,array<string,mixed>> */
    public static function failures(): array
    {
        $failures = get_option(self::FAILURE_OPTION, []);

        return is_array($failures) ? $failures : [];
    }

    public static function clear_failures(): void
    {
        delete_option(self::FAILURE_OPTION);
    }

    /**
     * Endpoint and secret come from constants, never the database.
     *
     * An option would be editable by anyone who reaches the settings screen, and
     * a webhook target is a request this server makes — pointing it elsewhere
     * turns the CMS into an SSRF gadget. A constant is set in wp-config or the
     * environment, where only someone with server access can change it.
     */
    private static function endpoint(): string
    {
        return defined('GEMRESERVE_REVALIDATE_URL') ? (string) \GEMRESERVE_REVALIDATE_URL : '';
    }

    private static function secret(): string
    {
        return defined('GEMRESERVE_REVALIDATE_SECRET') ? (string) \GEMRESERVE_REVALIDATE_SECRET : '';
    }
}
