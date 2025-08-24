import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCustomer } from '../hooks/useData'
import { 
  ArrowLeft,
  Mail, 
  Phone, 
  Calendar, 
  DollarSign,
  ShoppingBag,
  MapPin,
  Star,
  User,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react'

export default function CustomerProfile() {
  const { customerId } = useParams()
  const { data: customer, isLoading, error } = useCustomer(customerId!)

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'prospect': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <div className="h-20 bg-neutral-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <div className="h-16 bg-neutral-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="space-y-6">
        <Link to="/customers" className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Customers
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load customer profile. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/customers" className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Customers
          </Link>
        </div>
      </div>

      {/* Customer Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            {/* Profile Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-neutral-200 flex items-center justify-center">
                    <span className="text-lg font-semibold text-neutral-700">
                      {getInitials(customer.first_name, customer.last_name)}
                    </span>
                  </div>
                  {customer.vip_status && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Star className="h-3 w-3 text-white fill-current" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-neutral-900">
                      {customer.first_name} {customer.last_name}
                    </h1>
                    {customer.vip_status && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        VIP Customer
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-600">{customer.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    {customer.customer_tier && (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTierColor(customer.customer_tier)}`}>
                        {customer.customer_tier} Tier
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      customer.account_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.account_status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-neutral-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{customer.email}</p>
                      <p className="text-xs text-neutral-500">Primary Email</p>
                    </div>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-neutral-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{customer.phone}</p>
                        <p className="text-xs text-neutral-500">Phone Number</p>
                      </div>
                    </div>
                  )}
                  {(customer.city || customer.state || customer.country) && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-neutral-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          {[customer.city, customer.state, customer.country].filter(Boolean).join(', ')}
                        </p>
                        <p className="text-xs text-neutral-500">Location</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Customer Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-neutral-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{formatDate(customer.created_at)}</p>
                      <p className="text-xs text-neutral-500">Member Since</p>
                    </div>
                  </div>
                  {customer.last_purchase_date && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-neutral-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{formatDate(customer.last_purchase_date)}</p>
                        <p className="text-xs text-neutral-500">Last Purchase</p>
                      </div>
                    </div>
                  )}
                  {customer.engagement_score && (
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-neutral-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{customer.engagement_score}%</p>
                        <p className="text-xs text-neutral-500">Engagement Score</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          {customer.orders && customer.orders.length > 0 && (
            <div className="bg-white rounded-lg border border-neutral-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {customer.orders.slice(0, 5).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                    <div>
                      <p className="font-medium text-neutral-900">{order.order_number}</p>
                      <p className="text-sm text-neutral-500">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-neutral-900">{formatCurrency(order.total_amount)}</p>
                      <p className={`text-sm capitalize ${
                        order.status === 'completed' ? 'text-green-600' : 
                        order.status === 'pending' ? 'text-yellow-600' : 
                        'text-neutral-500'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Purchase Stats */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Purchase Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-neutral-600">Total Orders</span>
                </div>
                <span className="text-lg font-semibold text-neutral-900">{customer.total_orders || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-neutral-600">Total Spent</span>
                </div>
                <span className="text-lg font-semibold text-green-600">
                  {formatCurrency(customer.total_spent || 0)}
                </span>
              </div>
              
              {customer.average_order_value && parseFloat(customer.average_order_value) > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="text-sm text-neutral-600">Average Order</span>
                  </div>
                  <span className="text-lg font-semibold text-purple-600">
                    {formatCurrency(customer.average_order_value)}
                  </span>
                </div>
              )}
              
              {customer.lifetime_value && parseFloat(customer.lifetime_value) > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-orange-600 mr-2" />
                    <span className="text-sm text-neutral-600">Lifetime Value</span>
                  </div>
                  <span className="text-lg font-semibold text-orange-600">
                    {formatCurrency(customer.lifetime_value)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Attributes */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Customer Attributes</h3>
            <div className="space-y-3">
              {customer.repeat_customer && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Repeat Customer
                </span>
              )}
              {customer.customer_segment && (
                <div>
                  <p className="text-sm text-neutral-600">Segment</p>
                  <p className="font-medium text-neutral-900 capitalize">{customer.customer_segment}</p>
                </div>
              )}
              {customer.primary_occasion && (
                <div>
                  <p className="text-sm text-neutral-600">Primary Occasion</p>
                  <p className="font-medium text-neutral-900 capitalize">{customer.primary_occasion}</p>
                </div>
              )}
              {customer.acquisition_source && (
                <div>
                  <p className="text-sm text-neutral-600">Acquired Via</p>
                  <p className="font-medium text-neutral-900 capitalize">{customer.acquisition_source}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}