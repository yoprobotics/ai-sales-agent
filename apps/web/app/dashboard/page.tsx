'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChartBarIcon,
  UsersIcon,
  EnvelopeIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalProspects: number
  qualifiedProspects: number
  activeSequences: number
  emailsSent: number
  responseRate: number
  conversionRate: number
}

const mockStats: DashboardStats = {
  totalProspects: 1234,
  qualifiedProspects: 456,
  activeSequences: 12,
  emailsSent: 3456,
  responseRate: 23.5,
  conversionRate: 8.7,
}

const quickActions = [
  {
    name: 'Import Prospects',
    description: 'Upload CSV or paste URLs',
    icon: UsersIcon,
    href: '/prospects/import',
    color: 'bg-blue-500',
  },
  {
    name: 'Create Sequence',
    description: 'Design email campaigns',
    icon: EnvelopeIcon,
    href: '/sequences/new',
    color: 'bg-purple-500',
  },
  {
    name: 'View Pipeline',
    description: 'Manage your sales funnel',
    icon: ChartBarIcon,
    href: '/pipeline',
    color: 'bg-green-500',
  },
  {
    name: 'AI Insights',
    description: 'Get recommendations',
    icon: SparklesIcon,
    href: '/insights',
    color: 'bg-orange-500',
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState({ firstName: 'User', email: '' })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      setUser({ firstName: 'John', email: 'john@example.com' })
      setLoading(false)
    }, 500)
  }, [])
  
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <SparklesIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="text-xl font-bold text-slate-900 dark:text-white">AI Sales Agent</span>
              </div>
              <div className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-sm font-medium text-slate-900 dark:text-white">
                  Dashboard
                </Link>
                <Link href="/prospects" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  Prospects
                </Link>
                <Link href="/sequences" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  Sequences
                </Link>
                <Link href="/analytics" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  Analytics
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <Cog6ToothIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Here's what's happening with your sales pipeline today.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Total Prospects</span>
              <UsersIcon className="h-5 w-5 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {mockStats.totalProspects.toLocaleString()}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              +12% from last month
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Qualified</span>
              <ArrowTrendingUpIcon className="h-5 w-5 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {mockStats.qualifiedProspects}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              +23% from last month
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Response Rate</span>
              <EnvelopeIcon className="h-5 w-5 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {mockStats.responseRate}%
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              +5% from last month
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Conversion</span>
              <ChartBarIcon className="h-5 w-5 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {mockStats.conversionRate}%
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">
              -2% from last month
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link
                  key={index}
                  href={action.href}
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow group"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {action.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-slate-900 dark:text-white">
                    45 new prospects imported from CSV
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-slate-900 dark:text-white">
                    Email sequence "Q1 Outreach" launched
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-slate-900 dark:text-white">
                    12 prospects moved to "Meeting" stage
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              AI Insights
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <SparklesIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      High engagement detected
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Prospects from "Tech Industry" showing 40% higher engagement
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <SparklesIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      Optimize send times
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      Tuesday 10-11 AM shows 25% better open rates
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <SparklesIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Follow-up recommended
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      23 prospects are ready for a second touchpoint
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
