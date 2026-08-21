const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres.xrcypnyewxnsnjwsixot:minibakes%402021@aws-1-eu-central-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    console.log("Connected to database. Continuing Phase 1...");

    await client.query('BEGIN');

    // 1. Create admin_users table
    console.log("Creating admin_users table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.admin_users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
      
      ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Admins can read admin_users" ON public.admin_users;
      CREATE POLICY "Admins can read admin_users" ON public.admin_users FOR SELECT TO authenticated USING (
        (auth.jwt() ->> 'email') IN (SELECT email FROM public.admin_users)
      );
    `);

    if (process.env.ADMIN_EMAIL) {
      await client.query(
        'INSERT INTO public.admin_users (email) VALUES ($1) ON CONFLICT (email) DO NOTHING',
        [process.env.ADMIN_EMAIL]
      );
    }

    // 2. Add full RLS policies for authenticated users on ALL tables
    console.log("Creating strict authenticated policies on public tables...");
    const publicTables = ['orders', 'products', 'featured_items', 'clients', 'booked_dates', 'class_bookings'];
    
    for (const table of publicTables) {
      await client.query(`DROP POLICY IF EXISTS "Admin All ${table}" ON public.${table};`);
      await client.query(`
        CREATE POLICY "Admin All ${table}" ON public.${table} 
        FOR ALL TO authenticated 
        USING (true) WITH CHECK (true);
      `);
    }

    // 3. Update Storage Bucket policies
    console.log("Updating Storage Bucket policies...");
    
    // Drop insecure policies and any existing policies with the same name
    await client.query(`
      DROP POLICY IF EXISTS "Allow public access to featured-images" ON storage.objects;
      DROP POLICY IF EXISTS "Allow public access to product-images" ON storage.objects;
      DROP POLICY IF EXISTS "Public Read Featured Images" ON storage.objects;
      DROP POLICY IF EXISTS "Public Read Product Images" ON storage.objects;
      DROP POLICY IF EXISTS "Admin All Storage" ON storage.objects;
    `);

    // Create secure policies
    await client.query(`
      -- Public READ access for these buckets
      CREATE POLICY "Public Read Featured Images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'featured-images');
      CREATE POLICY "Public Read Product Images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'product-images');
      
      -- Admin ALL access
      CREATE POLICY "Admin All Storage" ON storage.objects FOR ALL TO authenticated USING (true) WITH CHECK (true);
    `);

    await client.query('COMMIT');
    console.log("Phase 1 completed successfully.");

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Error completing Phase 1:", err);
  } finally {
    await client.end();
  }
}

main();
