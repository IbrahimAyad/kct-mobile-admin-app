import React, { useState, useEffect } from 'react'
import { supabase, supabaseAdmin } from '../lib/supabase'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
  details?: any
}

export function DebugPanel() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    const testResults: TestResult[] = []

    // Test 1: Check supabase admin client connection
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('id')
        .limit(1)
      
      testResults.push({
        name: 'Admin Client - Orders Table',
        status: error ? 'error' : 'success',
        message: error ? `Error: ${error.message}` : 'Successfully connected to orders table',
        details: error || data
      })
    } catch (err: any) {
      testResults.push({
        name: 'Admin Client - Orders Table',
        status: 'error',
        message: `Exception: ${err.message}`,
        details: err
      })
    }

    // Test 2: Check admin_notifications table
    try {
      const { data, error } = await supabaseAdmin
        .from('admin_notifications')
        .select('id')
        .limit(1)
      
      testResults.push({
        name: 'Admin Client - Notifications Table',
        status: error ? 'error' : 'success',
        message: error ? `Error: ${error.message}` : 'Successfully connected to notifications table',
        details: error || data
      })
    } catch (err: any) {
      testResults.push({
        name: 'Admin Client - Notifications Table',
        status: 'error',
        message: `Exception: ${err.message}`,
        details: err
      })
    }

    // Test 3: Check products table
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('id')
        .limit(1)
      
      testResults.push({
        name: 'Admin Client - Products Table',
        status: error ? 'error' : 'success',
        message: error ? `Error: ${error.message}` : 'Successfully connected to products table',
        details: error || data
      })
    } catch (err: any) {
      testResults.push({
        name: 'Admin Client - Products Table',
        status: 'error',
        message: `Exception: ${err.message}`,
        details: err
      })
    }

    // Test 4: Check regular client for comparison
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id')
        .limit(1)
      
      testResults.push({
        name: 'Regular Client - Orders Table',
        status: error ? 'error' : 'success',
        message: error ? `Error: ${error.message}` : 'Successfully connected with regular client',
        details: error || data
      })
    } catch (err: any) {
      testResults.push({
        name: 'Regular Client - Orders Table',
        status: 'error',
        message: `Exception: ${err.message}`,
        details: err
      })
    }

    // Test 5: Check service role configuration
    try {
      const adminConfig = supabaseAdmin.supabaseKey
      const regularConfig = supabase.supabaseKey
      
      testResults.push({
        name: 'Key Configuration Check',
        status: 'success',
        message: `Admin key: ${adminConfig?.slice(0, 20)}..., Regular key: ${regularConfig?.slice(0, 20)}...`,
        details: { adminKey: adminConfig?.slice(0, 50), regularKey: regularConfig?.slice(0, 50) }
      })
    } catch (err: any) {
      testResults.push({
        name: 'Key Configuration Check',
        status: 'error',
        message: `Exception: ${err.message}`,
        details: err
      })
    }

    setTests(testResults)
    setIsRunning(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-yellow-800">Debug Panel - Database Connection Tests</h3>
        <button 
          onClick={runTests}
          disabled={isRunning}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </button>
      </div>
      
      <div className="space-y-3">
        {tests.map((test, index) => (
          <div key={index} className={`p-3 rounded border ${
            test.status === 'success' ? 'bg-green-50 border-green-200' : 
            test.status === 'error' ? 'bg-red-50 border-red-200' : 
            'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${
                test.status === 'success' ? 'bg-green-500' :
                test.status === 'error' ? 'bg-red-500' :
                'bg-gray-400'
              }`}></span>
              <span className="font-medium">{test.name}</span>
            </div>
            <p className="text-sm mt-1">{test.message}</p>
            {test.details && (
              <details className="mt-2">
                <summary className="text-xs cursor-pointer text-gray-600">Show Details</summary>
                <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(test.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
