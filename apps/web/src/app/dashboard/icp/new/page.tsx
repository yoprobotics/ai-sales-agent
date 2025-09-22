'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  GlobeAmericasIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XMarkIcon,
  SparklesIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function NewICPPage() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [step, setStep] = useState(1)
  
  // Form state
  const [icpData, setIcpData] = useState({
    name: '',
    description: '',
    industries: [] as string[],
    companySizes: [] as string[],
    revenue: '',
    locations: [] as string[],
    keywords: [] as string[],
    jobTitles: [] as string[],
    technologies: [] as string[],
    exclusions: [] as string[]
  })

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education',
    'Manufacturing', 'Real Estate', 'Consulting', 'Marketing', 'Legal'
  ]

  const companySizes = [
    { id: 'startup', label: 'Startup (1-10)', labelFr: 'Startup (1-10)' },
    { id: 'small', label: 'Small (11-50)', labelFr: 'Petite (11-50)' },
    { id: 'medium', label: 'Medium (51-200)', labelFr: 'Moyenne (51-200)' },
    { id: 'large', label: 'Large (201-1000)', labelFr: 'Grande (201-1000)' },
    { id: 'enterprise', label: 'Enterprise (1000+)', labelFr: 'Entreprise (1000+)' }
  ]

  const revenueRanges = [
    { id: 'under_1m', label: 'Under $1M', labelFr: 'Moins de 1M$' },
    { id: '1m_10m', label: '$1M - $10M', labelFr: '1M$ - 10M$' },
    { id: '10m_50m', label: '$10M - $50M', labelFr: '10M$ - 50M$' },
    { id: '50m_100m', label: '$50M - $100M', labelFr: '50M$ - 100M$' },
    { id: 'over_100m', label: 'Over $100M', labelFr: 'Plus de 100M$' }
  ]

  const jobTitleSuggestions = [
    'CEO', 'CTO', 'VP Sales', 'VP Marketing', 'Director', 'Manager',
    'Head of Sales', 'Head of Marketing', 'Business Development', 'Product Manager'
  ]

  const technologySuggestions = [
    'Salesforce', 'HubSpot', 'Microsoft 365', 'Google Workspace', 'AWS',
    'Azure', 'Slack', 'Zoom', 'Shopify', 'WordPress'
  ]

  const toggleArrayItem = (array: string[], item: string): string[] => {
    if (array.includes(item)) {
      return array.filter(i => i !== item)
    }
    return [...array, item]
  }

  const handleSaveICP = () => {
    // Validation
    if (!icpData.name) {
      toast.error(lang === 'en' ? 'Please enter an ICP name' : 'Veuillez entrer un nom d\'ICP')
      return
    }
    if (icpData.industries.length === 0) {
      toast.error(lang === 'en' ? 'Please select at least one industry' : 'Veuillez sélectionner au moins une industrie')
      return
    }
    if (icpData.companySizes.length === 0) {
      toast.error(lang === 'en' ? 'Please select at least one company size' : 'Veuillez sélectionner au moins une taille d\'entreprise')
      return
    }

    // Save ICP (mock)
    toast.success(
      lang === 'en' 
        ? '🎉 ICP created successfully!' 
        : '🎉 ICP créé avec succès!'
    )
    setTimeout(() => {
      router.push('/dashboard/icp')
    }, 1500)
  }

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
            <button
              onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {lang === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {lang === 'en' ? 'Create Ideal Customer Profile' : 'Créer un Profil Client Idéal'}
          </h1>
          <p className="mt-2 text-gray-600">
            {lang === 'en' 
              ? 'Define your target market to help AI qualify prospects accurately'
              : 'Définissez votre marché cible pour aider l\'IA à qualifier les prospects avec précision'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${
              step >= 1 ? 'text-blue-600' : 'text-gray-400'
            }`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
              }`}>1</span>
              <span className="ml-2 text-sm font-medium">
                {lang === 'en' ? 'Basic Info' : 'Infos de Base'}
              </span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
            <div className={`flex items-center ${
              step >= 2 ? 'text-blue-600' : 'text-gray-400'
            }`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
              }`}>2</span>
              <span className="ml-2 text-sm font-medium">
                {lang === 'en' ? 'Targeting' : 'Ciblage'}
              </span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
            <div className={`flex items-center ${
              step >= 3 ? 'text-blue-600' : 'text-gray-400'
            }`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
              }`}>3</span>
              <span className="ml-2 text-sm font-medium">
                {lang === 'en' ? 'Refinement' : 'Affinement'}
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {lang === 'en' ? 'Basic Information' : 'Informations de Base'}
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === 'en' ? 'ICP Name' : 'Nom de l\'ICP'}
                </label>
                <input
                  type="text"
                  value={icpData.name}
                  onChange={(e) => setIcpData({ ...icpData, name: e.target.value })}
                  placeholder={lang === 'en' ? 'e.g., SaaS Startups' : 'ex: Startups SaaS'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === 'en' ? 'Description (Optional)' : 'Description (Optionnel)'}
                </label>
                <textarea
                  value={icpData.description}
                  onChange={(e) => setIcpData({ ...icpData, description: e.target.value })}
                  placeholder={lang === 'en' 
                    ? 'Describe your ideal customer...'
                    : 'Décrivez votre client idéal...'
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Link
                href="/dashboard"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                {lang === 'en' ? 'Cancel' : 'Annuler'}
              </Link>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {lang === 'en' ? 'Continue' : 'Continuer'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Targeting */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Industries */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-400" />
                {lang === 'en' ? 'Target Industries' : 'Industries Cibles'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {industries.map((industry) => (
                  <label
                    key={industry}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={icpData.industries.includes(industry)}
                      onChange={() => setIcpData({
                        ...icpData,
                        industries: toggleArrayItem(icpData.industries, industry)
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{industry}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Company Size */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2 text-gray-400" />
                {lang === 'en' ? 'Company Size' : 'Taille d\'Entreprise'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {companySizes.map((size) => (
                  <label
                    key={size.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={icpData.companySizes.includes(size.id)}
                      onChange={() => setIcpData({
                        ...icpData,
                        companySizes: toggleArrayItem(icpData.companySizes, size.id)
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {lang === 'en' ? size.label : size.labelFr}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Revenue Range */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
                {lang === 'en' ? 'Annual Revenue' : 'Chiffre d\'Affaires Annuel'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {revenueRanges.map((range) => (
                  <label
                    key={range.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="revenue"
                      value={range.id}
                      checked={icpData.revenue === range.id}
                      onChange={(e) => setIcpData({ ...icpData, revenue: e.target.value })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {lang === 'en' ? range.label : range.labelFr}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <GlobeAmericasIcon className="h-5 w-5 mr-2 text-gray-400" />
                {lang === 'en' ? 'Geographic Locations' : 'Emplacements Géographiques'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {['United States', 'Canada', 'United Kingdom', 'France', 'Germany', 'Australia'].map((location) => (
                  <button
                    key={location}
                    onClick={() => setIcpData({
                      ...icpData,
                      locations: toggleArrayItem(icpData.locations, location)
                    })}
                    className={`px-4 py-2 rounded-full text-sm transition ${
                      icpData.locations.includes(location)
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                {lang === 'en' ? 'Previous' : 'Précédent'}
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {lang === 'en' ? 'Continue' : 'Continuer'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Refinement */}
        {step === 3 && (
          <div className="space-y-6">
            {/* AI Suggestions */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
              <div className="flex items-start">
                <SparklesIcon className="h-6 w-6 text-purple-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {lang === 'en' ? 'AI Recommendations' : 'Recommandations IA'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {lang === 'en'
                      ? 'Based on your selections, we recommend also targeting:'
                      : 'Basé sur vos sélections, nous recommandons aussi de cibler:'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white rounded-full text-sm text-purple-700 border border-purple-200">
                      {lang === 'en' ? 'Decision Makers' : 'Décideurs'}
                    </span>
                    <span className="px-3 py-1 bg-white rounded-full text-sm text-purple-700 border border-purple-200">
                      {lang === 'en' ? 'Cloud Technologies' : 'Technologies Cloud'}
                    </span>
                    <span className="px-3 py-1 bg-white rounded-full text-sm text-purple-700 border border-purple-200">
                      {lang === 'en' ? 'Growth Stage' : 'Phase de Croissance'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Titles */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {lang === 'en' ? 'Target Job Titles' : 'Titres de Poste Cibles'}
              </h3>
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">
                  {lang === 'en' ? 'Quick add:' : 'Ajout rapide:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {jobTitleSuggestions.map((title) => (
                    <button
                      key={title}
                      onClick={() => {
                        if (!icpData.jobTitles.includes(title)) {
                          setIcpData({
                            ...icpData,
                            jobTitles: [...icpData.jobTitles, title]
                          })
                        }
                      }}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                    >
                      + {title}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {icpData.jobTitles.map((title, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center"
                  >
                    {title}
                    <button
                      onClick={() => setIcpData({
                        ...icpData,
                        jobTitles: icpData.jobTitles.filter((_, i) => i !== index)
                      })}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {lang === 'en' ? 'Technologies Used' : 'Technologies Utilisées'}
              </h3>
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">
                  {lang === 'en' ? 'Common technologies:' : 'Technologies courantes:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {technologySuggestions.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => {
                        if (!icpData.technologies.includes(tech)) {
                          setIcpData({
                            ...icpData,
                            technologies: [...icpData.technologies, tech]
                          })
                        }
                      }}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                    >
                      + {tech}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {icpData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center"
                  >
                    {tech}
                    <button
                      onClick={() => setIcpData({
                        ...icpData,
                        technologies: icpData.technologies.filter((_, i) => i !== index)
                      })}
                      className="ml-2 text-green-500 hover:text-green-700"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                {lang === 'en' ? 'Previous' : 'Précédent'}
              </button>
              <button
                onClick={handleSaveICP}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                {lang === 'en' ? 'Create ICP' : 'Créer l\'ICP'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}