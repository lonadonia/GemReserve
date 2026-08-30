<?php
/**
 * One GemReserve menu, so the client sees their content and not WordPress's
 * furniture. Everything the site actually holds hangs off this; the native
 * Posts and Comments menus are removed because this site uses neither.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

function gemreserve_admin_menu(): void
{
    add_menu_page(
        'GemReserve',
        'GemReserve',
        'edit_posts',
        'gemreserve',
        'gemreserve_render_dashboard',
        'dashicons-shield-alt',
        3
    );

    $items = [
        ['Pages', 'edit.php?post_type=page'],
        ['Gemstones', 'edit.php?post_type=gemstone'],
        ['Documents', 'edit.php?post_type=gr_document'],
        ['News', 'edit.php?post_type=gr_news'],
        ['FAQs', 'edit.php?post_type=gr_faq'],
        ['Media', 'upload.php'],
        ['Menus', 'nav-menus.php'],
    ];
    foreach ($items as [$label, $slug]) {
        add_submenu_page('gemreserve', $label, $label, 'edit_posts', $slug);
    }

    // Submissions carry personal data, so they need their own capability
    // rather than riding on edit_posts like the editorial screens above.
    foreach ([
        ['Waitlist', 'edit.php?post_type=gr_waitlist'],
        ['Contact Enquiries', 'edit.php?post_type=gr_contact'],
    ] as [$label, $slug]) {
        add_submenu_page('gemreserve', $label, $label, 'gr_manage_submissions', $slug);
    }

    add_submenu_page(
        'gemreserve',
        'Site Settings',
        'Site Settings',
        'manage_options',
        'gemreserve-settings',
        'gemreserve_render_settings_page'
    );

    // The site has no blog and no comments; leaving those menus in place only
    // invites an editor to publish into a surface nothing renders.
    remove_menu_page('edit.php');
    remove_menu_page('edit-comments.php');
}
add_action('admin_menu', 'gemreserve_admin_menu', 20);

/** Rename the first submenu entry, which WordPress otherwise duplicates. */
function gemreserve_rename_first_submenu(): void
{
    global $submenu;
    if (isset($submenu['gemreserve'][0])) {
        $submenu['gemreserve'][0][0] = 'Overview';
    }
}
add_action('admin_menu', 'gemreserve_rename_first_submenu', 21);

function gemreserve_render_dashboard(): void
{
    $counts = [
        'Pages' => wp_count_posts('page')->publish ?? 0,
        'Gemstones' => wp_count_posts('gemstone')->publish ?? 0,
        'Documents' => wp_count_posts('gr_document')->publish ?? 0,
        'News' => wp_count_posts('gr_news')->publish ?? 0,
        'FAQs' => wp_count_posts('gr_faq')->publish ?? 0,
    ];
    ?>
    <div class="wrap">
        <h1>GemReserve</h1>
        <p class="description">Everything the public site publishes, in one place.</p>
        <table class="widefat striped" style="max-width:520px">
            <thead><tr><th>Content</th><th>Published</th></tr></thead>
            <tbody>
            <?php foreach ($counts as $label => $n) : ?>
                <tr><td><?php echo esc_html($label); ?></td><td><?php echo (int) $n; ?></td></tr>
            <?php endforeach; ?>
            </tbody>
        </table>

        <h2>Before you publish</h2>
        <ul style="list-style:disc;margin-left:20px;max-width:70ch">
            <li><strong>Evidence state.</strong> A gemstone below “Verified” renders with a sample label. Do not raise it without evidence on file.</li>
            <li><strong>Documents.</strong> A download link appears only when the status is Published <em>and</em> a file is attached. There is no way to link a file that does not exist.</li>
            <li><strong>No partners.</strong> A laboratory may be named as the issuer of a report. No laboratory, auditor, insurer, custodian or law firm is a partner of GemReserve, and none may be described as one.</li>
            <li><strong>News is a record.</strong> Publish an announcement on the day it is issued, not before.</li>
        </ul>
    </div>
    <?php
}

/** Columns worth having in the list tables. */
function gemreserve_gemstone_columns(array $columns): array
{
    $new = [];
    foreach ($columns as $key => $label) {
        $new[$key] = $label;
        if ($key === 'title') {
            $new['evidence'] = 'Evidence';
            $new['custody'] = 'Custody';
        }
    }
    return $new;
}
add_filter('manage_gemstone_posts_columns', 'gemreserve_gemstone_columns');

function gemreserve_gemstone_column(string $column, int $post_id): void
{
    if ($column === 'evidence') {
        $states = gemreserve_evidence_states();
        $v = get_post_meta($post_id, '_gr_evidence_state', true) ?: 'illustrative';
        $colour = $v === 'verified' ? '#1f9c62' : ($v === 'illustrative' ? '#8a7a4a' : '#b8862c');
        echo '<span style="color:' . esc_attr($colour) . ';font-weight:600">' . esc_html(explode(' — ', $states[$v] ?? $v)[0]) . '</span>';
    }
    if ($column === 'custody') {
        $states = gemreserve_custody_states();
        $v = get_post_meta($post_id, '_gr_custody_state', true) ?: 'not_scheduled';
        echo esc_html($states[$v] ?? $v);
    }
}
add_action('manage_gemstone_posts_custom_column', 'gemreserve_gemstone_column', 10, 2);

function gemreserve_document_columns(array $columns): array
{
    $new = [];
    foreach ($columns as $key => $label) {
        $new[$key] = $label;
        if ($key === 'title') {
            $new['docstatus'] = 'Status';
            $new['downloadable'] = 'Downloadable';
        }
    }
    return $new;
}
add_filter('manage_gr_document_posts_columns', 'gemreserve_document_columns');

function gemreserve_document_column(string $column, int $post_id): void
{
    if ($column === 'docstatus') {
        $statuses = gemreserve_document_statuses();
        $v = get_post_meta($post_id, '_gr_doc_status', true) ?: 'draft';
        echo esc_html($statuses[$v] ?? $v);
    }
    if ($column === 'downloadable') {
        echo gemreserve_document_is_downloadable($post_id)
            ? '<span style="color:#1f9c62;font-weight:600">Yes</span>'
            : '<span style="color:#8a8a8a">No — in preparation</span>';
    }
}
add_action('manage_gr_document_posts_custom_column', 'gemreserve_document_column', 10, 2);

/**
 * Editor choice, per post type.
 *
 * News keeps the block editor: an announcement is genuinely prose, and blocks
 * are the right tool for it.
 *
 * Pages, gemstones, documents and FAQs do not. Their content is structured
 * fields plus migrated markup, and `post_content` is empty by design. Showing a
 * block canvas there invites an editor to add blocks that render underneath the
 * design and look broken, while pushing the fields that actually drive the page
 * below the fold. The classic editor puts the fields where the work is.
 */
function gemreserve_use_classic_editor(bool $use_block, string $post_type): bool
{
    if (in_array($post_type, ['page', 'gemstone', 'gr_document', 'gr_faq'], true)) {
        return false;
    }
    return $use_block;
}
add_filter('use_block_editor_for_post_type', 'gemreserve_use_classic_editor', 10, 2);

/**
 * The body markup a page carries is the approved design's own HTML. It is not
 * editor input, and the visual editor would reformat it, so the field is shown
 * read-only with a note rather than as an inviting textarea.
 */
function gemreserve_body_notice(): void
{
    $screen = get_current_screen();
    if (!$screen || !in_array($screen->post_type, ['page', 'gemstone'], true) || $screen->base !== 'post') {
        return;
    }
    if (!get_post_meta(get_the_ID(), '_gr_body_html', true)) {
        return;
    }
    echo '<div class="notice notice-info"><p><strong>This page carries migrated layout.</strong> '
        . 'Its body sections came across from the previous build and render against the approved '
        . 'stylesheet. Edit the hero, SEO and structured fields below; the body is managed by the '
        . 'migration and is not editable here.</p></div>';
}
add_action('admin_notices', 'gemreserve_body_notice');
