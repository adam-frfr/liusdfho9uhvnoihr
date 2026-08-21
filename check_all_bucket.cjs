const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function listAll(path = '') {
  const { data, error } = await supabase.storage.from('product-images').list(path, { limit: 1000 });
  if (error) {
    console.error('Error listing path', path, error);
    return;
  }
  for (const item of data) {
    const fullPath = path ? `${path}/${item.name}` : item.name;
    if (item.id === null) { // It's a folder (usually)
      await listAll(fullPath);
    } else {
      console.log('File:', fullPath);
    }
  }
}

listAll('');
