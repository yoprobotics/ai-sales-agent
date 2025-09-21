'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
}

export function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async (): Promise<Activity[]> => {
      // Mock data for now
      return [
        {
          id: '1',
          type: 'prospect_qualified',
          title: 'New Qualified Prospect',
          description: 'John Doe from Acme Corp scored 85/100',
          timestamp: '2 hours ago',
        },
        {
          id: '2',
          type: 'email_sent',
          title: 'Email Campaign Started',
          description: 'Sent to 50 prospects in Tech ICP',
          timestamp: '5 hours ago',
        },
        {
          id: '3',
          type: 'response_received',
          title: 'New Response',
          description: 'Sarah Miller replied to your sequence',
          timestamp: '1 day ago',
        },
      ];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities?.map((activity) => (
        <div key={activity.id} className="border-l-2 border-gray-200 pl-4 pb-4 last:pb-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {activity.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                {activity.timestamp}
              </p>
            </div>
          </div>
        </div>
      ))}
      {!activities?.length && (
        <p className="text-sm text-gray-500 text-center py-4">
          No recent activity
        </p>
      )}
    </div>
  );
}