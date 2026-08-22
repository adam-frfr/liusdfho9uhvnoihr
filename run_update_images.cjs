const { createClient } = require('@supabase/supabase-js');

const newUrl = 'https://pratxgdpyhqvjmszemly.supabase.co';
const newAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYXR4Z2RweWhxdmptc3plbWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NzQ1MDAsImV4cCI6MjA5NzI1MDUwMH0.N2qMrS3R-OmKbL6ehorO2ppVHyo4XX9Tj6ypm-zrdKU';

const supabase = createClient(newUrl, newAnon);

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

async function run() {
  console.log('Updating images for all products...');
  for (const [id, img] of Object.entries(imageMap)) {
    const { error } = await supabase.from('products').update({ img }).eq('id', id);
    if (error) console.error(`Error updating product ${id}:`, error.message);
    else console.log(`Updated product ${id}`);
  }

  // Update featured items
  await supabase.from('featured_items').update({ img: imageMap['brownies-box'] }).eq('id', 'featured-1');
  await supabase.from('featured_items').update({ img: imageMap['cu1'] }).eq('id', 'featured-2');
  await supabase.from('featured_items').update({ img: imageMap['c1'] }).eq('id', 'featured-3');

  console.log('Finished updating product images!');
}

run();
