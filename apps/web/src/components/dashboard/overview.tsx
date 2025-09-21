'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  EnvelopeIcon, 
  TrendingUpIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { ProspectChart } from '@/components/dashboard/prospect-chart';
import { PerformanceMetrics } from '@/components/dashboard/performance-metrics';
import { AIInsights } from '@/components/dashboard/ai-insights';
import { useAuth } from '@/hooks/use-auth';
import { useI18n } from '@/hooks/use-i18n';
import { formatNumber, formatPercentage } from '@ai-sales-agent/core';

interface DashboardStats {
  totalProspects: number;
  qualifiedProspects: number;
  emailsSent: number;
  responseRate: number;
  pipelineValue: number;
  activeSequences: number;
  weeklyGrowth: {
    prospects: number;
    emails: number;
    responses: number;
  };
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
}

export function DashboardOverview() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', selectedTimeRange],
    queryFn: async (): Promise<DashboardStats> => {
      const response = await fetch(`/api/dashboard/stats?timeRange=${selectedTimeRange}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });

  // Quick actions for getting started
  const quickActions: QuickAction[] = [
    {
      id: 'create-icp',
      title: t('dashboard.quickActions.createICP'),
      description: t('dashboard.quickActions.createICPDesc'),
      icon: UserGroupIcon,
      href: '/dashboard/icps/new',
      color: 'bg-blue-500',
    },
    {
      id: 'import-prospects',
      title: t('dashboard.quickActions.importProspects'),
      description: t('dashboard.quickActions.importProspectsDesc'),
      icon: PlusIcon,
      href: '/dashboard/prospects/import',
      color: 'bg-green-500',
    },
    {
      id: 'create-sequence',
      title: t('dashboard.quickActions.createSequence'),
      description: t('dashboard.quickActions.createSequenceDesc'),
      icon: EnvelopeIcon,
      href: '/dashboard/sequences/new',
      color: 'bg-purple-500',
    },
    {
      id: 'view-reports',
      title: t('dashboard.quickActions.viewReports'),
      description: t('dashboard.quickActions.viewReportsDesc'),
      icon: ChartBarIcon,
      href: '/dashboard/reports',
      color: 'bg-orange-500',
    },
  ];

  // Stats cards configuration
  const statsCards = [
    {
      title: t('dashboard.stats.totalProspects'),
      value: stats?.totalProspects || 0,
      change: stats?.weeklyGrowth.prospects || 0,
      icon: UserGroupIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('dashboard.stats.qualifiedProspects'),
      value: stats?.qualifiedProspects || 0,
      change: ((stats?.qualifiedProspects || 0) / (stats?.totalProspects || 1)) * 100,
      icon: TrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      isPercentage: true,
    },
    {
      title: t('dashboard.stats.emailsSent'),
      value: stats?.emailsSent || 0,
      change: stats?.weeklyGrowth.emails || 0,
      icon: EnvelopeIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: t('dashboard.stats.responseRate'),
      value: stats?.responseRate || 0,
      change: stats?.weeklyGrowth.responses || 0,
      icon: ChartBarIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      isPercentage: true,
      showAsPercentage: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('dashboard.welcome', { name: user?.firstName || 'User' })}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('dashboard.subtitle')}
          </p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex space-x-2">
          {['7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              variant={selectedTimeRange === range ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange(range)}
            >
              {t(`dashboard.timeRange.${range}`)}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const value = stat.showAsPercentage 
            ? formatPercentage(stat.value / 100)
            : formatNumber(stat.value);
          const changeValue = stat.isPercentage 
            ? formatPercentage(stat.change / 100)
            : stat.change;
          const isPositive = stat.change >= 0;

          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {statsLoading ? (
                      <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ) : (
                      value
                    )}
                  </p>
                  {!statsLoading && (
                    <div className="flex items-center mt-2">
                      <Badge 
                        variant={isPositive ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {isPositive ? '+' : ''}{changeValue}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {t('dashboard.vsLastWeek')}
                      </span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Card key={action.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts and Performance */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {t('dashboard.charts.prospectTrends')}
              </h2>
              <Button variant="outline" size="sm">
                <EyeIcon className="h-4 w-4 mr-2" />
                {t('common.viewDetails')}
              </Button>
            </div>
            <ProspectChart timeRange={selectedTimeRange} />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              {t('dashboard.performance.title')}
            </h2>
            <PerformanceMetrics timeRange={selectedTimeRange} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* AI Insights */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              {t('dashboard.insights.title')}
            </h2>
            <AIInsights />
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              {t('dashboard.activity.title')}
            </h2>
            <RecentActivity />
          </Card>
        </div>
      </div>
    </div>
  );
}