<?php
/**
 * Structured fields, registered natively.
 *
 * No ACF. ACF Pro is a commercial licence this project has not been shown to
 * hold, and the free tier does not cover the field types this content needs.
 * Everything here is core `register_post_meta` plus hand-written meta boxes,
 * which costs nothing, adds no recurring licence, and keeps the data in plain
 * post meta where a future API can read it without a plugin in the way.
 *
 * The load-bearing idea is the evidence state. The Next.js site distinguishes
 * what is verified from what is illustrative, and that distinction is the whole
 * reason several pages are safe to publish. It survives here as a required
 * field with a closed vocabulary, not a free-text box: an editor cannot let an
 * illustrative gemstone read as verified inventory by typing the wrong word.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

/** The project's evidence vocabulary. Order is deliberate: weakest first. */
function gemreserve_evidence_states(): array
{
    return [
        'illustrative' => 'Illustrative — sample data, not a held asset',
        'owner_supplied' => 'Owner supplied — provided, not yet checked',
        'evidence_pending' => 'Evidence pending — under verification',
        'verified' => 'Verified — independent evidence on file',
    ];
}

/** Publication lifecycle for controlled documents. */
function gemreserve_document_statuses(): array
{
    return [
        'draft' => 'Draft',
        'signature_ready' => 'Signature-ready',
        'signed' => 'Signed',
        'published' => 'Published',
        'superseded' => 'Superseded',
        'withdrawn' => 'Withdrawn',
        'restricted' => 'Restricted',
    ];
}

/** Custody state, kept separate from evidence: a stone can be verified but not yet vaulted. */
function gemreserve_custody_states(): array
{
    return [
        'not_scheduled' => 'Not scheduled',
        'scheduled' => 'Scheduled',
        'in_transit' => 'In transit',
        'in_custody' => 'In custody',
    ];
}

/**
 * Field definitions, one table for the whole model.
 * type: text | textarea | select | number | url | media | date | checkbox
 */
function gemreserve_field_schema(): array
{
    $evidence = array_keys(gemreserve_evidence_states());
    $custody = array_keys(gemreserve_custody_states());

    return [
        'gemstone' => [
            'Identity' => [
                'display_name' => ['label' => 'Display name', 'type' => 'text'],
                'canonical_name' => ['label' => 'Canonical name', 'type' => 'text'],
                'species' => ['label' => 'Species', 'type' => 'text'],
                'variety' => ['label' => 'Variety', 'type' => 'text'],
                'inventory_form' => ['label' => 'Inventory form', 'type' => 'select', 'options' => ['polished' => 'Polished', 'rough' => 'Natural rough']],
            ],
            'Specification' => [
                'origin' => ['label' => 'Origin', 'type' => 'text'],
                'weight' => ['label' => 'Weight', 'type' => 'text'],
                'weight_unit' => ['label' => 'Unit', 'type' => 'select', 'options' => ['ct' => 'Carat (ct)', 'g' => 'Gram (g)', 'kg' => 'Kilogram (kg)']],
                'colour' => ['label' => 'Colour', 'type' => 'text'],
                'clarity' => ['label' => 'Clarity', 'type' => 'text'],
                'hardness' => ['label' => 'Hardness (Mohs)', 'type' => 'text'],
                'quality' => ['label' => 'Quality', 'type' => 'text'],
                'treatment' => ['label' => 'Treatment', 'type' => 'text'],
            ],
            'Status — controls what the page may claim' => [
                'evidence_state' => [
                    'label' => 'Evidence state',
                    'type' => 'select',
                    'options' => gemreserve_evidence_states(),
                    'default' => 'illustrative',
                    'help' => 'Anything below "Verified" renders with a sample/illustrative label on the public page. Do not raise this without evidence on file.',
                ],
                'custody_state' => ['label' => 'Custody state', 'type' => 'select', 'options' => gemreserve_custody_states(), 'default' => 'not_scheduled'],
                'lab_report_issuer' => ['label' => 'Report issuer', 'type' => 'text', 'help' => 'The laboratory that issued the report, if one exists. A laboratory named here is the issuer of a report — never a partner of GemReserve.'],
                'lab_report_number' => ['label' => 'Report number', 'type' => 'text'],
            ],
            'Presentation' => [
                'tagline' => ['label' => 'Tagline', 'type' => 'text'],
                'accent' => ['label' => 'Accent colour', 'type' => 'text', 'help' => 'CSS colour driving the page accent, e.g. #c9202f'],
                'hero_image' => ['label' => 'Hero image', 'type' => 'media'],
                'cutout_image' => ['label' => 'Cut-out image', 'type' => 'media'],
                'cta_label' => ['label' => 'CTA label', 'type' => 'text'],
                'cta_href' => ['label' => 'CTA destination', 'type' => 'text'],
            ],
            /*
             * Hero and SEO were defined for `page` only, but every gemstone
             * carries this meta — the migration wrote it and
             * `single-gemstone.php` reads it through the shared hero part and
             * `gemreserve_head_meta()`. The data was live and the fields were
             * unreachable, so the only way to change a gemstone's title tag or
             * hero copy was to edit the database. Declaring the groups here is
             * what makes them editable; it adds no field that was not already
             * being rendered.
             */
            'Hero' => [
                'hero_eyebrow' => ['label' => 'Breadcrumb parent label', 'type' => 'text'],
                'hero_title_lines' => ['label' => 'Hero title lines', 'type' => 'textarea', 'help' => 'One line per row. The last line takes the gold gradient.'],
                'hero_tagline' => ['label' => 'Hero tagline', 'type' => 'text'],
                'hero_description' => ['label' => 'Hero description', 'type' => 'textarea'],
                'hero_image_desktop' => ['label' => 'Hero image (desktop)', 'type' => 'text', 'help' => 'Path without extension, e.g. /images/heroes/aquamarine-hero'],
                'hero_image_mobile' => ['label' => 'Hero image (mobile)', 'type' => 'text'],
            ],
            'SEO' => [
                'seo_title' => ['label' => 'SEO title', 'type' => 'text', 'help' => 'Overrides the page title in <title> and Open Graph.'],
                'seo_description' => ['label' => 'Meta description', 'type' => 'textarea'],
                'canonical_url' => ['label' => 'Canonical URL', 'type' => 'text'],
                'noindex' => ['label' => 'Exclude from search engines', 'type' => 'checkbox'],
            ],
        ],
        'gr_document' => [
            'Register' => [
                'doc_status' => ['label' => 'Status', 'type' => 'select', 'options' => gemreserve_document_statuses(), 'default' => 'draft', 'help' => 'A download link appears only when this is Published AND a file is attached.'],
                'version' => ['label' => 'Version', 'type' => 'text'],
                'publication_date' => ['label' => 'Publication date', 'type' => 'date'],
                'effective_date' => ['label' => 'Effective date', 'type' => 'date'],
                'supersedes' => ['label' => 'Supersedes (document ID)', 'type' => 'number'],
                'visibility' => ['label' => 'Visibility', 'type' => 'select', 'options' => ['public' => 'Public', 'restricted' => 'Restricted', 'internal' => 'Internal']],
            ],
            'File' => [
                'file' => ['label' => 'File', 'type' => 'media', 'help' => 'Leave empty while the document is in preparation. No file, no download button.'],
                'file_size' => ['label' => 'File size', 'type' => 'text', 'help' => 'Filled automatically from the attached file.'],
                'page_count' => ['label' => 'Page count', 'type' => 'number'],
                'sha256' => ['label' => 'SHA-256', 'type' => 'text', 'help' => 'Computed automatically when a file is attached.'],
            ],
            'Presentation' => [
                'cover_image' => ['label' => 'Cover image', 'type' => 'media'],
                'related_page' => ['label' => 'Related page URL', 'type' => 'text', 'help' => 'A published page covering the same ground, shown while the document is in preparation.'],
            ],
        ],
        'gr_news' => [
            'Publication' => [
                'standfirst' => ['label' => 'Standfirst', 'type' => 'textarea'],
                'seo_title' => ['label' => 'SEO title', 'type' => 'text'],
                'seo_description' => ['label' => 'SEO description', 'type' => 'textarea'],
            ],
        ],
        'gr_faq' => [
            'Answer' => [
                'faq_answer' => ['label' => 'Answer', 'type' => 'textarea', 'help' => 'Plain text. Rendered into the accordion panel.'],
            ],
        ],
        'page' => [
            'SEO' => [
                'seo_title' => ['label' => 'SEO title', 'type' => 'text', 'help' => 'Overrides the page title in <title> and Open Graph.'],
                'seo_description' => ['label' => 'Meta description', 'type' => 'textarea'],
                'canonical_url' => ['label' => 'Canonical URL', 'type' => 'text'],
                'noindex' => ['label' => 'Exclude from search engines', 'type' => 'checkbox'],
            ],
            'Hero' => [
                'hero_eyebrow' => ['label' => 'Breadcrumb parent label', 'type' => 'text'],
                'hero_title_lines' => ['label' => 'Hero title lines', 'type' => 'textarea', 'help' => 'One line per row. The last line takes the gold gradient.'],
                'hero_tagline' => ['label' => 'Hero tagline', 'type' => 'text'],
                'hero_description' => ['label' => 'Hero description', 'type' => 'textarea'],
                'hero_image_desktop' => ['label' => 'Hero image (desktop)', 'type' => 'text', 'help' => 'Path without extension, e.g. /images/heroes/technology-hero'],
                'hero_image_mobile' => ['label' => 'Hero image (mobile)', 'type' => 'text'],
            ],
            'Sections' => [
                'section_json' => ['label' => 'Section data (JSON)', 'type' => 'textarea', 'help' => 'Structured section content migrated from the previous implementation. Edit through the section editor where one exists.'],
            ],
        ],
    ];
}

/** Register every field as post meta so REST and a future API can read it. */
function gemreserve_register_meta(): void
{
    foreach (gemreserve_field_schema() as $post_type => $groups) {
        foreach ($groups as $fields) {
            foreach ($fields as $key => $field) {
                register_post_meta($post_type, "_gr_{$key}", [
                    'type' => in_array($field['type'], ['number'], true) ? 'number' : 'string',
                    'single' => true,
                    'show_in_rest' => true,
                    'sanitize_callback' => static fn($v) => is_string($v) ? wp_kses_post($v) : $v,
                    'auth_callback' => static fn() => current_user_can('edit_posts'),
                ]);
            }
        }
    }
}
add_action('init', 'gemreserve_register_meta');

/** Meta boxes, grouped exactly as the schema groups them. */
function gemreserve_add_meta_boxes(): void
{
    foreach (gemreserve_field_schema() as $post_type => $groups) {
        foreach ($groups as $group_title => $fields) {
            add_meta_box(
                'gr_' . sanitize_key($post_type . '_' . $group_title),
                $group_title,
                static function ($post) use ($fields): void {
                    gemreserve_render_fields($post, $fields);
                },
                $post_type,
                'normal',
                'default'
            );
        }
    }
}
add_action('add_meta_boxes', 'gemreserve_add_meta_boxes');

function gemreserve_render_fields(WP_Post $post, array $fields): void
{
    wp_nonce_field('gemreserve_save_fields', 'gemreserve_fields_nonce');
    echo '<div class="gr-fields">';
    foreach ($fields as $key => $field) {
        $meta_key = "_gr_{$key}";
        $value = get_post_meta($post->ID, $meta_key, true);
        if ($value === '' && isset($field['default'])) {
            $value = $field['default'];
        }
        $id = esc_attr("gr_field_{$key}");
        echo '<p class="gr-field">';
        echo '<label for="' . $id . '"><strong>' . esc_html($field['label']) . '</strong></label><br>';

        switch ($field['type']) {
            case 'textarea':
                echo '<textarea class="widefat" rows="4" id="' . $id . '" name="' . esc_attr($meta_key) . '">' . esc_textarea((string) $value) . '</textarea>';
                break;
            case 'select':
                echo '<select class="widefat" id="' . $id . '" name="' . esc_attr($meta_key) . '">';
                echo '<option value="">— select —</option>';
                foreach ($field['options'] as $ov => $ol) {
                    echo '<option value="' . esc_attr($ov) . '"' . selected($value, $ov, false) . '>' . esc_html($ol) . '</option>';
                }
                echo '</select>';
                break;
            case 'checkbox':
                echo '<input type="checkbox" id="' . $id . '" name="' . esc_attr($meta_key) . '" value="1"' . checked($value, '1', false) . '>';
                break;
            case 'number':
                echo '<input type="number" class="widefat" id="' . $id . '" name="' . esc_attr($meta_key) . '" value="' . esc_attr((string) $value) . '">';
                break;
            case 'date':
                echo '<input type="date" class="widefat" id="' . $id . '" name="' . esc_attr($meta_key) . '" value="' . esc_attr((string) $value) . '">';
                break;
            case 'media':
                echo '<input type="text" class="widefat gr-media-field" id="' . $id . '" name="' . esc_attr($meta_key) . '" value="' . esc_attr((string) $value) . '" placeholder="Attachment ID or path">';
                echo '<button type="button" class="button gr-media-pick" data-target="' . $id . '">Choose from Media Library</button>';
                break;
            default:
                echo '<input type="text" class="widefat" id="' . $id . '" name="' . esc_attr($meta_key) . '" value="' . esc_attr((string) $value) . '">';
        }

        if (!empty($field['help'])) {
            echo '<br><span class="description">' . esc_html($field['help']) . '</span>';
        }
        echo '</p>';
    }
    echo '</div>';
}

function gemreserve_save_fields(int $post_id): void
{
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!isset($_POST['gemreserve_fields_nonce']) || !wp_verify_nonce(sanitize_key($_POST['gemreserve_fields_nonce']), 'gemreserve_save_fields')) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $post_type = get_post_type($post_id);
    $schema = gemreserve_field_schema();
    if (!isset($schema[$post_type])) {
        return;
    }

    foreach ($schema[$post_type] as $fields) {
        foreach ($fields as $key => $field) {
            $meta_key = "_gr_{$key}";
            if ($field['type'] === 'checkbox') {
                update_post_meta($post_id, $meta_key, isset($_POST[$meta_key]) ? '1' : '');
                continue;
            }
            if (!isset($_POST[$meta_key])) {
                continue;
            }
            $raw = wp_unslash($_POST[$meta_key]);

            // A closed vocabulary must stay closed: an unknown option is dropped
            // rather than stored, so no page can be pushed into a state the
            // model does not define.
            if ($field['type'] === 'select' && $raw !== '' && !array_key_exists($raw, $field['options'])) {
                continue;
            }

            $value = $field['type'] === 'textarea'
                ? sanitize_textarea_field($raw)
                : sanitize_text_field($raw);
            update_post_meta($post_id, $meta_key, $value);
        }
    }

    gemreserve_sync_document_file_meta($post_id);
}
add_action('save_post', 'gemreserve_save_fields');

/**
 * File size and SHA-256 are derived, never typed.
 *
 * The board printed file sizes for documents that did not exist. Computing them
 * from the actual attachment means the figure cannot describe a missing file.
 */
function gemreserve_sync_document_file_meta(int $post_id): void
{
    if (get_post_type($post_id) !== 'gr_document') {
        return;
    }
    $file = get_post_meta($post_id, '_gr_file', true);
    if (!$file) {
        update_post_meta($post_id, '_gr_file_size', '');
        update_post_meta($post_id, '_gr_sha256', '');
        return;
    }
    $path = is_numeric($file) ? get_attached_file((int) $file) : null;
    if ($path && file_exists($path)) {
        update_post_meta($post_id, '_gr_file_size', size_format((int) filesize($path)));
        update_post_meta($post_id, '_gr_sha256', hash_file('sha256', $path));
    }
}

/** True only when a document is genuinely downloadable. */
function gemreserve_document_is_downloadable(int $post_id): bool
{
    $status = get_post_meta($post_id, '_gr_doc_status', true);
    $file = get_post_meta($post_id, '_gr_file', true);
    $visibility = get_post_meta($post_id, '_gr_visibility', true);
    return $status === 'published' && !empty($file) && $visibility !== 'internal';
}

/** Media picker for the media-type fields. */
function gemreserve_admin_assets(string $hook): void
{
    if (!in_array($hook, ['post.php', 'post-new.php'], true)) {
        return;
    }
    wp_enqueue_media();
    wp_add_inline_script('jquery-core', <<<'JS'
jQuery(function ($) {
  $(document).on('click', '.gr-media-pick', function (e) {
    e.preventDefault();
    var target = $('#' + $(this).data('target'));
    var frame = wp.media({ title: 'Select file', multiple: false });
    frame.on('select', function () {
      target.val(frame.state().get('selection').first().id);
    });
    frame.open();
  });
});
JS);
}
add_action('admin_enqueue_scripts', 'gemreserve_admin_assets');
