const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres.xrcypnyewxnsnjwsixot:minibakes%402021@aws-1-eu-central-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to database!');

    // Create the bucket
    await client.query(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('featured-images', 'featured-images', true) 
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('Bucket "featured-images" ensured.');

    // Create policies for the bucket so anonymous users can insert/select/delete
    // First, check if policy exists to avoid errors
    try {
      await client.query(`
        CREATE POLICY "Allow public access to featured-images" 
        ON storage.objects 
        FOR ALL 
        USING (bucket_id = 'featured-images');
      `);
      console.log('Created policy for featured-images');
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
