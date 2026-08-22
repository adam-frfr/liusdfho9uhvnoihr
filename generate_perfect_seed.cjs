const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const oldUrl = 'https://xrcypnyewxnsnjwsixot.supabase.co';
const oldAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyY3lwbnlld3huc25qd3NpeG90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzczNTksImV4cCI6MjA5MjAxMzM1OX0.7bXAk9yXNJipd2LhXchqJV6-N_FzC8YfTxyVq0hYxbc';

const oldClient = createClient(oldUrl, oldAnon);

function sqlVal(val, type) {
  if (val === null || val === undefined) {
    if (type === 'jsonb') return `'[]'::jsonb`;
    if (type === 'text[]') return `'{}'::text[]`;
    return 'NULL';
  }

  if (type === 'boolean') {
    return val ? 'TRUE' : 'FALSE';
  }

  if (type === 'integer') {
    return parseInt(val, 10) || 0;
  }

  if (type === 'jsonb') {
    let obj = val;
    if (typeof val === 'string') {
      try {
        obj = JSON.parse(val);
      } catch (e) {
        obj = [];
      }
    }
    // Clean up any "[object Object]" artifacts
    if (Array.isArray(obj)) {
      obj = obj.filter(item => typeof item === 'object' && item !== null && !String(item).includes('[object Object]'));
    }
    const cleanJson = JSON.stringify(obj).replaceAll('xrcypnyewxnsnjwsixot', 'pratxgdpyhqvjmszemly');
    return `'${cleanJson.replace(/'/g, "''")}'::jsonb`;
  }

  if (type === 'text[]') {
    let arr = val;
    if (typeof val === 'string') {
      try {
        arr = JSON.parse(val);
      } catch (e) {
        arr = [val];
      }
    }
    if (!Array.isArray(arr)) arr = [];
    arr = arr.filter(item => item && !String(item).includes('[object Object]'));
    if (arr.length === 0) return `'{}'::text[]`;
    const escapedElems = arr.map(item => `'${String(item).replace(/'/g, "''")}'`);
    return `ARRAY[${escapedElems.join(', ')}]::text[]`;
  }

  if (type === 'timestamp with time zone') {
    return `'${String(val)}'::timestamp with time zone`;
  }

  // text columns
  let str = String(val).replaceAll('xrcypnyewxnsnjwsixot', 'pratxgdpyhqvjmszemly');
  return `'${str.replace(/'/g, "''")}'`;
}

async function run() {
  let sql = `-- Seed script to populate new Supabase project database (Exact schema matching)\n\n`;

  // 1. PRODUCTS
  const { data: products, error } = await oldClient.from('products').select('*').order('id');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Fetched ${products.length} products from old database.`);

  const cols = [
    { name: 'id', type: 'text' },
    { name: 'category', type: 'text' },
    { name: 'subcategory', type: 'text' },
    { name: 'name', type: 'text' },
    { name: 'price', type: 'text' },
    { name: 'description', type: 'text' },
    { name: 'portions', type: 'text' },
    { name: 'img', type: 'text' },
    { name: 'status', type: 'text' },
    { name: 'min_qty', type: 'integer' },
    { name: 'has_message', type: 'boolean' },
    { name: 'has_inner_message', type: 'boolean' },
    { name: 'has_edible_printing', type: 'boolean' },
    { name: 'individual_packaging', type: 'boolean' },
    { name: 'bows', type: 'boolean' },
    { name: 'is_full_width', type: 'boolean' },
    { name: 'options', type: 'jsonb' },
    { name: 'flavours', type: 'text[]' },
    { name: 'spreads', type: 'text[]' },
    { name: 'created_at', type: 'timestamp with time zone' }
  ];

  sql += `-- 1. PRODUCTS (${products.length} products)\n`;
  const colNames = cols.map(c => c.name).join(', ');

  const valueRows = [];
  for (const prod of products) {
    const rowVals = cols.map(c => sqlVal(prod[c.name], c.type));
    valueRows.push(`(${rowVals.join(', ')})`);
  }

  sql += `INSERT INTO public.products (${colNames})\nVALUES\n${valueRows.join(',\n')}\nON CONFLICT (id) DO UPDATE SET\n  name = EXCLUDED.name,\n  price = EXCLUDED.price,\n  description = EXCLUDED.description,\n  portions = EXCLUDED.portions,\n  category = EXCLUDED.category,\n  subcategory = EXCLUDED.subcategory,\n  img = EXCLUDED.img,\n  status = EXCLUDED.status,\n  options = EXCLUDED.options,\n  flavours = EXCLUDED.flavours,\n  spreads = EXCLUDED.spreads;\n\n`;

  // 2. FEATURED ITEMS
  const { data: featured } = await oldClient.from('featured_items').select('*').order('slot');
  if (featured && featured.length > 0) {
    sql += `-- 2. FEATURED ITEMS (${featured.length} items)\n`;
    const fCols = [
      { name: 'id', type: 'text' },
      { name: 'slot', type: 'integer' },
      { name: 'name', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'price', type: 'text' },
      { name: 'img', type: 'text' },
      { name: 'is_empty', type: 'boolean' },
      { name: 'highlights', type: 'jsonb' },
      { name: 'created_at', type: 'timestamp with time zone' }
    ];
    const fColNames = fCols.map(c => c.name).join(', ');
    const fRows = featured.map(item => `(${fCols.map(c => sqlVal(item[c.name], c.type)).join(', ')})`);
    sql += `INSERT INTO public.featured_items (${fColNames})\nVALUES\n${fRows.join(',\n')}\nON CONFLICT (id) DO NOTHING;\n\n`;
  }

  // 3. STORE SETTINGS
  const { data: settings } = await oldClient.from('store_settings').select('*');
  if (settings && settings.length > 0) {
    sql += `-- 3. STORE SETTINGS\n`;
    const sCols = [
      { name: 'id', type: 'integer' },
      { name: 'facebook_link', type: 'text' },
      { name: 'instagram_link', type: 'text' },
      { name: 'whatsapp_number', type: 'text' },
      { name: 'updated_at', type: 'timestamp with time zone' }
    ];
    const sRows = settings.map(item => `(${sCols.map(c => sqlVal(item[c.name], c.type)).join(', ')})`);
    sql += `INSERT INTO public.store_settings (${sCols.map(c => c.name).join(', ')})\nVALUES\n${sRows.join(',\n')}\nON CONFLICT (id) DO NOTHING;\n\n`;
  }

  // 4. STORE AVAILABILITY
  const { data: avail } = await oldClient.from('store_availability').select('*');
  if (avail && avail.length > 0) {
    sql += `-- 4. STORE AVAILABILITY\n`;
    const aCols = [
      { name: 'id', type: 'integer' },
      { name: 'is_taking_orders_today', type: 'boolean' },
      { name: 'daily_pause_message', type: 'text' },
      { name: 'vacation_start_date', type: 'text' },
      { name: 'vacation_end_date', type: 'text' },
      { name: 'vacation_message', type: 'text' },
      { name: 'updated_at', type: 'timestamp with time zone' }
    ];
    const aRows = avail.map(item => `(${aCols.map(c => sqlVal(item[c.name], c.type)).join(', ')})`);
    sql += `INSERT INTO public.store_availability (${aCols.map(c => c.name).join(', ')})\nVALUES\n${aRows.join(',\n')}\nON CONFLICT (id) DO NOTHING;\n\n`;
  }

  fs.writeFileSync('seed_data_perfect.sql', sql);
  console.log(`Generated seed_data_perfect.sql with ${products.length} products!`);
}

run();
