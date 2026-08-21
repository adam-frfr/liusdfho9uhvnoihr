const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Load env
require('dotenv').config({ path: path.join(__dirname, '.env') });
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const pgClient = new Client({
    connectionString: 'postgresql://postgres.xrcypnyewxnsnjwsixot:minibakes%402021@aws-1-eu-central-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await pgClient.connect();
    console.log("Connected to PG. Temporarily allowing anon uploads...");

    await pgClient.query(`
      CREATE POLICY "Temp Anon Upload" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id IN ('product-images', 'featured-images'));
      CREATE POLICY "Temp Anon Update" ON storage.objects FOR UPDATE TO public USING (bucket_id IN ('product-images', 'featured-images'));
    `);

    console.log("Anon upload allowed. Finding images...");

    const assetsDir = path.join(__dirname, 'src', 'assets').replace(/\\/g, '/');
    
    // Glob product image folders
    const patterns = [
      'brownies/*.{webp,png,jpg,jpeg}',
      'cake pops/*.{webp,png,jpg,jpeg}',
      'cake sicles/*.{webp,png,jpg,jpeg}',
      'minicakes/*.{webp,png,jpg,jpeg}',
      'cakes/heart/*.{webp,png,jpg,jpeg}',
      'cakes/round/*.{webp,png,jpg,jpeg}',
      'cupcakes/*.{webp,png,jpg,jpeg}',
      'cupcake4.webp',
      'roundcake1.webp',
      '1.webp'
    ];

    let filesToUpload = [];
    for (const pattern of patterns) {
      const globPattern = `${assetsDir}/${pattern}`;
      const files = glob.sync(globPattern);
      filesToUpload.push(...files);
    }
    
    // De-duplicate
    filesToUpload = [...new Set(filesToUpload)];
    console.log(`Found ${filesToUpload.length} images to upload.`);

    for (const file of filesToUpload) {
      const ext = path.extname(file);
      const relativePath = path.relative(assetsDir, file).replace(/\\/g, '/');
      const filename = path.basename(file);
      const bucket = 'product-images'; // We'll put everything in product-images

      // We will use the relative path as the path in the bucket, replacing spaces with dashes
      const storagePath = relativePath.replace(/ /g, '-').toLowerCase();

      const fileBuffer = fs.readFileSync(file);
      const contentType = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';

      console.log(`Uploading ${storagePath}...`);
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, fileBuffer, {
          contentType,
          upsert: true
        });

      if (error) {
        console.error(`Error uploading ${storagePath}:`, error.message);
      } else {
        console.log(`Success: ${storagePath}`);
      }
    }

    console.log("Uploads complete. Restoring security policies...");

  } catch (err) {
    console.error("Script error:", err);
  } finally {
    try {
       await pgClient.query(`
        DROP POLICY IF EXISTS "Temp Anon Upload" ON storage.objects;
        DROP POLICY IF EXISTS "Temp Anon Update" ON storage.objects;
      `);
      console.log("Security policies restored.");
      await pgClient.end();
    } catch (e) {
      console.error("Failed to restore policies!", e);
    }
  }
}

main();
