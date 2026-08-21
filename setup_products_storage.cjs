const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres.xrcypnyewxnsnjwsixot:minibakes%402021@aws-1-eu-central-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to database!');

    // Add img column if it doesn't exist
    try {
      await client.query(`ALTER TABLE products ADD COLUMN img TEXT;`);
      console.log('Added img column to products table.');
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('img column already exists.');
      } else {
        throw e;
      }
    }

    // Create the bucket
    await client.query(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('product-images', 'product-images', true) 
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('Bucket "product-images" ensured.');

    // Create policies for the bucket
    try {
      await client.query(`
        CREATE POLICY "Allow public access to product-images" 
        ON storage.objects 
        FOR ALL 
        USING (bucket_id = 'product-images');
      `);
      console.log('Created policy for product-images');
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('Policy already exists.');
      } else {
        throw e;
      }
    }

  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

main();
