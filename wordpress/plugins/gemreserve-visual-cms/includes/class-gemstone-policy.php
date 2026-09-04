<?php
/**
 * Who may edit what on a gemstone.
 *
 * The problem this solves, stated precisely. `gemstone` was registered with
 * `capability_type => 'post'`, so editing one required `edit_others_posts` and
 * `edit_published_posts`. Those are the same capabilities that govern
 * `gr_document` — the compliance-controlled register. Granting them to a
 * marketing role so it could reach the 18 gemstone pages would also have handed
 * it the controlled documents, so the previous deployment left marketing unable
 * to edit gemstones at all rather than make that trade.
 *
 * The fix is not a bigger grant. It is a smaller one: give `gemstone` and
 * `gr_document` their own capability sets so the two can be granted
 * independently, then split the gemstone's own fields into the part marketing
 * owns and the part it must not touch.
 *
 * ## The split
 *
 * A gemstone page carries two different kinds of statement. One is marketing:
 * the hero, the copy, the imagery, the calls to action, the SEO surface. The
 * other is a claim about a real asset: what the stone is, where it came from,
 * what it weighs, whether evidence exists, whether it is in custody, which
 * laboratory issued which report. The second kind is why the page is safe to
 * publish, and it is not marketing's to change.
 *
 * ## Default deny
 *
 * Everything in the `_gr_` namespace is protected unless it appears in
 * MARKETING_META. A field added later — by this project or by anyone else — is
 * therefore denied to marketing until somebody deliberately adds it to the
 * allowlist. That is the intended failure direction.
 *
 * Keys outside `_gr_` are left alone: `_edit_lock`, `_thumbnail_id`,
 * `_wp_page_template` and the rest are how WordPress runs an edit session, and
 * blocking them would break editing without protecting anything.
 *
 * ## Enforcement, in layers
 *
 * The UI layer is not a control, so it is the last of five and the only one
 * that is cosmetic:
 *
 *   1. `update_post_metadata` / `add_post_metadata` / `delete_post_metadata`
 *      — the choke point every writer passes through: REST, the meta-box POST,
 *      XML-RPC, another plugin, a crafted payload. Blocking here means a new
 *      write path cannot appear that bypasses the policy.
 *   2. `auth_callback` on the registered meta — refuses the REST meta route
 *      before it reaches the storage layer, so the API answers 403 rather than
 *      silently discarding.
 *   3. `save_post` at priority 1 — strips protected keys out of `$_POST`
 *      before `gemreserve_save_fields()` reads them.
 *   4. `is_protected_meta` — keeps them out of the Custom Fields box.
 *   5. Meta boxes for protected groups are removed for users who lack the
 *      capability, so nobody is offered a control that will refuse them.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class GemstonePolicy
{
    /** Held by anyone who may change a gemstone's asset record. Never marketing. */
    public const CAP_RECORD = 'gr_manage_gemstone_record';

    /**
     * The gemstone meta a marketing user may write.
     *
     * Presentation and the SEO surface. Nothing that describes the asset, its
     * provenance, its custody or the evidence behind it.
     */
    public const MARKETING_META = [
        // Hero — the top of the page.
        '_gr_hero_eyebrow',
        '_gr_hero_title_lines',
        '_gr_hero_tagline',
        '_gr_hero_description',
        '_gr_hero_image_desktop',
        '_gr_hero_image_mobile',
        // Presentation.
        '_gr_tagline',
        '_gr_accent',
        '_gr_hero_image',
        '_gr_cutout_image',
        '_gr_cta_label',
        '_gr_cta_href',
        // SEO. Editing what is already there; the withdrawn strategy is not
        // implemented and no new SEO surface is introduced.
        '_gr_seo_title',
        '_gr_seo_description',
        '_gr_canonical_url',
        '_gr_noindex',
    ];


    public static function boot(): void
    {
        // Capability sets. A filter rather than an edit to gemreserve-core, so
        // deactivating this plugin restores the previous model exactly — which
        // is the same rollback lever the rest of the CMS work uses.
        add_filter('register_post_type_args', [self::class, 'post_type_args'], 10, 2);

        add_filter('map_meta_cap', [self::class, 'map_record_cap'], 10, 4);

        // Layer 1 — the storage choke point.
        add_filter('update_post_metadata', [self::class, 'guard_write'], 10, 4);
        add_filter('add_post_metadata', [self::class, 'guard_write'], 10, 4);
        add_filter('delete_post_metadata', [self::class, 'guard_write'], 10, 4);

        // Layer 2 — REST meta authorisation.
        add_filter('register_meta_args', [self::class, 'tighten_auth_callback'], 10, 4);

        // Layer 3 — the classic meta-box POST.
        add_action('save_post', [self::class, 'strip_protected_post_data'], 1);

        // Layer 4 — keep them out of Custom Fields.
        add_filter('is_protected_meta', [self::class, 'is_protected'], 10, 3);

        // Layer 5 — do not offer a control that will refuse.
        add_action('add_meta_boxes', [self::class, 'remove_record_meta_boxes'], 99);

        // REST: refuse a payload that carries protected meta rather than
        // dropping it quietly, so an API consumer is told it was rejected.
        add_filter('rest_pre_insert_gemstone', [self::class, 'reject_protected_rest'], 10, 2);
    }

    /**
     * Give `gemstone` and `gr_document` their own capability sets.
     *
     * `gr_document` is separated in the same breath and for the same reason.
     * While it shared the `post` family, a Marketing Publisher — which holds
     * `edit_posts` and `publish_posts` — could create and publish a new
     * controlled document. It could not edit an existing one, which is
     * presumably why it went unnoticed. Splitting the type closes that without
     * changing anything for compliance or administrators, who are granted the
     * new capabilities below.
     *
     * @param array<string,mixed> $args
     * @return array<string,mixed>
     */
    public static function post_type_args(array $args, string $post_type): array
    {
        if ($post_type === 'gemstone') {
            $args['capability_type'] = ['gemstone', 'gemstones'];
            $args['map_meta_cap'] = true;
        }

        if ($post_type === 'gr_document') {
            $args['capability_type'] = ['gr_document', 'gr_documents'];
            $args['map_meta_cap'] = true;
        }

        return $args;
    }

    /** The primitive capabilities WordPress derives from a capability_type pair. */
    public static function caps_for(string $singular, string $plural): array
    {
        return [
            "edit_{$plural}",
            "edit_others_{$plural}",
            "edit_published_{$plural}",
            "publish_{$plural}",
            "read_private_{$plural}",
            "delete_{$plural}",
            "delete_private_{$plural}",
            "delete_published_{$plural}",
            "delete_others_{$plural}",
            "create_{$plural}",
        ];
    }

    /**
     * CAP_RECORD is not a primitive; it resolves to one.
     *
     * Mapping it rather than granting it directly means a role that should not
     * have it cannot acquire it by being handed a capability that happens to
     * imply it.
     *
     * @param string[] $caps
     * @param mixed[]  $args
     * @return string[]
     */
    public static function map_record_cap(array $caps, string $cap, int $user_id, array $args): array
    {
        if ($cap !== self::CAP_RECORD) {
            return $caps;
        }

        return [self::CAP_RECORD];
    }

    /** Is this a gemstone meta key that marketing must not write? */
    public static function is_record_meta(string $meta_key): bool
    {
        if (!str_starts_with($meta_key, '_gr_')) {
            return false;
        }

        return !in_array($meta_key, self::MARKETING_META, true);
    }

    /**
     * May the current user write the asset record?
     *
     * A request with no user is not a browser request — WP-CLI, cron, the
     * migration. Those are trusted by the same reasoning that lets WP-CLI run
     * `wp gemreserve migrate` at all: reaching them already requires shell
     * access on the host.
     */
    public static function may_edit_record(): bool
    {
        if (!is_user_logged_in()) {
            return true;
        }

        return current_user_can(self::CAP_RECORD);
    }

    /**
     * Layer 1. Refuse the write itself.
     *
     * Returning a non-null value short-circuits the metadata API, so nothing
     * reaches the database no matter which code path asked.
     *
     * @param mixed $check
     * @return mixed
     */
    public static function guard_write($check, int $object_id, string $meta_key, $meta_value = null)
    {
        if ($check !== null) {
            return $check;
        }
        if (get_post_type($object_id) !== 'gemstone') {
            return $check;
        }
        if (!self::is_record_meta($meta_key)) {
            return $check;
        }
        if (self::may_edit_record()) {
            return $check;
        }

        Audit::record('gemstone_record_write_refused', $object_id, $meta_key);

        // false, not null: the metadata API reports failure to the caller.
        return false;
    }

    /**
     * Layer 2. The REST meta route asks this before writing.
     *
     * gemreserve-core registers every field with
     * `auth_callback => current_user_can('edit_posts')`, which a marketing role
     * satisfies. That would have been the hole the moment gemstone capabilities
     * were granted, so the callback is replaced rather than added to.
     *
     * @param array<string,mixed> $args
     * @return array<string,mixed>
     */
    public static function tighten_auth_callback(array $args, array $defaults, string $object_type, string $meta_key): array
    {
        if ($object_type !== 'post') {
            return $args;
        }
        // register_post_meta() carries the post type in object_subtype.
        if (($args['object_subtype'] ?? '') !== 'gemstone') {
            return $args;
        }
        if (!self::is_record_meta($meta_key)) {
            return $args;
        }

        $args['auth_callback'] = static fn(): bool => self::may_edit_record();

        return $args;
    }

    /**
     * Layer 3. `gemreserve_save_fields()` reads `$_POST` directly and gates only
     * on `edit_post`, so a marketing user editing a gemstone would otherwise
     * post the whole schema back including the asset record. The keys are
     * removed before that handler runs, at priority 1.
     */
    public static function strip_protected_post_data(int $post_id): void
    {
        if (get_post_type($post_id) !== 'gemstone' || self::may_edit_record()) {
            return;
        }

        foreach (array_keys($_POST) as $key) {
            $key = (string) $key;
            if (self::is_record_meta($key)) {
                unset($_POST[$key]);
                Audit::record('gemstone_record_field_stripped', $post_id, $key);
            }
        }
    }

    /** Layer 4. Out of the Custom Fields box for anyone who may not write it. */
    public static function is_protected(bool $protected, string $meta_key, string $meta_type): bool
    {
        if ($meta_type !== 'post') {
            return $protected;
        }

        return self::is_record_meta($meta_key) ? true : $protected;
    }

    /**
     * Layer 5. Cosmetic: do not render a control that will refuse the save.
     *
     * The groups are derived from the schema rather than named here. A group
     * added later whose fields are protected is hidden automatically, which is
     * the same default-deny the write path uses — naming them in a constant
     * would have meant a new group of asset fields rendering to marketing until
     * somebody remembered to update a second list.
     */
    public static function remove_record_meta_boxes(): void
    {
        if (self::may_edit_record() || !function_exists('gemreserve_field_schema')) {
            return;
        }

        foreach (self::record_group_titles() as $group) {
            remove_meta_box('gr_' . sanitize_key('gemstone_' . $group), 'gemstone', 'normal');
        }
    }

    /**
     * Schema groups for `gemstone` that contain at least one protected field.
     *
     * A group is treated as protected if any of its fields is, because a group
     * is a single meta box: rendering it would expose the protected control
     * alongside the editable ones.
     *
     * @return string[]
     */
    public static function record_group_titles(): array
    {
        $groups = [];
        foreach (gemreserve_field_schema()['gemstone'] ?? [] as $title => $fields) {
            foreach (array_keys($fields) as $key) {
                if (self::is_record_meta("_gr_{$key}")) {
                    $groups[] = (string) $title;
                    break;
                }
            }
        }

        return $groups;
    }

    /**
     * Refuse rather than ignore.
     *
     * A consumer that sent a protected field and got 200 has been told
     * something false about what happened to it.
     *
     * @param object           $prepared
     * @param \WP_REST_Request $request
     * @return object|\WP_Error
     */
    public static function reject_protected_rest($prepared, $request)
    {
        if (self::may_edit_record()) {
            return $prepared;
        }

        $meta = $request['meta'] ?? null;
        if (!is_array($meta)) {
            return $prepared;
        }

        $refused = array_values(array_filter(array_keys($meta), [self::class, 'is_record_meta']));
        if ($refused === []) {
            return $prepared;
        }

        return new \WP_Error(
            'gemreserve_gemstone_record_forbidden',
            sprintf(
                'These fields describe the asset record and are not editable by this role: %s',
                implode(', ', $refused)
            ),
            ['status' => 403, 'fields' => $refused]
        );
    }

    /**
     * The editable/protected matrix, generated from the policy rather than
     * transcribed, so the documentation cannot drift from the code.
     *
     * @return array{editable: string[], protected: string[]}
     */
    public static function matrix(): array
    {
        $protected = [];
        if (function_exists('gemreserve_field_schema')) {
            foreach (gemreserve_field_schema()['gemstone'] ?? [] as $fields) {
                foreach (array_keys($fields) as $key) {
                    $meta = "_gr_{$key}";
                    if (self::is_record_meta($meta)) {
                        $protected[] = $meta;
                    }
                }
            }
        }
        foreach (['_gr_body_html', '_gr_section_json', '_gr_hero_extra_html', '_gr_hero_class',
                  '_gr_page_class', '_gr_vcms_legacy_body', '_gr_vcms_migrated', '_gr_vcms_source_sha256'] as $meta) {
            if (self::is_record_meta($meta)) {
                $protected[] = $meta;
            }
        }

        return [
            'editable' => self::MARKETING_META,
            'protected' => array_values(array_unique($protected)),
        ];
    }
}
