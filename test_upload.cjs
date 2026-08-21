const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testUpload() {
  const fileContent = Buffer.from('test');
  const { data, error } = await supabase.storage.from('product-images').upload('test.webp', fileContent, {
    contentType: 'image/webp',
    upsert: true
  });
  console.log('Upload Result:', data, error);
}

testUpload();
