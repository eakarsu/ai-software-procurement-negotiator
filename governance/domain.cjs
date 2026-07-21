'use strict';

const TYPES = new Set(['string', 'number', 'boolean', 'array', 'object']);
const TOOLS = new Set(['contract:extract', 'vendor:compare', 'license:forecast', 'negotiation:scenario']);

function validateSchema(schema, value, path = 'input') {
  const errors = [];
  if (!schema || !TYPES.has(schema.type)) return [`${path} schema type unsupported`];
  const actual = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
  if (actual !== schema.type) errors.push(`${path} expected ${schema.type}`);
  if (schema.type === 'object' && actual === 'object') {
    for (const key of schema.required || []) if (!(key in value)) errors.push(`${path}.${key} required`);
    for (const [key, nested] of Object.entries(schema.properties || {})) {
      if (key in value) errors.push(...validateSchema(nested, value[key], `${path}.${key}`));
    }
  }
  if (schema.type === 'array' && actual === 'array' && schema.items) {
    value.forEach((item, index) => errors.push(...validateSchema(schema.items, item, `${path}[${index}]`)));
  }
  return errors;
}

function evaluate(input = {}) {
  const errors = [];
  if (!TOOLS.has(input.toolId) || !String(input.toolVersion || '').trim()) {
    errors.push('allow-listed typed and versioned procurement tool required');
  }
  errors.push(...validateSchema(input.inputSchema || {}, input.input, 'input'));
  if (!input.outputSchema || !TYPES.has(input.outputSchema.type)) errors.push('output schema required');
  const sources = Array.isArray(input.retrievalSources) ? input.retrievalSources : [];
  if (!sources.length) errors.push('grounded retrieval sources required');
  sources.forEach((source, index) => {
    const valid = String(source.sourceRef || '').trim() && String(source.chunkRef || '').trim()
      && /^[a-f0-9]{64}$/i.test(String(source.sha256 || ''))
      && source.freshnessAt && !Number.isNaN(Date.parse(source.freshnessAt));
    if (!valid) errors.push(`retrievalSources[${index}] provenance invalid`);
  });
  const budget = input.budget || {};
  if (!Number.isFinite(Number(budget.maxCostUsd)) || budget.maxCostUsd <= 0 || budget.maxCostUsd > 10) {
    errors.push('bounded cost budget required');
  }
  if (!Number.isInteger(Number(budget.maxLatencyMs)) || budget.maxLatencyMs < 100 || budget.maxLatencyMs > 120000) {
    errors.push('bounded latency budget required');
  }
  if (!Number.isInteger(Number(input.timeoutMs)) || input.timeoutMs < 100 || input.timeoutMs > 60000) {
    errors.push('timeout must be 100-60000ms');
  }
  if (!String(input.datasetVersion || '').trim()) errors.push('evaluation dataset version required');
  if (!String(input.policyVersion || '').trim()) errors.push('evaluation policy version required');
  if (!Array.isArray(input.requiredTerms) || !input.requiredTerms.length) {
    errors.push('required commercial/legal terms must be declared');
  }
  return {
    errors,
    result: {
      schemaVersion: 1,
      toolId: String(input.toolId || ''),
      toolVersion: String(input.toolVersion || ''),
      datasetVersion: String(input.datasetVersion || ''),
      policyVersion: String(input.policyVersion || ''),
      sourceRefs: sources.map((source) => source.sourceRef).sort(),
      requiredTerms: Array.isArray(input.requiredTerms) ? [...input.requiredTerms].map(String).sort() : [],
      isolation: { network: 'deny_by_default', filesystem: 'ephemeral', timeoutMs: input.timeoutMs },
      gates: {
        qualityThreshold: Number(input.qualityThreshold || 0.8),
        safetyThreshold: Number(input.safetyThreshold || 1),
        costUsd: budget.maxCostUsd,
        latencyMs: budget.maxLatencyMs,
      },
      state: 'queued',
      humanApprovalRequired: true,
    },
    uncertainty: { vendorAcceptanceUnknown: true, legalInterpretationNotPerformed: true },
  };
}

function gate(metrics = {}, gates = {}) {
  const failures = [];
  if (Number(metrics.quality) < Number(gates.qualityThreshold)) failures.push('quality');
  if (Number(metrics.safety) < Number(gates.safetyThreshold)) failures.push('safety');
  if (Number(metrics.costUsd) > Number(gates.costUsd)) failures.push('cost');
  if (Number(metrics.latencyMs) > Number(gates.latencyMs)) failures.push('latency');
  if (metrics.citationsComplete !== true) failures.push('citations');
  if (metrics.requiredTermsCovered !== true) failures.push('required_terms');
  return { passed: failures.length === 0, failures };
}

module.exports = { TOOLS, validateSchema, evaluate, gate };
