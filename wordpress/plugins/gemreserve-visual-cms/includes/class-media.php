<?php
/**
 * Media handling.
 *
 * The audit found the Media Library holds exactly one file: every image on the
 * site is a theme-asset path baked into the migrated markup. §18 asks for those
 * to become real attachment references.
 *
 * What is done here, and what is deliberately not:
 *
 * **Not done: bulk-importing 500 theme assets into the Media Library.** It
 * sounds like the obvious reading of §18, and it would be a mistake. Those
 * files are deployed with the theme, versioned with it, and optimised by the
 * asset pipeline; copying them into `uploads/` would create a second copy of
 * every image with no provenance, double the backup size, and leave two sources
 * of truth for the same picture. Worse, the migrated `srcset` attributes would
 * still point at the theme copies, so the imported ones would be unreferenced
 * files that look authoritative.
 *
 * **Done: make the Library the route for anything new, and make replacement
 * safe.** An editor choosing a replacement image gets the Media Library picker;
 * the chosen attachment's URL replaces the slot value, and the stale
 * fifteen-candidate `srcset` that pointed at the old file is rewritten so the
 * browser cannot keep loading it. Alt text travels with the attachment.
 *
 * **Done: import on demand.** `import_theme_asset()` brings a single theme
 * asset into the Library, deduplicated by content hash, for the case where an
 * editor genuinely needs to manage one. It is called by the migration only for
 * assets an editor is likely to touch, never wholesale.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class Media
{
    private const HASH_META = '_gr_vcms_source_sha256';
    private const ORIGIN_META = '_gr_vcms_source_path';

    public static function boot(): void
    {
        add_filter('rest_pre_insert_page', [self::class, 'rewrite_stale_srcset'], 10, 2);
        add_filter('wp_handle_upload_prefilter', [self::class, 'reject_dangerous_uploads']);
    }

    /**
     * Refuse uploads that are dangerous regardless of what WordPress allows.
     *
     * SVG is the one that matters. WordPress does not permit SVG uploads by
     * default, but plugins routinely enable it, and an SVG is a script-bearing
     * document served from the site's own origin — a stored-XSS primitive handed
     * to anyone who can upload. The icons this design uses are inline and
     * sanitised (Renderer::sanitize_icon); none of them arrive as uploads, so
     * there is nothing to trade off.
     *
     * @param array<string,mixed> $file
     * @return array<string,mixed>
     */
    public static function reject_dangerous_uploads(array $file): array
    {
        $name = strtolower((string) ($file['name'] ?? ''));
        $type = strtolower((string) ($file['type'] ?? ''));

        $blocked_extensions = ['svg', 'svgz', 'html', 'htm', 'xhtml', 'xml', 'php', 'phtml', 'phar', 'js', 'mjs'];
        $extension = pathinfo($name, PATHINFO_EXTENSION);

        if (in_array($extension, $blocked_extensions, true)
            || str_contains($type, 'svg')
            || str_contains($type, 'html')) {
            $file['error'] = __(
                'That file type cannot be uploaded. Please use JPEG, PNG, WebP, AVIF, MP4 or PDF. If you need a new icon, ask a developer to add it to the shared icon set.',
                'gemreserve-visual-cms'
            );
        }

        return $file;
    }

    /**
     * Keep `srcset` honest when an image slot changes.
     *
     * The migrated markup carries Next.js-exported `srcset` attributes listing
     * fifteen width descriptors that all resolve to the same file. If an editor
     * replaces the `src` and the `srcset` is left alone, every browser that
     * understands `srcset` — which is all of them — keeps loading the *old*
     * image and the replacement silently does nothing. That failure is
     * invisible in the editor and obvious to visitors, which is the worst
     * combination.
     *
     * So on save, any `srcset` in a block template that no longer agrees with
     * its own `src` is dropped. Losing a fake responsive set costs nothing; the
     * candidates were never different files.
     *
     * @param \stdClass        $prepared
     * @param \WP_REST_Request $request
     */
    public static function rewrite_stale_srcset(\stdClass $prepared, \WP_REST_Request $request): \stdClass
    {
        if (!isset($prepared->post_content) || !is_string($prepared->post_content)) {
            return $prepared;
        }
        if (!str_contains($prepared->post_content, 'srcset')) {
            return $prepared;
        }

        $prepared->post_content = self::strip_mismatched_srcset($prepared->post_content);

        return $prepared;
    }

    /**
     * Remove `srcset`/`sizes` from any `<img>` whose `src` is not among its
     * own candidates.
     */
    public static function strip_mismatched_srcset(string $html): string
    {
        return (string) preg_replace_callback(
            '#<img\b[^>]*>#i',
            static function (array $m): string {
                $tag = $m[0];
                if (!preg_match('#\bsrcset="([^"]*)"#i', $tag, $set)) {
                    return $tag;
                }
                if (!preg_match('#\bsrc="([^"]*)"#i', $tag, $src)) {
                    return $tag;
                }

                $current = trim($src[1]);
                // A slot placeholder has not been resolved yet; leave it be.
                if ($current === '' || str_contains($current, '{{gr_')) {
                    return $tag;
                }

                foreach (explode(',', $set[1]) as $candidate) {
                    $url = trim(explode(' ', trim($candidate))[0] ?? '');
                    if ($url !== '' && $url === $current) {
                        return $tag; // Still consistent.
                    }
                }

                $tag = (string) preg_replace('#\s*\bsrcset="[^"]*"#i', '', $tag);

                return (string) preg_replace('#\s*\bsizes="[^"]*"#i', '', $tag);
            },
            $html
        );
    }

    /**
     * Bring one theme asset into the Media Library, once.
     *
     * Deduplicated on the file's SHA-256 so calling this repeatedly — or from
     * two pages referencing the same picture — yields one attachment rather
     * than a Library full of near-duplicates.
     *
     * @param string $relative Path under the theme root, e.g. assets/images/x.webp
     * @return int Attachment ID, or 0 on failure.
     */
    public static function import_theme_asset(string $relative): int
    {
        $relative = ltrim(str_replace('\\', '/', $relative), '/');

        // Path traversal: this takes a caller-supplied path and reads a file.
        // Resolving and then confirming the result is still inside the theme is
        // the check that matters; rejecting ".." alone is not enough because
        // symlinks and encodings can get around it.
        if (str_contains($relative, "\0")) {
            return 0;
        }

        $theme_root = (string) realpath(get_template_directory());
        $candidate = realpath($theme_root . '/' . $relative);
        if ($theme_root === '' || $candidate === false || !str_starts_with($candidate, $theme_root . '/')) {
            return 0;
        }
        if (!is_file($candidate) || !is_readable($candidate)) {
            return 0;
        }

        $type = wp_check_filetype(basename($candidate));
        if (empty($type['type']) || !str_starts_with((string) $type['type'], 'image/')) {
            return 0;
        }

        $hash = hash_file('sha256', $candidate);
        $existing = get_posts([
            'post_type' => 'attachment',
            'post_status' => 'inherit',
            'numberposts' => 1,
            'fields' => 'ids',
            'meta_query' => [['key' => self::HASH_META, 'value' => $hash]],
        ]);
        if ($existing) {
            return (int) $existing[0];
        }

        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';

        $uploads = wp_upload_dir();
        if (!empty($uploads['error'])) {
            return 0;
        }

        $filename = wp_unique_filename($uploads['path'], basename($candidate));
        $destination = $uploads['path'] . '/' . $filename;
        if (!copy($candidate, $destination)) {
            return 0;
        }

        $attachment_id = wp_insert_attachment([
            'post_mime_type' => $type['type'],
            'post_title' => sanitize_file_name(pathinfo($filename, PATHINFO_FILENAME)),
            'post_content' => '',
            'post_status' => 'inherit',
        ], $destination);

        if (is_wp_error($attachment_id) || !$attachment_id) {
            @unlink($destination);

            return 0;
        }

        wp_update_attachment_metadata(
            $attachment_id,
            wp_generate_attachment_metadata($attachment_id, $destination)
        );

        update_post_meta($attachment_id, self::HASH_META, $hash);
        update_post_meta($attachment_id, self::ORIGIN_META, $relative);

        return (int) $attachment_id;
    }

    /**
     * How much of the site's imagery is Library-managed.
     *
     * Reported rather than asserted; `CMS_MEDIA_REMEDIATION.md` uses it.
     *
     * @return array<string,int>
     */
    public static function stats(): array
    {
        $attachments = (array) get_posts([
            'post_type' => 'attachment',
            'post_status' => 'inherit',
            'numberposts' => -1,
            'fields' => 'ids',
        ]);

        $theme_refs = 0;
        $library_refs = 0;
        $missing_alt = 0;

        foreach (Migrator::candidates() as $id) {
            $content = (string) get_post_field('post_content', $id);
            $legacy = (string) get_post_meta($id, '_gr_body_html', true);
            $haystack = $content !== '' ? $content : $legacy;

            $theme_refs += preg_match_all('#/wp-content/themes/[^"\']+\.(?:webp|avif|png|jpe?g)#i', $haystack);
            $library_refs += preg_match_all('#/wp-content/uploads/[^"\']+\.(?:webp|avif|png|jpe?g)#i', $haystack);
            $missing_alt += preg_match_all('#<img\b(?![^>]*\balt=)[^>]*>#i', $haystack);
        }

        return [
            'attachments' => count($attachments),
            'themeAssetReferences' => $theme_refs,
            'libraryReferences' => $library_refs,
            'imagesMissingAlt' => $missing_alt,
        ];
    }
}
