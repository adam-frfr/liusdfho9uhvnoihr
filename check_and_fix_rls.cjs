const { createClient } = require('@supabase/supabase-js');

const url = 'https://pratxgdpyhqvjmszemly.supabase.co';
const anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYXR4Z2RweWhxdmptc3plbWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NzQ1MDAsImV4cCI6MjA5NzI1MDUwMH0.N2qMrS3R-OmKbL6ehorO2ppVHyo4XX9Tj6ypm-zrdKU';

const supabase = createClient(url, anon);

async function testAllTables() {
  console.log('=== Checking all table read/write permissions for anon role ===\n');

  const tables = ['orders', 'products', 'featured_items', 'store_settings', 'store_availability', 'class_bookings', 'clients', 'booked_dates'];

  for (const table of tables) {
    console.log(`Checking table: ${table}`);
    
    // 1. SELECT test
    const { data: selData, error: selErr } = await supabase.from(table).select('*').limit(1);
    if (selErr) {
      console.error(`  - SELECT FAILED: ${selErr.message} (code: ${selErr.code})`);
    } else {
      console.log(`  - SELECT OK (rows returned: ${selData?.length || 0})`);
    }

    // 2. INSERT test (using dummy id)
    let dummyPayload = { id: `test_perm_${Date.now()}` };
    if (table === 'store_settings' || table === 'store_availability') {
      dummyPayload = { id: 99999 };
    }
    const { error: insErr } = await supabase.from(table).insert([dummyPayload]);
    if (insErr) {
      console.error(`  - INSERT FAILED: ${insErr.message} (code: ${insErr.code})`);
    } else {
      console.log(`  - INSERT OK`);
      // Delete test row
      await supabase.from(table).delete().eq('id', dummyPayload.id);
    }

    // 3. UPDATE test
    const { error: updErr } = await supabase.from(table).update({ updated_at: new Date().toISOString() }).eq('id', 'non_existent_id');
    if (updErr) {
      console.error(`  - UPDATE FAILED: ${updErr.message} (code: ${updErr.code})`);
    } else {
      console.log(`  - UPDATE OK`);
    }
    console.log('');
  }
}

testAllTables();
