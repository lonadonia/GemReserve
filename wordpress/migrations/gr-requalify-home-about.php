<?php
/**
 * Requalify the four unsupported metrics on / and /about.
 *
 *   wp eval-file gr-requalify-home-about.php [dry] --path=.
 *
 * "500+ Verified Gems", "20+ Gemstone Types", "5 Secure Vaults" and
 * "50+ Countries Served" appeared on both pages. Nothing supports any of them,
 * and all four contradicted the same claims elsewhere on the site — 500+
 * against 1,850+, 20+ against 25+, 50 countries against 18 — which is its own
 * evidence that none was sourced.
 *
 * Six cards stay six cards. Each keeps its icon, its position and the panel's
 * spacing; only the claim changes, and no figure replaces it.
 *
 * The second pass adds metric-item--textual to any card whose figure is now a
 * word. That is the same thing the React component does at render time, and it
 * is what lets a status word sit in a slot the stylesheet sizes for "25+".
 */

if (!defined('WP_CLI') || !WP_CLI) {
    fwrite(STDERR, "Run through wp-cli.\n");
    exit(1);
}

$dry = in_array('dry', $args ?? [], true);

$edits = [
    'home' => [
        ['<dt><span>500+</span></dt><dd>Verified Gems</dd>',
         '<dt><span>Evidence-controlled</span></dt><dd>Gemstone Records</dd>'],
        ['<dt><span>20+</span></dt><dd>Gemstone Types</dd>',
         '<dt><span>Published catalogue</span></dt><dd>Gemstone Types</dd>'],
        ['<dt><span>5</span></dt><dd>Secure Vaults</dd>',
         '<dt><span>Arrangements pending</span></dt><dd>Custody</dd>'],
        ['<dt><span>50+</span></dt><dd>Countries Served</dd>',
         '<dt><span>Eligibility pending</span></dt><dd>Jurisdictions</dd>'],
    ],
    'about' => [
        ['<dt><span>500+</span></dt><dd>VERIFIED GEMS<small>Independently verified and graded</small></dd>',
         '<dt><span>Evidence-controlled</span></dt><dd>GEMSTONE RECORDS<small>Each record carries its own evidence state</small></dd>'],
        ['<dt><span>20+</span></dt><dd>GEMSTONE TYPES<small>A diverse collection of precious stones</small></dd>',
         '<dt><span>Published catalogue</span></dt><dd>GEMSTONE TYPES<small>Listed in the catalogue on this site</small></dd>'],
        ['<dt><span>5</span></dt><dd>SECURE VAULTS<small>Institutional grade security</small></dd>',
         '<dt><span>Arrangements pending</span></dt><dd>CUSTODY<small>Arrangements to be published before launch</small></dd>'],
        ['<dt><span>50+</span></dt><dd>COUNTRIES SERVED<small>A global community of investors</small></dd>',
         '<dt><span>Eligibility pending</span></dt><dd>JURISDICTIONS<small>Eligibility to be published before launch</small></dd>'],
    ],
];

/** Add metric-item--textual to every card whose figure contains no digit. */
function gr_mark_textual_metrics(string $html): array
{
    $marked = 0;
    $offset = 0;
    while (($start = strpos($html, '<div class="metric-item"', $offset)) !== false) {
        $depth = 0;
        $i = $start;
        $end = null;
        $len = strlen($html);
        while ($i < $len) {
            $open = strpos($html, '<div', $i);
            $close = strpos($html, '</div>', $i);
            if ($close === false) {
                break;
            }
            if ($open !== false && $open < $close) {
                $depth++;
                $i = $open + 4;
                continue;
            }
            $depth--;
            $i = $close + 6;
            if ($depth === 0) {
                $end = $i;
                break;
            }
        }
        if ($end === null) {
            break;
        }
        $card = substr($html, $start, $end - $start);
        if (preg_match('#<dt>(?:<span>)?([^<]*)#', $card, $m) && !preg_match('/\d/', $m[1])) {
            $new = preg_replace(
                '#^<div class="metric-item"#',
                '<div class="metric-item metric-item--textual"',
                $card,
                1
            );
            $html = substr($html, 0, $start) . $new . substr($html, $end);
            $marked++;
            $offset = $start + strlen($new);
            continue;
        }
        $offset = $end;
    }
    return [$html, $marked];
}

$applied = 0;
foreach ($edits as $slug => $pairs) {
    $id = $slug === 'home'
        ? (int) get_option('page_on_front')
        : (int) (get_posts(['name' => $slug, 'post_type' => 'page', 'post_status' => 'publish', 'numberposts' => 1])[0]->ID ?? 0);
    if (!$id) {
        WP_CLI::error("page not found: {$slug}");
    }

    $html = get_post_meta($id, '_gr_body_html', true);
    if (!is_string($html) || $html === '') {
        WP_CLI::error("{$slug}: no _gr_body_html");
    }

    foreach ($pairs as [$from, $to]) {
        $n = substr_count($html, $from);
        if ($n === 0) {
            WP_CLI::warning("{$slug}: fragment not found: " . substr($from, 0, 60));
            continue;
        }
        if ($n > 1) {
            WP_CLI::error("{$slug}: fragment appears {$n} times, refusing an ambiguous edit");
        }
        $html = str_replace($from, $to, $html);
        $applied++;
    }

    [$html, $marked] = gr_mark_textual_metrics($html);
    WP_CLI::log("  {$slug}: {$marked} card(s) marked textual" . ($dry ? ' [dry]' : ''));

    foreach (['500+', '20+', '50+', 'Verified Gems', 'Countries Served', 'Secure Vaults'] as $stale) {
        if (str_contains($html, $stale)) {
            WP_CLI::error("{$slug}: '{$stale}' still present after the edit");
        }
    }

    if (!$dry) {
        update_post_meta($id, '_gr_body_html', $html);
    }
}

WP_CLI::success(sprintf('%d fragment(s) replaced%s', $applied, $dry ? ' [dry run, nothing written]' : ''));
