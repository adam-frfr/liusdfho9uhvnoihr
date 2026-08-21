const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres.xrcypnyewxnsnjwsixot:6FuC9V3W9fbaqK!@aws-1-eu-central-2.pooler.supabase.com:6543/postgres';

const menuDataStr = fs.readFileSync(path.join(__dirname, 'src', 'data', 'menuData.js'), 'utf8');

// Parse menuData
const script = `
  ${menuDataStr.replace(/export const menuData =/, 'global.menuData =')}
`;
eval(script);

async function migrate() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log('Connected to DB. Adding images column if missing...');
    await client.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;
    `);
    console.log('images column ensured.');

    const allProducts = [];
    
    global.menuData.forEach(cat => {
      if (cat.items) {
        cat.items.forEach(item => {
          allProducts.push({
            id: item.id,
            category: cat.category,
            subcategory: null,
            name: item.name,
            price: item.price,
            description: item.description || '',
            img: item.img,
            images: JSON.stringify(item.images || []),
            status: 'In Stock',
            flavours: '[]',
            spreads: '[]',
            options: '[]'
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
              images: JSON.stringify(item.images || []),
              status: 'In Stock',
              flavours: '[]',
              spreads: '[]',
              options: '[]'
            });
          });
        });
      }
    });

    console.log(`Found ${allProducts.length} products to upsert.`);

    for (const p of allProducts) {
      // We will perform an UPSERT using id as primary key
      const query = `
        INSERT INTO products (id, category, subcategory, name, price, description, img, images, status, flavours, spreads, options)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10::jsonb, $11::jsonb, $12::jsonb)
        ON CONFLICT (id) DO UPDATE SET
          category = EXCLUDED.category,
          subcategory = EXCLUDED.subcategory,
          name = EXCLUDED.name,
          price = EXCLUDED.price,
          description = EXCLUDED.description,
          img = EXCLUDED.img,
          images = EXCLUDED.images
      `;
      const values = [
        p.id, p.category, p.subcategory, p.name, p.price, p.description, p.img, p.images, p.status, p.flavours, p.spreads, p.options
      ];
      await client.query(query, values);
      console.log(`Upserted ${p.id}: ${p.name}`);
    }

    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await client.end();
  }
}

migrate();
