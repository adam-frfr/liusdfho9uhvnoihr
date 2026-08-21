const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres.xrcypnyewxnsnjwsixot:minibakes%402021@aws-1-eu-central-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to database!');

    // Get list of tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('\n--- TABLES ---');
    console.log(tablesRes.rows.map(r => r.table_name));

    // Get columns of products table
    const prodCols = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'products'
    `);
    console.log('\n--- PRODUCTS COLUMNS ---');
    console.table(prodCols.rows);

    // Get columns of orders table
    const orderCols = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'orders'
    `);
    console.log('\n--- ORDERS COLUMNS ---');
    console.table(orderCols.rows);

  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

main();
