const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const menuDataStr = fs.readFileSync(path.join(__dirname, 'src', 'data', 'menuData.js'), 'utf8');

// A very hacky but functional parser for the menuData JS
// Since it's a JS file and not JSON, we'll execute it to extract the data
const script = `
  ${menuDataStr.replace(/export const menuData =/, 'global.menuData =')}
`;
eval(script);

async function migrate() {
  const allProducts = [];
  
  global.menuData.forEach(cat => {
    if (cat.items) {
      cat.items.forEach(item => {
        allProducts.push({
          id: item.id,
          category: cat.category,
          name: item.name,
          price: item.price,
          description: item.description || '',
          img: item.img,
          options: item.images && item.images.length > 0 ? [{ name: '__gallery_images', values: item.images }] : [],
          status: 'In Stock',
          flavours: [],
          spreads: []
        });
      });
    }
    if (cat.sections) {
      cat.sections.forEach(sec => {
        sec.items.forEach(item => {
          allProducts.push({
            id: item.id,
            category: cat.category,
            subcategory: sec.title,
            name: item.name,
            price: item.price,
            description: item.description || '',
            img: item.img,
            options: item.images && item.images.length > 0 ? [{ name: '__gallery_images', values: item.images }] : [],
            status: 'In Stock',
            flavours: [],
            spreads: []
          });
        });
      });
    }
  });

  console.log(`Found ${allProducts.length} products to migrate.`);
  
  for (const p of allProducts) {
    const { data, error } = await supabase.from('products').upsert(p);
    if (error) {
      console.error(`Error upserting ${p.id}:`, error.message);
    } else {
      console.log(`Migrated ${p.id}: ${p.name}`);
    }
  }
}

migrate();
