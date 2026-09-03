#!/usr/bin/env bash
#
# Capture the SEO surface of every route, so a deployment can prove it changed
# nothing.
#
# The route-level byte comparison already proves the whole document is
# unchanged, and is the stronger check. This exists for a different reason: when
# a byte comparison *does* show a difference, someone has to answer "was it the
# SEO?" quickly and without reading a 130 KB diff. This extracts exactly the
# fields a stakeholder cares about into one line per route.
#
# It is also the check that survives an environment where the page legitimately
# differs — a nonce, a timestamp, a cache-buster — and the question is narrowed
# to whether the *metadata* moved.
#
# Usage:
#   seo-snapshot.sh <base-url> <routes-file> <out-file>

set -euo pipefail

BASE="${1:?base url}"
ROUTES="${2:?routes file}"
OUT="${3:?output file}"

extract() {
	local html="$1" pattern="$2"
	printf '%s' "$html" | grep -oP "$pattern" | head -1 | sed 's/[[:space:]]\+/ /g' || true
}

: > "$OUT"
while read -r route; do
	[ -z "$route" ] && continue
	html="$(curl -sS "$BASE$route" --max-time 30 || true)"
	code="$(curl -sS -o /dev/null -w '%{http_code}' "$BASE$route" --max-time 30 || echo 000)"

	title="$(extract "$html" '(?<=<title>)[^<]*')"
	desc="$(extract "$html" '(?<=<meta name="description" content=")[^"]*')"
	canon="$(extract "$html" '(?<=<link rel="canonical" href=")[^"]*')"
	ogt="$(extract "$html" '(?<=<meta property="og:title" content=")[^"]*')"
	ogd="$(extract "$html" '(?<=<meta property="og:description" content=")[^"]*')"
	ogu="$(extract "$html" '(?<=<meta property="og:url" content=")[^"]*')"
	robots="$(extract "$html" '(?<=<meta name=.robots. content=.)[^"'"'"']*')"
	tw="$(extract "$html" '(?<=<meta name="twitter:card" content=")[^"]*')"
	# Counts catch duplicate tags — the classic symptom of two SEO plugins both
	# claiming a field.
	ntitle="$(printf '%s' "$html" | grep -c '<title>' || true)"
	ncanon="$(printf '%s' "$html" | grep -c 'rel="canonical"' || true)"
	ndesc="$(printf '%s' "$html" | grep -c 'name="description"' || true)"
	nh1="$(printf '%s' "$html" | grep -oc '<h1' || true)"
	nimg="$(printf '%s' "$html" | grep -oc '<img' || true)"
	nsec="$(printf '%s' "$html" | grep -oc '<section' || true)"
	bytes="${#html}"

	printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
		"$route" "$code" "$bytes" "$ntitle" "$ncanon" "$ndesc" "$nh1" "$nimg" "$nsec" \
		"$title" "$desc" "$canon" "$ogt" "$ogd" "$ogu" "$robots$tw" >> "$OUT"
done < "$ROUTES"

echo "captured $(wc -l < "$OUT") routes into $OUT"
