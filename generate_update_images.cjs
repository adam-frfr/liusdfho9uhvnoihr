const fs = require('fs');

const imageMap = {
  // Cakes
  'c1': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
  'c2': 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800&auto=format&fit=crop',
  'c3': 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=800&auto=format&fit=crop',
  'c4': 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=800&auto=format&fit=crop',
  'c5': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop',
  'c7': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=800&auto=format&fit=crop',
  'prod_v1s6bcz9': 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=800&auto=format&fit=crop',

  // Cupcakes
  'cu1': 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=800&auto=format&fit=crop',
  'cu2': 'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=800&auto=format&fit=crop',
  'cu3': 'https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=800&auto=format&fit=crop',
  'cu4': 'https://images.unsplash.com/photo-1599785209707-a456fc1337cc?q=80&w=800&auto=format&fit=crop',
  'cu5': 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=800&auto=format&fit=crop',
  'cu6': 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?q=80&w=800&auto=format&fit=crop',

  // Brownies
  'brownies-box': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',

  // Mini Cakes
  'mc1': 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=800&auto=format&fit=crop',
  'mc2': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800&auto=format&fit=crop',

  // Cake Pops
  'cp1': 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop',
  'cp2': 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop',
  'cp3': 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop',

  // Cakesicles
  't3': 'https://images.unsplash.com/photo-1570476922354-81227cdbb76c?q=80&w=800&auto=format&fit=crop',
  't4': 'https://images.unsplash.com/photo-1570476922354-81227cdbb76c?q=80&w=800&auto=format&fit=crop',
  'cakesicles-bulk': 'https://images.unsplash.com/photo-1570476922354-81227cdbb76c?q=80&w=800&auto=format&fit=crop',

  // Breakable Hearts
  't2': 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop'
};

let sql = `-- SQL query to update all product and featured item image URLs with high-quality cake images\n\n`;

for (const [id, url] of Object.entries(imageMap)) {
  sql += `UPDATE public.products SET img = '${url}' WHERE id = '${id}';\n`;
}

sql += `\n-- Update Featured Carousel Images\n`;
sql += `UPDATE public.featured_items SET img = '${imageMap['brownies-box']}' WHERE id = 'featured-1' OR slot = 1;\n`;
sql += `UPDATE public.featured_items SET img = '${imageMap['cu1']}' WHERE id = 'featured-2' OR slot = 2;\n`;
sql += `UPDATE public.featured_items SET img = '${imageMap['c1']}' WHERE id = 'featured-3' OR slot = 3;\n`;

fs.writeFileSync('update_images.sql', sql);
console.log('Successfully created update_images.sql!');
