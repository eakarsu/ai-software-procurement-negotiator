'use strict';

const crypto = require('node:crypto');
const KEY = /^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/;
const SCOPE = /^[A-Za-z0-9][A-Za-z0-9._:-]{1,127}$/;

function canonical(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  if (typeof value === 'number' && !Number.isFinite(value)) throw new TypeError('non-finite number');
  return JSON.stringify(value);
}

function digest(value) {
  return crypto.createHash('sha256').update(canonical(value)).digest('hex');
}

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

function verifyIdentity(headers, secret, audience, now = Math.floor(Date.now() / 1000)) {
  if (!secret || secret.length < 32) return null;
  const encoded = headers.get('x-governance-identity') || '';
  const signature = headers.get('x-governance-signature') || '';
  const expected = sign(encoded, secret);
  if (!/^[a-f0-9]{64}$/i.test(signature)
    || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const claims = JSON.parse(Buffer.from(encoded, 'base64url'));
    if (claims.aud !== audience || !SCOPE.test(claims.sub) || !SCOPE.test(claims.tenantId)
      || !SCOPE.test(claims.role) || !Array.isArray(claims.permissions)
      || claims.iat > now + 60 || claims.exp < now) return null;
    return {
      actor: claims.sub,
      tenant: claims.tenantId,
      role: claims.role,
      permissions: claims.permissions.map(String),
      subjects: Array.isArray(claims.subjects) ? claims.subjects.map(String) : [],
    };
  } catch (_) {
    return null;
  }
}

function retryState(attempts, retryable = true) {
  return !retryable || Number(attempts) >= 5 ? 'dead_letter' : 'failed';
}

module.exports = { KEY, SCOPE, canonical, digest, sign, verifyIdentity, retryState };
