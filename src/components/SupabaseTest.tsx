import React, { useEffect, useState } from 'react'
import { supabaseAdmin } from '../lib/supabase'

export default function SupabaseTest() {
  const [testResult, setTestResult] = useState<string>('Testing...')
  const [customerCount, setCustomerCount] = useState<number>(0)

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...')
        
        // Test basic connection
        const { count, error } = await supabaseAdmin
          .from('customers')
          .select('*', { count: 'exact', head: true })
          
        if (error) {
          console.error('Supabase error:', error)
          setTestResult(`ERROR: ${error.message}`)
          return
        }

        console.log('Customer count:', count)
        setCustomerCount(count || 0)
        setTestResult(`SUCCESS: Connected to Supabase. Found ${count} customers.`)
        
        // Test actual data fetch
        const { data: sampleCustomers, error: fetchError } = await supabaseAdmin
          .from('customers')
          .select('id, email, first_name, last_name')
          .limit(3)
          
        if (fetchError) {
          console.error('Data fetch error:', fetchError)
          setTestResult(`CONNECTION OK but FETCH FAILED: ${fetchError.message}`)
          return
        }
        
        console.log('Sample customers:', sampleCustomers)
        setTestResult(`FULLY WORKING: ${count} customers total, sample: ${JSON.stringify(sampleCustomers?.slice(0, 2))}`)
        
      } catch (err) {
        console.error('Test failed:', err)
        setTestResult(`EXCEPTION: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
    
    testConnection()
  }, [])

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
      <h3 className="font-bold text-yellow-800">Supabase Connection Test</h3>
      <p className="text-yellow-700 mt-2">{testResult}</p>
      {customerCount > 0 && (
        <p className="text-green-700 mt-1">✅ Database connection working with {customerCount} customers</p>
      )}
    </div>
  )
}
