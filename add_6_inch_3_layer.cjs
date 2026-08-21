const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function main() {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  const urlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*['"`]?([^'"`\r\n]+)['"`]?/);
  const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY\s*=\s*['"`]?([^'"`\r\n]+)['"`]?/);
  
  if (!urlMatch || !keyMatch) {
    console.error("Could not parse supabase credentials");
    return;
  }
  
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  
  // Find an existing cake to copy options
  const { data: cakes, error: fetchError } = await supabase
    .from('products')
    .select('options')
    .eq('category', 'Cakes')
    .not('options', 'is', null)
    .limit(1);
    
  if (fetchError) {
    console.error("Error fetching cakes:", fetchError);
    return;
  }
  
  let options = [];
  if (cakes && cakes.length > 0 && cakes[0].options) {
    options = cakes[0].options;
  }
  
  // Filter out gallery images if any
  options = options.filter(o => o.name !== '__gallery_images');
  
  // Insert new product
  const payload = {
    name: "6 Inch 3 Layer",
    price: "€",
    category: "Cakes",
    status: "In Stock",
    options: options,
    created_at: new Date().toISOString()
  };
  
  const { data: newProduct, error: insertError } = await supabase
    .from('products')
    .insert([payload])
    .select();
    
  if (insertError) {
    console.error("Error inserting product:", insertError);
  } else {
    console.log("Successfully added new product:", newProduct[0].name);
  }
}

main();
