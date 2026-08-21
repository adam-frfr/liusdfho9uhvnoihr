const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres.xrcypnyewxnsnjwsixot:minibakes%402021@aws-1-eu-central-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    
    await client.query(`TRUNCATE TABLE featured_items;`);

    // Seed data
    await client.query(`
      INSERT INTO featured_items (id, slot, name, description, price, highlights, img)
      VALUES 
      ('featured-1', 1, 'Bespoke Cupcakes', 'Handcrafted perfection tailored to your theme.', '12 for €28', '[]'::jsonb, null),
      ('featured-2', 2, 'Signature Mini Cakes', 'Elegant layers of flavor in a personal size.', 'Starts at €15', '[]'::jsonb, null),
      ('featured-3', 3, 'Gourmet Cookie Cups', 'Crispy edges, gooey centers, irresistible flavors.', '6 for €18', '[]'::jsonb, null);
    `);
    
    console.log('Seeded featured items successfully.');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
