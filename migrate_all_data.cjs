const { createClient } = require('@supabase/supabase-js');

const oldUrl = 'https://xrcypnyewxnsnjwsixot.supabase.co';
const oldAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyY3lwbnlld3huc25qd3NpeG90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzczNTksImV4cCI6MjA5MjAxMzM1OX0.7bXAk9yXNJipd2LhXchqJV6-N_FzC8YfTxyVq0hYxbc';

const newUrl = 'https://pratxgdpyhqvjmszemly.supabase.co';
const newAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYXR4Z2RweWhxdmptc3plbWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NzQ1MDAsImV4cCI6MjA5NzI1MDUwMH0.N2qMrS3R-OmKbL6ehorO2ppVHyo4XX9Tj6ypm-zrdKU';

const oldClient = createClient(oldUrl, oldAnon);
const newClient = createClient(newUrl, newAnon);

async function migrateTable(tableName) {
  console.log(`\n--- Migrating ${tableName} ---`);
  const { data: rows, error: fetchErr } = await oldClient.from(tableName).select('*');
  if (fetchErr) {
    console.error(`Error fetching ${tableName}:`, fetchErr.message);
    return;
  }
  if (!rows || rows.length === 0) {
    console.log(`No rows in old table ${tableName}`);
    return;
  }

  console.log(`Found ${rows.length} rows in ${tableName}. Updating image URLs and inserting into new DB...`);
  
  // Replace old domain in any string/URL fields with new domain
  const updatedRows = rows.map(row => {
    const jsonStr = JSON.stringify(row).replaceAll('xrcypnyewxnsnjwsixot', 'pratxgdpyhqvjmszemly');
    return JSON.parse(jsonStr);
  });

  const { data: inserted, error: insertErr } = await newClient.from(tableName).upsert(updatedRows);
  if (insertErr) {
    console.error(`Error inserting into new DB for ${tableName}:`, insertErr.message);
  } else {
    console.log(`Successfully migrated ${rows.length} rows into ${tableName}!`);
  }
}

async function run() {
  await migrateTable('products');
  await migrateTable('featured_items');
  await migrateTable('store_settings');
  await migrateTable('store_availability');
  await migrateTable('booked_dates');
  console.log('\nAll table data migration finished!');
}

run();
