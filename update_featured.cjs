const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres.xrcypnyewxnsnjwsixot:minibakes%402021@aws-1-eu-central-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    
    // Update data
    await client.query(`
      UPDATE featured_items SET name = 'Brownie Selection', description = 'Our most popular brownie assortment, baked fresh daily with premium chocolate.', price = '€xx' WHERE slot = 1;
      UPDATE featured_items SET name = 'Signature Cupcakes', description = 'A curated selection of our most loved cupcake flavors, perfect for any occasion.', price = '€xx' WHERE slot = 2;
      UPDATE featured_items SET name = 'Best Seller cake', description = 'Our signature masterpiece cake, loved by everyone for its perfect balance of flavor.', price = '€xx' WHERE slot = 3;
    `);
    
    console.log('Updated featured items successfully.');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
