import fs from 'node:fs';
import { Pool, type QueryResultRow } from 'pg';

let governedPool: Pool | undefined;

function pool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');
  if (!governedPool) {
    governedPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSLROOTCERT
        ? { rejectUnauthorized: true, ca: fs.readFileSync(process.env.PGSSLROOTCERT, 'utf8') }
        : undefined,
    });
  }
  return governedPool;
}

export function governedQuery<T extends QueryResultRow = QueryResultRow>(text: string, values: unknown[] = []) {
  return pool().query<T>(text, values);
}

export async function governedTransaction<T>(callback: (query: typeof governedQuery) => Promise<T>) {
  const client = await pool().connect();
  try {
    await client.query('BEGIN');
    const query = ((text: string, values: unknown[] = []) => client.query(text, values)) as typeof governedQuery;
    const result = await callback(query);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
