import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { governedQuery, governedTransaction } from '@/lib/governedPostgres';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { KEY, digest, verifyIdentity, retryState } = require('../../../../../governance/kernel.cjs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { evaluate, validateSchema, gate } = require('../../../../../governance/domain.cjs');

const AUDIENCE = 'software-procurement';
const PROVIDERS = new Set([
  'contract-repository',
  'procurement-system',
  'usage-telemetry',
  'vendor-portal',
  'finance-system',
]);
const APPROVERS = new Set(['procurement_reviewer', 'legal_reviewer', 'finance_reviewer', 'procurement_admin']);

function context(request: NextRequest) {
  return verifyIdentity(
    request.headers,
    process.env.GOVERNANCE_GATEWAY_SECRET || '',
    AUDIENCE,
  );
}

export async function GET(request: NextRequest) {
  const ctx = context(request);
  if (!ctx) return NextResponse.json({ error: 'signed identity required' }, { status: 401 });
  const result = await governedQuery(
    `SELECT id,tool_id,tool_version,state,version,trace_id,metrics,failure_code,
      created_by,approved_by,updated_at FROM procurement_jobs
     WHERE tenant_id=$1 ORDER BY updated_at DESC LIMIT 100`,
    [ctx.tenant],
  );
  return NextResponse.json(result.rows);
}

export async function POST(request: NextRequest) {
  const ctx = context(request);
  if (!ctx) return NextResponse.json({ error: 'signed identity required' }, { status: 401 });
  const key = request.headers.get('Idempotency-Key') || '';
  if (!KEY.test(key)) return NextResponse.json({ error: 'valid Idempotency-Key required' }, { status: 400 });
  try {
    const body = await request.json();

    if (body.action === 'connector-sync') {
      if (!ctx.permissions.includes('source:sync') || !PROVIDERS.has(body.provider)
        || !KEY.test(String(body.sourceId || '')) || !KEY.test(String(body.sourceVersion || ''))) {
        return NextResponse.json({ error: 'source permission, provider, ID, and version required' }, { status: 403 });
      }
      const scope = Array.isArray(body.permissionScope) ? body.permissionScope.map(String) : [];
      if (!scope.length || !scope.every((subject: string) => ctx.subjects.includes(subject))) {
        return NextResponse.json({ error: 'permission-aware source scope required' }, { status: 403 });
      }
      if (!body.freshnessAt || Number.isNaN(Date.parse(body.freshnessAt))) {
        return NextResponse.json({ error: 'valid source freshness required' }, { status: 422 });
      }
      const payloadHash = digest({
        provider: body.provider,
        sourceId: body.sourceId,
        sourceVersion: body.sourceVersion,
        payload: body.payload,
        permissionScope: scope,
      });
      const result = await governedQuery(
        `INSERT INTO procurement_sources
          (tenant_id,id,provider,source_id,source_version,permission_scope,payload_hash,
           freshness_at,deleted_at_source,index_status)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT(tenant_id,provider,source_id) DO UPDATE SET
           source_version=EXCLUDED.source_version,permission_scope=EXCLUDED.permission_scope,
           payload_hash=EXCLUDED.payload_hash,freshness_at=EXCLUDED.freshness_at,
           deleted_at_source=EXCLUDED.deleted_at_source,
           index_status=CASE WHEN EXCLUDED.deleted_at_source IS NULL THEN 'pending' ELSE 'deletion_pending' END,
           index_receipt=NULL,index_failure_code=NULL,updated_at=NOW()
         RETURNING *`,
        [ctx.tenant, randomUUID(), body.provider, body.sourceId, body.sourceVersion, scope,
          payloadHash, body.freshnessAt, body.deletedAtSource || null,
          body.deletedAtSource ? 'deletion_pending' : 'pending'],
      );
      return NextResponse.json(result.rows[0]);
    }

    if (body.action === 'source-index-result') {
      if (!ctx.permissions.includes('source:index')
        || !['ready', 'failed', 'deleted'].includes(body.status)) {
        return NextResponse.json({ error: 'source:index permission and valid status required' }, { status: 403 });
      }
      if (body.status === 'ready' && (!KEY.test(String(body.receipt?.receiptRef || '')) || !body.receipt?.indexedAt)) {
        return NextResponse.json({ error: 'typed index receipt required' }, { status: 422 });
      }
      const result = await governedQuery(
        `UPDATE procurement_sources SET index_status=$1,index_receipt=$2,index_failure_code=$3,updated_at=NOW()
         WHERE tenant_id=$4 AND id=$5
           AND (($1='deleted' AND index_status='deletion_pending')
             OR ($1 IN('ready','failed') AND index_status IN('pending','failed')))
         RETURNING *`,
        [body.status, body.receipt || null, body.errorCode || null, ctx.tenant, body.id],
      );
      return result.rowCount
        ? NextResponse.json(result.rows[0])
        : NextResponse.json({ error: 'stale or missing source index result' }, { status: 409 });
    }

    if (body.action === 'create') {
      if (!ctx.permissions.includes('job:create')) {
        return NextResponse.json({ error: 'job:create required' }, { status: 403 });
      }
      const recent = await governedQuery<{ count: string }>(
        `SELECT COUNT(*)::text count FROM procurement_jobs
         WHERE tenant_id=$1 AND created_by=$2 AND created_at>NOW()-INTERVAL '1 minute'`,
        [ctx.tenant, ctx.actor],
      );
      if (Number(recent.rows[0]?.count || 0) >= 20) {
        return NextResponse.json({ error: 'job rate limit exceeded' }, { status: 429 });
      }
      const assessment = evaluate(body.job);
      if (assessment.errors.length) return NextResponse.json(assessment, { status: 422 });
      const requested = [...new Set((body.sourceIds || []).map(String))] as string[];
      const sources = requested.length
        ? await governedQuery<{
          id: string; permission_scope: string[]; freshness_at: string;
          deleted_at_source: string | null; index_status: string;
        }>(
          `SELECT id,permission_scope,freshness_at,deleted_at_source,index_status
           FROM procurement_sources WHERE tenant_id=$1 AND id=ANY($2::uuid[])`,
          [ctx.tenant, requested],
        )
        : { rows: [] };
      const staleBefore = Date.now() - 24 * 60 * 60 * 1000;
      const forbidden = sources.rows.length !== requested.length || sources.rows.some((source) =>
        source.deleted_at_source || source.index_status !== 'ready'
        || Date.parse(source.freshness_at) < staleBefore
        || !source.permission_scope.every((subject) => ctx.subjects.includes(subject)));
      if (forbidden) {
        return NextResponse.json({ error: 'fresh permission-aware indexed sources required' }, { status: 403 });
      }
      const requestHash = digest({ job: body.job, sourceIds: requested });
      const job = await governedTransaction(async (query) => {
        const inserted = await query<any>(
          `WITH created AS (
            INSERT INTO procurement_jobs
              (tenant_id,id,tool_id,tool_version,input,contract,request_hash,
               idempotency_key,trace_id,created_by)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            ON CONFLICT(tenant_id,idempotency_key) DO NOTHING RETURNING *
          ) SELECT created.*,FALSE replay FROM created
            UNION ALL SELECT prior.*,TRUE replay FROM procurement_jobs prior
            WHERE prior.tenant_id=$1 AND prior.idempotency_key=$8 AND prior.request_hash=$7
              AND NOT EXISTS(SELECT 1 FROM created) LIMIT 1`,
          [ctx.tenant, randomUUID(), body.job.toolId, body.job.toolVersion, body.job.input,
            body.job, requestHash, key, randomUUID(), ctx.actor],
        );
        const row = inserted.rows[0];
        if (row && !row.replay) {
          for (const sourceId of requested) {
            await query(
              `INSERT INTO procurement_job_sources(tenant_id,job_id,source_id) VALUES($1,$2,$3)`,
              [ctx.tenant, row.id, sourceId],
            );
          }
          await query(
            `INSERT INTO procurement_job_events
              (tenant_id,job_id,actor_id,event_type,input_digest,details)
             VALUES($1,$2,$3,'queued',$4,$5)`,
            [ctx.tenant, row.id, ctx.actor, digest(body.job.input),
              { sourceIds: requested, isolation: assessment.result.isolation }],
          );
        }
        return row;
      });
      return job
        ? NextResponse.json(job, { status: job.replay ? 200 : 201 })
        : NextResponse.json({ error: 'idempotency conflict' }, { status: 409 });
    }

    if (body.action === 'claim') {
      if (!ctx.permissions.includes('job:execute')) {
        return NextResponse.json({ error: 'job:execute required' }, { status: 403 });
      }
      const leaseToken = randomUUID();
      const result = await governedQuery<any>(
        `WITH picked AS (
          SELECT id FROM procurement_jobs WHERE tenant_id=$1
            AND ((state IN('queued','failed') AND next_attempt_at<=NOW())
              OR (state='running' AND lease_expires_at<NOW()))
            AND attempts<5 ORDER BY next_attempt_at,id FOR UPDATE SKIP LOCKED LIMIT 1
        ) UPDATE procurement_jobs job SET state='running',lease_token=$2,
          lease_expires_at=NOW()+INTERVAL '2 minutes',updated_at=NOW()
          FROM picked WHERE job.tenant_id=$1 AND job.id=picked.id RETURNING job.*`,
        [ctx.tenant, leaseToken],
      );
      return result.rowCount ? NextResponse.json(result.rows[0]) : new NextResponse(null, { status: 204 });
    }

    if (body.action === 'result') {
      if (!ctx.permissions.includes('job:execute')) {
        return NextResponse.json({ error: 'job:execute required' }, { status: 403 });
      }
      const job = await governedTransaction(async (query) => {
        const claimed = await query<any>(
          `SELECT * FROM procurement_jobs WHERE tenant_id=$1 AND id=$2
           AND state='running' AND lease_token=$3 AND lease_expires_at>=NOW() FOR UPDATE`,
          [ctx.tenant, body.id, body.leaseToken],
        );
        const current = claimed.rows[0];
        if (!current) return null;
        const schemaErrors = body.status === 'succeeded'
          ? validateSchema(current.contract.outputSchema, body.output, 'output') : [];
        const gates = current.contract.budget ? {
          qualityThreshold: current.contract.qualityThreshold,
          safetyThreshold: current.contract.safetyThreshold,
          costUsd: current.contract.budget.maxCostUsd,
          latencyMs: current.contract.budget.maxLatencyMs,
        } : {};
        const gateResult = body.status === 'succeeded'
          ? gate(body.metrics, gates) : { passed: false, failures: ['execution'] };
        const passed = body.status === 'succeeded' && !schemaErrors.length && gateResult.passed;
        const state = passed ? 'approval_pending' : retryState(current.attempts + 1, body.retryable !== false);
        const updated = await query<any>(
          `UPDATE procurement_jobs SET state=$1,version=version+1,attempts=attempts+1,
           result=$2,metrics=$3,failure_code=$4,lease_token=NULL,lease_expires_at=NULL,
           next_attempt_at=NOW()+INTERVAL '1 minute',updated_at=NOW()
           WHERE tenant_id=$5 AND id=$6 RETURNING *`,
          [state, passed ? body.output : null, body.metrics || null,
            passed ? null : String(body.errorCode || schemaErrors[0] || gateResult.failures[0] || 'EXECUTION_FAILED').slice(0, 64),
            ctx.tenant, body.id],
        );
        await query(
          `INSERT INTO procurement_job_events
            (tenant_id,job_id,actor_id,event_type,output_digest,details)
           VALUES($1,$2,$3,$4,$5,$6)`,
          [ctx.tenant, body.id, ctx.actor, state, passed ? digest(body.output) : null,
            { schemaErrors, gateFailures: gateResult.failures || [] }],
        );
        return updated.rows[0];
      });
      return job
        ? NextResponse.json(job)
        : NextResponse.json({ error: 'missing or expired claim' }, { status: 409 });
    }

    if (body.action === 'approval') {
      if (!APPROVERS.has(ctx.role) || !ctx.permissions.includes('job:approve')
        || !['approved', 'rejected'].includes(body.decision) || !String(body.reason || '').trim()) {
        return NextResponse.json({ error: 'independent approval required' }, { status: 403 });
      }
      const job = await governedTransaction(async (query) => {
        const updated = await query<any>(
          `UPDATE procurement_jobs SET state=$1,version=version+1,approved_by=$2,updated_at=NOW()
           WHERE tenant_id=$3 AND id=$4 AND state='approval_pending'
             AND version=$5 AND created_by<>$2 RETURNING *`,
          [body.decision, ctx.actor, ctx.tenant, body.id, Number(body.version)],
        );
        if (updated.rowCount) {
          await query(
            `INSERT INTO procurement_job_events(tenant_id,job_id,actor_id,event_type,details)
             VALUES($1,$2,$3,$4,$5)`,
            [ctx.tenant, body.id, ctx.actor, body.decision, { reason: String(body.reason).slice(0, 1000) }],
          );
        }
        return updated.rows[0];
      });
      return job
        ? NextResponse.json(job)
        : NextResponse.json({ error: 'stale, missing, or self approval' }, { status: 409 });
    }

    return NextResponse.json({ error: 'unsupported action' }, { status: 422 });
  } catch (error) {
    console.error('governed procurement job failed', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json({ error: 'governed procurement operation failed' }, { status: 500 });
  }
}
