<?php
/**
 * Taxonomies. One per axis an editor actually filters or groups by.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

function gemreserve_register_taxonomies(): void
{
    // Polished vs natural rough. The site's two gemstone families.
    register_taxonomy('gemstone_form', ['gemstone'], [
        'labels' => ['name' => 'Inventory forms', 'singular_name' => 'Form'],
        'hierarchical' => true,
        'public' => false,
        'show_ui' => true,
        'show_admin_column' => true,
        'show_in_rest' => true,
        'rewrite' => false,
    ]);

    register_taxonomy('document_category', ['gr_document'], [
        'labels' => ['name' => 'Document categories', 'singular_name' => 'Category'],
        'hierarchical' => true,
        'public' => false,
        'show_ui' => true,
        'show_admin_column' => true,
        'show_in_rest' => true,
        'rewrite' => false,
    ]);

    register_taxonomy('news_category', ['gr_news'], [
        'labels' => ['name' => 'News categories', 'singular_name' => 'Category'],
        'hierarchical' => true,
        'public' => true,
        'show_ui' => true,
        'show_admin_column' => true,
        'show_in_rest' => true,
        'rewrite' => ['slug' => 'news/category'],
    ]);

    register_taxonomy('faq_category', ['gr_faq'], [
        'labels' => ['name' => 'FAQ categories', 'singular_name' => 'Category'],
        'hierarchical' => true,
        'public' => false,
        'show_ui' => true,
        'show_admin_column' => true,
        'show_in_rest' => true,
        'rewrite' => false,
    ]);
}
add_action('init', 'gemreserve_register_taxonomies');

/** Seed the fixed vocabularies once, so the admin is usable immediately. */
function gemreserve_seed_terms(): void
{
    $seeds = [
        'gemstone_form' => ['Polished', 'Natural rough'],
        'document_category' => [
            'Company & platform', 'Legal & compliance', 'Asset programs',
            'Reports & research', 'Whitepapers', 'Forms & templates',
        ],
        'news_category' => [
            'Corporate announcement', 'Partnership', 'Platform update',
            'Milestone', 'Press release', 'Reserve attestation',
        ],
        'faq_category' => [
            'General', 'Assets', 'Buying', 'Trading', 'Security & compliance',
        ],
    ];
    foreach ($seeds as $taxonomy => $terms) {
        foreach ($terms as $term) {
            if (!term_exists($term, $taxonomy)) {
                wp_insert_term($term, $taxonomy);
            }
        }
    }
}
