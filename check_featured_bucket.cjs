const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkBucket() {
  const { data, error } = await supabase.storage.from('featured-images').list();
  console.log('Files in featured-images:', data?.map(f => f.name));
}

checkBucket();
