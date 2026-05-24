#!/usr/bin/env bash
set -euo pipefail

echo "Starting backend on Replit..."
cd backend
echo "Installing dependencies..."
npm ci

export PORT=${PORT:-5000}
echo "Using PORT=$PORT"

echo "Starting server.js"
node server.js
