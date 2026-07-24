import crypto from 'node:crypto';
import { promisify } from 'node:util';
import pg from 'pg';

const scrypt = promisify(crypto.scrypt);
const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = String(process.env.ADMIN_PASSWORD || '');
const tenantId = String(process.env.TENANT_ID || process.env.GOVERNANCE_TENANT_ID || '').trim();
if (!process.env.DATABASE_URL || !email.includes('@') || password.length < 12 || !tenantId) throw new Error('DATABASE_URL, ADMIN_EMAIL, strong ADMIN_PASSWORD, and TENANT_ID are required');
const salt = crypto.randomBytes(16).toString('hex');
const derived = await scrypt(password, salt, 64);
const passwordHash = `scrypt$${salt}$${Buffer.from(derived).toString('hex')}`;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
try {
  await pool.query(
    `INSERT INTO procurement_app_users(tenant_id,email,password_hash,first_name,last_name,role,status)
     VALUES($1,$2,$3,'Runtime','Administrator','admin','active')
     ON CONFLICT(email) DO UPDATE SET tenant_id=EXCLUDED.tenant_id,password_hash=EXCLUDED.password_hash,
       first_name=EXCLUDED.first_name,last_name=EXCLUDED.last_name,role='admin',status='active',updated_at=NOW()`,
    [tenantId, email, passwordHash],
  );
} finally { await pool.end(); }
