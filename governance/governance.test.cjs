'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { digest, sign, verifyIdentity, retryState } = require('./kernel.cjs');
const { validateSchema, evaluate, gate } = require('./domain.cjs');

const root = path.resolve(__dirname, '..');
const base = {
  toolId: 'contract:extract',
  toolVersion: 'v2',
  inputSchema: { type: 'object', required: ['query'], properties: { query: { type: 'string' } } },
  input: { query: 'termination and renewal terms' },
  outputSchema: { type: 'object' },
  retrievalSources: [{
    sourceRef: 'contract:0001', chunkRef: 'chunk:0001', sha256: 'a'.repeat(64), freshnessAt: '2030-01-01',
  }],
  budget: { maxCostUsd: 1, maxLatencyMs: 5000 },
  timeoutMs: 30000,
  datasetVersion: 'procurement-dataset-v1',
  policyVersion: 'procurement-policy-v2',
  qualityThreshold: 0.8,
  safetyThreshold: 1,
  requiredTerms: ['renewal', 'termination', 'data-processing'],
};

test('digest is stable and payload bound', () => {
  assert.equal(digest({ b: 2, a: 1 }), digest({ a: 1, b: 2 }));
  assert.notEqual(digest({ a: 1 }), digest({ a: 2 }));
});
test('gateway assertion scopes audience, tenant, permissions, and subjects', () => {
  const secret = 'x'.repeat(32);
  const encoded = Buffer.from(JSON.stringify({
    sub: 'user:1', tenantId: 'tenant:1', role: 'procurement_reviewer',
    permissions: ['job:create'], subjects: ['contract:1'], aud: 'software-procurement', iat: 1, exp: 200,
  })).toString('base64url');
  const headers = new Headers({
    'x-governance-identity': encoded,
    'x-governance-signature': sign(encoded, secret),
  });
  assert.deepEqual(verifyIdentity(headers, secret, 'software-procurement', 100).subjects, ['contract:1']);
  assert.equal(verifyIdentity(headers, secret, 'other-audience', 100), null);
});
test('typed input schemas reject missing and wrong values', () => {
  assert.ok(validateSchema(base.inputSchema, {}).length);
  assert.ok(validateSchema(base.inputSchema, { query: 1 }).length);
});
test('valid procurement job is deterministic, grounded, and isolated', () => {
  const result = evaluate(base);
  assert.deepEqual(result, evaluate(base));
  assert.equal(result.result.isolation.network, 'deny_by_default');
  assert.equal(result.result.humanApprovalRequired, true);
});
test('only allow-listed procurement tools are accepted', () => {
  assert.match(evaluate({ ...base, toolId: 'generic:prompt' }).errors.join(','), /allow-listed/);
});
test('retrieval requires freshness, hashes, chunks, and source references', () => {
  assert.match(evaluate({ ...base, retrievalSources: [{}] }).errors.join(','), /provenance/);
});
test('timeouts, budgets, dataset, policy, and required terms fail closed', () => {
  const result = evaluate({
    ...base, timeoutMs: 999999, budget: { maxCostUsd: 100, maxLatencyMs: 1 },
    datasetVersion: '', policyVersion: '', requiredTerms: [],
  });
  assert.ok(result.errors.length >= 6);
});
test('quality, safety, citation, and required-term gates fail closed', () => {
  assert.deepEqual(gate(
    { quality: 0.5, safety: 0.8, costUsd: 0.2, latencyMs: 100, citationsComplete: false, requiredTermsCovered: false },
    { qualityThreshold: 0.8, safetyThreshold: 1, costUsd: 1, latencyMs: 500 },
  ).failures, ['quality', 'safety', 'citations', 'required_terms']);
});
test('cost and latency gates fail closed', () => {
  assert.deepEqual(gate(
    { quality: 1, safety: 1, costUsd: 2, latencyMs: 600, citationsComplete: true, requiredTermsCovered: true },
    { qualityThreshold: 0.8, safetyThreshold: 1, costUsd: 1, latencyMs: 500 },
  ).failures, ['cost', 'latency']);
});
test('retry policy dead-letters bounded and permanent failures', () => {
  assert.equal(retryState(4), 'failed');
  assert.equal(retryState(5), 'dead_letter');
  assert.equal(retryState(1, false), 'dead_letter');
});
test('migration covers source scope, deletion, tracing, leases, datasets, and immutable audit', () => {
  const migration = fs.readFileSync(path.join(root, 'migrations/001_governed_procurement_jobs.sql'), 'utf8');
  assert.match(migration, /permission_scope/);
  assert.match(migration, /deleted_at_source/);
  assert.match(migration, /lease_expires_at/);
  assert.match(migration, /trace_id/);
  assert.match(migration, /evaluation_cases/);
  assert.match(migration, /events_append_only/);
});
test('API, CI, launcher, and runbook expose governed controls', () => {
  const api = fs.readFileSync(path.join(root, 'frontend/src/app/api/governed-procurement-jobs/route.ts'), 'utf8');
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/governed-procurement.yml'), 'utf8');
  const launcher = fs.readFileSync(path.join(root, 'start.sh'), 'utf8');
  const auth = fs.readFileSync(path.join(root, 'frontend/src/lib/auth.ts'), 'utf8');
  assert.match(api, /Idempotency-Key/);
  assert.match(api, /SKIP LOCKED/);
  assert.match(api, /subjects.includes/);
  assert.match(api, /approval/);
  assert.match(workflow, /npm run build/);
  assert.match(auth, /createHmac/);
  assert.doesNotMatch(auth, /admin123|manager123|analyst123/);
  assert.doesNotMatch(launcher, /kill|npm install|seed|db push/);
  assert.match(launcher, /ALLOW_SCHEMA_MIGRATION/);
  assert.match(fs.readFileSync(path.join(root, 'RUNBOOK.md'), 'utf8'), /Rollback/);
});
