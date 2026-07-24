import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { governedQuery } from '@/lib/governedPostgres';
import type { SessionUser } from '@/lib/authShared';

const scrypt = promisify(crypto.scrypt);
type UserRow = { tenant_id: string; email: string; password_hash: string; first_name: string; last_name: string; role: SessionUser['role']; status: string };

export async function authenticateDatabaseUser(emailValue: string, password: string): Promise<SessionUser | null> {
  const email = emailValue.trim().toLowerCase();
  const result = await governedQuery<UserRow>('SELECT tenant_id,email,password_hash,first_name,last_name,role,status FROM procurement_app_users WHERE email=$1', [email]);
  const row = result.rows[0];
  if (!row || row.status !== 'active') return null;
  const [, salt, expectedHex] = row.password_hash.split('$');
  if (!salt || !expectedHex) return null;
  const derived = await scrypt(password, salt, 64) as Buffer;
  const actual = Buffer.from(derived);
  const expected = Buffer.from(expectedHex, 'hex');
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;
  return { email: row.email, firstName: row.first_name, lastName: row.last_name, role: row.role };
}

export async function databaseUserIsActive(email: string): Promise<boolean> {
  const result = await governedQuery<{ active: boolean }>("SELECT status='active' AS active FROM procurement_app_users WHERE email=$1", [email.toLowerCase()]);
  return result.rows[0]?.active === true;
}
