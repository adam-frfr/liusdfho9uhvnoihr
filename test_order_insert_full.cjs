const { createClient } = require('@supabase/supabase-js');

const url = 'https://pratxgdpyhqvjmszemly.supabase.co';
const anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYXR4Z2RweWhxdmptc3plbWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NzQ1MDAsImV4cCI6MjA5NzI1MDUwMH0.N2qMrS3R-OmKbL6ehorO2ppVHyo4XX9Tj6ypm-zrdKU';

const supabase = createClient(url, anon);

async function testFullOrderInsert() {
  const newOrder = {
    id: `ORD-TEST-${Date.now()}`,
    customer: 'Test Order',
    phone: '+356 99000000',
    whatsapp: '+356 99000000',
    date: new Date().toISOString().split('T')[0],
    total: '€45.00',
    status: 'pending',
    client_id: null,
    subscription_id: null,
    details: {
      whatsapp: '+356 99000000',
      pickupDate: '2026-08-25',
      pickupPeriod: 'Morning',
      items: [{ itemType: '6 inch Cake', quantity: 1, price: '€45.00' }]
    }
  };

  console.log('Testing full order insert...');
  const { data, error } = await supabase.from('orders').insert([newOrder]).select();
  if (error) {
    console.error('Order Insert Error:', error);
  } else {
    console.log('Order Insert SUCCESS:', data);
    // Delete test order
    await supabase.from('orders').delete().eq('id', newOrder.id);
  }
}

testFullOrderInsert();
