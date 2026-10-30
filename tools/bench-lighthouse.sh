#!/usr/bin/env bash
# Vergleich Lighthouse-Performance alt (altes Pinning-Design) vs. neu (Redesign).
# Vorbedingung: chromium installiert; läuft aus dem Repo-Root.
# Nutzung:  tools/bench-lighthouse.sh
set -euo pipefail
cd "$(dirname "$0")/.."

OLD_REF="${1:-545e6ab}"   # Commit vor dem Redesign
export CHROME_PATH="${CHROME_PATH:-$(command -v chromium || command -v chromium-browser || true)}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"; kill $(jobs -p) 2>/dev/null || true' EXIT

mkdir -p "$TMP/old"
git archive "$OLD_REF" | tar -x -C "$TMP/old"

python3 -m http.server 8171 --bind 127.0.0.1 --directory "$TMP/old" >/dev/null 2>&1 &
python3 -m http.server 8172 --bind 127.0.0.1 --directory . >/dev/null 2>&1 &
sleep 1

run() { # name url
  # Node-Fetch (Lighthouse-CDP) würde 127.0.0.1 über den Egress-Proxy schicken und
  # scheitert dann; für den Lauf komplett ohne Proxy-Umgebung arbeiten.
  env -u HTTP_PROXY -u HTTPS_PROXY -u ALL_PROXY -u http_proxy -u https_proxy -u all_proxy \
    NODE_USE_ENV_PROXY=0 \
    npx --yes lighthouse "$2" --only-categories=performance \
    --output=json --output-path="$TMP/$1.json" --quiet \
    --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage --no-proxy-server --disable-gpu" 2>/dev/null
  python3 - "$TMP/$1.json" "$1" <<'EOF'
import json, sys
r = json.load(open(sys.argv[1]))
a = r["audits"]
def v(k): return a[k].get("numericValue")
print(f"{sys.argv[2]:>4}: Perf={r['categories']['performance']['score']*100:.0f} "
      f"FCP={v('first-contentful-paint')/1000:.2f}s LCP={v('largest-contentful-paint')/1000:.2f}s "
      f"TBT={v('total-blocking-time'):.0f}ms CLS={v('cumulative-layout-shift'):.3f} "
      f"SpeedIndex={v('speed-index')/1000:.2f}s")
EOF
}

run alt "http://localhost:8171/"
run neu "http://localhost:8172/"
