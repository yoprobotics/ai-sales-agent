'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  UserGroupIcon,
  EnvelopeIcon,
  ChartBarIcon,
  TrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  PlusIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { SparklesIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [lang, setLang] = useState('en')
  const [isLoading, setIsLoading] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token) {
      router.push('/login')
      return
    }
    
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success(lang === 'en' ? 'Logged out successfully' : 'Déconnexion réussie')
    router.push('/login')
  }

  // Mock data for demonstration
  const stats = [
    {
      name: lang === 'en' ? 'Total Prospects' : 'Total Prospects',
      value: '2,847',
      change: '+12.5%',
      changeType: 'increase',
      icon: UserGroupIcon,
      color: 'bg-blue-500'
    },
    {
      name: lang === 'en' ? 'Qualified Leads' : 'Leads Qualifiés',
      value: '423',
      change: '+23.1%',
      changeType: 'increase',
      icon: TrendingUpIcon,
      color: 'bg-green-500'
    },
    {
      name: lang === 'en' ? 'Emails Sent' : 'Emails Envoyés',
      value: '1,259',
      change: '-5.4%',
      changeType: 'decrease',
      icon: EnvelopeIcon,
      color: 'bg-purple-500'
    },
    {
      name: lang === 'en' ? 'Response Rate' : 'Taux de Réponse',
      value: '18.2%',
      change: '+4.3%',
      changeType: 'increase',
      icon: ChartBarIcon,
      color: 'bg-orange-500'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'prospect',
      message: lang === 'en' 
        ? '12 new prospects imported from CSV'
        : '12 nouveaux prospects importés depuis CSV',
      time: '2 hours ago',
      icon: UserGroupIcon
    },
    {
      id: 2,
      type: 'email',
      message: lang === 'en'
        ? 'Sequence "Q1 Outreach" completed'
        : 'Séquence "Q1 Outreach" terminée',
      time: '4 hours ago',
      icon: EnvelopeIcon
    },
    {
      id: 3,
      type: 'ai',
      message: lang === 'en'
        ? 'AI qualified 28 new prospects'
        : 'IA a qualifié 28 nouveaux prospects',
      time: '6 hours ago',
      icon: SparklesIcon
    }
  ]

  const aiInsights = [
    {
      id: 1,
      title: lang === 'en' 
        ? '🎯 High-Value Prospects Identified'
        : '🎯 Prospects à Haute Valeur Identifiés',
      description: lang === 'en'
        ? '15 prospects show strong buying signals based on recent activity'
        : '15 prospects montrent de forts signaux d\'achat basés sur l\'activité récente',
      action: lang === 'en' ? 'View Prospects' : 'Voir les Prospects'
    },
    {
      id: 2,
      title: lang === 'en'
        ? '📧 Optimize Email Timing'
        : '📧 Optimiser le Timing des Emails',
      description: lang === 'en'
        ? 'Your audience is most active between 9-11 AM EST'
        : 'Votre audience est plus active entre 9h-11h EST',
      action: lang === 'en' ? 'Update Schedule' : 'Mettre à jour'
    },
    {
      id: 3,
      title: lang === 'en'
        ? '📈 Sequence Performance Alert'
        : '📈 Alerte Performance de Séquence',
      description: lang === 'en'
        ? '"Product Launch" sequence has 3x higher conversion'
        : 'La séquence "Product Launch" a 3x plus de conversion',
      action: lang === 'en' ? 'Analyze' : 'Analyser'
    }
  ]

  const quickActions = [
    {
      title: lang === 'en' ? 'Import Prospects' : 'Importer des Prospects',
      description: lang === 'en' ? 'Add from CSV or URL' : 'Ajouter depuis CSV ou URL',
      icon: PlusIcon,
      href: '/dashboard/import',
      color: 'bg-blue-500'
    },
    {
      title: lang === 'en' ? 'Create Sequence' : 'Créer une Séquence',
      description: lang === 'en' ? 'New email campaign' : 'Nouvelle campagne email',
      icon: EnvelopeIcon,
      href: '/dashboard/sequences/new',
      color: 'bg-green-500'
    },
    {
      title: lang === 'en' ? 'View Pipeline' : 'Voir le Pipeline',
      description: lang === 'en' ? 'Track your deals' : 'Suivre vos affaires',
      icon: ChartBarIcon,
      href: '/dashboard/pipeline',
      color: 'bg-purple-500'
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <div className="flex items-center">
              <span className="text-2xl">🚀</span>
              <span className="ml-2 text-xl font-bold text-gray-900">AI Sales Agent</span>
              
              {/* Search */}
              <div className="ml-8 relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={lang === 'en' ? 'Search prospects...' : 'Rechercher des prospects...'}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-96"
                />
              </div>
            </div>
            
            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <button
                onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {lang === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
              </button>
              
              {/* Notifications */}
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-gray-500 hover:text-gray-700"
              >
                <BellIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Settings */}
              <Link href="/dashboard/settings" className="text-gray-500 hover:text-gray-700">
                <Cog6ToothIcon className="h-6 w-6" />
              </Link>
              
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.companyName || 'Demo Account'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {lang === 'en' 
              ? `Welcome back, ${user?.firstName || 'User'}!` 
              : `Bon retour, ${user?.firstName || 'Utilisateur'}!`}
          </h1>
          <p className="mt-2 text-gray-600">
            {lang === 'en'
              ? "Here's what's happening with your sales today"
              : "Voici ce qui se passe avec vos ventes aujourd'hui"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                  <div className="mt-2 flex items-center">
                    {stat.changeType === 'increase' ? (
                      <ArrowUpIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`ml-1 text-sm ${
                      stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="ml-1 text-sm text-gray-500">
                      {lang === 'en' ? 'vs last week' : 'vs semaine dernière'}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {lang === 'en' ? 'Quick Actions' : 'Actions Rapides'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition group"
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Insights */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <SparklesIcon className="h-6 w-6 text-purple-500 mr-2" />
                  {lang === 'en' ? 'AI Insights' : 'Insights IA'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className="border-l-4 border-purple-500 pl-4 py-2">
                    <h3 className="font-medium text-gray-900">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <button className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
                      {insight.action} →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {lang === 'en' ? 'Recent Activity' : 'Activité Récente'}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="bg-gray-100 rounded-lg p-2">
                        <activity.icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  {lang === 'en' ? 'View All Activity' : 'Voir Toute l\'Activité'} →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}