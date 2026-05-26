#!/usr/bin/env bash
set -euo pipefail

# Helper to trigger a Render deploy via API.
# Usage:
#   bash scripts/deploy-backend.sh srv-xxxxx rnd_xxxxx
#   or set env vars: RENDER_SERVICE_ID and RENDER_API_KEY

RENDER_SERVICE_ID="${1:-${RENDER_SERVICE_ID:-}}"
RENDER_API_KEY="${2:-${RENDER_API_KEY:-}}"

missing=()
[ -z "${RENDER_SERVICE_ID:-}" ] && missing+=("RENDER_SERVICE_ID (or arg1)")
[ -z "${RENDER_API_KEY:-}" ] && missing+=("RENDER_API_KEY (or arg2)")

if [ ${#missing[@]} -gt 0 ]; then
  echo "Missing required environment variable(s): ${missing[*]}"
  echo ""
  echo "Quickest way:" 
  echo "  bash scripts/deploy-backend.sh srv-xxxxx rnd_xxxxx"
  echo ""
  echo "Bash: export RENDER_SERVICE_ID=srv-xxxxx; export RENDER_API_KEY=rnd_xxxxx"
  echo "PowerShell: $env:RENDER_SERVICE_ID='srv-xxxxx'; $env:RENDER_API_KEY='rnd_xxxxx'"
  exit 1
fi

if [[ ! "$RENDER_SERVICE_ID" =~ ^srv- ]]; then
  echo "Warning: RENDER_SERVICE_ID usually starts with 'srv-' (current: $RENDER_SERVICE_ID)"
fi

echo "Triggering deploy for Render service $RENDER_SERVICE_ID"
response="$(curl -sS --fail-with-body -X POST "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -d '{"clearCache":true}')"

if command -v jq >/dev/null 2>&1; then
  echo "$response" | jq '.'
else
  echo "$response"
fi
