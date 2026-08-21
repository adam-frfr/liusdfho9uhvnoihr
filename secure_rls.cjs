const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres.xrcypnyewxnsnjwsixot:minibakes%402021@aws-1-eu-central-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    console.log("Connected to database. Starting security lockdown...");

    // Begin transaction
    await client.query('BEGIN');

    // 1. Drop the catastrophic "Enable all for anon" policies
    const tablesWithInsecurePolicies = [
      'booked_dates',
      'orders',
      'featured_items',
      'clients',
      'products'
    ];

    for (const table of tablesWithInsecurePolicies) {
      console.log(`Dropping "Enable all for anon" policy on table: ${table}`);
      await client.query(`DROP POLICY IF EXISTS "Enable all for anon" ON public.${table};`);
    }

    // 2. Add secure policies for 'orders' table
    console.log("Applying secure policies for 'orders' table...");
    // Allow anon to insert
    await client.query(`
      CREATE POLICY "Anon Insert Orders" 
      ON public.orders FOR INSERT 
      TO anon 
      WITH CHECK (true);
    `);

    // 3. Add secure policies for 'products' and 'featured_items'
    console.log("Applying secure policies for public readable tables...");
    const publicReadTables = ['products', 'featured_items', 'booked_dates'];
    for (const table of publicReadTables) {
      await client.query(`
        CREATE POLICY "Anon Select ${table}" 
        ON public.${table} FOR SELECT 
        TO anon 
        USING (true);
      `);
    }

    await client.query('COMMIT');
    console.log("Security lockdown applied successfully.");

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Error applying security lockdown:", err);
  } finally {
    await client.end();
  }
}

main();
