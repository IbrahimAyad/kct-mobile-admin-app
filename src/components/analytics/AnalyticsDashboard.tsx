import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAnalytics } from '../../hooks/useAnalytics';
import { ExecutiveOverview } from './sections/ExecutiveOverview';
import { SalesIntelligence } from './sections/SalesIntelligence';
import { CustomerAnalytics } from './sections/CustomerAnalytics';
import { PredictiveAnalytics } from './sections/PredictiveAnalytics';
import { InventoryOptimization } from './sections/InventoryOptimization';
import { MarketIntelligence } from './sections/MarketIntelligence';
import { 
  BarChart3, 
  Brain, 
  Users, 
  TrendingUp, 
  Package, 
  Globe, 
  RefreshCw, 
  Clock, 
  Zap 
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const {
    data,
    isLoading,
    error,
    timeframe,
    setTimeframe,
    refreshInterval,
    setRefreshInterval,
    refreshAnalytics
  } = useAnalytics();

  const [activeTab, setActiveTab] = useState('executive');

  const tabs = [
    {
      id: 'executive',
      label: 'Executive Overview',
      icon: BarChart3,
      component: ExecutiveOverview,
      description: 'High-level KPIs and business insights'
    },
    {
      id: 'sales',
      label: 'Sales Intelligence',
      icon: TrendingUp,
      component: SalesIntelligence,
      description: 'Sales optimization and performance analysis'
    },
    {
      id: 'customer',
      label: 'Customer Analytics',
      icon: Users,
      component: CustomerAnalytics,
      description: 'Customer behavior and segmentation insights'
    },
    {
      id: 'predictive',
      label: 'Predictive Analytics',
      icon: Brain,
      component: PredictiveAnalytics,
      description: 'AI-powered forecasting and predictions'
    },
    {
      id: 'inventory',
      label: 'Inventory Optimization',
      icon: Package,
      component: InventoryOptimization,
      description: 'Stock level optimization and management'
    },
    {
      id: 'market',
      label: 'Market Intelligence',
      icon: Globe,
      component: MarketIntelligence,
      description: 'Competitive analysis and market trends'
    }
  ];

  const getRefreshIntervalLabel = (interval: number) => {
    const minutes = interval / 60000;
    return minutes >= 60 ? `${minutes / 60}h` : `${minutes}m`;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Analytics Dashboard Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">
              Failed to load analytics data. Please check your connection and try again.
            </p>
            <Button onClick={refreshAnalytics} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                <span>AI-Enhanced Analytics</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Advanced business intelligence powered by KCT Knowledge API
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Timeframe Selector */}
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-36 sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="6m">Last 6 months</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Refresh Interval */}
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-gray-500" />
                <Select 
                  value={refreshInterval.toString()} 
                  onValueChange={(value) => setRefreshInterval(parseInt(value))}
                >
                  <SelectTrigger className="w-20 sm:w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60000">1m</SelectItem>
                    <SelectItem value="300000">5m</SelectItem>
                    <SelectItem value="900000">15m</SelectItem>
                    <SelectItem value="1800000">30m</SelectItem>
                    <SelectItem value="3600000">1h</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Manual Refresh */}
              <Button 
                onClick={refreshAnalytics} 
                variant="outline" 
                size="sm"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation - Mobile Optimized */}
          <div className="bg-white rounded-lg border border-gray-200 p-2">
            <TabsList className="grid w-full lg:grid-cols-6 sm:grid-cols-3 grid-cols-2 gap-2 bg-transparent">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex flex-col items-center space-y-1 sm:space-y-2 p-2 sm:p-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 border border-transparent rounded-md transition-all min-h-[80px] sm:min-h-[100px]"
                  >
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                    <div className="text-center">
                      <div className="text-xs sm:text-sm font-medium leading-tight">
                        {tab.label.split(' ').map((word, index, arr) => (
                          <span key={index}>
                            {word}
                            {index < arr.length - 1 && <br className="sm:hidden" />}
                            {index < arr.length - 1 && <span className="hidden sm:inline"> </span>}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 hidden xl:block mt-1">
                        {tab.description}
                      </div>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Tab Content */}
          {tabs.map((tab) => {
            const ComponentToRender = tab.component;
            return (
              <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <tab.icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                      <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                          {tab.label}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {tab.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isLoading && (
                        <Badge variant="secondary" className="animate-pulse text-xs">
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          Loading...
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        Updated every {getRefreshIntervalLabel(refreshInterval)}
                      </Badge>
                    </div>
                  </div>
                  
                  <ComponentToRender 
                    data={data[tab.id as keyof typeof data]} 
                    isLoading={isLoading}
                  />
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    );
};