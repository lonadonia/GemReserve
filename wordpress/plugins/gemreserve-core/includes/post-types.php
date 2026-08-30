<?php
/**
 * Post types.
 *
 * Deliberately few. Pages stay pages — the 58-page architecture is hierarchical
 * content and WordPress already models that well. A post type is added only
 * where the records have their own fields and their own editorial lifecycle.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

function gemreserve_register_post_types(): void
{
    // Gemstone: 18 published programme pages, each a structured record rather
    // than free prose. Slug is the bare stone (/ruby, /natural-rough-jasper) to
    // preserve the existing public URLs exactly.
    register_post_type('gemstone', [
        'labels' => gemreserve_labels('Gemstone', 'Gemstones'),
        'public' => true,
        'has_archive' => false,
        'rewrite' => ['slug' => '/', 'with_front' => false],
        'menu_icon' => 'dashicons-carrot',
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'revisions', 'page-attributes'],
        'show_in_rest' => true,
        'show_in_menu' => false, // surfaced under the GemReserve menu instead
        'capability_type' => 'post',
    ]);

    // Document: the controlled register. Its lifecycle is the point — a document
    // is never downloadable until it is both Published and has a real file.
    register_post_type('gr_document', [
        'labels' => gemreserve_labels('Document', 'Documents'),
        'public' => true,
        'has_archive' => false,
        'rewrite' => ['slug' => 'documents/item', 'with_front' => false],
        'menu_icon' => 'dashicons-media-document',
        'supports' => ['title', 'editor', 'revisions'],
        'show_in_rest' => true,
        'show_in_menu' => false,
        'capability_type' => 'post',
    ]);

    // News: a real newsroom. Nothing is seeded — see the migration report.
    register_post_type('gr_news', [
        'labels' => gemreserve_labels('Announcement', 'News & Announcements'),
        'public' => true,
        'has_archive' => 'news',
        'rewrite' => ['slug' => 'news', 'with_front' => false],
        'menu_icon' => 'dashicons-megaphone',
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'revisions', 'author'],
        'show_in_rest' => true,
        'show_in_menu' => false,
        'capability_type' => 'post',
    ]);

    // FAQ: ordered, categorised, and rendered into the existing accordion.
    register_post_type('gr_faq', [
        'labels' => gemreserve_labels('FAQ', 'FAQs'),
        'public' => false,
        'show_ui' => true,
        'has_archive' => false,
        'menu_icon' => 'dashicons-editor-help',
        'supports' => ['title', 'editor', 'page-attributes'],
        'show_in_rest' => true,
        'show_in_menu' => false,
        'capability_type' => 'post',
    ]);
}
add_action('init', 'gemreserve_register_post_types');

/** Standard label set, so every type reads consistently in the admin. */
function gemreserve_labels(string $single, string $plural): array
{
    return [
        'name' => $plural,
        'singular_name' => $single,
        'add_new' => 'Add New',
        'add_new_item' => "Add New {$single}",
        'edit_item' => "Edit {$single}",
        'new_item' => "New {$single}",
        'view_item' => "View {$single}",
        'search_items' => "Search {$plural}",
        'not_found' => "No {$plural} yet",
        'not_found_in_trash' => "No {$plural} in the bin",
        'all_items' => $plural,
        'menu_name' => $plural,
    ];
}
