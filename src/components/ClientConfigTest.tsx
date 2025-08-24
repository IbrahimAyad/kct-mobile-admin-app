import React, { useEffect, useState } from 'react'
import { supabase, supabaseAdmin } from '../lib/supabase'

export function ClientConfigTest() {
  const [results, setResults] = useState<any>({
    regularClient: null,
    adminClient: null,
    error: null
  })

  useEffect(() => {
    const testClients = async () => {
      try {
        // Test regular client
        console.log('Testing regular client...')
        const { data: regularData, error: regularError } = await supabase
          .from('orders')
          .select('id')
          .limit(1)
        
        // Test admin client  
        console.log('Testing admin client...')
        const { data: adminData, error: adminError } = await supabaseAdmin
          .from('orders')
          .select('id')
          .limit(1)
        
        setResults({
          regularClient: {
            data: regularData,
            error: regularError?.message || null,
            success: !regularError
          },
          adminClient: {
            data: adminData,
            error: adminError?.message || null,
            success: !adminError
          },
          timestamp: new Date().toISOString()
        })

      } catch (err: any) {
        console.error('Client test error:', err)
        setResults({
          regularClient: null,
          adminClient: null,
          error: err.message
        })
      }
    }

    testClients()
  }, [])

  return (
    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-blue-800 mb-3">Client Configuration Test</h3>
      
      <div className="space-y-4">
        {/* Regular Client */}
        <div className={`p-3 rounded ${
          results.regularClient?.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
        }`}>
          <h4 className="font-semibold">Regular Supabase Client</h4>
          <p className="text-sm">
            Status: {results.regularClient?.success ? '✅ Success' : '❌ Failed'}
          </p>
          {results.regularClient?.error && (
            <p className="text-sm text-red-700">Error: {results.regularClient.error}</p>
          )}
          {results.regularClient?.data && (
            <p className="text-sm text-green-700">
              Data: {JSON.stringify(results.regularClient.data, null, 2)}
            </p>
          )}
        </div>

        {/* Admin Client */}
        <div className={`p-3 rounded ${
          results.adminClient?.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
        }`}>
          <h4 className="font-semibold">Admin Supabase Client</h4>
          <p className="text-sm">
            Status: {results.adminClient?.success ? '✅ Success' : '❌ Failed'}
          </p>
          {results.adminClient?.error && (
            <p className="text-sm text-red-700">Error: {results.adminClient.error}</p>
          )}
          {results.adminClient?.data && (
            <p className="text-sm text-green-700">
              Data: {JSON.stringify(results.adminClient.data, null, 2)}
            </p>
          )}
        </div>

        {results.error && (
          <div className="p-3 rounded bg-red-100 border border-red-300">
            <h4 className="font-semibold text-red-800">Test Error</h4>
            <p className="text-sm text-red-700">{results.error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
