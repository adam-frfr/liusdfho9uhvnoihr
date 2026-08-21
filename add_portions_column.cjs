const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres.xrcypnyewxnsnjwsixot:minibakes%402021@aws-1-eu-central-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to database!');

    await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS portions TEXT;`);
    console.log(`Added portions column to products table.`);
    
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

main();
