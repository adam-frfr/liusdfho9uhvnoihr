const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres.xrcypnyewxnsnjwsixot:minibakes%402021@aws-1-eu-central-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to database!');

    // Get an existing cake's options
    const res = await client.query(`
      SELECT options FROM products 
      WHERE category = 'Cakes' AND options IS NOT NULL 
      LIMIT 1
    `);
    
    let options = res.rows[0].options;
    // ensure no __gallery_images
    options = options.filter(o => o.name !== '__gallery_images');

    const id = 'prod_' + Math.random().toString(36).substring(2, 10);

    const idRes = await client.query(`
      INSERT INTO products (id, name, price, category, status, options, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name
    `, [
      id,
      '6 Inch 3 Layer', 
      '€', 
      'Cakes', 
      'In Stock', 
      JSON.stringify(options), 
      new Date().toISOString()
    ]);
    
    console.log(`Inserted product:`, idRes.rows[0]);
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

main();
