// Quick Supabase connection test
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xuukuwzxwvdhiowrxymd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1dWt1d3p4d3ZkaGlvd3J4eW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4ODU2NTAsImV4cCI6MjA4MzQ2MTY1MH0.Cv4s9GdMcGCFcNNHT0-2IULYsC8U53xkfeCGfyDcbew';

console.log('Testing Supabase Connection...\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Check if orders table exists
    console.log('✓ Testing connection...');
    const { data, error } = await supabase
      .from('orders')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('✗ Error:', error.message);
      return;
    }
    
    console.log('✓ Connected successfully!');
    console.log('✓ Orders table exists and is accessible\n');
    
    // Test 2: Try to insert a test record
    console.log('✓ Testing insert...');
    const { data: insertData, error: insertError } = await supabase
      .from('orders')
      .insert({
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        plan_id: 'test',
        payment_status: 'test'
      })
      .select()
      .single();
    
    if (insertError) {
      console.log('✗ Insert error:', insertError.message);
      return;
    }
    
    console.log('✓ Test record inserted successfully!');
    console.log('  Record ID:', insertData.id);
    
    // Clean up test record
    await supabase.from('orders').delete().eq('id', insertData.id);
    console.log('✓ Test record cleaned up\n');
    
    console.log('🎉 Supabase is fully configured and working!\n');
    console.log('Next steps:');
    console.log('1. Go to http://localhost:3000');
    console.log('2. Fill out the form and submit');
    console.log('3. Check Supabase Table Editor to see the data!\n');
    
  } catch (err) {
    console.log('✗ Unexpected error:', err.message);
  }
}

testConnection();
