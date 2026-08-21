const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres.xrcypnyewxnsnjwsixot:minibakes%402021@aws-1-eu-central-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to database!');

    // Update mc1 and mc2
    const res = await client.query(`
      UPDATE products 
      SET flavours = ARRAY['Chocolate', 'Vanilla', 'Red Velvet'],
          description = CASE 
            WHEN id = 'mc1' THEN 'Bite-sized indulgence (Single portion). Choice of Chocolate, Vanilla, or Red Velvet flavors. Choice of 1 signature spread.'
            WHEN id = 'mc2' THEN 'A delightful small treat (Large portion). Choice of Chocolate, Vanilla, or Red Velvet flavors. Choice of 1 signature spread.'
            ELSE description
          END
      WHERE id IN ('mc1', 'mc2')
    `);
    
    console.log(`Updated ${res.rowCount} rows.`);
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

main();
