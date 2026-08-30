<?php
/**
 * Repair escape sequences that update_post_meta() unslashed.
 *
 *   wp eval-file gr-repair-unslashed.php [dry] --path=.
 *
 * update_metadata() runs wp_unslash() on the value before storing it. That
 * strips one level of backslashes from the WHOLE field, not just the part an
 * edit touched — so writing any change back to a field containing JSON \uXXXX
 * escapes destroys every one of them.
 *
 * Two distinct sequences resulted, and they need opposite repairs:
 *
 *   _gr_body_html    u2014   an em-dash introduced by the backing rewrite,
 *                            written as a JSON escape into an HTML field. The
 *                            HTML wants the character itself.
 *   _gr_section_json u2019   a pre-existing, correct JSON escape that lost its
 *                            backslash. The JSON wants the escape back.
 *
 * The values go back through wp_slash() so the unslash on the way in leaves
 * them exactly as intended. That is the fix for the cause, not just the
 * symptom — see gr-requalify-backing.php, which now does the same.
 */

if (!defined('WP_CLI') || !WP_CLI) {
    fwrite(STDERR, "Run through wp-cli.\n");
    exit(1);
}

$dry = in_array('dry', $args ?? [], true);

global $wpdb;
$rows = $wpdb->get_results("SELECT meta_id, post_id, meta_key, meta_value FROM {$wpdb->postmeta} WHERE meta_key LIKE '\\_gr\\_%'");

$repaired = 0;
$pages = [];

foreach ($rows as $row) {
    $value = $row->meta_value;
    $before = $value;

    if ($row->meta_key === '_gr_section_json') {
        // Restore the escape. Anchored on "u" + exactly four hex digits not
        // already preceded by a backslash, which is the only shape the damage
        // takes and cannot collide with prose.
        $value = preg_replace('/(?<!\\\\)u([0-9a-fA-F]{4})/', '\\\\u$1', $value);
    } else {
        // Any other field is HTML or plain text: the character, not an escape.
        $value = preg_replace_callback(
            '/(?<!\\\\)u([0-9a-fA-F]{4})/',
            static fn(array $m): string => mb_chr((int) hexdec($m[1]), 'UTF-8'),
            $value
        );
    }

    if ($value === $before) {
        continue;
    }

    if ($row->meta_key === '_gr_section_json') {
        json_decode($value, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            WP_CLI::error(sprintf(
                '%s/%s: repair would leave invalid JSON (%s) — aborting.',
                get_post_field('post_name', $row->post_id), $row->meta_key, json_last_error_msg()
            ));
        }
    }

    $repaired++;
    $pages[get_post_field('post_name', $row->post_id)][] = $row->meta_key;

    if (!$dry) {
        // wp_slash, so update_metadata's wp_unslash returns what we meant.
        update_post_meta($row->post_id, $row->meta_key, wp_slash($value));
    }
}

ksort($pages);
foreach ($pages as $slug => $keys) {
    WP_CLI::log(sprintf('  %-32s %s', $slug, implode(', ', array_unique($keys))));
}
WP_CLI::success(sprintf('%d field(s) repaired%s', $repaired, $dry ? ' [dry run]' : ''));
