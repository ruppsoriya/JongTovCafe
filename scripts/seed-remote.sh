#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "Usage: DATABASE_URL=\"postgres://...\" $0"
  exit 1
fi

cd backend
npm ci
echo "Seeding database using DATABASE_URL=${DATABASE_URL}",
DATABASE_URL="$DATABASE_URL" npm run seed
