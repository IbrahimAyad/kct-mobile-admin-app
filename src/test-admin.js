// Test script to verify admin client functionality
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gvcswimqaxvylgxbklbz.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2Y3N3aW1xYXh2eWxneGJrbGJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzc2MDUzMCwiZXhwIjoyMDY5MzM2NTMwfQ.NbG4FqOV6YfLBJRpOHtmRWVdGDYrWDKY5VFBUUnNXjM'

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    detectSessionInUrl: false,
    autoRefreshToken: false,
  }
})

async function testAdminAccess() {
  console.log('Testing admin access...')
  
  try {
    // Test 1: Try to query orders table
    console.log('\n1. Testing orders table:')
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('id, order_number, customer_email')
      .limit(1)
    
    if (ordersError) {
      console.error('Orders error:', ordersError)
    } else {
      console.log('Orders success:', orders?.length || 0, 'records')
    }

    // Test 2: Try to query products table
    console.log('\n2. Testing products table:')
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('id, name')
      .limit(1)
    
    if (productsError) {
      console.error('Products error:', productsError)
    } else {
      console.log('Products success:', products?.length || 0, 'records')
    }

    // Test 3: Try to query admin_notifications table
    console.log('\n3. Testing admin_notifications table:')
    const { data: notifications, error: notificationsError } = await supabaseAdmin
      .from('admin_notifications')
      .select('id, title')
      .limit(1)
    
    if (notificationsError) {
      console.error('Admin notifications error:', notificationsError)
    } else {
      console.log('Admin notifications success:', notifications?.length || 0, 'records')
    }

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the test
testAdminAccess()
