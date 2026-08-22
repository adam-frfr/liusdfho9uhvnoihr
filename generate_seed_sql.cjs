const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const oldUrl = 'https://xrcypnyewxnsnjwsixot.supabase.co';
const oldAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyY3lwbnlld3huc25qd3NpeG90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzczNTksImV4cCI6MjA5MjAxMzM1OX0.7bXAk9yXNJipd2LhXchqJV6-N_FzC8YfTxyVq0hYxbc';

const oldClient = createClient(oldUrl, oldAnon);

function escapeLiteral(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return val;
  if (Array.isArray(val)) {
    if (val.length === 0) return 'ARRAY[]::text[]';
    const escapedElems = val.map(item => `'${String(item).replace(/'/g, "''")}'`);
    return `ARRAY[${escapedElems.join(', ')}]::text[]`;
  }
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(val).replace(/'/g, "''")}'`;
}

async function run() {
  let sql = `-- Seed script to populate new Supabase project database\n\n`;

  // 1. PRODUCTS
  const { data: products } = await oldClient.from('products').select('*');
  if (products && products.length > 0) {
    sql += `-- 1. PRODUCTS (${products.length} items)\n`;
    for (const prod of products) {
      const updatedStr = JSON.stringify(prod).replaceAll('xrcypnyewxnsnjwsixot', 'pratxgdpyhqvjmszemly');
      const item = JSON.parse(updatedStr);
      
      const keys = Object.keys(item);
      const vals = keys.map(k => escapeLiteral(item[k]));
      
      sql += `INSERT INTO public.products (${keys.join(', ')})\nVALUES (${vals.join(', ')})\nON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;\n\n`;
    }
  }

  // 2. FEATURED ITEMS
  const { data: featured } = await oldClient.from('featured_items').select('*');
  if (featured && featured.length > 0) {
    sql += `-- 2. FEATURED ITEMS (${featured.length} items)\n`;
    for (const feat of featured) {
      const updatedStr = JSON.stringify(feat).replaceAll('xrcypnyewxnsnjwsixot', 'pratxgdpyhqvjmszemly');
      const item = JSON.parse(updatedStr);
      
      const keys = Object.keys(item);
      const vals = keys.map(k => escapeLiteral(item[k]));
      
      sql += `INSERT INTO public.featured_items (${keys.join(', ')})\nVALUES (${vals.join(', ')})\nON CONFLICT (id) DO NOTHING;\n\n`;
    }
  }

  // 3. STORE SETTINGS
  const { data: settings } = await oldClient.from('store_settings').select('*');
  if (settings && settings.length > 0) {
    sql += `-- 3. STORE SETTINGS\n`;
    for (const setItem of settings) {
      const keys = Object.keys(setItem);
      const vals = keys.map(k => escapeLiteral(setItem[k]));
      sql += `INSERT INTO public.store_settings (${keys.join(', ')})\nVALUES (${vals.join(', ')})\nON CONFLICT (id) DO NOTHING;\n\n`;
    }
  }

  // 4. STORE AVAILABILITY
  const { data: avail } = await oldClient.from('store_availability').select('*');
  if (avail && avail.length > 0) {
    sql += `-- 4. STORE AVAILABILITY\n`;
    for (const availItem of avail) {
      const keys = Object.keys(availItem);
      const vals = keys.map(k => escapeLiteral(availItem[k]));
      sql += `INSERT INTO public.store_availability (${keys.join(', ')})\nVALUES (${vals.join(', ')})\nON CONFLICT (id) DO NOTHING;\n\n`;
    }
  }

  fs.writeFileSync('seed_data.sql', sql);
  console.log('Successfully generated clean seed_data.sql file!');
}

run();
