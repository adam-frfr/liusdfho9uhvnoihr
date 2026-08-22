const { createClient } = require('@supabase/supabase-js');

const url = 'https://pratxgdpyhqvjmszemly.supabase.co';
const anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYXR4Z2RweWhxdmptc3plbWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NzQ1MDAsImV4cCI6MjA5NzI1MDUwMH0.N2qMrS3R-OmKbL6ehorO2ppVHyo4XX9Tj6ypm-zrdKU';

const supabase = createClient(url, anon);

async function testExactUpdates() {
  console.log('=== Testing Exact Table Updates for Admin Panel & Checkout ===\n');

  // 1. Products UPDATE test
  const { error: pErr } = await supabase.from('products').update({ status: 'In Stock' }).eq('id', 'c1');
  console.log('Products UPDATE (id=c1):', pErr ? `FAILED: ${pErr.message} (code: ${pErr.code})` : 'SUCCESS');

  // 2. Store Settings UPSERT test
  const { error: sErr } = await supabase.from('store_settings').upsert({ id: 1, whatsapp_number: '+35699000000' });
  console.log('Store Settings UPSERT (id=1):', sErr ? `FAILED: ${sErr.message} (code: ${sErr.code})` : 'SUCCESS');

  // 3. Store Availability UPSERT test
  const { error: aErr } = await supabase.from('store_availability').upsert({ id: 1, is_taking_orders_today: true });
  console.log('Store Availability UPSERT (id=1):', aErr ? `FAILED: ${aErr.message} (code: ${aErr.code})` : 'SUCCESS');

  // 4. Featured Items UPDATE test
  const { error: fErr } = await supabase.from('featured_items').update({ name: 'Brownie Selection' }).eq('id', 'featured-1');
  console.log('Featured Items UPDATE (id=featured-1):', fErr ? `FAILED: ${fErr.message} (code: ${fErr.code})` : 'SUCCESS');

  // 5. Orders UPDATE test
  const { error: oErr } = await supabase.from('orders').update({ status: 'completed' }).eq('id', 'test_order_id');
  console.log('Orders UPDATE (id=test_order_id):', oErr ? `FAILED: ${oErr.message} (code: ${oErr.code})` : 'SUCCESS');
}

testExactUpdates();
