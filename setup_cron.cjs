const { Client } = require('pg');

const connectionString = 'postgresql://postgres.xrcypnyewxnsnjwsixot:minibakes%402021@aws-1-eu-central-2.pooler.supabase.com:6543/postgres';

async function setupCron() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to DB. Enabling extensions...');
    await client.query('CREATE EXTENSION IF NOT EXISTS pg_cron;');
    await client.query('CREATE EXTENSION IF NOT EXISTS pg_net;');
    console.log('Extensions enabled.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

setupCron();
