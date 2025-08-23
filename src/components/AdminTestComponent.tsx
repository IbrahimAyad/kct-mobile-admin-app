import { useEffect, useState } from 'react'
import { supabaseAdmin } from '../lib/supabase'

// Test component to verify admin client functionality
export function AdminTestComponent() {
  const [results, setResults] = useState<string[]>([])

  useEffect(() => {
    async function testAdminAccess() {
      const testResults: string[] = []
      
      try {
        // Test orders table
        testResults.push('Testing orders table...')
        const { data: orders, error: ordersError } = await supabaseAdmin
          .from('orders')
          .select('id')
          .limit(1)
        
        if (ordersError) {
          testResults.push(`❌ Orders error: ${ordersError.message}`)
        } else {
          testResults.push(`✅ Orders success: ${orders?.length || 0} records`)
        }

        // Test products table  
        testResults.push('Testing products table...')
        const { data: products, error: productsError } = await supabaseAdmin
          .from('products')
          .select('id')
          .limit(1)
        
        if (productsError) {
          testResults.push(`❌ Products error: ${productsError.message}`)
        } else {
          testResults.push(`✅ Products success: ${products?.length || 0} records`)
        }

        // Test admin_notifications table
        testResults.push('Testing admin_notifications table...')
        const { data: notifications, error: notificationsError } = await supabaseAdmin
          .from('admin_notifications')
          .select('id')
          .limit(1)
        
        if (notificationsError) {
          testResults.push(`❌ Admin notifications error: ${notificationsError.message}`)
        } else {
          testResults.push(`✅ Admin notifications success: ${notifications?.length || 0} records`)
        }

      } catch (error) {
        testResults.push(`❌ Unexpected error: ${error}`)
      }
      
      setResults(testResults)
    }

    testAdminAccess()
  }, [])

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Admin Client Test Results</h3>
      <div className="space-y-2">
        {results.map((result, index) => (
          <div key={index} className="text-sm font-mono bg-white p-2 rounded">
            {result}
          </div>
        ))}
      </div>
    </div>
  )
}
