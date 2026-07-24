#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "$project_dir/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$project_dir/.env"
  set +a
fi
export API_PORT="${API_PORT:-${BACKEND_PORT:-}}"
export UI_PORT="${UI_PORT:-${FRONTEND_PORT:-}}"

fail() { printf 'error: %s\n' "$*" >&2; exit 1; }
check_config() {
  [[ "${DATABASE_URL:-}" == postgres://* || "${DATABASE_URL:-}" == postgresql://* ]] || fail 'DATABASE_URL must be PostgreSQL'
  [[ ${#SESSION_SECRET} -ge 32 ]] || fail 'SESSION_SECRET must contain at least 32 characters'
  [[ -n "${OPENROUTER_API_KEY:-}" && -n "${OPENROUTER_MODEL:-}" && -n "${OPENROUTER_BASE_URL:-}" ]] || fail 'OpenRouter configuration is required'
  [[ -n "${API_PORT:-}" && -n "${UI_PORT:-}" && "$API_PORT" != "$UI_PORT" ]] || fail 'distinct API_PORT and UI_PORT are required'
}
migrate() {
  [[ "${ALLOW_SCHEMA_MIGRATION:-}" == 1 || "${ALLOW_SCHEMA_MIGRATION:-}" == true ]] || fail 'set ALLOW_SCHEMA_MIGRATION=true for the approved migration step'
  for migration in "$project_dir"/migrations/*.sql; do
    psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$migration"
  done
}
start_services() {
  migrate
  node "$project_dir/frontend/scripts/create-admin.mjs"
  npm --prefix "$project_dir/frontend" run start -- -H 127.0.0.1 -p "$API_PORT" &
  app_pid=$!
  API_PORT="$API_PORT" UI_PORT="$UI_PORT" node "$project_dir/frontend/scripts/runtime-proxy.mjs" &
  proxy_pid=$!
  wait "$app_pid" "$proxy_pid"
}

case "${1:-start}" in
  check) npm --prefix "$project_dir/frontend" run typecheck && node --test "$project_dir"/governance/*.test.cjs && NODE_ENV=production npm --prefix "$project_dir/frontend" run build ;;
  migrate) check_config; migrate ;;
  start) check_config; start_services ;;
  *) fail 'usage: ./start.sh [check|migrate|start]' ;;
esac
