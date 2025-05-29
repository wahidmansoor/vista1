
import { readFileSync } from 'fs';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function runSQL() {
  const sql = readFileSync('./update_protocol_ac_paclitaxel.sql', 'utf8');

  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to Supabase DB.');

    const res = await client.query(sql);
    console.log('✅ SQL update successful');
    console.log(res);
  } catch (err) {
    console.error('❌ Error executing SQL:', err);
  } finally {
    await client.end();
    console.log('Connection closed.');
  }
}

runSQL();
