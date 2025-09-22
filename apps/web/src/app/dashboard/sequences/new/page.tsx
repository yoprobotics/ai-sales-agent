'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  ClockIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  SparklesIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  ChartBarIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface SequenceStep {
  id: string
  subject: string
  content: string
  delayDays: number
  conditions: string[]
}

export default function NewSequencePage() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [sequenceName, setSequenceName] = useState('')
  const [selectedICP, setSelectedICP] = useState('')
  const [steps, setSteps] = useState<SequenceStep[]>([
    {
      id: '1',
      subject: '',
      content: '',
      delayDays: 0,
      conditions: []
    }
  ])
  const [activeStep, setActiveStep] = useState(0)
  const [showAIAssist, setShowAIAssist] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock ICPs
  const icps = [
    { id: '1', name: 'SaaS Startups' },
    { id: '2', name: 'E-commerce B2B' },
    { id: '3', name: 'Financial Services' }
  ]

  // Email templates
  const templates = [
    {
      name: lang === 'en' ? 'Introduction' : 'Introduction',
      subject: lang === 'en' 
        ? 'Quick question about {{company}}' 
        : 'Question rapide à propos de {{company}}',
      content: lang === 'en'
        ? `Hi {{firstName}},\n\nI noticed that {{company}} is growing rapidly in the {{industry}} space. Many similar companies struggle with {{pain_point}}.\n\nWe've helped companies like {{similar_company}} achieve {{benefit}}.\n\nWorth a quick chat?\n\nBest,\n{{sender_name}}`
        : `Bonjour {{firstName}},\n\nJ'ai remarqué que {{company}} connaît une croissance rapide dans le secteur {{industry}}. De nombreuses entreprises similaires ont des difficultés avec {{pain_point}}.\n\nNous avons aidé des entreprises comme {{similar_company}} à atteindre {{benefit}}.\n\nÇa vaut le coup d'en discuter rapidement?\n\nCordialement,\n{{sender_name}}`
    },
    {
      name: lang === 'en' ? 'Follow-up' : 'Relance',
      subject: lang === 'en' 
        ? 'Re: Quick question about {{company}}' 
        : 'Re: Question rapide à propos de {{company}}',
      content: lang === 'en'
        ? `Hi {{firstName}},\n\nJust wanted to follow up on my previous email.\n\n{{value_prop}}\n\nWould you be open to a 15-minute call this week?\n\nBest,\n{{sender_name}}`
        : `Bonjour {{firstName}},\n\nJe voulais juste faire suite à mon email précédent.\n\n{{value_prop}}\n\nSeriez-vous ouvert à un appel de 15 minutes cette semaine?\n\nCordialement,\n{{sender_name}}`
    },
    {
      name: lang === 'en' ? 'Break-up' : 'Dernière tentative',
      subject: lang === 'en' 
        ? 'Should I close your file?' 
        : 'Dois-je fermer votre dossier?',
      content: lang === 'en'
        ? `Hi {{firstName}},\n\nI've reached out a couple of times but haven't heard back, which tells me one of three things:\n\n1. You're not interested (totally fine)\n2. The timing isn't right\n3. You're interested but busy\n\nIf it's #1, no worries at all. If it's #2 or #3, when might be a better time to connect?\n\nBest,\n{{sender_name}}`
        : `Bonjour {{firstName}},\n\nJ'ai essayé de vous joindre plusieurs fois sans réponse, ce qui me dit l'une de ces trois choses:\n\n1. Vous n'êtes pas intéressé (pas de problème)\n2. Le timing n'est pas bon\n3. Vous êtes intéressé mais occupé\n\nSi c'est #1, aucun souci. Si c'est #2 ou #3, quand serait un meilleur moment pour échanger?\n\nCordialement,\n{{sender_name}}`
    }
  ]

  const addStep = () => {
    const newStep: SequenceStep = {
      id: Date.now().toString(),
      subject: '',
      content: '',
      delayDays: 3,
      conditions: []
    }
    setSteps([...steps, newStep])
    setActiveStep(steps.length)
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index)
      setSteps(newSteps)
      if (activeStep >= newSteps.length) {
        setActiveStep(newSteps.length - 1)
      }
    }
  }

  const updateStep = (index: number, field: keyof SequenceStep, value: any) => {
    const newSteps = [...steps]
    newSteps[index] = { ...newSteps[index], [field]: value }
    setSteps(newSteps)
  }

  const applyTemplate = (template: any) => {
    updateStep(activeStep, 'subject', template.subject)
    updateStep(activeStep, 'content', template.content)
    toast.success(lang === 'en' ? 'Template applied' : 'Modèle appliqué')
  }

  const generateAIContent = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const aiGenerated = {
        subject: lang === 'en' 
          ? `{{firstName}}, quick question about {{company}}'s growth`
          : `{{firstName}}, question rapide sur la croissance de {{company}}`,
        content: lang === 'en'
          ? `Hi {{firstName}},\n\nI came across {{company}} and was impressed by your recent expansion in {{industry}}.\n\nWe specialize in helping companies at your growth stage optimize their sales pipeline and increase qualified leads by 40% on average.\n\nCompanies like {{similar_company}} have seen remarkable results within the first 90 days.\n\nWould you be interested in a brief 15-minute call to explore if we could help {{company}} achieve similar results?\n\nBest regards,\n{{sender_name}}`
          : `Bonjour {{firstName}},\n\nJ'ai découvert {{company}} et j'ai été impressionné par votre récente expansion dans {{industry}}.\n\nNous nous spécialisons dans l'aide aux entreprises à votre stade de croissance pour optimiser leur pipeline de ventes et augmenter les leads qualifiés de 40% en moyenne.\n\nDes entreprises comme {{similar_company}} ont vu des résultats remarquables dans les 90 premiers jours.\n\nSeriez-vous intéressé par un bref appel de 15 minutes pour explorer si nous pourrions aider {{company}} à atteindre des résultats similaires?\n\nCordialement,\n{{sender_name}}`
      }
      updateStep(activeStep, 'subject', aiGenerated.subject)
      updateStep(activeStep, 'content', aiGenerated.content)
      setIsGenerating(false)
      toast.success(
        lang === 'en' 
          ? '🤖 AI content generated!' 
          : '🤖 Contenu IA généré!'
      )
    }, 2000)
  }

  const saveSequence = () => {
    if (!sequenceName) {
      toast.error(lang === 'en' ? 'Please enter a sequence name' : 'Veuillez entrer un nom de séquence')
      return
    }
    if (!selectedICP) {
      toast.error(lang === 'en' ? 'Please select an ICP' : 'Veuillez sélectionner un ICP')
      return
    }
    if (steps.some(step => !step.subject || !step.content)) {
      toast.error(lang === 'en' ? 'Please complete all email steps' : 'Veuillez compléter toutes les étapes email')
      return
    }

    toast.success(
      lang === 'en' 
        ? '🎉 Sequence created successfully!' 
        : '🎉 Séquence créée avec succès!'
    )
    setTimeout(() => {
      router.push('/dashboard/sequences')
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
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {lang === 'en' ? 'Create Email Sequence' : 'Créer une Séquence Email'}
          </h1>
          <p className="mt-2 text-gray-600">
            {lang === 'en' 
              ? 'Set up automated email campaigns with AI-powered personalization'
              : 'Configurez des campagnes email automatisées avec personnalisation par IA'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Sequence Settings */}
          <div className="col-span-1 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {lang === 'en' ? 'Sequence Settings' : 'Paramètres de Séquence'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {lang === 'en' ? 'Sequence Name' : 'Nom de la Séquence'}
                  </label>
                  <input
                    type="text"
                    value={sequenceName}
                    onChange={(e) => setSequenceName(e.target.value)}
                    placeholder={lang === 'en' ? 'e.g., Q1 Outreach' : 'ex: Campagne Q1'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {lang === 'en' ? 'Target ICP' : 'ICP Cible'}
                  </label>
                  <select
                    value={selectedICP}
                    onChange={(e) => setSelectedICP(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">
                      {lang === 'en' ? 'Select ICP...' : 'Sélectionner ICP...'}
                    </option>
                    {icps.map((icp) => (
                      <option key={icp.id} value={icp.id}>
                        {icp.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sequence Steps */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {lang === 'en' ? 'Email Steps' : 'Étapes Email'}
              </h2>
              
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    onClick={() => setActiveStep(index)}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      activeStep === index
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">
                          {lang === 'en' ? `Email ${index + 1}` : `Email ${index + 1}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {index > 0 && (
                          <span className="text-xs text-gray-500">
                            +{step.delayDays} {lang === 'en' ? 'days' : 'jours'}
                          </span>
                        )}
                        {steps.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeStep(index)
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    {step.subject && (
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {step.subject}
                      </p>
                    )}
                  </div>
                ))}
                
                {steps.length < 5 && (
                  <button
                    onClick={addStep}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    {lang === 'en' ? 'Add Step' : 'Ajouter une Étape'}
                  </button>
                )}
              </div>
            </div>

            {/* Templates */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <DocumentDuplicateIcon className="h-5 w-5 mr-2 text-gray-400" />
                {lang === 'en' ? 'Templates' : 'Modèles'}
              </h2>
              
              <div className="space-y-2">
                {templates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => applyTemplate(template)}
                    className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <span className="font-medium text-gray-900">{template.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Email Editor */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  {lang === 'en' ? `Email ${activeStep + 1} Content` : `Contenu Email ${activeStep + 1}`}
                </h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {lang === 'en' ? 'Generating...' : 'Génération...'}
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="h-5 w-5 mr-2" />
                        {lang === 'en' ? 'AI Generate' : 'Générer IA'}
                      </>
                    )}
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                    <EyeIcon className="h-5 w-5 mr-2" />
                    {lang === 'en' ? 'Preview' : 'Aperçu'}
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                    <BeakerIcon className="h-5 w-5 mr-2" />
                    {lang === 'en' ? 'A/B Test' : 'Test A/B'}
                  </button>
                </div>
              </div>
              
              {activeStep > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <ClockIcon className="h-4 w-4 inline mr-1" />
                    {lang === 'en' ? 'Send after (days)' : 'Envoyer après (jours)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={steps[activeStep].delayDays}
                    onChange={(e) => updateStep(activeStep, 'delayDays', parseInt(e.target.value))}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {lang === 'en' ? 'Subject Line' : 'Objet'}
                  </label>
                  <input
                    type="text"
                    value={steps[activeStep].subject}
                    onChange={(e) => updateStep(activeStep, 'subject', e.target.value)}
                    placeholder={lang === 'en' 
                      ? 'Enter email subject...'
                      : 'Entrez l\'objet de l\'email...'
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {lang === 'en' ? 'Email Body' : 'Corps de l\'Email'}
                  </label>
                  <textarea
                    value={steps[activeStep].content}
                    onChange={(e) => updateStep(activeStep, 'content', e.target.value)}
                    placeholder={lang === 'en' 
                      ? 'Write your email content...\n\nUse variables like {{firstName}}, {{company}}, etc.'
                      : 'Écrivez le contenu de votre email...\n\nUtilisez des variables comme {{firstName}}, {{company}}, etc.'
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={12}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {lang === 'en' ? 'Available Variables' : 'Variables Disponibles'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['firstName', 'lastName', 'company', 'industry', 'jobTitle', 'city'].map((variable) => (
                      <button
                        key={variable}
                        onClick={() => {
                          const currentContent = steps[activeStep].content
                          updateStep(activeStep, 'content', currentContent + ` {{${variable}}}`)
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                      >
                        {`{{${variable}}}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Predictions */}
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
              <div className="flex items-start">
                <ChartBarIcon className="h-6 w-6 text-purple-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {lang === 'en' ? 'Performance Predictions' : 'Prédictions de Performance'}
                  </h3>
                  <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">
                        {lang === 'en' ? 'Open Rate' : 'Taux d\'Ouverture'}
                      </span>
                      <p className="font-semibold text-purple-600">28-35%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        {lang === 'en' ? 'Reply Rate' : 'Taux de Réponse'}
                      </span>
                      <p className="font-semibold text-purple-600">12-18%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        {lang === 'en' ? 'Conversion' : 'Conversion'}
                      </span>
                      <p className="font-semibold text-purple-600">3-5%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            {lang === 'en' ? 'Cancel' : 'Annuler'}
          </Link>
          
          <div className="space-x-3">
            <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              {lang === 'en' ? 'Save as Draft' : 'Enregistrer comme Brouillon'}
            </button>
            <button
              onClick={saveSequence}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              {lang === 'en' ? 'Create Sequence' : 'Créer la Séquence'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}