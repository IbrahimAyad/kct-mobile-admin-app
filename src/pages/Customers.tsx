import React, { useState } from 'react'
import { useCustomers } from '../hooks/useData'
import { Link } from 'react-router-dom'
import SupabaseTest from '../components/SupabaseTest'
import { 
  Search, 
  Plus, 
  Eye, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign,
  ShoppingBag,
  User,
  Users,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react'

export default function Customers() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const limit = 20

  const { data, isLoading, error } = useCustomers(page, limit, search)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount || 0)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Customers</h2>
            <p className="text-sm text-neutral-500">Manage customer relationships and profiles</p>
          </div>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="animate-pulse">
                <div className="h-12 w-12 bg-neutral-200 rounded-full mb-4"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load customers. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Debug Component */}
      <SupabaseTest />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Customers</h2>
          <p className="text-sm text-neutral-500">
            Manage customer relationships and profiles
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-500">Total Customers</p>
              <p className="text-2xl font-bold text-neutral-900">
                {data?.total.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-500">New This Month</p>
              <p className="text-2xl font-bold text-neutral-900">
                {data?.customers.filter((customer: any) => {
                  const customerDate = new Date(customer.created_at)
                  const now = new Date()
                  return customerDate.getMonth() === now.getMonth() && customerDate.getFullYear() === now.getFullYear()
                }).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingBag className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-500">VIP Customers</p>
              <p className="text-2xl font-bold text-neutral-900">
                {data?.customers.filter((customer: any) => customer.vip_status).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-500">Avg. Customer Value</p>
              <p className="text-2xl font-bold text-neutral-900">
                {(() => {
                  const customers = data?.customers || []
                  const totalSpent = customers.reduce((sum: number, customer: any) => 
                    sum + (parseFloat(customer.total_spent || '0')), 0)
                  const avgValue = customers.length > 0 ? totalSpent / customers.length : 0
                  return formatCurrency(avgValue)
                })()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data?.customers.map((customer: any) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>

      {/* Empty State */}
      {data?.customers.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-neutral-400" />
          <h3 className="mt-2 text-sm font-medium text-neutral-900">No customers found</h3>
          <p className="mt-1 text-sm text-neutral-500">
            {search ? 'Try adjusting your search terms.' : 'Get started by adding your first customer.'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {data?.total && data.total > limit && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-neutral-200 rounded-lg">
          <div className="flex justify-between flex-1 sm:hidden">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!data.hasMore}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-neutral-700">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * limit, data.total)}
                </span>{' '}
                of <span className="font-medium">{data.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!data.hasMore}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Customer Card Component
function CustomerCard({ customer }: { customer: any }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount || 0)
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const getTierColor = (tier: string) => {
    switch(tier?.toLowerCase()) {
      case 'platinum': return 'bg-purple-100 text-purple-800'
      case 'gold': return 'bg-yellow-100 text-yellow-800'
      case 'silver': return 'bg-gray-100 text-gray-800'
      case 'prospect': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header with avatar and basic info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center relative">
              <span className="text-sm font-medium text-neutral-700">
                {getInitials(customer.first_name, customer.last_name)}
              </span>
              {customer.vip_status && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">★</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-neutral-900 truncate">
                {customer.first_name} {customer.last_name}
              </h3>
              {customer.vip_status && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  VIP
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 truncate">
              {customer.email}
            </p>
          </div>
        </div>
        {customer.customer_tier && (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTierColor(customer.customer_tier)}`}>
            {customer.customer_tier}
          </span>
        )}
      </div>

      {/* Customer metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-neutral-900">
            {customer.total_orders || 0}
          </p>
          <p className="text-xs text-neutral-500">Total Orders</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(customer.total_spent || 0)}
          </p>
          <p className="text-xs text-neutral-500">Total Spent</p>
        </div>
      </div>

      {/* Additional details */}
      <div className="space-y-2 text-xs text-neutral-500">
        {customer.phone && (
          <div className="flex items-center">
            <Phone className="h-3 w-3 mr-2" />
            <span className="truncate">{customer.phone}</span>
          </div>
        )}
        
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-2" />
          <span>Joined {formatDate(customer.created_at)}</span>
        </div>
        
        {customer.last_purchase_date && (
          <div className="flex items-center">
            <ShoppingBag className="h-3 w-3 mr-2" />
            <span>Last order {formatDate(customer.last_purchase_date)}</span>
          </div>
        )}

        {customer.average_order_value && parseFloat(customer.average_order_value) > 0 && (
          <div className="flex items-center">
            <DollarSign className="h-3 w-3 mr-2" />
            <span>Avg: {formatCurrency(customer.average_order_value)}</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex items-center justify-between pt-4 border-t border-neutral-100">
        <div className="flex items-center space-x-1">
          {customer.repeat_customer && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Repeat
            </span>
          )}
          {customer.engagement_score && (
            <span className="text-xs text-neutral-500">
              Engagement: {customer.engagement_score}%
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Link
            to={`/customers/${customer.id}`}
            className="inline-flex items-center p-1.5 border border-neutral-300 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-50"
          >
            <Eye className="h-3 w-3" />
          </Link>
          <a
            href={`mailto:${customer.email}`}
            className="inline-flex items-center p-1.5 border border-neutral-300 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-50"
          >
            <Mail className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}