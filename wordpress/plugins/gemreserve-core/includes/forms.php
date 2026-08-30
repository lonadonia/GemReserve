<?php
/**
 * Form handling: storage, validation and the admin review screens.
 *
 * Two rules shape all of this.
 *
 * The database is the receipt. A visitor is told their message was received
 * only after the row is written — never on the strength of an email that may
 * silently fail. Notification email is an extra, off by default, and its
 * absence must never turn into a lost enquiry.
 *
 * Submissions are personal data. The post types are private, excluded from
 * REST and from search, and reading them takes a capability that an ordinary
 * editor does not have. Nothing here is ever rendered on the front end.
 */

if (!defined('ABSPATH')) {
    exit;
}

const GR_FORM_TYPES = ['gr_contact' => 'Contact enquiry', 'gr_waitlist' => 'Waitlist signup'];

/** Submission lifecycle, for the reviewer's own tracking. */
function gemreserve_submission_statuses(): array
{
    return [
        'new' => 'New',
        'in_review' => 'In review',
        'responded' => 'Responded',
        'closed' => 'Closed',
        'spam' => 'Spam',
    ];
}

/**
 * The two post types.
 *
 * `public => false` with `show_in_rest => false` is doing real work: it keeps
 * these out of the sitemap, out of search, off the front end and out of the
 * REST API, so a submission cannot be read by anyone who has not authenticated
 * into the admin with the right capability.
 */
function gemreserve_register_submission_types(): void
{
    foreach (GR_FORM_TYPES as $type => $label) {
        register_post_type($type, [
            'labels' => [
                'name' => $label === 'Contact enquiry' ? 'Contact Enquiries' : 'Waitlist',
                'singular_name' => $label,
                'menu_name' => $label === 'Contact enquiry' ? 'Contact Enquiries' : 'Waitlist',
                'all_items' => $label === 'Contact enquiry' ? 'Contact Enquiries' : 'Waitlist',
                'search_items' => "Search {$label}s",
                'not_found' => 'No submissions yet',
            ],
            'public' => false,
            'publicly_queryable' => false,
            'exclude_from_search' => true,
            'show_ui' => true,
            'show_in_menu' => false,
            'show_in_rest' => false,
            'has_archive' => false,
            'rewrite' => false,
            'query_var' => false,
            'supports' => ['title'],
            'capability_type' => ['gr_submission', 'gr_submissions'],
            'map_meta_cap' => true,
            'capabilities' => [
                'create_posts' => 'do_not_allow', // only the form creates these
            ],
        ]);
    }
}
add_action('init', 'gemreserve_register_submission_types');

/** Who may read submissions. Editors deliberately may not. */
function gemreserve_grant_submission_caps(): void
{
    $caps = [
        'edit_gr_submission', 'read_gr_submission', 'delete_gr_submission',
        'edit_gr_submissions', 'edit_others_gr_submissions',
        'delete_gr_submissions', 'delete_others_gr_submissions',
        'read_private_gr_submissions', 'edit_private_gr_submissions',
        'edit_published_gr_submissions', 'publish_gr_submissions',
        'gr_manage_submissions',
    ];
    foreach (['administrator', 'gr_compliance'] as $role_name) {
        $role = get_role($role_name);
        if (!$role) {
            continue;
        }
        foreach ($caps as $cap) {
            $role->add_cap($cap);
        }
    }
}
add_action('admin_init', 'gemreserve_grant_submission_caps');

/** Field definitions per form. `required` is enforced server-side. */
function gemreserve_form_fields(string $type): array
{
    if ($type === 'gr_contact') {
        return [
            'name' => ['label' => 'Full name', 'required' => true, 'max' => 120],
            'company' => ['label' => 'Company', 'required' => false, 'max' => 160],
            'email' => ['label' => 'Email', 'required' => true, 'email' => true, 'max' => 190],
            'phone' => ['label' => 'Phone', 'required' => false, 'max' => 40],
            'subject' => ['label' => 'Subject', 'required' => true, 'max' => 160],
            'message' => ['label' => 'Message', 'required' => true, 'max' => 5000, 'textarea' => true],
        ];
    }
    return [
        'first_name' => ['label' => 'First name', 'required' => true, 'max' => 80],
        'last_name' => ['label' => 'Last name', 'required' => true, 'max' => 80],
        'email' => ['label' => 'Email', 'required' => true, 'email' => true, 'max' => 190],
        'country' => ['label' => 'Country of residence', 'required' => true, 'max' => 80],
        'role' => ['label' => 'Joining as', 'required' => false, 'max' => 80],
    ];
}

/**
 * Rate limiting, per address.
 *
 * Five submissions an hour. Enough for a person who mistypes an email twice and
 * tries again; not enough to be worth automating.
 */
function gemreserve_submission_rate_key(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    return 'gr_form_rate_' . md5((string) $ip);
}

function gemreserve_rate_limited(): bool
{
    return ((int) get_transient(gemreserve_submission_rate_key())) >= 5;
}

function gemreserve_record_submission_attempt(): void
{
    $key = gemreserve_submission_rate_key();
    set_transient($key, ((int) get_transient($key)) + 1, HOUR_IN_SECONDS);
}

/**
 * Handle a submission.
 *
 * Wired to admin-post so it runs through WordPress's own nonce and referer
 * machinery rather than a bespoke endpoint.
 */
function gemreserve_handle_submission(): void
{
    $type = sanitize_key($_POST['gr_form'] ?? '');
    if (!isset(GR_FORM_TYPES[$type])) {
        gemreserve_form_redirect('', 'invalid');
        return;
    }
    $source = wp_get_referer() ?: home_url('/');

    // CSRF. A missing or stale nonce is refused outright.
    if (!isset($_POST['gr_nonce']) || !wp_verify_nonce(sanitize_key($_POST['gr_nonce']), 'gr_form_' . $type)) {
        gemreserve_form_redirect($source, 'expired');
        return;
    }

    // Honeypot: a field hidden from people and irresistible to bots. Answered
    // with a success redirect on purpose — telling a bot it was caught only
    // teaches whoever wrote it to stop filling that field in.
    if (!empty($_POST['gr_website'])) {
        gemreserve_form_redirect($source, 'sent');
        return;
    }

    // A human does not complete and submit a form in under two seconds.
    $started = (int) ($_POST['gr_t'] ?? 0);
    if ($started > 0 && (time() - $started) < 2) {
        gemreserve_form_redirect($source, 'sent');
        return;
    }

    if (gemreserve_rate_limited()) {
        gemreserve_form_redirect($source, 'throttled');
        return;
    }

    $fields = gemreserve_form_fields($type);
    $values = [];
    $errors = [];

    foreach ($fields as $key => $spec) {
        $raw = wp_unslash($_POST[$key] ?? '');
        $value = $spec['textarea'] ?? false
            ? sanitize_textarea_field($raw)
            : sanitize_text_field($raw);
        $value = mb_substr($value, 0, (int) $spec['max']);

        if (($spec['required'] ?? false) && $value === '') {
            $errors[] = $key;
            continue;
        }
        if (($spec['email'] ?? false) && $value !== '' && !is_email($value)) {
            $errors[] = $key;
            continue;
        }
        $values[$key] = $value;
    }

    // Consent is not optional and is recorded with the wording version in force,
    // so what someone agreed to can be established later.
    if (empty($_POST['consent'])) {
        $errors[] = 'consent';
    }

    if ($errors) {
        gemreserve_form_redirect($source, 'invalid', $errors);
        return;
    }

    // Duplicate suppression: the same address submitting the same form inside
    // five minutes is a double-click, not a second enquiry.
    $existing = get_posts([
        'post_type' => $type,
        'post_status' => 'private',
        'numberposts' => 1,
        'fields' => 'ids',
        'date_query' => [['after' => '5 minutes ago']],
        'meta_query' => [['key' => '_gr_email', 'value' => $values['email']]],
    ]);
    if ($existing) {
        gemreserve_form_redirect($source, 'sent');
        return;
    }

    $title = $type === 'gr_contact'
        ? sprintf('%s — %s', $values['name'], $values['subject'])
        : sprintf('%s %s', $values['first_name'], $values['last_name']);

    $post_id = wp_insert_post([
        'post_type' => $type,
        'post_status' => 'private',
        'post_title' => wp_strip_all_tags($title),
    ], true);

    if (is_wp_error($post_id)) {
        // The row did not write, so the visitor is not told it did.
        gemreserve_form_redirect($source, 'error');
        return;
    }

    foreach ($values as $key => $value) {
        update_post_meta($post_id, "_gr_{$key}", $value);
    }
    update_post_meta($post_id, '_gr_consent', '1');
    update_post_meta($post_id, '_gr_consent_version', gemreserve_setting('forms_consent_version'));
    update_post_meta($post_id, '_gr_submitted_at', gmdate('c'));
    update_post_meta($post_id, '_gr_source_page', esc_url_raw($source));
    update_post_meta($post_id, '_gr_status', 'new');
    // Truncated to a /24 so an enquiry can be correlated with abuse without
    // retaining a full address against a named person indefinitely.
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    update_post_meta($post_id, '_gr_ip_prefix', preg_replace('/\.\d+$/', '.0', $ip));

    gemreserve_record_submission_attempt();
    gemreserve_maybe_notify($type, $post_id, $values);

    gemreserve_form_redirect($source, 'sent');
}
add_action('admin_post_nopriv_gr_submit', 'gemreserve_handle_submission');
add_action('admin_post_gr_submit', 'gemreserve_handle_submission');

/** Redirect back with a result the page can render accessibly. */
function gemreserve_form_redirect(string $source, string $result, array $errors = []): void
{
    $url = $source ?: home_url('/');
    $args = ['gr_result' => $result];
    if ($errors) {
        $args['gr_fields'] = implode(',', array_map('sanitize_key', $errors));
    }
    wp_safe_redirect(add_query_arg($args, $url) . '#gr-form-status');
    exit;
}

/**
 * Notification email, only when configured.
 *
 * Postfix is listening locally on this host, but a local MTA sending as
 * gemreserve.io without SPF and DKIM alignment gets filed as spam or refused.
 * So this stays off until a real transactional service is configured, and its
 * failure can never affect what the visitor is told — the row is already
 * written by the time it runs.
 */
function gemreserve_maybe_notify(string $type, int $post_id, array $values): void
{
    if (!gemreserve_flag('forms_enabled')) {
        return;
    }
    $to = gemreserve_setting('forms_destination');
    if (!$to || !is_email($to)) {
        return;
    }
    $label = GR_FORM_TYPES[$type] ?? 'Submission';
    $lines = ["New {$label} (#{$post_id})", ''];
    foreach ($values as $k => $v) {
        $lines[] = ucfirst(str_replace('_', ' ', $k)) . ': ' . $v;
    }
    $lines[] = '';
    $lines[] = 'Review: ' . admin_url("post.php?post={$post_id}&action=edit");
    wp_mail($to, "[GemReserve] {$label}", implode("\n", $lines));
}

// --- Admin ---------------------------------------------------------------

function gemreserve_submission_meta_boxes(): void
{
    foreach (GR_FORM_TYPES as $type => $label) {
        add_meta_box('gr_submission', 'Submission', 'gemreserve_render_submission', $type, 'normal', 'high');
        add_meta_box('gr_submission_admin', 'Handling', 'gemreserve_render_submission_admin', $type, 'side', 'default');
    }
}
add_action('add_meta_boxes', 'gemreserve_submission_meta_boxes');

function gemreserve_render_submission(WP_Post $post): void
{
    $fields = gemreserve_form_fields($post->post_type);
    echo '<table class="widefat striped"><tbody>';
    foreach ($fields as $key => $spec) {
        $v = get_post_meta($post->ID, "_gr_{$key}", true);
        echo '<tr><th style="width:180px">' . esc_html($spec['label']) . '</th><td>'
            . nl2br(esc_html((string) $v)) . '</td></tr>';
    }
    foreach ([
        'Consent' => get_post_meta($post->ID, '_gr_consent', true) === '1' ? 'Given' : 'Not recorded',
        'Consent version' => get_post_meta($post->ID, '_gr_consent_version', true),
        'Submitted (UTC)' => get_post_meta($post->ID, '_gr_submitted_at', true),
        'Source page' => get_post_meta($post->ID, '_gr_source_page', true),
        'IP prefix' => get_post_meta($post->ID, '_gr_ip_prefix', true),
    ] as $label => $value) {
        echo '<tr><th>' . esc_html($label) . '</th><td>' . esc_html((string) $value) . '</td></tr>';
    }
    echo '</tbody></table>';
}

function gemreserve_render_submission_admin(WP_Post $post): void
{
    wp_nonce_field('gr_save_submission', 'gr_submission_nonce');
    $status = get_post_meta($post->ID, '_gr_status', true) ?: 'new';
    echo '<p><label for="gr_status"><strong>Status</strong></label><br>';
    echo '<select class="widefat" id="gr_status" name="gr_status">';
    foreach (gemreserve_submission_statuses() as $k => $l) {
        echo '<option value="' . esc_attr($k) . '"' . selected($status, $k, false) . '>' . esc_html($l) . '</option>';
    }
    echo '</select></p>';
    echo '<p><label for="gr_notes"><strong>Internal notes</strong></label><br>';
    echo '<textarea class="widefat" rows="6" id="gr_notes" name="gr_notes">'
        . esc_textarea((string) get_post_meta($post->ID, '_gr_notes', true)) . '</textarea>';
    echo '<span class="description">Not visible to the person who submitted.</span></p>';
}

function gemreserve_save_submission(int $post_id): void
{
    if (!isset($_POST['gr_submission_nonce']) || !wp_verify_nonce(sanitize_key($_POST['gr_submission_nonce']), 'gr_save_submission')) {
        return;
    }
    if (!current_user_can('gr_manage_submissions')) {
        return;
    }
    $statuses = gemreserve_submission_statuses();
    $status = sanitize_key($_POST['gr_status'] ?? 'new');
    if (isset($statuses[$status])) {
        update_post_meta($post_id, '_gr_status', $status);
    }
    update_post_meta($post_id, '_gr_notes', sanitize_textarea_field(wp_unslash($_POST['gr_notes'] ?? '')));
}
add_action('save_post', 'gemreserve_save_submission');

/** List columns worth having. */
function gemreserve_submission_columns(array $columns): array
{
    return [
        'cb' => $columns['cb'] ?? '',
        'title' => 'Submission',
        'gr_email' => 'Email',
        'gr_status' => 'Status',
        'gr_source' => 'Source page',
        'date' => 'Received',
    ];
}
foreach (array_keys(GR_FORM_TYPES) as $t) {
    add_filter("manage_{$t}_posts_columns", 'gemreserve_submission_columns');
}

function gemreserve_submission_column(string $column, int $post_id): void
{
    if ($column === 'gr_email') {
        $e = (string) get_post_meta($post_id, '_gr_email', true);
        echo $e ? '<a href="mailto:' . esc_attr($e) . '">' . esc_html($e) . '</a>' : '—';
    }
    if ($column === 'gr_status') {
        $s = get_post_meta($post_id, '_gr_status', true) ?: 'new';
        $labels = gemreserve_submission_statuses();
        echo esc_html($labels[$s] ?? $s);
    }
    if ($column === 'gr_source') {
        $u = (string) get_post_meta($post_id, '_gr_source_page', true);
        echo esc_html($u ? (wp_parse_url($u, PHP_URL_PATH) ?: $u) : '—');
    }
}
foreach (array_keys(GR_FORM_TYPES) as $t) {
    add_action("manage_{$t}_posts_custom_column", 'gemreserve_submission_column', 10, 2);
}

/**
 * Search across the stored fields.
 *
 * WordPress's own search only looks at post_title and post_content, and the
 * content of a submission lives entirely in meta, so a reviewer searching for
 * an email address would otherwise find nothing.
 */
function gemreserve_search_submissions(WP_Query $q): void
{
    if (!is_admin() || !$q->is_main_query()) {
        return;
    }
    $type = $q->get('post_type');
    if (!is_string($type) || !isset(GR_FORM_TYPES[$type])) {
        return;
    }
    $term = trim((string) $q->get('s'));
    if ($term === '') {
        return;
    }
    $q->set('s', '');
    $meta = ['relation' => 'OR'];
    foreach (['email', 'name', 'first_name', 'last_name', 'company', 'subject', 'message', 'country'] as $k) {
        $meta[] = ['key' => "_gr_{$k}", 'value' => $term, 'compare' => 'LIKE'];
    }
    $q->set('meta_query', $meta);
}
add_action('pre_get_posts', 'gemreserve_search_submissions');

/**
 * CSV export.
 *
 * Behind a capability and a nonce, because this is the one action that takes
 * every stored personal record and puts it in a file. Fields are prefixed
 * against spreadsheet formula injection: a value starting =, +, - or @ is
 * executed by Excel on open.
 */
function gemreserve_export_submissions(): void
{
    if (!current_user_can('gr_manage_submissions')) {
        wp_die('You do not have permission to export submissions.');
    }
    check_admin_referer('gr_export_submissions');

    $type = sanitize_key($_GET['type'] ?? '');
    if (!isset(GR_FORM_TYPES[$type])) {
        wp_die('Unknown submission type.');
    }

    $fields = gemreserve_form_fields($type);
    $extra = ['consent', 'consent_version', 'submitted_at', 'source_page', 'status', 'notes'];

    nocache_headers();
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="gemreserve-' . $type . '-' . gmdate('Ymd-His') . '.csv"');

    $out = fopen('php://output', 'w');
    fputcsv($out, array_merge(['id'], array_keys($fields), $extra));

    $posts = get_posts(['post_type' => $type, 'post_status' => 'private', 'numberposts' => -1]);
    foreach ($posts as $p) {
        $row = [$p->ID];
        foreach (array_merge(array_keys($fields), $extra) as $k) {
            $v = (string) get_post_meta($p->ID, "_gr_{$k}", true);
            if ($v !== '' && strpbrk($v[0], "=+-@\t\r") !== false) {
                $v = "'" . $v;
            }
            $row[] = $v;
        }
        fputcsv($out, $row);
    }
    fclose($out);
    exit;
}
add_action('admin_post_gr_export_submissions', 'gemreserve_export_submissions');

/** An export button on each list screen. */
function gemreserve_export_button(string $which): void
{
    $screen = get_current_screen();
    if ($which !== 'top' || !$screen || !isset(GR_FORM_TYPES[$screen->post_type])) {
        return;
    }
    if (!current_user_can('gr_manage_submissions')) {
        return;
    }
    $url = wp_nonce_url(
        admin_url('admin-post.php?action=gr_export_submissions&type=' . $screen->post_type),
        'gr_export_submissions'
    );
    echo '<div class="alignleft actions"><a class="button" href="' . esc_url($url) . '">Export CSV</a></div>';
}
add_action('manage_posts_extra_tablenav', 'gemreserve_export_button');
