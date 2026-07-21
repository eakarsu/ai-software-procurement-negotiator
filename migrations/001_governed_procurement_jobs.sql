BEGIN;

CREATE TABLE IF NOT EXISTS procurement_sources (
  tenant_id TEXT NOT NULL,
  id UUID NOT NULL,
  provider TEXT NOT NULL CHECK(provider IN('contract-repository','procurement-system','usage-telemetry','vendor-portal','finance-system')),
  source_id TEXT NOT NULL,
  source_version TEXT NOT NULL,
  permission_scope TEXT[] NOT NULL,
  payload_hash CHAR(64) NOT NULL,
  freshness_at TIMESTAMPTZ NOT NULL,
  deleted_at_source TIMESTAMPTZ,
  index_status TEXT NOT NULL DEFAULT 'pending' CHECK(index_status IN('pending','ready','failed','deletion_pending','deleted')),
  index_receipt JSONB,
  index_failure_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(tenant_id,id),
  UNIQUE(tenant_id,provider,source_id)
);

CREATE TABLE IF NOT EXISTS procurement_jobs (
  tenant_id TEXT NOT NULL,
  id UUID NOT NULL,
  tool_id TEXT NOT NULL CHECK(tool_id IN('contract:extract','vendor:compare','license:forecast','negotiation:scenario')),
  tool_version TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'queued' CHECK(state IN('queued','running','failed','dead_letter','approval_pending','approved','rejected')),
  version INTEGER NOT NULL DEFAULT 1 CHECK(version > 0),
  input JSONB NOT NULL,
  contract JSONB NOT NULL,
  request_hash CHAR(64) NOT NULL,
  idempotency_key TEXT NOT NULL,
  trace_id UUID NOT NULL,
  created_by TEXT NOT NULL,
  approved_by TEXT,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts >= 0),
  lease_token UUID,
  lease_expires_at TIMESTAMPTZ,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  result JSONB,
  metrics JSONB,
  failure_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(tenant_id,id),
  UNIQUE(tenant_id,idempotency_key)
);

CREATE TABLE IF NOT EXISTS procurement_job_sources (
  tenant_id TEXT NOT NULL,
  job_id UUID NOT NULL,
  source_id UUID NOT NULL,
  PRIMARY KEY(tenant_id,job_id,source_id),
  FOREIGN KEY(tenant_id,job_id) REFERENCES procurement_jobs(tenant_id,id) ON DELETE RESTRICT,
  FOREIGN KEY(tenant_id,source_id) REFERENCES procurement_sources(tenant_id,id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS procurement_job_events (
  seq BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  job_id UUID NOT NULL,
  actor_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  input_digest CHAR(64),
  output_digest CHAR(64),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY(tenant_id,job_id) REFERENCES procurement_jobs(tenant_id,id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS procurement_evaluation_cases (
  tenant_id TEXT NOT NULL,
  dataset_version TEXT NOT NULL,
  case_id TEXT NOT NULL,
  input JSONB NOT NULL,
  expected JSONB NOT NULL,
  policy_tags TEXT[] NOT NULL,
  PRIMARY KEY(tenant_id,dataset_version,case_id)
);

CREATE INDEX IF NOT EXISTS procurement_source_scope_idx ON procurement_sources USING GIN(permission_scope);
CREATE INDEX IF NOT EXISTS procurement_job_ready_idx ON procurement_jobs(state,next_attempt_at,lease_expires_at);

CREATE OR REPLACE FUNCTION procurement_events_append_only() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'procurement job events are append-only';
END
$$;
DROP TRIGGER IF EXISTS procurement_events_append_only_trigger ON procurement_job_events;
CREATE TRIGGER procurement_events_append_only_trigger
BEFORE UPDATE OR DELETE ON procurement_job_events
FOR EACH ROW EXECUTE FUNCTION procurement_events_append_only();

COMMIT;
