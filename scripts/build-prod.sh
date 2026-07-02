#!/bin/sh
# Build FE production without Docker (when Docker Hub is unreachable).
set -e
cd "$(dirname "$0")"

echo "Building with .env.production..."
npm ci --legacy-peer-deps 2>/dev/null || npm install --legacy-peer-deps
npm run build-only

echo ""
echo "Done. Deploy folder: dist/"
echo "Copy dist/ to nginx root, e.g.:"
echo "  rsync -avz dist/ user@server:/var/www/qldn/"
