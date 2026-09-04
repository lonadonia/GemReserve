<?php
/**
 * Route traceability matrix.
 *
 * One row per public route, every column measured from the live instance
 * rather than assumed. Emitted as TSV so it can be rendered or diffed.
 */

$rows = [];
$ids = get_posts([
    'post_type' => ['page', 'gemstone'],
    'post_status' => 'publish',
    'numberposts' => -1,
    'fields' => 'ids',
    'orderby' => 'ID',
    'order' => 'ASC',
]);

/*
 * Access is a property of the role, not of whichever account happens to hold
 * it, and production deliberately has no marketing account yet. So the check
 * is made against a throw-away user that exists only for the duration of this
 * script when none is present — never persisted, never granted a password.
 */
$ephemeral = [];
$role_user = static function (string $role) use (&$ephemeral): int {
    $found = get_users(['role' => $role, 'number' => 1]);
    if ($found) {
        return (int) $found[0]->ID;
    }
    $login = 'gr_matrix_probe_' . substr(md5($role), 0, 8);
    $id = username_exists($login) ?: wp_create_user($login, wp_generate_password(32), $login . '@invalid.test');
    (new WP_User((int) $id))->set_role($role);
    $ephemeral[] = (int) $id;

    return (int) $id;
};
$pub_id = $role_user('gr_marketing_publisher');
$ed_id  = $role_user('gr_marketing_editor');

$home = untrailingslashit(home_url());

foreach ($ids as $id) {
    $id = (int) $id;
    $post = get_post($id);
    $route = str_replace($home, '', get_permalink($id));

    $migrated = (string) get_post_meta($id, '_gr_vcms_migrated', true) !== '';
    $legacy   = (string) get_post_meta($id, '_gr_body_html', true) !== '';
    $content  = (string) $post->post_content;

    // Block census of the stored content.
    $counts = [];
    $walk = static function (array $bs) use (&$walk, &$counts): void {
        foreach ($bs as $b) {
            $n = $b['blockName'] ?? null;
            if ($n) { $counts[$n] = ($counts[$n] ?? 0) + 1; }
            if (!empty($b['innerBlocks'])) { $walk($b['innerBlocks']); }
        }
    };
    if (trim($content) !== '') { $walk(parse_blocks($content)); }

    $sections   = $counts['gemreserve/section'] ?? 0;
    $cards      = $counts['gemreserve/repeatable'] ?? 0;
    $contentB   = $counts['gemreserve/content'] ?? 0;
    $freeform   = ($counts['core/freeform'] ?? 0) + ($counts['core/html'] ?? 0);
    $coreBlocks = 0;
    foreach ($counts as $n => $c) {
        if (str_starts_with($n, 'core/') && !in_array($n, ['core/freeform', 'core/html'], true)) { $coreBlocks += $c; }
    }

    // Editable media + slot census, from the block attributes themselves.
    $images = 0; $slots = 0;
    $walk2 = static function (array $bs) use (&$walk2, &$images, &$slots): void {
        foreach ($bs as $b) {
            $a = $b['attrs'] ?? [];
            foreach (($a['slots'] ?? []) as $slot) {
                $slots++;
                if (($slot['kind'] ?? '') === 'image') { $images++; }
            }
            if (!empty($b['innerBlocks'])) { $walk2($b['innerBlocks']); }
        }
    };
    if (trim($content) !== '') { $walk2(parse_blocks($content)); }
    // Hero images are structured fields, not blocks.
    foreach (['_gr_hero_image_desktop', '_gr_hero_image_mobile', '_gr_hero_image', '_gr_cutout_image'] as $k) {
        if ((string) get_post_meta($id, $k, true) !== '') { $images++; }
    }

    if ($migrated)                      { $type = 'migrated-blocks'; }
    elseif ($freeform > 0)              { $type = 'classic-html'; }
    elseif ($coreBlocks > 0)            { $type = 'core-blocks'; }
    elseif (trim($content) === '')      { $type = 'fields-only'; }
    else                                { $type = 'other'; }

    $editor = use_block_editor_for_post_type($post->post_type) ? 'block' : 'classic';

    // SEO controls available on this object's edit screen.
    $schema = gemreserve_field_schema()[$post->post_type] ?? [];
    $seo = [];
    foreach ($schema as $fields) {
        foreach (array_keys($fields) as $k) {
            if (in_array($k, ['seo_title', 'seo_description', 'canonical_url', 'noindex'], true)) { $seo[] = $k; }
        }
    }

    $can_pub = $pub_id ? user_can($pub_id, 'edit_post', $id) : null;
    $can_ed  = $ed_id  ? user_can($ed_id,  'edit_post', $id) : null;
    $can_publish = $pub_id ? user_can($pub_id, 'publish_post', $id) : null;

    $rows[] = implode("\t", [
        $route,
        $id,
        $post->post_type,
        $type,
        $editor,
        $sections,
        $cards,
        $contentB,
        $slots,
        $images,
        $freeform,
        count($seo) . ':' . implode(',', $seo),
        $can_ed === null ? 'n/a' : ($can_ed ? 'yes' : 'NO'),
        $can_pub === null ? 'n/a' : ($can_pub ? 'yes' : 'NO'),
        $can_publish === null ? 'n/a' : ($can_publish ? 'yes' : 'NO'),
        $post->post_status,
    ]);
}

echo implode("\t", ['route','id','post_type','page_type','editor','sections','cards','content_blocks','slots','images','freeform','seo_fields','mkt_editor_can_edit','mkt_publisher_can_edit','mkt_publisher_can_publish','status']), "\n";
echo implode("\n", $rows), "\n";

// Remove the probe accounts. They exist for the length of this script only.
require_once ABSPATH . 'wp-admin/includes/user.php';
foreach ($ephemeral as $id) {
    wp_delete_user($id);
}
