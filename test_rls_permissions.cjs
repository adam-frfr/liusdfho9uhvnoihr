const { createClient } = require('@supabase/supabase-js');

const url = 'https://pratxgdpyhqvjmszemly.supabase.co';
const anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYXR4Z2RweWhxdmptc3plbWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NzQ1MDAsImV4cCI6MjA5NzI1MDUwMH0.N2qMrS3R-OmKbL6ehorO2ppVHyo4XX9Tj6ypm-zrdKU';

const supabase = createClient(url, anon);

async function testPermissions() {
  console.log('--- Testing RLS Permissions with Anon Key ---');

  // 1. Test Order Insert
  const testOrder = {
    id: `TEST-${Date.now()}`,
    customer: 'Test Customer',
    phone: '+356 99000000',
    whatsapp: '+356 99000000',
    date: new Date().toISOString().split('T')[0],
    total: '€10.00',
    status: 'pending',
    details: { test: true }
  };
  const { error: orderErr } = await supabase.from('orders').insert([testOrder]);
  console.log('Order Insert Result:', orderErr ? `FAILED: ${orderErr.message}` : 'SUCCESS');

  // 2. Test Order Select
  const { data: orders, error: orderSelErr } = await supabase.from('orders').select('*').limit(5);
  console.log('Order Select Result:', orderSelErr ? `FAILED: ${orderSelErr.message}` : `SUCCESS (found ${orders?.length || 0} orders)`);

  // 3. Test Product Update
  const { error: prodUpdateErr } = await supabase.from('products').update({ status: 'In Stock' }).eq('id', 'c1');
  console.log('Product Update Result:', prodUpdateErr ? `FAILED: ${prodUpdateErr.message}` : 'SUCCESS');

  // 4. Test Store Settings Update
  const { error: settingsUpdateErr } = await supabase.from('store_settings').update({ whatsapp_number: '+35699000000' }).eq('id', 1);
  console.log('Store Settings Update Result:', settingsUpdateErr ? `FAILED: ${settingsUpdateErr.message}` : 'SUCCESS');

  // 5. Test Store Availability Update
  const { error: availUpdateErr } = await supabase.from('store_availability').update({ is_taking_orders_today: true }).eq('id', 1);
  console.log('Store Availability Update Result:', availUpdateErr ? `FAILED: ${availUpdateErr.message}` : 'SUCCESS');

  // Clean up test order if created
  if (!orderErr) {
    await supabase.from('orders').delete().eq('id', testOrder.id);
  }
}

testPermissions();
