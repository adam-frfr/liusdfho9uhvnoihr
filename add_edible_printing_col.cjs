const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres.xrcypnyewxnsnjwsixot:minibakes%402021@aws-1-eu-central-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to database!');

    // 1. Add column
    await client.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS has_edible_printing BOOLEAN DEFAULT false;
    `);
    console.log('Column has_edible_printing added.');

    // 2. Set true for cakesicles
    const res = await client.query(`
      UPDATE products 
      SET has_edible_printing = true
      WHERE id IN ('t3', 't4', 'cakesicles-bulk')
    `);
    
    console.log(`Updated ${res.rowCount} rows to have edible printing.`);
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

main();
