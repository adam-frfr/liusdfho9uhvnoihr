const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkWebP() {
  const { data: featured } = await supabase.from('featured_items').select('img');
  console.log('Featured Images:', featured.map(f => f.img).filter(img => img && img.includes('.webp')));

  const { data: products } = await supabase.from('products').select('img');
  console.log('Product Images:', products.map(p => p.img).filter(img => img && img.includes('.webp')));
}

checkWebP();
