const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testUpload() {
  const fileContent = 'dummy content for test_upsert';
  const fileName = 'test_upsert.webp';

  console.log('Uploading with upsert: true...');
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, fileContent, { upsert: true, contentType: 'image/webp' });

  console.log('Result:', { data, error });

  const { data: listData } = await supabase.storage.from('product-images').list();
  console.log('Files now:', listData?.map(f => f.name));
}

testUpload();
