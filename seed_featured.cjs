const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres.xrcypnyewxnsnjwsixot:minibakes%402021@aws-1-eu-central-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    
    // Seed data
    await client.query(`
      INSERT INTO featured_items (slot, name, description, price, highlights, img)
      VALUES 
      (1, 'Bespoke Cupcakes', 'Handcrafted perfection tailored to your theme.', '12 for €28', '[]'::jsonb, null),
      (2, 'Signature Mini Cakes', 'Elegant layers of flavor in a personal size.', 'Starts at €15', '[]'::jsonb, null),
      (3, 'Gourmet Cookie Cups', 'Crispy edges, gooey centers, irresistible flavors.', '6 for €18', '[]'::jsonb, null)
      ON CONFLICT (id) DO NOTHING;
    `);
    
    console.log('Seeded featured items successfully.');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
