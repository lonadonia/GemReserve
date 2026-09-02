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

    public static function ensure(): void
    {
        if (!get_role(self::EDITOR) || !get_role(self::PUBLISHER)) {
            self::register();
        }
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
        ]);

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
        ]);

        foreach (['administrator'] as $role_name) {
            $role = get_role($role_name);
            if ($role) {
                $role->add_cap('gr_preview_drafts');
                $role->add_cap('gr_manage_globals');
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
