
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'wardrobe',
  password: '',
  port: 5432,
});

export async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}
