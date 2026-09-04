<?php
/**
 * The WordPress-side test suite.
 *
 * Run with WP-CLI against an isolated instance:
 *
 *     wp eval-file wordpress/plugins/gemreserve-visual-cms/tests/run-tests.php
 *
 * Written as a plain runner rather than as PHPUnit tests. The reason is what
 * these tests actually assert: that block registration, capability mapping,
 * kses filtering, nonce consumption and the REST permission callbacks behave
 * correctly *inside a booted WordPress*. WP's PHPUnit harness exists for that,
 * but it wants its own database, its own bootstrap and a checkout of the core
 * test library — infrastructure this project does not have and which would have
 * to be stood up and maintained to run assertions that WP-CLI can already make
 * against a real instance.
 *
 * The tests are destructive in the sense that they create and delete posts and
 * a user. They refuse to run against a site whose home URL is not local, which
 * is the guard that stops someone pointing this at production.
 *
 * @package GemReserveVisualCms
 */

// No `declare(strict_types=1)` here, deliberately: `wp eval-file` evaluates this
// file rather than including it, and a strict-types declaration is only legal as
// the first statement of a script. The code under test declares it; this runner
// cannot.

namespace GemReserve\VisualCms\Tests;

use GemReserve\VisualCms\Blocks;
use GemReserve\VisualCms\Decomposer;
use GemReserve\VisualCms\Duplicator;
use GemReserve\VisualCms\GemstonePolicy;
use GemReserve\VisualCms\Html;
use GemReserve\VisualCms\MarkupPolicy;
use GemReserve\VisualCms\Media;
use GemReserve\VisualCms\Migrator;
use GemReserve\VisualCms\Normaliser;
use GemReserve\VisualCms\Preview;
use GemReserve\VisualCms\Renderer;
use GemReserve\VisualCms\Roles;
use GemReserve\VisualCms\SlotEngine;

if (!defined('WP_CLI') || !\WP_CLI) {
    exit("This suite must be run through WP-CLI.\n");
}

/* ------------------------------------------------------------------ */
/* Harness                                                             */
/* ------------------------------------------------------------------ */

final class Runner
{
    private int $passed = 0;
    private int $failed = 0;
    /** @var string[] */
    private array $failures = [];
    private string $group = '';

    public function group(string $name): void
    {
        $this->group = $name;
        \WP_CLI::log("\n== {$name} ==");
    }

    public function ok(string $name, bool $condition, string $detail = ''): void
    {
        if ($condition) {
            $this->passed++;
            \WP_CLI::log(sprintf('  PASS  %s', $name));

            return;
        }
        $this->failed++;
        $line = sprintf('%s / %s%s', $this->group, $name, $detail !== '' ? ' — ' . $detail : '');
        $this->failures[] = $line;
        \WP_CLI::log(sprintf('  FAIL  %s%s', $name, $detail !== '' ? ' — ' . $detail : ''));
    }

    public function same(string $name, mixed $expected, mixed $actual): void
    {
        $this->ok(
            $name,
            $expected === $actual,
            $expected === $actual ? '' : sprintf('expected %s, got %s', self::show($expected), self::show($actual))
        );
    }

    private static function show(mixed $value): string
    {
        if (is_string($value)) {
            return strlen($value) > 90 ? substr($value, 0, 90) . '…' : $value;
        }

        return var_export($value, true);
    }

    public function summary(): int
    {
        \WP_CLI::log(sprintf("\n%d passed, %d failed", $this->passed, $this->failed));
        foreach ($this->failures as $failure) {
            \WP_CLI::log('  FAILED: ' . $failure);
        }

        return $this->failed === 0 ? 0 : 1;
    }
}

/* Refuse to run anywhere that looks like production. */
$home = (string) home_url();
if (!preg_match('#^https?://(127\.0\.0\.1|localhost|.*\.local|.*\.test)(:\d+)?#i', $home)) {
    \WP_CLI::error("Refusing to run: home_url() is {$home}, which is not a local instance. This suite creates and deletes content.");
}

$t = new Runner();

/* ------------------------------------------------------------------ */
$t->group('Block registration');

$registry = \WP_Block_Type_Registry::get_instance();
foreach (Blocks::names() as $name) {
    $t->ok("{$name} is registered", $registry->is_registered($name));
}
$section = $registry->get_registered('gemreserve/section');
$t->ok('section declares its attributes', isset($section->attributes['open'], $section->attributes['hidden']));
$t->ok('section is server-rendered', is_callable($section->render_callback));
$t->same('section disallows raw HTML editing', false, $section->supports['html'] ?? null);

/* ------------------------------------------------------------------ */
$t->group('Slot engine — fidelity');

$samples = [
    'plain text' => '<p>Hello world</p>',
    'entities' => '<p>Vaults &amp; Custody &lt;tag&gt;</p>',
    'apostrophe' => "<p>A jeweller's loupe</p>",
    'attributes' => '<a class="button" href="/about/" title="Read">Read more</a>',
    'image' => '<img src="/a.webp" alt="A gem" width="10" height="10">',
    'svg icon' => '<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M1 2"></path></svg></span>',
    'nested list' => '<ul class="x"><li><h3>A</h3><p>B</p></li><li><h3>C</h3><p>D</p></li></ul>',
    'nbsp entity' => '<p>a&nbsp;b</p>',
];
foreach ($samples as $label => $markup) {
    $engine = new SlotEngine();
    $extracted = $engine->extract($markup, 'c');
    $t->same("round-trips: {$label}", $markup, SlotEngine::render($extracted->template, $extracted->slots));
}

/*
 * A literal U+00A0 is normalised to `&nbsp;`, not preserved.
 *
 * That is the HTML5 serialiser's canonical form, and it is the one case found
 * where extract → render is not byte-identical to its input. It is recorded
 * rather than fixed because the fix would be worse: forcing a literal
 * non-breaking space back into the output would mean hand-editing the
 * serialiser's output, and the two forms are identical to every parser.
 *
 * It is also harmless in practice, and the reason is the migration's own
 * design: a page whose body carried a literal U+00A0 would fail the
 * byte-identity precondition and be refused, not silently rewritten. None of
 * the 58 routes contain one. What matters is that the normalisation is
 * *stable*, which is what this asserts — a second pass changes nothing.
 */
$nbsp_engine = new SlotEngine();
$nbsp_once = SlotEngine::render(
    ...(static function (SlotEngine $e): array {
        $x = $e->extract("<p>a\u{00A0}b</p>", 'c');
        return [$x->template, $x->slots];
    })($nbsp_engine)
);
$nbsp_twice_engine = new SlotEngine();
$nbsp_twice = SlotEngine::render(
    ...(static function (SlotEngine $e, string $html): array {
        $x = $e->extract($html, 'c');
        return [$x->template, $x->slots];
    })($nbsp_twice_engine, $nbsp_once)
);
$t->same('a literal nbsp normalises to the entity', '<p>a&nbsp;b</p>', $nbsp_once);
$t->same('and that normalisation is stable', $nbsp_once, $nbsp_twice);

$engine = new SlotEngine();
$extracted = $engine->extract('<p>original</p>', 'c');
$t->same(
    'a changed value renders escaped',
    '<p>&lt;script&gt;x&lt;/script&gt;</p>',
    SlotEngine::render($extracted->template, $extracted->slots, [$extracted->slots[0]->key => '<script>x</script>'])
);

$engine = new SlotEngine();
$extracted = $engine->extract('<a href="/ok/">x</a>', 'c');
$url_slot = $extracted->slots[0];
$t->same(
    'javascript: URL is dropped',
    '<a href="">x</a>',
    SlotEngine::render($extracted->template, $extracted->slots, [$url_slot->key => 'javascript:alert(1)'])
);
$t->same(
    'control characters cannot smuggle a scheme',
    '<a href="">x</a>',
    SlotEngine::render($extracted->template, $extracted->slots, [$url_slot->key => "java\nscript:alert(1)"])
);
$t->same(
    'a relative URL is kept',
    '<a href="/about/">x</a>',
    SlotEngine::render($extracted->template, $extracted->slots, [$url_slot->key => '/about/'])
);
$t->same(
    'an ampersand in a query string is not double-escaped',
    '<a href="/a?x=1&amp;y=2">x</a>',
    SlotEngine::render($extracted->template, $extracted->slots, [$url_slot->key => '/a?x=1&y=2'])
);

/* ------------------------------------------------------------------ */
$t->group('Icon sanitiser');

$icon_cases = [
    'script inside svg' => ['<svg viewBox="0 0 1 1"><script>alert(1)</script><path d="M0 0"></path></svg>', 'script'],
    'event handler' => ['<svg viewBox="0 0 1 1" onload="alert(1)"><path d="M0 0"></path></svg>', 'onload'],
    'foreignObject' => ['<svg viewBox="0 0 1 1"><foreignObject><body>x</body></foreignObject></svg>', 'foreignobject'],
    'external paint url' => ['<svg viewBox="0 0 1 1"><path d="M0 0" fill="url(https://evil.example/x)"></path></svg>', 'evil.example'],
];
foreach ($icon_cases as $label => [$svg, $needle]) {
    $clean = Renderer::sanitize_icon($svg);
    $t->ok("removes {$label}", stripos($clean, $needle) === false, $clean);
}
$t->same('a local paint reference survives', true, str_contains(
    Renderer::sanitize_icon('<svg viewBox="0 0 1 1"><path d="M0 0" fill="url(#g)"></path></svg>'),
    'url(#g)'
));
$t->same('non-svg input is refused', '', Renderer::sanitize_icon('<div>not an icon</div>'));

/* ------------------------------------------------------------------ */
$t->group('Markup policy');

$policy_cases = [
    'script element' => ['<p>a</p><script>alert(1)</script>', 'script'],
    'onerror attribute' => ['<img src="x" onerror="alert(1)">', 'onerror'],
    'iframe' => ['<iframe src="https://evil.example"></iframe>', 'iframe'],
    'javascript href' => ['<a href="javascript:alert(1)">x</a>', 'javascript:'],
    'form action' => ['<form action="https://evil.example"></form>', 'evil.example'],
];
foreach ($policy_cases as $label => [$markup, $needle]) {
    $t->ok("strips {$label}", stripos(MarkupPolicy::filter($markup), $needle) === false);
}
$t->ok('keeps aria-labelledby', MarkupPolicy::is_clean('<section class="x" aria-labelledby="y"></section>'));
$t->ok('keeps data attributes', MarkupPolicy::is_clean('<li data-phase="physical"></li>'));
$t->ok('keeps CSS custom properties', MarkupPolicy::is_clean('<div class="a" style="--reveal-delay:80ms"></div>'));
$t->ok('keeps SVG viewBox case', MarkupPolicy::is_clean('<svg viewBox="0 0 24 24" fill="none"><path d="M1 2"></path></svg>'));
$t->ok('keeps a slot placeholder in an image src', MarkupPolicy::is_clean('<img src="{{gr_c1}}" alt="{{gr_c2}}">'));
$t->ok('keeps adjacent slot placeholders', MarkupPolicy::is_clean('<li>{{gr_i1}}{{gr_i2}}</li>'));
$t->ok('accepts a lone closing tag', MarkupPolicy::filter_fragment('</section>') === '</section>');
$t->ok('accepts a lone opening tag', MarkupPolicy::filter_fragment('<section class="x">') === '<section class="x">');

/* ------------------------------------------------------------------ */
$t->group('Migration — every candidate route');

$candidates = Migrator::candidates();
$t->ok('candidates include pages and gemstones', count($candidates) >= 40, (string) count($candidates));

$identical = 0;
$refused = 0;
foreach ($candidates as $id) {
    $row = Migrator::migrate_post((int) $id, false);
    if ($row['identical']) {
        $identical++;
    }
    if ($row['status'] === 'refused') {
        $refused++;
    }
}
$t->same('every candidate re-renders byte-identically', count($candidates), $identical);
$t->same('no candidate is refused', 0, $refused);

/* ------------------------------------------------------------------ */
$t->group('Migration — idempotency and rollback');

$sample = (int) ($candidates[0] ?? 0);
if ($sample > 0) {
    $before = (string) get_post_field('post_content', $sample);
    Migrator::migrate_post($sample, true);
    $first = (string) get_post_field('post_content', $sample);
    Migrator::migrate_post($sample, true);
    $second = (string) get_post_field('post_content', $sample);
    $t->same('a second migration changes nothing', $first, $second);

    $snapshot = (string) get_post_meta($sample, Migrator::META_SNAPSHOT, true);
    $t->ok('a pre-migration snapshot is kept', $snapshot !== '');
    $t->same(
        'stored blocks render back to the snapshot',
        $snapshot,
        Migrator::render_blocks(parse_blocks($first))
    );

    Migrator::rollback_post($sample, true);
    $t->same('rollback restores the legacy body', $snapshot, (string) get_post_meta($sample, '_gr_body_html', true));
    $t->ok('rollback clears the migrated flag', !Migrator::is_migrated($sample));

    Migrator::migrate_post($sample, true);
    $t->same('re-migration reproduces the same content', $first, (string) get_post_field('post_content', $sample));
    unset($before);
}

/* ------------------------------------------------------------------ */
$t->group('Migration — every migrated post type is editable');

// The filter that re-enables Gutenberg and the migration's candidate query must
// name the same post types. When they disagreed, the 18 gemstone records came
// out of the migration holding block markup and were still handed to the
// classic editor, whose save path runs content through wp_kses_post() and
// wpautop() — which would have rewritten a 57 KB body down to 31 KB.
foreach (\GemReserve\VisualCms\MIGRATED_POST_TYPES as $type) {
    $t->ok(
        "the block editor is enabled for {$type}",
        use_block_editor_for_post_type($type)
    );
}
$migrated_types = [];
foreach (Migrator::candidates() as $cid) {
    $migrated_types[get_post_type($cid)] = true;
}
foreach (array_keys($migrated_types) as $type) {
    $t->ok(
        "the migration only converts post types it makes editable ({$type})",
        in_array($type, \GemReserve\VisualCms\MIGRATED_POST_TYPES, true)
    );
}

/* ------------------------------------------------------------------ */
$t->group('Migration — post_modified is not disturbed');

// A migration changes no byte of a page's public output, so it must not claim
// the page was modified. `gemreserve-flat-sitemap` builds every <lastmod> in
// /sitemap.xml out of post_modified_gmt, so a migration that bumps it moves
// most of the sitemap to the deployment timestamp and tells every crawler the
// site changed when it did not.
$stamp_sample = (int) ($candidates[1] ?? $candidates[0] ?? 0);
if ($stamp_sample > 0) {
    Migrator::rollback_post($stamp_sample, true);

    // Age the row so a bump would be unmistakable rather than a same-second tie.
    $aged = gmdate('Y-m-d H:i:s', time() - 86400 * 30);
    $GLOBALS['wpdb']->update(
        $GLOBALS['wpdb']->posts,
        ['post_modified' => $aged, 'post_modified_gmt' => $aged],
        ['ID' => $stamp_sample]
    );
    clean_post_cache($stamp_sample);

    $before_gmt = (string) get_post_field('post_modified_gmt', $stamp_sample);
    Migrator::migrate_post($stamp_sample, true);
    clean_post_cache($stamp_sample);
    $t->same(
        'migration leaves post_modified_gmt untouched',
        $before_gmt,
        (string) get_post_field('post_modified_gmt', $stamp_sample)
    );
    $t->same(
        'migration leaves post_modified untouched',
        $aged,
        (string) get_post_field('post_modified', $stamp_sample)
    );

    Migrator::rollback_post($stamp_sample, true);
    clean_post_cache($stamp_sample);
    $t->same(
        'rollback leaves post_modified_gmt untouched',
        $before_gmt,
        (string) get_post_field('post_modified_gmt', $stamp_sample)
    );

    // The revision the migration created keeps its own real timestamp — the
    // filter is scoped to the page id, and a revision carries ID 0 with the
    // page in post_parent.
    $revs = wp_get_post_revisions($stamp_sample, ['numberposts' => 1]);
    $rev = $revs ? array_shift($revs) : null;
    $t->ok(
        'a revision created by the migration keeps its own timestamp',
        $rev === null || $rev->post_modified_gmt !== $aged
    );

    Migrator::migrate_post($stamp_sample, true);
}

/* ------------------------------------------------------------------ */
$t->group('Roles and capabilities');

Roles::register();
$matrix = Roles::matrix();
foreach ([Roles::EDITOR, Roles::PUBLISHER] as $role_name) {
    $row = $matrix[$role_name] ?? [];
    $t->ok("{$role_name} can edit pages", !empty($row['edit_pages']));
    $t->ok("{$role_name} cannot install plugins", empty($row['install_plugins']));
    $t->ok("{$role_name} cannot edit plugin code", empty($row['edit_plugins']));
    $t->ok("{$role_name} cannot edit theme files", empty($row['edit_themes']));
    $t->ok("{$role_name} has no unfiltered_html", empty($row['unfiltered_html']));
    $t->ok("{$role_name} cannot manage users", empty($row['edit_users']));
    $t->ok("{$role_name} cannot manage options", empty($row['manage_options']));
}
$t->ok('editor cannot publish pages', empty($matrix[Roles::EDITOR]['publish_pages']));
$t->ok('publisher can publish pages', !empty($matrix[Roles::PUBLISHER]['publish_pages']));
$t->ok('publisher can manage menus', !empty($matrix[Roles::PUBLISHER]['edit_theme_options']));

/* ------------------------------------------------------------------ */
$t->group('An ordinary marketing save preserves the design');

/*
 * The defect this guards against was severe and silent. `wp_filter_post_kses`
 * runs on `content_save_pre` for every user without `unfiltered_html`, and
 * WordPress reaches inside block delimiters there to sanitise attribute values.
 * `<svg>` is not in the `post` allowlist, so a Marketing Publisher changing one
 * heading on the home page deleted all fourteen icons and 24,309 bytes of
 * approved design — measured, through the same REST save the editor uses.
 *
 * Kses::capture()/restore() bracket core's filter: the plugin's stricter policy
 * decides what a GemReserve block may contain, core still decides what a core
 * block may contain. Both halves are asserted here, because fixing the first
 * by weakening the second would be worse than the bug.
 */
$kses_user = username_exists('gr_test_kses_pub') ?: wp_create_user('gr_test_kses_pub', wp_generate_password(24), 'kses@example.test');
(new \WP_User((int) $kses_user))->set_role(Roles::PUBLISHER);
$kses_before_user = get_current_user_id();
wp_set_current_user((int) $kses_user);

$t->ok('the test user has no unfiltered_html', !current_user_can('unfiltered_html'));
$t->ok('core kses is still active for them', has_filter('content_save_pre', 'wp_filter_post_kses') !== false);

/* --- fidelity: every migrated body survives a re-save unchanged --- */
$fid_same = 0;
$fid_total = 0;
$fid_lost = 0;
foreach (Migrator::candidates() as $cid) {
    $cid = (int) $cid;
    $body = (string) get_post_field('post_content', $cid);
    if (trim($body) === '') {
        continue;
    }
    $fid_total++;
    $rest = new \WP_REST_Request('PUT', '/wp/v2/' . (get_post_type($cid) === 'gemstone' ? 'gemstone' : 'pages') . '/' . $cid);
    $rest->set_header('content-type', 'application/json');
    $rest->set_body(wp_json_encode(['content' => $body]));
    rest_do_request($rest);
    $after = (string) get_post_field('post_content', $cid);
    if ($after === $body) {
        $fid_same++;
    } else {
        $fid_lost += strlen($body) - strlen($after);
    }
}
$t->same('every migrated body survives a marketing re-save byte-identically', $fid_total, $fid_same);
$t->same('no bytes are lost across the whole site', 0, $fid_lost);

/* --- security: the same save path still refuses every payload --- */
$kses_probe = wp_insert_post([
    'post_type' => 'page',
    'post_title' => 'VCMS kses probe',
    'post_status' => 'draft',
    'post_content' => '',
], true);

$kses_payloads = [
    'script in a core block' => '<!-- wp:paragraph --><p>hi<script>alert(1)</script></p><!-- /wp:paragraph -->',
    'handler in a core block' => '<!-- wp:paragraph --><p><img src=x onerror=alert(1)></p><!-- /wp:paragraph -->',
    'iframe in a core block' => '<!-- wp:paragraph --><p><iframe src="//evil"></iframe></p><!-- /wp:paragraph -->',
    'script in a block template' => '<!-- wp:gemreserve/content {"template":"<div><script>alert(1)</script></div>","slots":[]} /-->',
    'handler in a block template' => '<!-- wp:gemreserve/content {"template":"<img src=x onerror=alert(1)>","slots":[]} /-->',
    'handler and script in an icon' => '<!-- wp:gemreserve/content {"template":"<div>{{gr_a}}</div>","slots":[{"key":"a","kind":"icon","label":"i","value":"<svg onload=alert(1)><script>x</script></svg>","path":"/div"}]} /-->',
];

if (!is_wp_error($kses_probe)) {
    foreach ($kses_payloads as $label => $payload) {
        $rest = new \WP_REST_Request('PUT', '/wp/v2/pages/' . (int) $kses_probe);
        $rest->set_header('content-type', 'application/json');
        $rest->set_body(wp_json_encode(['content' => $payload]));
        rest_do_request($rest);
        $rendered = apply_filters('the_content', (string) get_post_field('post_content', (int) $kses_probe));

        $leaked = stripos($rendered, '<script') !== false
            || preg_match('/\son[a-z]+\s*=/i', $rendered) === 1
            || stripos($rendered, '<iframe') !== false;

        $t->ok("neutralised: {$label}", !$leaked);
    }
    wp_delete_post((int) $kses_probe, true);
}

wp_set_current_user($kses_before_user);

/* ------------------------------------------------------------------ */
$t->group('Duplicate a page or gemstone');

/*
 * WordPress has no duplicate function, and "duplicate an existing page safely"
 * is on the client's list. The word doing the work is *safely*: a copy must not
 * go live on its own, must not claim a migration history it does not have, and
 * must not become a way around the gemstone field policy.
 */
$dup_source = 0;
foreach (Migrator::candidates() as $cid) {
    if (get_post_type($cid) === 'page') { $dup_source = (int) $cid; break; }
}

if ($dup_source === 0) {
    $t->ok('a page exists to duplicate', false);
} else {
    $before_user = get_current_user_id();
    $pub = username_exists('gr_test_gem_publisher') ?: wp_create_user('gr_test_gem_publisher', wp_generate_password(24), 'dup@example.test');
    (new \WP_User((int) $pub))->set_role(Roles::PUBLISHER);
    wp_set_current_user((int) $pub);

    $copy = Duplicator::duplicate($dup_source);
    $t->ok('a marketing publisher can duplicate a page', !is_wp_error($copy));

    if (!is_wp_error($copy)) {
        $copy = (int) $copy;
        $src = get_post($dup_source);
        $new = get_post($copy);

        $t->same('the copy is a draft, never published', 'draft', $new->post_status);
        $t->ok('the copy has its own id', $copy !== $dup_source);
        $t->ok('the copy has its own slug', $new->post_name !== $src->post_name);
        $t->same('the block content is copied verbatim', $src->post_content, $new->post_content);
        $t->ok('the title marks it as a copy', str_contains($new->post_title, '(copy)'));
        $t->same('the parent is preserved', $src->post_parent, $new->post_parent);

        // Provenance must not travel: the copy was never migrated.
        $t->ok('the copy is not flagged as migrated', !Migrator::is_migrated($copy));
        foreach (['_gr_vcms_legacy_body', '_gr_vcms_source_sha256', '_gr_body_html'] as $k) {
            $t->same("the copy carries no {$k}", '', (string) get_post_meta($copy, $k, true));
        }

        // The original is untouched.
        $t->same('the original keeps its status', get_post($dup_source)->post_status, $src->post_status);
        $t->ok('the original is still migrated', Migrator::is_migrated($dup_source));

        // Marketing meta does travel, or the copy would be useless.
        $t->same(
            'the SEO title is carried across',
            (string) get_post_meta($dup_source, '_gr_seo_title', true),
            (string) get_post_meta($copy, '_gr_seo_title', true)
        );

        wp_delete_post($copy, true);
    }

    /* ---- the security property: duplication is not a way round the policy ---- */
    $gem_src = 0;
    foreach (Migrator::candidates() as $cid) {
        if (get_post_type($cid) === 'gemstone') { $gem_src = (int) $cid; break; }
    }

    if ($gem_src > 0) {
        // Seed a verified record as an administrator.
        $adm = username_exists('gr_test_gem_admin') ?: wp_create_user('gr_test_gem_admin', wp_generate_password(24), 'dupadm@example.test');
        (new \WP_User((int) $adm))->set_role('administrator');
        wp_set_current_user((int) $adm);
        update_post_meta($gem_src, '_gr_evidence_state', 'verified');
        update_post_meta($gem_src, '_gr_custody_state', 'in_custody');
        update_post_meta($gem_src, '_gr_species', 'Beryl');
        $t->same('the source gemstone is verified', 'verified', (string) get_post_meta($gem_src, '_gr_evidence_state', true));

        // Now duplicate it as marketing.
        wp_set_current_user((int) $pub);
        $gem_copy = Duplicator::duplicate($gem_src);
        $t->ok('a marketing publisher can duplicate a gemstone', !is_wp_error($gem_copy));

        if (!is_wp_error($gem_copy)) {
            $gem_copy = (int) $gem_copy;
            $t->same(
                'the copy does NOT inherit the evidence state',
                '',
                (string) get_post_meta($gem_copy, '_gr_evidence_state', true)
            );
            $t->same(
                'the copy does NOT inherit the custody state',
                '',
                (string) get_post_meta($gem_copy, '_gr_custody_state', true)
            );
            $t->same(
                'the copy does NOT inherit the species',
                '',
                (string) get_post_meta($gem_copy, '_gr_species', true)
            );
            $t->same('the gemstone copy is a draft', 'draft', get_post($gem_copy)->post_status);
            wp_delete_post($gem_copy, true);
        }

        // An administrator duplicating the same stone DOES keep the record —
        // otherwise the strip would be destroying data rather than guarding it.
        wp_set_current_user((int) $adm);
        $adm_copy = Duplicator::duplicate($gem_src);
        if (!is_wp_error($adm_copy)) {
            $t->same(
                'an administrator copy keeps the evidence state',
                'verified',
                (string) get_post_meta((int) $adm_copy, '_gr_evidence_state', true)
            );
            wp_delete_post((int) $adm_copy, true);
        }
    }

    /* ---- the row action is offered, and only to those who may use it ---- */
    wp_set_current_user((int) $pub);
    $actions = Duplicator::row_action([], get_post($dup_source));
    $t->ok('a Duplicate row action is offered to marketing', isset($actions['gemreserve_duplicate']));

    wp_set_current_user(0);
    $anon = Duplicator::row_action([], get_post($dup_source));
    $t->ok('no Duplicate action for a user who cannot edit', !isset($anon['gemreserve_duplicate']));

    wp_set_current_user($before_user);
}

/* ------------------------------------------------------------------ */
$t->group('Deployment hygiene — nothing backup-shaped in the document root');

/*
 * A deployment kept each replaced file beside its target as
 * `<file>.gr-orig-<stamp>`. The vhost denies `wp-content/**` + `.php`, but that
 * matches paths *ending* in `.php`, and these did not — so six theme and plugin
 * source files were served as plain text for 74 minutes.
 *
 * Extending the vhost's suffix list would not have prevented it: `~`, `.save`,
 * `.tmp` and `.php.<anything>` were all uncovered too. The invariant that holds
 * is that a backup is never written inside the document root, and this asserts
 * it on every test run rather than trusting a deployment step to remember.
 */
// Source copies are dangerous anywhere — a stray .php.bak in uploads is as
// servable as one beside the theme. Plain archives are different: uploads is
// where WordPress stores what people upload, the vhost already refuses
// archives there (gemreserve-ai-center.zip verified returning 403), and
// flagging a user's plugin installer as a deployment artefact is the kind of
// false positive that teaches people to ignore the check.
$webroot_patterns = [
    '/\.gr-orig/i',
    '/\.(bak|backup|orig|old|save|swp|swo|tmp|temp|patch|rej|diff|copy)$/i',
    '/\.(php|inc|env|json|ya?ml)\.[A-Za-z0-9_.-]+$/i',
];
$archive_pattern = '/\.(sql|sql\.gz|tar|tar\.gz|tgz|zip)$/i';
$offenders = [];
$root = rtrim(ABSPATH, '/');
$skip = $root . '/wp-content/plugins/redirection';
$uploads_dir = $root . '/wp-content/uploads';

$it = new \RecursiveIteratorIterator(
    new \RecursiveDirectoryIterator($root, \FilesystemIterator::SKIP_DOTS),
    \RecursiveIteratorIterator::SELF_FIRST
);
foreach ($it as $path => $info) {
    $path = (string) $path;
    if (str_starts_with($path, $skip)) {
        continue;
    }
    $name = basename($path);
    foreach ($webroot_patterns as $re) {
        if (preg_match($re, $name)) {
            $offenders[] = str_replace($root . '/', '', $path);
            continue 2;
        }
    }
    if (!str_starts_with($path, $uploads_dir) && preg_match($archive_pattern, $name)) {
        $offenders[] = str_replace($root . '/', '', $path);
    }
}

$t->same(
    'no backup or source-copy artefact exists under the document root',
    [],
    $offenders
);

/* ------------------------------------------------------------------ */
$t->group('Gemstone — marketing may edit the page, not the asset record');

/*
 * The point of these tests is that hiding a field is not a control. Each write
 * path a determined caller could use is exercised separately as a restricted
 * marketing user: the metadata API, the REST meta authorisation callback, the
 * classic meta-box POST, and a crafted REST payload. Then the same writes are
 * repeated as an administrator, because a policy that blocks everybody proves
 * nothing.
 */
$gem_id = 0;
foreach (Migrator::candidates() as $cid) {
    if (get_post_type($cid) === 'gemstone') {
        $gem_id = (int) $cid;
        break;
    }
}

if ($gem_id === 0) {
    $t->ok('a gemstone exists to test against', false, 'no gemstone found');
} else {
    $mk_user = static function (string $login, string $role): int {
        $id = username_exists($login) ?: wp_create_user($login, wp_generate_password(24), $login . '@example.test');
        (new \WP_User((int) $id))->set_role($role);

        return (int) $id;
    };
    $gem_pub = $mk_user('gr_test_gem_publisher', Roles::PUBLISHER);
    $gem_ed  = $mk_user('gr_test_gem_editor', Roles::EDITOR);
    $gem_adm = $mk_user('gr_test_gem_admin', 'administrator');

    $before = get_current_user_id();

    /* ---------------- positive: the page surface is editable ---------------- */
    wp_set_current_user($gem_pub);

    $t->ok('publisher can open the gemstone for editing', current_user_can('edit_post', $gem_id));
    $t->ok('publisher can publish gemstones', current_user_can('publish_gemstones'));
    $t->ok('publisher sees the block editor for gemstones', use_block_editor_for_post_type('gemstone'));

    $editable_ok = 0;
    foreach (GemstonePolicy::MARKETING_META as $key) {
        $want = 'marketing-' . substr(md5($key), 0, 8);
        update_post_meta($gem_id, $key, $want);
        if ((string) get_post_meta($gem_id, $key, true) === $want) {
            $editable_ok++;
        }
    }
    $t->same('publisher can write every marketing field', count(GemstonePolicy::MARKETING_META), $editable_ok);

    /* ---------------- negative: the asset record is not ---------------- */
    $protected = GemstonePolicy::matrix()['protected'];
    $t->ok('the protected list is not empty', $protected !== []);

    // Seed known values as an administrator so a refusal is visible as "unchanged".
    wp_set_current_user($gem_adm);
    $seed = [];
    foreach ($protected as $key) {
        $seed[$key] = 'record-' . substr(md5($key), 0, 8);
        update_post_meta($gem_id, $key, $seed[$key]);
    }
    $seeded = 0;
    foreach ($protected as $key) {
        if ((string) get_post_meta($gem_id, $key, true) === $seed[$key]) {
            $seeded++;
        }
    }
    $t->same('an administrator can write the asset record', count($protected), $seeded);

    wp_set_current_user($gem_pub);
    $t->ok('publisher does not hold the record capability', !current_user_can(GemstonePolicy::CAP_RECORD));

    // Path 1 — the metadata API (covers REST meta writes and any plugin).
    $held = 0;
    foreach ($protected as $key) {
        update_post_meta($gem_id, $key, 'TAMPERED');
        if ((string) get_post_meta($gem_id, $key, true) === $seed[$key]) {
            $held++;
        }
    }
    $t->same('update_post_meta is refused for every protected field', count($protected), $held);

    $held = 0;
    foreach ($protected as $key) {
        delete_post_meta($gem_id, $key);
        if ((string) get_post_meta($gem_id, $key, true) === $seed[$key]) {
            $held++;
        }
    }
    $t->same('delete_post_meta is refused for every protected field', count($protected), $held);

    $t->ok(
        'add_post_meta is refused for a protected field',
        add_post_meta($gem_id, '_gr_evidence_state', 'verified') === false
    );

    // Path 2 — the REST meta authorisation callback.
    $registered = get_registered_meta_keys('post', 'gemstone');
    $auth_denied = 0;
    $auth_total = 0;
    foreach ($protected as $key) {
        if (!isset($registered[$key]['auth_callback'])) {
            continue;
        }
        $auth_total++;
        if (!call_user_func($registered[$key]['auth_callback'], false, $key, $gem_id, $gem_pub, 'edit_post', [])) {
            $auth_denied++;
        }
    }
    $t->ok('every registered protected field has a denying auth_callback', $auth_total > 0 && $auth_denied === $auth_total);

    // Path 3 — the classic meta-box POST, which reads $_POST directly.
    $_POST = ['_gr_evidence_state' => 'verified', '_gr_species' => 'Tampered', '_gr_seo_title' => 'Allowed SEO'];
    GemstonePolicy::strip_protected_post_data($gem_id);
    $t->ok('the meta-box POST loses the protected keys', !isset($_POST['_gr_evidence_state']) && !isset($_POST['_gr_species']));
    $t->ok('the meta-box POST keeps the marketing keys', ($_POST['_gr_seo_title'] ?? '') === 'Allowed SEO');
    $_POST = [];

    // Path 4 — a crafted REST payload.
    $req = new \WP_REST_Request('POST', '/wp/v2/gemstone/' . $gem_id);
    $req->set_param('meta', ['_gr_seo_title' => 'ok', '_gr_custody_state' => 'in_custody']);
    $res = GemstonePolicy::reject_protected_rest(new \stdClass(), $req);
    $t->ok('a REST payload carrying a protected field is refused', is_wp_error($res));
    $t->same(
        'the refusal is a 403',
        403,
        is_wp_error($res) ? ($res->get_error_data()['status'] ?? 0) : 0
    );

    $req_ok = new \WP_REST_Request('POST', '/wp/v2/gemstone/' . $gem_id);
    $req_ok->set_param('meta', ['_gr_seo_title' => 'ok']);
    $t->ok(
        'a REST payload carrying only marketing fields is accepted',
        !is_wp_error(GemstonePolicy::reject_protected_rest(new \stdClass(), $req_ok))
    );

    // Default deny — a field nobody has classified yet.
    $t->ok(
        'an unknown _gr_ field defaults to protected',
        GemstonePolicy::is_record_meta('_gr_some_field_added_next_year')
    );
    update_post_meta($gem_id, '_gr_some_field_added_next_year', 'x');
    $t->same('and cannot be written by marketing', '', (string) get_post_meta($gem_id, '_gr_some_field_added_next_year', true));
    $t->ok(
        'a core editorial key is not swept up by default deny',
        !GemstonePolicy::is_record_meta('_thumbnail_id') && !GemstonePolicy::is_record_meta('_edit_lock')
    );

    // The compliance register stays out of reach.
    $t->ok('publisher cannot edit controlled documents', !current_user_can('edit_gr_documents'));
    $t->ok('publisher cannot publish controlled documents', !current_user_can('publish_gr_documents'));
    $t->ok('publisher cannot delete gemstones', !current_user_can('delete_gemstones'));

    wp_set_current_user($gem_ed);
    $t->ok('marketing editor can edit the gemstone', current_user_can('edit_post', $gem_id));
    $t->ok('marketing editor cannot publish it', !current_user_can('publish_gemstones'));
    $t->ok('marketing editor cannot touch the record', !current_user_can(GemstonePolicy::CAP_RECORD));

    // Compliance keeps what it had.
    if (get_role('gr_compliance')) {
        $comp = $mk_user('gr_test_gem_compliance', 'gr_compliance');
        wp_set_current_user($comp);
        $t->ok('compliance holds the record capability', current_user_can(GemstonePolicy::CAP_RECORD));
        $t->ok('compliance can still edit gemstones', current_user_can('edit_post', $gem_id));
        $t->ok('compliance can still reach controlled documents', current_user_can('edit_gr_documents'));
    }

    wp_set_current_user($before);
}

/* ------------------------------------------------------------------ */
$t->group('Stored XSS through block attributes');

$uid = username_exists('gr_test_editor') ?: wp_create_user('gr_test_editor', wp_generate_password(24), 'gr-test@example.test');
$user = new \WP_User((int) $uid);
$user->set_role(Roles::EDITOR);
$original_user = get_current_user_id();
wp_set_current_user((int) $uid);
$t->ok('the test user has no unfiltered_html', !current_user_can('unfiltered_html'));

$probe = wp_insert_post([
    'post_type' => 'page',
    'post_title' => 'VCMS test probe',
    'post_status' => 'draft',
    'post_content' => '',
], true);

/** Save a block tree as the marketing editor and return the rendered output. */
$save_and_render = static function (array $tree) use ($probe): string {
    wp_update_post(['ID' => $probe, 'post_content' => wp_slash(Blocks::serialize($tree))], true);

    return Migrator::render_blocks(parse_blocks((string) get_post_field('post_content', $probe)));
};

/** Parse output and report anything executable that survived. */
$dangerous = static function (string $html): array {
    if (trim($html) === '') {
        return [];
    }
    $root = Html::parse_fragment($html);
    if ($root === null) {
        return [];
    }
    $found = [];
    $stack = [$root];
    while ($stack !== []) {
        $node = array_pop($stack);
        foreach ($node->childNodes as $child) {
            if (Html::is_element($child)) {
                $stack[] = $child;
            }
        }
        if (!Html::is_element($node)) {
            continue;
        }
        $tag = strtolower($node->localName);
        if (in_array($tag, ['script', 'iframe', 'object', 'embed', 'base', 'link', 'meta'], true)) {
            $found[] = 'element:' . $tag;
        }
        foreach ($node->attributes as $attribute) {
            $name = strtolower($attribute->nodeName);
            $value = (string) $attribute->nodeValue;
            if (str_starts_with($name, 'on')) {
                $found[] = 'handler:' . $name;
            }
            if (in_array($name, ['href', 'src', 'action', 'formaction'], true)
                && preg_match('/^\s*(javascript|vbscript|data)\s*:/i', $value)) {
                $found[] = 'url:' . $name;
            }
        }
    }

    return array_unique($found);
};

$attacks = [
    'script in a template' => [['name' => 'gemreserve/content', 'inner' => [], 'attrs' => ['template' => '<p>hi</p><script>alert(1)</script>', 'slots' => []]]],
    'onerror in a template' => [['name' => 'gemreserve/content', 'inner' => [], 'attrs' => ['template' => '<img src="x" onerror="alert(1)">', 'slots' => []]]],
    'iframe in a template' => [['name' => 'gemreserve/content', 'inner' => [], 'attrs' => ['template' => '<iframe src="https://evil.example"></iframe>', 'slots' => []]]],
    'javascript: in a URL slot' => [['name' => 'gemreserve/content', 'inner' => [], 'attrs' => ['template' => '<a href="{{gr_c1}}">x</a>', 'slots' => [['key' => 'c1', 'kind' => 'url', 'label' => 'L', 'value' => 'javascript:alert(1)']]]]],
    'script in an icon slot' => [['name' => 'gemreserve/content', 'inner' => [], 'attrs' => ['template' => '<span>{{gr_c1}}</span>', 'slots' => [['key' => 'c1', 'kind' => 'icon', 'label' => 'Icon', 'value' => '<svg onload="alert(1)"><script>alert(2)</script></svg>']]]]],
    'handler on a section tag' => [['name' => 'gemreserve/section', 'inner' => [], 'attrs' => ['open' => '<section class="x" onclick="alert(1)">', 'close' => '</section>']]],
    'markup in a gap' => [['name' => 'gemreserve/gap', 'inner' => [], 'attrs' => ['text' => '<script>alert(1)</script>']]],
    'breakout from a text slot' => [['name' => 'gemreserve/content', 'inner' => [], 'attrs' => ['template' => '<p>{{gr_c1}}</p>', 'slots' => [['key' => 'c1', 'kind' => 'text', 'label' => 'P', 'value' => '</p><script>alert(1)</script>']]]]],
    'breakout from an attribute slot' => [['name' => 'gemreserve/content', 'inner' => [], 'attrs' => ['template' => '<img src="/a.webp" alt="{{gr_c1}}">', 'slots' => [['key' => 'c1', 'kind' => 'attr', 'label' => 'Alt', 'value' => '" onerror="alert(1)']]]]],
    'preserved block injection' => [['name' => 'gemreserve/preserved', 'inner' => [], 'attrs' => ['html' => '<script>alert(1)</script>']]],
];

foreach ($attacks as $label => $tree) {
    $found = $dangerous($save_and_render($tree));
    $t->ok("neutralised: {$label}", $found === [], implode(', ', $found));
}

/* Legitimate content must survive this same path untouched. */
$legit_source = '<a class="button" href="/about/">Read more</a><img src="/wp-content/themes/gemreserve/assets/x.webp" alt="A gem">';
$legit_engine = new SlotEngine();
$legit = $legit_engine->extract($legit_source, 'c');
$t->same(
    'a legitimate block survives a marketing-editor save',
    $legit_source,
    $save_and_render([['name' => 'gemreserve/content', 'inner' => [], 'attrs' => $legit->to_array()]])
);

wp_delete_post($probe, true);
wp_set_current_user($original_user);

/* ------------------------------------------------------------------ */
$t->group('REST — published content only');

$states = [
    'draft' => ['post_status' => 'draft'],
    'pending' => ['post_status' => 'pending'],
    'private' => ['post_status' => 'private'],
    'future' => ['post_status' => 'future', 'post_date' => gmdate('Y-m-d H:i:s', time() + 86400), 'post_date_gmt' => gmdate('Y-m-d H:i:s', time() + 86400)],
    'password-protected' => ['post_status' => 'publish', 'post_password' => 'secret'],
];
$hidden_ids = [];
foreach ($states as $label => $args) {
    $id = wp_insert_post(array_merge([
        'post_type' => 'page',
        'post_title' => "VCMS hidden {$label}",
        'post_name' => 'vcms-hidden-' . sanitize_title($label),
        'post_content' => wp_slash(Blocks::serialize([
            ['name' => 'gemreserve/content', 'inner' => [], 'attrs' => ['template' => '<p>SECRET</p>', 'slots' => []]],
        ])),
    ], $args), true);
    $hidden_ids[$label] = (int) $id;
}

foreach ($hidden_ids as $label => $id) {
    $request = new \WP_REST_Request('GET', '/gemreserve/v1/page');
    $request->set_param('id', $id);
    $response = rest_do_request($request);
    $body = (string) wp_json_encode($response->get_data());
    $t->same("{$label} is 404 by id", 404, $response->get_status());
    $t->ok("{$label} content does not leak", !str_contains($body, 'SECRET'));

    $by_route = new \WP_REST_Request('GET', '/gemreserve/v1/page');
    $by_route->set_param('route', '/vcms-hidden-' . sanitize_title($label) . '/');
    $t->same("{$label} is 404 by route", 404, rest_do_request($by_route)->get_status());
}

$index = rest_do_request(new \WP_REST_Request('GET', '/gemreserve/v1/pages'))->get_data();
$listed = array_filter(array_column($index['routes'], 'route'), static fn(string $r): bool => str_contains($r, 'vcms-hidden'));
$t->same('the route index omits non-public pages', [], array_values($listed));

/* Route parameter cannot be pointed at another host or traversed. */
foreach (['https://evil.example/about/', '//evil.example/about/', 'javascript://evil/about/', '/../../etc/passwd'] as $hostile) {
    $request = new \WP_REST_Request('GET', '/gemreserve/v1/page');
    $request->set_param('route', $hostile);
    $status = rest_do_request($request)->get_status();
    $t->ok("hostile route is refused: {$hostile}", $status === 404, (string) $status);
}

foreach ($hidden_ids as $id) {
    wp_delete_post($id, true);
}

/* ------------------------------------------------------------------ */
$t->group('Preview tokens');

/*
 * Block content is built with the real serialiser, never hand-written.
 *
 * A block comment written by hand carries a raw `<`, and wp_filter_post_kses
 * mangles the whole comment on save for any user without unfiltered_html — the
 * block is destroyed and renders nothing. An earlier version of this test did
 * exactly that and then asserted the draft content came back, which failed for
 * a reason that had nothing to do with previews.
 */
$draft_content = static fn(string $marker): string => wp_slash(Blocks::serialize([
    ['name' => 'gemreserve/content', 'inner' => [], 'attrs' => ['template' => "<p>{$marker}</p>", 'slots' => []]],
]));

$draft_a = wp_insert_post(['post_type' => 'page', 'post_title' => 'VCMS draft A', 'post_name' => 'vcms-draft-a', 'post_status' => 'draft', 'post_content' => $draft_content('DRAFTA')], true);
$draft_b = wp_insert_post(['post_type' => 'page', 'post_title' => 'VCMS draft B', 'post_name' => 'vcms-draft-b', 'post_status' => 'draft', 'post_content' => $draft_content('DRAFTB')], true);

$serve = static function (string $token): array {
    $request = new \WP_REST_Request('GET', '/gemreserve/v1/preview');
    $request->set_param('token', $token);
    $response = rest_do_request($request);

    return [$response->get_status(), (string) wp_json_encode($response->get_data())];
};

$issued = Preview::issue((int) $draft_a);
[$status, $body] = $serve($issued['token']);
$t->same('a valid token serves the draft', 200, $status);
$t->ok('the draft content is returned', str_contains($body, 'DRAFTA'));
$t->ok('the response is marked as a preview', str_contains($body, '"isPreview":true'));

[$status] = $serve($issued['token']);
$t->same('the token cannot be replayed', 403, $status);

$fresh = Preview::issue((int) $draft_a);
$parts = explode('.', $fresh['token']);
$claims = json_decode((string) base64_decode(strtr($parts[0], '-_', '+/') . '=='), true);

$repoint = $claims;
$repoint['id'] = $draft_b;
$forged = rtrim(strtr(base64_encode((string) wp_json_encode($repoint)), '+/', '-_'), '=') . '.' . $parts[1];
[$status] = $serve($forged);
$t->same('a token cannot be repointed at another page', 403, $status);

$expired = $claims;
$expired['exp'] = time() - 10;
$stale = rtrim(strtr(base64_encode((string) wp_json_encode($expired)), '+/', '-_'), '=') . '.' . $parts[1];
[$status] = $serve($stale);
$t->same('an expired token is refused', 403, $status);

foreach (['', 'garbage', 'a.b', str_repeat('x', 200)] as $bad) {
    [$status] = $serve($bad);
    $t->same('a malformed token is refused: ' . substr($bad, 0, 12), 403, $status);
}

$bound = Preview::issue((int) $draft_a);
sleep(1);
wp_update_post(['ID' => $draft_a, 'post_content' => $draft_content('EDITED')], true);
[$status] = $serve($bound['token']);
$t->same('a token is invalidated by a later edit', 409, $status);

wp_delete_post((int) $draft_a, true);
wp_delete_post((int) $draft_b, true);

/* ------------------------------------------------------------------ */
$t->group('Normaliser');

$published = get_posts(['post_type' => 'page', 'post_status' => 'publish', 'numberposts' => 1]);
if ($published !== []) {
    $normalised = Normaliser::page($published[0], false);
    $t->same('schema version is published', \GemReserve\VisualCms\SCHEMA_VERSION, $normalised['schemaVersion']);
    $t->ok('status is withheld from the public shape', !array_key_exists('status', $normalised));
    $t->ok('seo carries a canonical URL', ($normalised['seo']['canonical'] ?? '') !== '');
    $t->ok('blocks are present', is_array($normalised['blocks']));

    $with_draft = Normaliser::page($published[0], true);
    $t->ok('status is present on the authorised shape', array_key_exists('status', $with_draft));

    /* A hidden section must be absent, not flagged. */
    $hidden_tree = [
        ['name' => 'gemreserve/section', 'attrs' => ['open' => '<section class="a">', 'close' => '</section>', 'hidden' => true], 'inner' => [
            ['name' => 'gemreserve/content', 'attrs' => ['template' => '<p>HIDDENCOPY</p>', 'slots' => []], 'inner' => []],
        ]],
    ];
    $hidden_blocks = Normaliser::blocks(parse_blocks(Blocks::serialize($hidden_tree)));
    $t->same('a hidden section is omitted from the API', [], $hidden_blocks);
    $t->same('a hidden section renders nothing', '', Migrator::render_tree($hidden_tree));
}

/* ------------------------------------------------------------------ */
$t->group('Media');

$t->ok(
    'a mismatched srcset is dropped',
    !str_contains(
        Media::strip_mismatched_srcset('<img src="/new.webp" srcset="/old.webp 1x, /old.webp 2x" sizes="100vw">'),
        'srcset'
    )
);
$t->ok(
    'a consistent srcset is kept',
    str_contains(
        Media::strip_mismatched_srcset('<img src="/a.webp" srcset="/a.webp 1x, /b.webp 2x">'),
        'srcset'
    )
);
$t->ok(
    'an unresolved placeholder is left alone',
    str_contains(
        Media::strip_mismatched_srcset('<img src="{{gr_c1}}" srcset="/a.webp 1x">'),
        'srcset'
    )
);
foreach (['evil.svg', 'shell.php', 'page.html', 'x.phtml'] as $name) {
    $result = Media::reject_dangerous_uploads(['name' => $name, 'type' => 'application/octet-stream']);
    $t->ok("upload refused: {$name}", isset($result['error']));
}
$ok_upload = Media::reject_dangerous_uploads(['name' => 'photo.webp', 'type' => 'image/webp']);
$t->ok('a normal image upload is allowed', !isset($ok_upload['error']));
$t->same('theme asset import rejects traversal', 0, Media::import_theme_asset('../../../etc/passwd'));

/* ------------------------------------------------------------------ */
$t->group('Decomposer');

$decomposer = new Decomposer();
$body = '<section class="a container-wide" aria-labelledby="t"><div class="motion-reveal"><h2 id="t">Title</h2></div>'
    . '<ul class="cards"><li><h3>One</h3><p>First</p></li><li><h3>Two</h3><p>Second</p></li></ul></section>';
$tree = $decomposer->decompose_body($body);
$stats = $decomposer->stats();
$t->same('a page body round-trips through decompose', $body, Migrator::render_tree($tree));
$t->same('the repeatable list is detected', 1, $stats['repeatables']);
$t->same('nothing needed preserving', 0, $stats['preserved']);
$t->ok('slots were lifted', $stats['slots'] > 0);

exit($t->summary());
