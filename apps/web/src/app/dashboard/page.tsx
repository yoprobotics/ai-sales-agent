'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  EnvelopeIcon, 
  TrendingUpIcon,
  CogIcon,
  PowerIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalProspects: number
  qualifiedProspects: number
  emailsSent: number
  responseRate: number
  activeSequences: number
  totalICPs: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProspects: 0,
    qualifiedProspects: 0,
    emailsSent: 0,
    responseRate: 0,
    activeSequences: 0,
    totalICPs: 0,
  })
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch user and stats data
    // For now, simulate loading
    setTimeout(() => {
      setUser({
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        plan: 'STARTER',
      })
      setStats({
        totalProspects: 156,
        qualifiedProspects: 89,
        emailsSent: 234,
        responseRate: 12.5,
        activeSequences: 3,
        totalICPs: 2,
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const statsCards = [
    {
      title: 'Total Prospects',
      value: stats.totalProspects.toLocaleString(),
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Qualified Prospects',
      value: stats.qualifiedProspects.toLocaleString(),
      icon: TrendingUpIcon,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Emails Sent',
      value: stats.emailsSent.toLocaleString(),
      icon: EnvelopeIcon,
      color: 'bg-purple-500',
      change: '+25%',
    },
    {
      title: 'Response Rate',
      value: `${stats.responseRate}%`,
      icon: ChartBarIcon,
      color: 'bg-orange-500',
      change: '+3%',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Sales Agent
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Welcome, {user?.firstName}!
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <PowerIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Overview of your AI Sales Agent performance</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`p-3 rounded-md ${stat.color}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {stat.title}
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stat.value}
                            </div>
                            <div className="ml-2 text-sm font-medium text-green-600">
                              {stat.change}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Create ICP
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Define your ideal customer profile to target the right prospects.</p>
                </div>
                <div className="mt-5">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Create ICP
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Import Prospects
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Upload CSV files or scrape URLs to add new prospects.</p>
                </div>
                <div className="mt-5">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Import Data
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Create Sequence
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Set up automated email sequences for your prospects.</p>
                </div>
                <div className="mt-5">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                    Create Sequence
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Imported 25 new prospects from CSV
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <EnvelopeIcon className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Email sequence "Introduction" sent to 15 prospects
                    </p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <TrendingUpIcon className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Qualified 12 prospects with AI scoring
                    </p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
                  </div>
                </div>
                
                <div className="text-center pt-4">
                  <button className="text-sm text-primary-600 hover:text-primary-500">
                    View all activity
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">AI Insights</h3>
                <p className="text-blue-100 mt-1">
                  Your response rate increased by 15% this week. Consider expanding your "SaaS Startup" ICP.
                </p>
              </div>
              <div className="flex-shrink-0">
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
