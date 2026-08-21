const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres.xrcypnyewxnsnjwsixot:minibakes%402021@aws-1-eu-central-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    
    console.log("=== TABLES ===");
    let res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';");
    console.log(res.rows);

    console.log("\n=== RLS POLICIES ===");
    res = await client.query("SELECT * FROM pg_policies WHERE schemaname = 'public';");
    console.log(res.rows);
    
    console.log("\n=== COLUMNS FOR EACH TABLE ===");
    res = await client.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    const tables = {};
    for (const row of res.rows) {
      if (!tables[row.table_name]) tables[row.table_name] = [];
      tables[row.table_name].push({ column: row.column_name, type: row.data_type });
    }
    console.log(JSON.stringify(tables, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
