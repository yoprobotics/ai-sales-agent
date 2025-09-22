'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  FunnelIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  ChevronDownIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Prospect {
  id: string
  name: string
  company: string
  email: string
  score: number
  value: number
  lastActivity: string
  nextAction: string
  assignee: string
  tags: string[]
}

interface Stage {
  id: string
  name: string
  nameFr: string
  color: string
  prospects: Prospect[]
  value: number
  conversion: number
}

export default function PipelinePage() {
  const [lang, setLang] = useState('en')
  const [selectedView, setSelectedView] = useState<'kanban' | 'list'>('kanban')
  const [searchQuery, setSearchQuery] = useState('')
  const [draggedProspect, setDraggedProspect] = useState<string | null>(null)
  const [draggedOverStage, setDraggedOverStage] = useState<string | null>(null)

  // Mock pipeline data
  const [stages, setStages] = useState<Stage[]>([
    {
      id: 'new',
      name: 'New Leads',
      nameFr: 'Nouveaux Leads',
      color: 'bg-gray-500',
      value: 125000,
      conversion: 100,
      prospects: [
        {
          id: '1',
          name: 'John Smith',
          company: 'TechCorp Inc',
          email: 'john@techcorp.com',
          score: 92,
          value: 25000,
          lastActivity: '2 hours ago',
          nextAction: 'Send intro email',
          assignee: 'You',
          tags: ['High Priority', 'SaaS']
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          company: 'Growth Co',
          email: 'sarah@growthco.com',
          score: 85,
          value: 15000,
          lastActivity: '5 hours ago',
          nextAction: 'LinkedIn connect',
          assignee: 'You',
          tags: ['Medium Priority', 'E-commerce']
        },
        {
          id: '3',
          name: 'Michael Chen',
          company: 'Innovation Labs',
          email: 'michael@innovationlabs.io',
          score: 78,
          value: 20000,
          lastActivity: '1 day ago',
          nextAction: 'Research company',
          assignee: 'You',
          tags: ['Tech', 'Startup']
        }
      ]
    },
    {
      id: 'contacted',
      name: 'Contacted',
      nameFr: 'Contactés',
      color: 'bg-blue-500',
      value: 85000,
      conversion: 68,
      prospects: [
        {
          id: '4',
          name: 'Emily Davis',
          company: 'Cloud Systems',
          email: 'emily@cloudsystems.com',
          score: 88,
          value: 35000,
          lastActivity: '3 hours ago',
          nextAction: 'Follow-up email',
          assignee: 'You',
          tags: ['Hot Lead', 'Enterprise']
        },
        {
          id: '5',
          name: 'Robert Wilson',
          company: 'DataTech Solutions',
          email: 'robert@datatech.com',
          score: 72,
          value: 18000,
          lastActivity: '6 hours ago',
          nextAction: 'Schedule call',
          assignee: 'You',
          tags: ['Follow-up', 'Analytics']
        }
      ]
    },
    {
      id: 'meeting',
      name: 'Meeting Scheduled',
      nameFr: 'RDV Programmé',
      color: 'bg-purple-500',
      value: 65000,
      conversion: 52,
      prospects: [
        {
          id: '6',
          name: 'Lisa Anderson',
          company: 'Finance Pro',
          email: 'lisa@financepro.com',
          score: 95,
          value: 45000,
          lastActivity: '1 hour ago',
          nextAction: 'Demo tomorrow 2PM',
          assignee: 'You',
          tags: ['Demo Scheduled', 'FinTech']
        }
      ]
    },
    {
      id: 'negotiation',
      name: 'Negotiation',
      nameFr: 'Négociation',
      color: 'bg-orange-500',
      value: 95000,
      conversion: 78,
      prospects: [
        {
          id: '7',
          name: 'David Brown',
          company: 'Global Retail',
          email: 'david@globalretail.com',
          score: 98,
          value: 55000,
          lastActivity: '30 minutes ago',
          nextAction: 'Send contract',
          assignee: 'You',
          tags: ['Contract Sent', 'Enterprise']
        }
      ]
    },
    {
      id: 'won',
      name: 'Won',
      nameFr: 'Gagné',
      color: 'bg-green-500',
      value: 120000,
      conversion: 100,
      prospects: [
        {
          id: '8',
          name: 'Jennifer Lee',
          company: 'Success Corp',
          email: 'jennifer@successcorp.com',
          score: 100,
          value: 75000,
          lastActivity: 'Today',
          nextAction: 'Onboarding',
          assignee: 'You',
          tags: ['Customer', 'Success']
        }
      ]
    }
  ])

  const handleDragStart = (prospectId: string) => {
    setDraggedProspect(prospectId)
  }

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    setDraggedOverStage(stageId)
  }

  const handleDragLeave = () => {
    setDraggedOverStage(null)
  }

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault()
    setDraggedOverStage(null)
    
    if (!draggedProspect) return

    setStages(prevStages => {
      const newStages = [...prevStages]
      let prospect: Prospect | undefined
      
      // Find and remove prospect from current stage
      for (const stage of newStages) {
        const index = stage.prospects.findIndex(p => p.id === draggedProspect)
        if (index !== -1) {
          prospect = stage.prospects.splice(index, 1)[0]
          break
        }
      }
      
      // Add prospect to target stage
      if (prospect) {
        const targetStage = newStages.find(s => s.id === targetStageId)
        if (targetStage) {
          targetStage.prospects.push(prospect)
          toast.success(
            lang === 'en' 
              ? `Moved ${prospect.name} to ${targetStage.name}`
              : `${prospect.name} déplacé vers ${targetStage.nameFr}`
          )
        }
      }
      
      return newStages
    })
    
    setDraggedProspect(null)
  }

  const totalValue = stages.reduce((sum, stage) => sum + stage.value, 0)
  const totalProspects = stages.reduce((sum, stage) => sum + stage.prospects.length, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                {lang === 'en' ? 'Back to Dashboard' : 'Retour au Tableau de bord'}
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedView('kanban')}
                className={`px-3 py-1 rounded text-sm ${
                  selectedView === 'kanban' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setSelectedView('list')}
                className={`px-3 py-1 rounded text-sm ${
                  selectedView === 'list' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {lang === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FunnelIcon className="h-8 w-8 mr-3 text-gray-400" />
              {lang === 'en' ? 'Sales Pipeline' : 'Pipeline de Ventes'}
            </h1>
            <div className="mt-2 flex items-center space-x-6 text-sm">
              <span className="flex items-center">
                <UserGroupIcon className="h-4 w-4 mr-1 text-gray-400" />
                <span className="font-medium">{totalProspects}</span>
                <span className="text-gray-500 ml-1">
                  {lang === 'en' ? 'prospects' : 'prospects'}
                </span>
              </span>
              <span className="flex items-center">
                <CurrencyDollarIcon className="h-4 w-4 mr-1 text-gray-400" />
                <span className="font-medium">${totalValue.toLocaleString()}</span>
                <span className="text-gray-500 ml-1">
                  {lang === 'en' ? 'total value' : 'valeur totale'}
                </span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Search prospects...' : 'Rechercher des prospects...'}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              {lang === 'en' ? 'Add Prospect' : 'Ajouter Prospect'}
            </button>
          </div>
        </div>

        {/* Pipeline Stages */}
        <div className="overflow-x-auto pb-3">
          <div className="inline-flex space-x-4 min-w-full">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="flex-1 min-w-[300px]"
              >
                {/* Stage Header */}
                <div className={`${stage.color} bg-opacity-10 rounded-t-lg p-4 border-t-4 ${
                  stage.color.replace('bg-', 'border-')
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {lang === 'en' ? stage.name : stage.nameFr}
                    </h3>
                    <span className="text-sm font-medium text-gray-600">
                      {stage.prospects.length}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    ${stage.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stage.conversion}% {lang === 'en' ? 'conversion' : 'conversion'}
                  </div>
                </div>

                {/* Stage Prospects */}
                <div
                  className={`bg-gray-50 min-h-[400px] p-2 space-y-2 ${
                    draggedOverStage === stage.id ? 'bg-blue-50' : ''
                  }`}
                  onDragOver={(e) => handleDragOver(e, stage.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  {stage.prospects.map((prospect) => (
                    <div
                      key={prospect.id}
                      draggable
                      onDragStart={() => handleDragStart(prospect.id)}
                      className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition cursor-move"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{prospect.name}</h4>
                          <p className="text-sm text-gray-500">{prospect.company}</p>
                        </div>
                        <div className="flex items-center">
                          <SparklesIcon className="h-4 w-4 text-purple-500 mr-1" />
                          <span className="text-sm font-medium text-purple-600">
                            {prospect.score}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        ${prospect.value.toLocaleString()}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{prospect.lastActivity}</span>
                        <span className="text-blue-600">{prospect.nextAction}</span>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {prospect.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-3 flex justify-between">
                        <button className="text-gray-400 hover:text-gray-600">
                          <EnvelopeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <PhoneIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <CalendarIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <ChevronDownIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {stage.prospects.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <UserGroupIcon className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">
                        {lang === 'en' ? 'No prospects' : 'Aucun prospect'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
          <div className="flex items-start">
            <SparklesIcon className="h-6 w-6 text-purple-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">
                {lang === 'en' ? 'Pipeline AI Insights' : 'Insights IA du Pipeline'}
              </h3>
              <div className="mt-2 space-y-2 text-sm text-gray-600">
                <p>
                  🔥 {lang === 'en' 
                    ? '3 prospects in "Meeting Scheduled" stage have high closing probability (>85%)'
                    : '3 prospects en phase "RDV Programmé" ont une forte probabilité de clôture (>85%)'}
                </p>
                <p>
                  ⚠️ {lang === 'en'
                    ? '2 prospects in "Contacted" stage need follow-up (no activity >3 days)'
                    : '2 prospects en phase "Contacté" nécessitent un suivi (pas d\'activité >3 jours)'}
                </p>
                <p>
                  📈 {lang === 'en'
                    ? 'Your conversion rate from "New" to "Contacted" improved by 15% this week'
                    : 'Votre taux de conversion de "Nouveau" à "Contacté" s\'est amélioré de 15% cette semaine'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}