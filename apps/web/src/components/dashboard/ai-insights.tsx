'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LightBulbIcon, ArrowTrendingUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Insight {
  id: string;
  type: 'recommendation' | 'trend' | 'alert';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
}

export function AIInsights() {
  const { data: insights, isLoading } = useQuery({
    queryKey: ['ai-insights'],
    queryFn: async (): Promise<Insight[]> => {
      // Mock data for now
      return [
        {
          id: '1',
          type: 'recommendation',
          title: 'Optimize Email Timing',
          description: 'Send emails on Tuesday mornings for 23% higher open rates based on your audience.',
          priority: 'high',
          actionable: true,
        },
        {
          id: '2',
          type: 'trend',
          title: 'Rising Engagement',
          description: 'Response rates increased 15% this week. Keep current messaging strategy.',
          priority: 'medium',
          actionable: false,
        },
        {
          id: '3',
          type: 'alert',
          title: 'Low Qualification Rate',
          description: 'Only 45% of prospects qualify. Consider refining ICP criteria.',
          priority: 'high',
          actionable: true,
        },
      ];
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'recommendation':
        return LightBulbIcon;
      case 'trend':
        return ArrowTrendingUpIcon;
      case 'alert':
        return ExclamationTriangleIcon;
      default:
        return LightBulbIcon;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {insights?.map((insight) => {
        const Icon = getIcon(insight.type);
        const priorityColor = getPriorityColor(insight.priority);

        return (
          <div
            key={insight.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${priorityColor}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {insight.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {insight.description}
                </p>
                {insight.actionable && (
                  <button className="text-xs text-blue-600 hover:text-blue-700 mt-2 font-medium">
                    Take Action →
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {!insights?.length && (
        <p className="text-sm text-gray-500 text-center py-4">
          No insights available
        </p>
      )}
    </div>
  );
}