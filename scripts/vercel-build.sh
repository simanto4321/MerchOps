#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm run db:generate -w @merchops/backend
cd frontend
npx prisma generate --schema=../backend/prisma/schema.prisma
npx next build
rm -rf ../.next
cp -a .next ../.next
