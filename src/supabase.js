import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pratxgdpyhqvjmszemly.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYXR4Z2RweWhxdmptc3plbWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NzQ1MDAsImV4cCI6MjA5NzI1MDUwMH0.N2qMrS3R-OmKbL6ehorO2ppVHyo4XX9Tj6ypm-zrdKU';

let client;
try {
  client = createClient(supabaseUrl, supabaseAnonKey);
} catch (err) {
  console.error('Failed to initialize Supabase client:', err);
  client = createClient('https://pratxgdpyhqvjmszemly.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYXR4Z2RweWhxdmptc3plbWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NzQ1MDAsImV4cCI6MjA5NzI1MDUwMH0.N2qMrS3R-OmKbL6ehorO2ppVHyo4XX9Tj6ypm-zrdKU');
}

export const supabase = client;

