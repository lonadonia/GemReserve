<?php
/**
 * Marketing roles.
 *
 * Two roles, because the client described two jobs: people who write and
 * people who decide it goes live. WordPress's stock Author/Editor split does
 * not fit — Editor can publish, and Author can only touch their own posts,
 * whereas marketing work is collaborative on a fixed set of pages.
 *
 * The rule that shapes both: a marketing user must never need a capability that
 * would let them put executable code on the server. No `edit_themes`, no
 * `edit_plugins`, no `install_*`, no `unfiltered_html`. The last one is the
 * subtle one and is discussed below.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class Roles
{
    public const EDITOR = 'gr_marketing_editor';
    public const PUBLISHER = 'gr_marketing_publisher';

    public static function boot(): void
    {
        add_action('init', [self::class, 'ensure'], 20);
        add_filter('map_meta_cap', [self::class, 'guard_preserved_blocks'], 10, 4);
    }

    /**
     * Bumped whenever the capability model changes.
     *
     * `ensure()` used to re-register only when a role was missing, which is
     * true exactly once — on first activation. A later change to the grants
     * would then never reach a site that already had the roles. The stamp makes
     * the model versioned rather than first-write-wins.
     */
    public const CAPS_VERSION = 2;

    public const CAPS_OPTION = 'gemreserve_vcms_caps_version';

    public static function ensure(): void
    {
        $installed = (int) get_option(self::CAPS_OPTION, 0);

        if ($installed === self::CAPS_VERSION && get_role(self::EDITOR) && get_role(self::PUBLISHER)) {
            return;
        }

        self::register();
        update_option(self::CAPS_OPTION, self::CAPS_VERSION, false);
    }

    public static function register(): void
    {
        /*
         * Marketing Editor — writes and revises, does not publish.
         *
         * `edit_published_pages` is granted deliberately: without it an editor
         * cannot touch a live page at all, which would make the role useless for
         * a site whose pages are all published. What stops an unreviewed change
         * reaching the public is the absence of `publish_pages`, which routes
         * the work through pending review instead.
         */
        remove_role(self::EDITOR);
        add_role(self::EDITOR, __('Marketing Editor', 'gemreserve-visual-cms'), [
            'read' => true,
            'upload_files' => true,
            'edit_posts' => true,
            'edit_pages' => true,
            'edit_others_pages' => true,
            'edit_published_pages' => true,
            'delete_posts' => true,
            'read_private_pages' => true,
            'gr_preview_drafts' => true,
        ] + self::gemstone_caps(false));

        /*
         * Marketing Publisher — everything above, plus the decision to publish.
         *
         * Also gains the global content surface (menus, footer, identity),
         * because "update the navigation" was on the client's list and belongs
         * with the person accountable for what is live rather than with anyone
         * who can draft.
         *
         * `edit_theme_options` is what WordPress uses to gate menu editing. It
         * does NOT permit editing theme files — that is `edit_themes`, which is
         * not granted here, and which wp-config disables outright via
         * DISALLOW_FILE_EDIT. The name is misleading and is worth stating so
         * nobody removes it thinking they are closing a hole.
         */
        remove_role(self::PUBLISHER);
        add_role(self::PUBLISHER, __('Marketing Publisher', 'gemreserve-visual-cms'), [
            'read' => true,
            'upload_files' => true,
            'edit_posts' => true,
            'publish_posts' => true,
            'edit_pages' => true,
            'edit_others_pages' => true,
            'edit_published_pages' => true,
            'publish_pages' => true,
            'delete_posts' => true,
            'delete_pages' => true,
            'delete_published_pages' => true,
            'read_private_pages' => true,
            'manage_categories' => true,
            'edit_theme_options' => true,
            'gr_preview_drafts' => true,
            'gr_manage_globals' => true,
        ] + self::gemstone_caps(true));

        self::grant_separated_capabilities();
    }

    /**
     * The gemstone content capabilities a marketing role needs.
     *
     * `gemstone` is given its own capability_type by GemstonePolicy, precisely
     * so this grant can be made without also handing over `gr_document`. Deleting
     * is withheld from both marketing roles: removing a gemstone removes an asset
     * page, and nothing on the client's list asks for it.
     *
     * @return array<string,bool>
     */
    private static function gemstone_caps(bool $may_publish): array
    {
        $caps = [
            'edit_gemstones' => true,
            'edit_others_gemstones' => true,
            'edit_published_gemstones' => true,
            'read_private_gemstones' => true,
        ];

        if ($may_publish) {
            $caps['publish_gemstones'] = true;
        }

        return $caps;
    }

    /**
     * Hand the separated capabilities to the roles that used to reach these
     * post types through the shared `post` family.
     *
     * Administrator and Compliance Reviewer keep exactly what they had.
     * Marketing gains gemstones and — deliberately — does not gain documents:
     * while the two types shared capabilities, a Marketing Publisher holding
     * `publish_posts` could create and publish a controlled document. That is
     * closed here rather than preserved.
     *
     * The stock `editor` role is given gemstones for the same reason marketing
     * is, and is not given documents for the same reason marketing is not.
     */
    private static function grant_separated_capabilities(): void
    {
        $gemstone = GemstonePolicy::caps_for('gemstone', 'gemstones');
        $document = GemstonePolicy::caps_for('gr_document', 'gr_documents');

        $admin = get_role('administrator');
        if ($admin) {
            $admin->add_cap('gr_preview_drafts');
            $admin->add_cap('gr_manage_globals');
            $admin->add_cap(GemstonePolicy::CAP_RECORD);
            foreach (array_merge($gemstone, $document) as $cap) {
                $admin->add_cap($cap);
            }
        }

        // Compliance owns the asset record and the document register, and had
        // both before the split. Nothing is taken away.
        $compliance = get_role('gr_compliance');
        if ($compliance) {
            $compliance->add_cap(GemstonePolicy::CAP_RECORD);
            foreach (array_merge($gemstone, $document) as $cap) {
                $compliance->add_cap($cap);
            }
        }

        $editor = get_role('editor');
        if ($editor) {
            foreach ($gemstone as $cap) {
                $editor->add_cap($cap);
            }
            foreach ($document as $cap) {
                $editor->remove_cap($cap);
            }
            $editor->remove_cap(GemstonePolicy::CAP_RECORD);
        }

        // Belt and braces: neither marketing role may ever hold the record
        // capability or a document capability, whatever else is granted later.
        foreach ([self::EDITOR, self::PUBLISHER] as $name) {
            $role = get_role($name);
            if (!$role) {
                continue;
            }
            $role->remove_cap(GemstonePolicy::CAP_RECORD);
            foreach ($document as $cap) {
                $role->remove_cap($cap);
            }
        }
    }

    public static function remove(): void
    {
        remove_role(self::EDITOR);
        remove_role(self::PUBLISHER);
    }

    /**
     * Only an administrator may create or alter preserved markup.
     *
     * A `gemreserve/preserved` block renders its stored HTML as-is, so being
     * able to write one is equivalent to `unfiltered_html`. Marketing roles do
     * not have that capability, and this maps the block's own capability onto
     * it so the check is enforced rather than implied by the editor UI.
     *
     * Enforcement on save lives in Migrator::guard_preserved(); this is the
     * capability half, used by the editor to decide whether to offer the field.
     *
     * @param string[] $caps
     * @param mixed[]  $args
     * @return string[]
     */
    public static function guard_preserved_blocks(array $caps, string $cap, int $user_id, array $args): array
    {
        if ($cap !== 'gr_edit_preserved_markup') {
            return $caps;
        }

        return ['unfiltered_html'];
    }

    /**
     * The capability matrix, generated rather than transcribed.
     *
     * Documentation that restates a permission list by hand goes stale the first
     * time the list changes. `CMS_ROLES_AND_PERMISSIONS.md` is built from this.
     *
     * @return array<string,array<string,bool>>
     */
    public static function matrix(): array
    {
        $interesting = [
            'read', 'upload_files',
            'edit_pages', 'edit_others_pages', 'edit_published_pages',
            'publish_pages', 'delete_published_pages',
            'edit_theme_options', 'manage_options',
            'install_plugins', 'activate_plugins', 'edit_plugins',
            'edit_themes', 'unfiltered_html', 'edit_users',
            'gr_preview_drafts', 'gr_manage_globals', 'gr_review_documents',
            'edit_gemstones', 'edit_others_gemstones', 'edit_published_gemstones',
            'publish_gemstones', 'delete_gemstones',
            'edit_gr_documents', 'edit_others_gr_documents', 'publish_gr_documents',
            GemstonePolicy::CAP_RECORD,
        ];

        $out = [];
        foreach ([self::EDITOR, self::PUBLISHER, 'gr_compliance', 'editor', 'administrator'] as $name) {
            $role = get_role($name);
            if (!$role) {
                continue;
            }
            $row = [];
            foreach ($interesting as $cap) {
                $row[$cap] = !empty($role->capabilities[$cap]);
            }
            $out[$name] = $row;
        }

        return $out;
    }
}
