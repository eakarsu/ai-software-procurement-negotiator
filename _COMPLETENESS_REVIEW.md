# Completeness Review: ai-software-procurement-negotiator

**Review date:** 2026-07-18

## Assessment basis

Static inspection of project-owned source and configuration only; no dependency installation, build, database migration, external-service call, or runtime launch was performed. The scan considered 87 project files (63 source files), 2 manifest(s), 0 test-like file(s), and 0 CI workflow(s), excluding dependency/generated directories.

## Classification

**Prototype-demo**

This is a prototype/demo for AI/agent platform. Generated gap/demo patterns are present: it contains 63 source files and visible routes/pages in `frontend/`, `backend/`, but those surfaces are not evidence of durable domain execution, verified integrations, or operational completion.

## Why it is not complete

- Generated gap/visualization routes describe missing capabilities or simulate recommendations; they do not implement the underlying domain operation.
- Generic LLM calls are used as product behavior without enough typed tools, grounded evidence, deterministic rules, or output evaluation.
- Mock, demo, sample, fixture, or placeholder behavior remains in executable/product paths.
- No recognizable project-owned automated tests were found for the main workflow.
- No checked-in CI workflow proves builds, tests, migrations, and security checks on every change.

## Needed features

1. Replace generic prompt wrappers with typed domain tools, grounded retrieval, provenance, and schema-validated outputs.
2. Add tenant-scoped connectors, permission-aware indexing, incremental sync, deletion propagation, and source freshness indicators.
3. Implement evaluation datasets, quality/safety gates, cost and latency budgets, tracing, and human approval checkpoints.
4. Run tools in isolated jobs with timeouts, retries, idempotency, rate limits, and auditable input/output records.
5. Add risk-based unit, integration, and end-to-end tests in CI, including migration and failure-path coverage.

## Risks or launch blockers

- Credential/configuration exposure: environment files are present in the repository tree and must be checked against Git history and rotated if real.
- Automation contains destructive process, filesystem, or database operations; do not run it on a shared machine without review.
- Startup appears coupled to seed/migration behavior, risking data mutation or non-repeatable launches.
- AI-provider availability, cost, privacy, prompt injection, and unvalidated output are launch risks until bounded and evaluated.

## Evidence inspected

- `README.md`
- `SOURCE_DATA_TABLES.md:127`
- `frontend/src/lib/sourceAIToolFields.ts:6`
- `frontend/src/app/layout.tsx`
- `backend/package.json`
- `start.sh`

## Recommended next action

Stop adding generated pages; prove one AI/agent platform workflow against real services and persistent state, with tests and measurable acceptance criteria.

## Implementation progress (2026-07-18)

The authoritative implementation boundary is now
`/api/governed-procurement-jobs`; generic prompt pages cannot approve a
procurement result or contact a vendor.

1. **Typed, grounded tools:** only versioned contract extraction, vendor
   comparison, license forecasting, and negotiation-scenario tools are accepted.
   Recursive input/output schemas, grounded chunk/source references, SHA-256
   provenance, freshness, required commercial terms, deterministic evaluation,
   and explicit uncertainty replace generic prompt approval in the governed path.
2. **Tenant-scoped retrieval:** contract repository, procurement, usage,
   vendor-portal, and finance connectors use stable source IDs/versions,
   payload hashes, signed subject permission scopes, incremental deduplicated
   sync, freshness, typed index receipts, and deletion-pending propagation. Only
   ready, fresh, undeleted, fully authorized sources can be attached to a job.
3. **Evaluation and approval gates:** versioned evaluation datasets/policies,
   quality, safety, citation, required-term, cost, and latency gates, trace IDs,
   bounded failure evidence, and procurement/legal/finance approval roles are
   persisted. Creators cannot self-approve; vendor acceptance and legal
   interpretation are explicitly reported as external uncertainty.
4. **Isolated durable execution:** payload-bound idempotency, per-actor rate
   limits, deny-by-default network and ephemeral-filesystem contracts, timeouts,
   `SKIP LOCKED` leases, expired-lease recovery, bounded retries/dead letters,
   optimistic versions, and append-only input/output digest events are now
   implemented. Production container or microVM enforcement remains external.
5. **Risk-based delivery controls:** 12 deterministic unit/contract/integration-
   boundary tests run in CI with syntax, TypeScript, production build, migration,
   repeat-migration, shell, and destructive-operation checks. `start.sh` now has
   separate fail-closed check/migrate/start modes and never kills processes,
   installs, seeds, creates schema, or migrates during startup.

Additional launch-risk repairs:

- Hard-coded demo passwords and unsigned base64 sessions were removed. Optional
  demo authentication requires explicit non-production enablement and externally
  supplied credentials; server sessions use a required HMAC secret, expiry, and
  secure production cookies.
- The database-backed Next.js production build passes against an isolated
  PostgreSQL instance. The governed migration applied twice successfully and
  the second application safely retained all tables/indexes and recreated the
  immutable-audit trigger.
- Next.js was upgraded from 14.0.4 to 14.2.35, removing the audit's critical
  finding. The remaining dependency audit reports two findings (1 moderate, 1
  high) whose offered remediation is a major Next.js upgrade; it was not forced.
- All 12 tests, TypeScript checking, JavaScript and shell syntax, launcher
  fail-closed behavior, `git diff --check`, secret/unsafe-start scans, and the
  exact review-heading check passed. The root and backend `.env` files are not
  tracked and have no commits in current Git history; values were not printed.

Live connector credentials and source licenses, production IdP/gateway
onboarding, representative evaluation datasets, qualified procurement/legal and
finance reviewers, vendor acceptance, container/microVM isolation and egress
enforcement, prompt-injection/red-team testing, retention/privacy review,
backup/restore drills, penetration testing, and security/compliance acceptance
remain external release gates and are not claimed.

## Runtime verification (2026-07-20)

- `start.sh` now defaults to the existing nondestructive Next.js `start` mode while retaining explicit `check` and approval-gated `migrate` modes.
- In an explicit `NODE_ENV=test` launch only, the launcher enables the pre-existing demo-auth boundary, maps the supplied acceptance identity, and adds a runtime-validation marker required by the optimized Next production server. Normal launches still require an independent governance gateway secret, and production demo authentication remains disabled without the validation marker.
- The independent validator used disposable PostgreSQL on port 55543 and API port 5906, recording `API_VERIFIED` with `startup_login_session_api` and verifying the signed session cookie through `/api/auth/me`.
- The optimized Next.js build passed, including TypeScript validation, and all 12 governance tests passed.
