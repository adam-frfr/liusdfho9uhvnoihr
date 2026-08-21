const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres.xrcypnyewxnsnjwsixot:minibakes%402021@aws-1-eu-central-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to database to setup RLS!');

    // 1. Products Table
    console.log('Setting up RLS for products...');
    await client.query(`
      ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Public Read Products" ON public.products;
      DROP POLICY IF EXISTS "Admin All Products" ON public.products;
      
      CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
      CREATE POLICY "Admin All Products" ON public.products FOR ALL USING (auth.role() = 'authenticated');
    `);

    // 2. Featured Items Table
    console.log('Setting up RLS for featured_items...');
    await client.query(`
      ALTER TABLE public.featured_items ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Public Read Featured" ON public.featured_items;
      DROP POLICY IF EXISTS "Admin All Featured" ON public.featured_items;

      CREATE POLICY "Public Read Featured" ON public.featured_items FOR SELECT USING (true);
      CREATE POLICY "Admin All Featured" ON public.featured_items FOR ALL USING (auth.role() = 'authenticated');
    `);

    // 3. Booked Dates Table
    console.log('Setting up RLS for booked_dates...');
    await client.query(`
      ALTER TABLE public.booked_dates ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Public Read Booked Dates" ON public.booked_dates;
      DROP POLICY IF EXISTS "Admin All Booked Dates" ON public.booked_dates;

      CREATE POLICY "Public Read Booked Dates" ON public.booked_dates FOR SELECT USING (true);
      CREATE POLICY "Admin All Booked Dates" ON public.booked_dates FOR ALL USING (auth.role() = 'authenticated');
    `);

    // 4. Orders Table
    console.log('Setting up RLS for orders...');
    await client.query(`
      ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Public Insert Orders" ON public.orders;
      DROP POLICY IF EXISTS "Admin All Orders" ON public.orders;

      CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
      CREATE POLICY "Admin All Orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated');
    `);

    console.log('Successfully enabled and configured Row Level Security on all tables!');

  } catch (err) {
    console.error('Failed to setup RLS:', err);
  } finally {
    await client.end();
  }
}

main();
