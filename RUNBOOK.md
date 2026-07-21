# Governed software procurement jobs

`/api/governed-procurement-jobs` is the authoritative boundary for procurement
analysis. Only versioned contract extraction, vendor comparison, license
forecasting, and negotiation-scenario tools are accepted. Inputs and outputs use
typed schemas; every result requires grounded source chunks, hashes, freshness,
dataset/policy versions, cost/latency/safety/quality gates, required commercial
terms, traces, and independent approval. Generic prompt pages cannot approve a
recommendation or contact a vendor.

Configure `.env.example` through an approved secret manager, install frontend
dependencies explicitly, run `./start.sh check`, create a database backup, and
use `ALLOW_SCHEMA_MIGRATION=1 ./start.sh migrate` as a separate approved step.
Build before `./start.sh start`. Startup never installs, seeds, creates schema,
modifies credentials, or kills processes.

Connectors use stable IDs/versions, tenant permission scopes, incremental
upserts, hashes, freshness, index receipts, and deletion-pending propagation. A
source must be ready, fresh, undeleted, and inside every signed subject scope.
Jobs are payload-idempotent, per-actor rate limited, leased with `SKIP LOCKED`,
timeout bounded, deny network by default, retry/dead-letter controlled, and
record input/output digests rather than credentials or hidden chain-of-thought.

## Rollback and incidents

Deploy the previous application artifact while retaining additive tables.
Disable affected connectors/runners, preserve active leases and audit events,
reconcile dead letters against source/provider records, rotate compromised
credentials, and submit new idempotent work rather than rewriting history.

Production container or microVM isolation, egress enforcement, live procurement
and contract connectors, licensed datasets, vendor acceptance, legal/privacy and
finance review, representative evaluation datasets, reviewer staffing,
penetration testing, backup/restore drills, and security/compliance certification
remain external release gates. Repository tests do not certify them.
