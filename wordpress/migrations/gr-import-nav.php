<?php
/**
 * Build the WordPress menus from the extracted navigation.
 *
 * Run: wp eval-file gr-import-nav.php <nav.json> --path=.
 *
 * Items keep their original labels, order and destinations. An item the source
 * marked "coming soon" gets the `is-upcoming` class, which is the one
 * convention the theme reads — it renders those as the disabled span the
 * original used rather than as a link to nowhere.
 *
 * Idempotent: menus are emptied and rebuilt, so re-running after a change in
 * the source does not duplicate items.
 */

if (!defined('WP_CLI') || !WP_CLI) {
    fwrite(STDERR, "Run through wp-cli.\n");
    exit(1);
}

$file = $args[0] ?? '';
if (!$file || !file_exists($file)) {
    WP_CLI::error('Usage: wp eval-file gr-import-nav.php <nav.json>');
}
$nav = json_decode((string) file_get_contents($file), true);
if (!is_array($nav)) {
    WP_CLI::error('Could not parse the navigation extract.');
}

/** Create or empty a menu, and return its ID. */
function gr_menu(string $name): int
{
    $menu = wp_get_nav_menu_object($name);
    if ($menu) {
        foreach (wp_get_nav_menu_items($menu->term_id) ?: [] as $item) {
            wp_delete_post($item->ID, true);
        }
        return (int) $menu->term_id;
    }
    $id = wp_create_nav_menu($name);
    return is_wp_error($id) ? 0 : (int) $id;
}

/** Add one item. A null href means "coming soon" — a disabled marker. */
function gr_menu_item(int $menu_id, array $item, int $parent = 0, int $order = 0): int
{
    $upcoming = empty($item['href']);
    $id = wp_update_nav_menu_item($menu_id, 0, [
        'menu-item-title' => $item['label'],
        'menu-item-url' => $upcoming ? '#' : home_url($item['href']),
        'menu-item-status' => 'publish',
        'menu-item-type' => 'custom',
        'menu-item-parent-id' => $parent,
        'menu-item-position' => $order,
        'menu-item-classes' => $upcoming ? 'is-upcoming' : '',
    ]);
    return is_wp_error($id) ? 0 : (int) $id;
}

// --- Primary ---------------------------------------------------------------
$primary = gr_menu('Primary navigation');
$order = 0;
foreach ($nav['groups'] as $group) {
    $parent = gr_menu_item($primary, [
        'label' => $group['label'],
        'href' => $group['items'] ? '#' : ($group['href'] ?? '#'),
    ], 0, ++$order);

    // A group with children is a dropdown; its own URL is never followed, so a
    // placeholder is correct there. A group without children is a real link.
    if (!$group['items'] && !empty($group['href'])) {
        wp_update_nav_menu_item($primary, $parent, [
            'menu-item-title' => $group['label'],
            'menu-item-url' => home_url($group['href']),
            'menu-item-status' => 'publish',
            'menu-item-type' => 'custom',
            'menu-item-position' => $order,
        ]);
    }
    foreach ($group['items'] as $i => $child) {
        gr_menu_item($primary, $child, $parent, $i + 1);
    }
}

// --- Footer, one menu per column -------------------------------------------
$locations = ['primary' => $primary];
$map = [
    'Platform' => 'footer_platform',
    'Assets' => 'footer_assets',
    'How It Works' => 'footer_how',
    'Technology' => 'footer_technology',
    'Enterprise' => 'footer_enterprise',
    'Investors' => 'footer_investors',
    'Company' => 'footer_company',
    'Resources' => 'footer_resources',
    'Early Participation' => 'footer_participation',
];
foreach ($nav['footer'] as $column) {
    $heading = $column['heading'];
    if (empty($map[$heading])) {
        continue;
    }
    $menu_id = gr_menu('Footer — ' . $heading);
    foreach ($column['items'] as $i => $item) {
        gr_menu_item($menu_id, $item, 0, $i + 1);
    }
    $locations[$map[$heading]] = $menu_id;
}

set_theme_mod('nav_menu_locations', $locations);

WP_CLI::success(sprintf(
    'Built %d menus: primary with %d groups, %d footer columns.',
    count($locations),
    count($nav['groups']),
    count($locations) - 1
));
