<?php
/**
 * Roles.
 *
 * Editor and Administrator are WordPress's own and are left alone. The one
 * addition is Compliance Reviewer, which exists because the document register
 * has a real approval step: someone must be able to move a document to Signed
 * or Published without also being able to install plugins or edit the theme.
 *
 * This is a capability, not hidden UI. A reviewer who is not an administrator
 * genuinely cannot change code, and an editor genuinely cannot publish a
 * controlled document — the check is enforced on save, not just in the menu.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

function gemreserve_register_roles(): void
{
    add_role('gr_compliance', 'Compliance Reviewer', [
        'read' => true,
        'edit_posts' => true,
        'edit_published_posts' => true,
        'edit_others_posts' => true,
        'publish_posts' => true,
        'delete_posts' => false,
        'upload_files' => true,
        'gr_review_documents' => true,
    ]);

    $admin = get_role('administrator');
    if ($admin) {
        $admin->add_cap('gr_review_documents');
    }
}
add_action('init', static function (): void {
    if (!get_role('gr_compliance')) {
        gemreserve_register_roles();
    }
});

/**
 * Only a reviewer may move a document into an approved state.
 *
 * Without this the status select would be advisory: any editor could set
 * "Published" and produce a live download link. The check runs on save and
 * silently restores the previous value rather than trusting the form.
 */
function gemreserve_guard_document_status(int $post_id): void
{
    if (get_post_type($post_id) !== 'gr_document') {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (current_user_can('gr_review_documents')) {
        return;
    }

    $approved = ['signed', 'published'];
    $submitted = get_post_meta($post_id, '_gr_doc_status', true);
    if (in_array($submitted, $approved, true)) {
        $previous = get_post_meta($post_id, '_gr_doc_status_last_approved', true) ?: 'draft';
        update_post_meta($post_id, '_gr_doc_status', $previous);
        set_transient('gr_status_denied_' . get_current_user_id(), 1, 30);
        return;
    }
    update_post_meta($post_id, '_gr_doc_status_last_approved', $submitted);
}
add_action('save_post', 'gemreserve_guard_document_status', 20);

function gemreserve_status_denied_notice(): void
{
    if (get_transient('gr_status_denied_' . get_current_user_id())) {
        delete_transient('gr_status_denied_' . get_current_user_id());
        echo '<div class="notice notice-warning is-dismissible"><p>Only a Compliance Reviewer or Administrator can move a document to Signed or Published. The status was left unchanged.</p></div>';
    }
}
add_action('admin_notices', 'gemreserve_status_denied_notice');
