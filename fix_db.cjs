const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fixDB() {
  console.log('Resetting img to null for c1 and t2...');
  await supabase.from('products').update({ img: null }).in('id', ['c1', 't2']);
  console.log('Done updating DB.');

  // Delete the rogue files
  console.log('Deleting rogue files from root...');
  const { data, error } = await supabase.storage.from('product-images').list();
  if (data) {
    const rogueFiles = data.filter(f => f.name.startsWith('product-c1.webp') || f.name.startsWith('product-t2-'));
    if (rogueFiles.length > 0) {
      await supabase.storage.from('product-images').remove(rogueFiles.map(f => f.name));
      console.log('Deleted rogue files:', rogueFiles.map(f => f.name));
    }
  }
}

fixDB();
