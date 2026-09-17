#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.production"

cd "$ROOT_DIR"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing .env.production — copy .env.production.example and fill in values:"
  echo "  cp .env.production.example .env.production"
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

if [[ -z "${JWT_SECRET:-}" || "${JWT_SECRET}" == *"replace-with"* ]]; then
  echo "Set a strong JWT_SECRET in .env.production before deploying."
  exit 1
fi

if [[ -z "${CLIENT_URL:-}" || "${CLIENT_URL}" == *"yourdomain"* ]]; then
  echo "Set CLIENT_URL in .env.production to your public app URL."
  exit 1
fi

echo "Deploying TaskForge..."
docker compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up --build -d

echo ""
echo "Deployed. App should be available at: ${CLIENT_URL}"
