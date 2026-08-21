const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres.xrcypnyewxnsnjwsixot:minibakes%402021@aws-1-eu-central-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    
    console.log("=== STORAGE BUCKETS ===");
    let res = await client.query("SELECT id, name, public FROM storage.buckets;");
    console.log(res.rows);

    console.log("\n=== STORAGE POLICIES ===");
    res = await client.query("SELECT * FROM pg_policies WHERE schemaname = 'storage';");
    console.log(res.rows);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
