'use client'

import { formatRelativeTime } from '@/lib/utils'

interface Activity {
  id: string
  type: 'prospect_added' | 'email_sent' | 'response_received' | 'meeting_scheduled'
  title: string
  description: string
  timestamp: Date
  icon?: string
}

export function RecentActivity() {
  // Mock data for now - will connect to API later
  const activities: Activity[] = [
    {
      id: '1',
      type: 'prospect_added',
      title: 'New prospect added',
      description: 'John Doe from Acme Corp',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    },
    {
      id: '2',
      type: 'email_sent',
      title: 'Email sequence started',
      description: '25 prospects in Tech ICP',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: '3',
      type: 'response_received',
      title: 'Response received',
      description: 'Sarah Smith interested in demo',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    },
  ]
  
  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="text-sm text-gray-500">No recent activity</p>
      ) : (
        activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs">📧</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {activity.title}
              </p>
              <p className="text-sm text-gray-500">
                {activity.description}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatRelativeTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}