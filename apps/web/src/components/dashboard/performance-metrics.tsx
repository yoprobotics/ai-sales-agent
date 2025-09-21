'use client';

import { useQuery } from '@tanstack/react-query';

interface Metric {
  name: string;
  value: number;
  target: number;
  unit: string;
}

interface PerformanceMetricsProps {
  timeRange: string;
}

export function PerformanceMetrics({ timeRange }: PerformanceMetricsProps) {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['performance-metrics', timeRange],
    queryFn: async (): Promise<Metric[]> => {
      // Mock data for now
      return [
        {
          name: 'Qualification Rate',
          value: 68,
          target: 75,
          unit: '%',
        },
        {
          name: 'Response Rate',
          value: 12,
          target: 15,
          unit: '%',
        },
        {
          name: 'Meeting Booked',
          value: 8,
          target: 10,
          unit: '',
        },
        {
          name: 'Pipeline Value',
          value: 45000,
          target: 50000,
          unit: '$',
        },
      ];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {metrics?.map((metric) => {
        const percentage = (metric.value / metric.target) * 100;
        const isAboveTarget = percentage >= 100;

        return (
          <div key={metric.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {metric.name}
              </p>
              <span className="text-xs text-gray-500">
                Target: {metric.unit === '$' ? '$' : ''}
                {metric.target.toLocaleString()}
                {metric.unit === '%' ? '%' : ''}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {metric.unit === '$' ? '$' : ''}
                {metric.value.toLocaleString()}
                {metric.unit === '%' ? '%' : ''}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className={`h-2 rounded-full transition-all ${
                  isAboveTarget ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}