#!/usr/bin/env bash
set -euo pipefail

# Helper to trigger a Render deploy via API. Requires RENDER_SERVICE_ID and RENDER_API_KEY
if [ -z "${RENDER_SERVICE_ID:-}" ] || [ -z "${RENDER_API_KEY:-}" ]; then
  echo "To use this helper, export RENDER_SERVICE_ID and RENDER_API_KEY, or push to GitHub to trigger a build."
  echo "Example: export RENDER_SERVICE_ID=svc-xxxxx; export RENDER_API_KEY=rz_..."
  exit 1
fi

echo "Triggering deploy for Render service $RENDER_SERVICE_ID"
curl -s -X POST "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -d '{}' | jq '.'
