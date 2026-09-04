<?php
/**
 * Signed draft preview.
 *
 * A preview link has to be shareable with someone who is not logged in — that
 * is the whole point of sending one to a colleague — which makes it a bearer
 * credential. The design follows from taking that seriously:
 *
 *   bound to one page      A token for page 33 cannot fetch page 34. This is
 *                          the property that stops "preview one draft" becoming
 *                          "read every draft on the site".
 *   bound to one revision  A token names the revision it was minted for, so a
 *                          link shared last week does not silently start
 *                          showing this week's unreviewed edits.
 *   short-lived            Fifteen minutes by default. Long enough to open and
 *                          read, short enough that a link in a chat log is not
 *                          a standing grant.
 *   single-use nonce       Replaying a captured token fails. Without this,
 *                          expiry is the only bound on a leaked link.
 *   secret never in a URL  The token authenticates a request to the *server*;
 *                          the browser never carries WordPress credentials.
 *
 * The token is an HMAC over the claims, not an encrypted blob: there is nothing
 * secret in the claims, and a signature that anyone can verify but nobody can
 * forge is exactly the requirement.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class Preview
{
    private const TTL = 900;          // 15 minutes.
    private const NONCE_PREFIX = 'gr_vcms_preview_nonce_';
    private const SECRET_OPTION = 'gemreserve_vcms_preview_secret';

    public static function boot(): void
    {
        add_action('rest_api_init', [self::class, 'register']);
        add_filter('preview_post_link', [self::class, 'preview_link'], 10, 2);
        add_action('admin_bar_menu', [self::class, 'admin_bar'], 100);
    }

    public static function register(): void
    {
        register_rest_route(Rest::NAMESPACE, '/preview', [
            'methods' => \WP_REST_Server::READABLE,
            'callback' => [self::class, 'serve'],
            // Authorisation is the token, checked inside the callback, because
            // the caller is a server fetching on behalf of an anonymous browser
            // and has no WordPress session to authenticate with.
            'permission_callback' => '__return_true',
            'args' => [
                'token' => ['type' => 'string', 'required' => true],
            ],
        ]);

        register_rest_route(Rest::NAMESPACE, '/preview-token', [
            'methods' => \WP_REST_Server::CREATABLE,
            'callback' => [self::class, 'mint'],
            'permission_callback' => static function (): bool {
                return current_user_can('gr_preview_drafts') || current_user_can('edit_posts');
            },
            'args' => [
                'id' => ['type' => 'integer', 'required' => true, 'sanitize_callback' => 'absint'],
            ],
        ]);
    }

    /**
     * The signing secret.
     *
     * Generated on first use and stored with autoload off. Deliberately not
     * derived from AUTH_KEY: rotating this secret should invalidate outstanding
     * preview links without logging every user out of WordPress.
     */
    private static function secret(): string
    {
        $secret = get_option(self::SECRET_OPTION, '');
        if (!is_string($secret) || strlen($secret) < 64) {
            $secret = bin2hex(random_bytes(32));
            update_option(self::SECRET_OPTION, $secret, false);
        }

        return $secret;
    }

    /**
     * Mint a token for one page.
     *
     * @return array{token:string,expires:int,url:string}
     */
    public static function issue(int $post_id): array
    {
        $post = get_post($post_id);
        if (!$post instanceof \WP_Post) {
            return ['token' => '', 'expires' => 0, 'url' => ''];
        }

        $claims = [
            'v' => 1,
            'id' => $post_id,
            // Modified time stands in for "which revision": it changes whenever
            // the draft does, so a token stops matching as soon as the content
            // it was minted for is superseded.
            'rev' => (string) get_post_modified_time('U', true, $post),
            'exp' => time() + self::TTL,
            'jti' => bin2hex(random_bytes(16)),
        ];

        $payload = self::b64(wp_json_encode($claims) ?: '{}');
        $signature = self::b64(hash_hmac('sha256', $payload, self::secret(), true));
        $token = $payload . '.' . $signature;

        // Reserve the nonce. Consuming it on use is what makes the token
        // single-use; a token whose nonce is gone is a replay.
        set_transient(self::NONCE_PREFIX . $claims['jti'], 1, self::TTL + 60);

        return [
            'token' => $token,
            'expires' => $claims['exp'],
            'url' => self::front_end_url($post, $token),
        ];
    }

    public static function mint(\WP_REST_Request $request): \WP_REST_Response|\WP_Error
    {
        $id = (int) $request->get_param('id');
        if (!current_user_can('edit_post', $id)) {
            return new \WP_Error(
                'gemreserve_forbidden',
                __('You cannot preview that page.', 'gemreserve-visual-cms'),
                ['status' => 403]
            );
        }

        $issued = self::issue($id);
        if ($issued['token'] === '') {
            return new \WP_Error('gemreserve_not_found', __('Page not found.', 'gemreserve-visual-cms'), ['status' => 404]);
        }

        $response = new \WP_REST_Response($issued, 200);
        $response->header('Cache-Control', 'no-store');

        return $response;
    }

    /**
     * Serve preview content against a token.
     */
    public static function serve(\WP_REST_Request $request): \WP_REST_Response|\WP_Error
    {
        $claims = self::verify((string) $request->get_param('token'));
        if ($claims === null) {
            return self::deny();
        }

        $post = get_post((int) $claims['id']);
        if (!$post instanceof \WP_Post) {
            return self::deny();
        }

        // The token names a revision; if the draft has moved on, the link is
        // stale. Refusing is the safe answer: silently serving newer content
        // would mean a link shared for review shows something never reviewed.
        $current = (string) get_post_modified_time('U', true, $post);
        if (!hash_equals((string) $claims['rev'], $current)) {
            return new \WP_Error(
                'gemreserve_preview_stale',
                __('This preview link is out of date because the page has been edited since it was created. Ask for a new link.', 'gemreserve-visual-cms'),
                ['status' => 409]
            );
        }

        $data = Normaliser::page($post, true);
        $data['preview'] = [
            'isPreview' => true,
            'expiresAt' => gmdate('c', (int) $claims['exp']),
            'status' => $post->post_status,
        ];

        $response = new \WP_REST_Response($data, 200);

        // Preview content must never be cached anywhere, and must never be
        // indexed. Both are stated on the response rather than left to the
        // consumer to remember.
        $response->header('Cache-Control', 'private, no-store, max-age=0');
        $response->header('X-Robots-Tag', 'noindex, nofollow, noarchive');

        return $response;
    }

    /**
     * Verify a token and consume its nonce.
     *
     * @return array<string,mixed>|null
     */
    public static function verify(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 2) {
            return null;
        }

        [$payload, $signature] = $parts;

        $expected = self::b64(hash_hmac('sha256', $payload, self::secret(), true));
        // Constant-time compare: a byte-at-a-time comparison here is a signature
        // forgery oracle given enough attempts.
        if (!hash_equals($expected, $signature)) {
            return null;
        }

        $json = self::unb64($payload);
        $claims = json_decode($json, true);
        if (!is_array($claims) || ($claims['v'] ?? 0) !== 1) {
            return null;
        }
        if (!isset($claims['id'], $claims['exp'], $claims['jti'], $claims['rev'])) {
            return null;
        }
        if (time() > (int) $claims['exp']) {
            return null;
        }

        $nonce_key = self::NONCE_PREFIX . (string) $claims['jti'];
        if (!get_transient($nonce_key)) {
            return null; // Already used, or never issued.
        }
        delete_transient($nonce_key);

        return $claims;
    }

    /**
     * Point WordPress's own Preview button at the Next.js draft route.
     *
     * Only when a renderer base URL is configured. Without one the button keeps
     * its normal behaviour, which previews through the WordPress theme — the
     * live renderer today, and therefore the honest preview.
     */
    public static function preview_link(string $link, \WP_Post $post): string
    {
        $base = self::renderer_base();
        if ($base === '' || !in_array($post->post_type, MIGRATED_POST_TYPES, true)) {
            return $link;
        }

        $issued = self::issue($post->ID);
        if ($issued['token'] === '') {
            return $link;
        }

        return $issued['url'];
    }

    private static function front_end_url(\WP_Post $post, string $token): string
    {
        $base = self::renderer_base();
        if ($base === '') {
            return add_query_arg('preview', 'true', (string) get_permalink($post));
        }

        return add_query_arg(
            [
                'token' => $token,
                'route' => Normaliser::route($post),
            ],
            rtrim($base, '/') . '/api/preview'
        );
    }

    /**
     * Where the Next.js renderer lives, if it is in use.
     *
     * Read from a constant so it is set in wp-config or the environment and
     * never stored in the database where an editor could point previews at
     * another host.
     */
    private static function renderer_base(): string
    {
        return defined('GEMRESERVE_RENDERER_URL') ? (string) \GEMRESERVE_RENDERER_URL : '';
    }

    public static function admin_bar(\WP_Admin_Bar $bar): void
    {
        if (!is_admin() || !current_user_can('gr_preview_drafts')) {
            return;
        }
        $screen = function_exists('get_current_screen') ? get_current_screen() : null;
        if (!$screen || $screen->base !== 'post' || !in_array($screen->post_type, MIGRATED_POST_TYPES, true)) {
            return;
        }

        $bar->add_node([
            'id' => 'gemreserve-preview-note',
            'title' => __('Preview links expire after 15 minutes', 'gemreserve-visual-cms'),
            'meta' => ['class' => 'gr-preview-note'],
        ]);
    }

    private static function b64(string $raw): string
    {
        return rtrim(strtr(base64_encode($raw), '+/', '-_'), '=');
    }

    private static function unb64(string $encoded): string
    {
        $padded = strtr($encoded, '-_', '+/');
        $padded .= str_repeat('=', (4 - strlen($padded) % 4) % 4);

        return (string) base64_decode($padded, true);
    }

    private static function deny(): \WP_Error
    {
        // One message for every failure: expired, replayed, forged, unknown
        // page. Distinguishing them would tell someone probing the endpoint
        // which part of their guess was right.
        return new \WP_Error(
            'gemreserve_preview_denied',
            __('This preview link is not valid. It may have expired or already been used.', 'gemreserve-visual-cms'),
            ['status' => 403]
        );
    }
}
