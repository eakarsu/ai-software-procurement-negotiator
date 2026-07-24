BEGIN;
CREATE TABLE IF NOT EXISTS procurement_app_users (
  tenant_id TEXT NOT NULL,
  email TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN('admin','manager','analyst')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN('active','disabled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS procurement_runtime_ai_results (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  actor_email TEXT NOT NULL REFERENCES procurement_app_users(email) ON DELETE RESTRICT,
  tool_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  provider TEXT NOT NULL CHECK(provider='openrouter'),
  model TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS procurement_runtime_ai_lookup_idx ON procurement_runtime_ai_results(tenant_id,actor_email,created_at DESC);
COMMIT;
