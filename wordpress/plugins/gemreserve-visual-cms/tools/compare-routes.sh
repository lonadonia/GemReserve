#!/usr/bin/env bash
#
# Route-by-route byte comparison across a change.
#
# The migration's central claim is that the public HTML does not change. This is
# how that claim is checked: capture every route before, capture every route
# after, compare the bytes.
#
# Two classes of value legitimately differ between any two captures and are
# normalised before comparison. Both are named here rather than quietly
# stripped, because a comparison tool that hides differences is worse than no
# comparison tool:
#
#   gr_nonce   WordPress CSRF nonce. Rotates on the nonce tick, and is
#              user- and action-bound. A page whose nonce did not change
#              between captures taken hours apart would be the bug.
#   gr_t       The form's issue timestamp, used for the submission time window.
#   ?ver=      The asset cache-buster, which the theme derives from filemtime().
#              Deploying files necessarily rewrites their mtime, so this changes
#              on every deploy whether or not the asset did. Normalising it is
#              only honest if the asset *content* is checked separately — and it
#              is: the deployment procedure compares the SHA-256 of every theme
#              asset before and after, and a changed asset is a finding, not a
#              normalisation.
#
# Nothing else is normalised. Whitespace, attribute order, srcset contents and
# generated element ids are all compared exactly.
#
# Usage:
#   compare-routes.sh capture <base-url> <routes-file> <out-dir>
#   compare-routes.sh compare <before-dir> <after-dir> <routes-file>

set -euo pipefail

normalise() {
	sed -E \
		-e 's/(name="gr_nonce"[^>]*value=")[^"]*"/\1NORMALISED"/g' \
		-e 's/(id="gr_nonce"[^>]*value=")[^"]*"/\1NORMALISED"/g' \
		-e 's/(name="gr_t"[^>]*value=")[^"]*"/\1NORMALISED"/g' \
		-e 's/\?ver=[0-9]+/?ver=NORMALISED/g' \
		"$1"
}

route_to_name() {
	local n
	n="${1#/}"
	n="${n%/}"
	printf '%s' "${n:-__home}"
}

cmd_capture() {
	local base="$1" routes="$2" out="$3"
	mkdir -p "$out"
	local fails=0 count=0
	while read -r route; do
		[ -z "$route" ] && continue
		local name code
		name="$(route_to_name "$route")"
		code="$(curl -sS -o "$out/$name.html" -w '%{http_code}' "$base$route" --max-time 30 || echo 000)"
		count=$((count + 1))
		if [ "$code" != "200" ]; then
			printf 'HTTP %s  %s\n' "$code" "$route" >&2
			fails=$((fails + 1))
		fi
	done <"$routes"
	printf 'captured %d routes into %s (%d non-200)\n' "$count" "$out" "$fails"
	[ "$fails" -eq 0 ]
}

cmd_compare() {
	local before="$1" after="$2" routes="$3"
	local same=0 differ=0 missing=0
	local report=""
	while read -r route; do
		[ -z "$route" ] && continue
		local name
		name="$(route_to_name "$route")"
		if [ ! -f "$before/$name.html" ] || [ ! -f "$after/$name.html" ]; then
			missing=$((missing + 1))
			report="$report\n  MISSING  $route"
			continue
		fi
		if diff -q <(normalise "$before/$name.html") <(normalise "$after/$name.html") >/dev/null; then
			same=$((same + 1))
		else
			differ=$((differ + 1))
			local a b
			a="$(wc -c <"$before/$name.html")"
			b="$(wc -c <"$after/$name.html")"
			report="$report\n  DIFFERS  $route  ($a -> $b bytes)"
		fi
	done <"$routes"

	printf 'identical: %d   differ: %d   missing: %d\n' "$same" "$differ" "$missing"
	if [ -n "$report" ]; then
		printf '%b\n' "$report"
	fi
	[ "$differ" -eq 0 ] && [ "$missing" -eq 0 ]
}

case "${1:-}" in
	capture) shift; cmd_capture "$@" ;;
	compare) shift; cmd_compare "$@" ;;
	*)
		echo "usage: $0 capture <base-url> <routes-file> <out-dir>" >&2
		echo "       $0 compare <before-dir> <after-dir> <routes-file>" >&2
		exit 2
		;;
esac
