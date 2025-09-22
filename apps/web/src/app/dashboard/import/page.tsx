'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  UserGroupIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function ImportPage() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [importType, setImportType] = useState<'csv' | 'url'>('csv')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [urls, setUrls] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [mappingPreview, setMappingPreview] = useState<any>(null)
  const [selectedICP, setSelectedICP] = useState('')

  // Mock ICPs for demonstration
  const icps = [
    { id: '1', name: 'SaaS Startups', prospects: 245 },
    { id: '2', name: 'E-commerce B2B', prospects: 189 },
    { id: '3', name: 'Financial Services', prospects: 412 },
  ]

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCsvFile(file)
      // Mock CSV preview
      setMappingPreview({
        headers: ['Email', 'Company', 'First Name', 'Last Name', 'Job Title', 'LinkedIn'],
        sampleRows: [
          ['john.doe@acme.com', 'Acme Corp', 'John', 'Doe', 'CEO', 'linkedin.com/in/johndoe'],
          ['jane.smith@tech.co', 'Tech Co', 'Jane', 'Smith', 'CTO', 'linkedin.com/in/janesmith'],
          ['bob.wilson@startup.io', 'Startup.io', 'Bob', 'Wilson', 'VP Sales', 'linkedin.com/in/bobwilson'],
        ],
        autoMapped: {
          email: 'Email',
          company_name: 'Company',
          first_name: 'First Name',
          last_name: 'Last Name',
          job_title: 'Job Title',
          linkedin_url: 'LinkedIn'
        }
      })
      toast.success(lang === 'en' ? 'CSV uploaded successfully' : 'CSV téléchargé avec succès')
    }
  }

  const handleImport = async () => {
    if (!selectedICP) {
      toast.error(lang === 'en' ? 'Please select an ICP' : 'Veuillez sélectionner un ICP')
      return
    }

    setIsProcessing(true)
    // Simulate import process
    setTimeout(() => {
      setIsProcessing(false)
      toast.success(
        lang === 'en' 
          ? '🎉 Successfully imported 156 prospects!' 
          : '🎉 156 prospects importés avec succès!'
      )
      setTimeout(() => {
        router.push('/dashboard/prospects')
      }, 2000)
    }, 3000)
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
            {lang === 'en' ? 'Import Prospects' : 'Importer des Prospects'}
          </h1>
          <p className="mt-2 text-gray-600">
            {lang === 'en' 
              ? 'Add prospects from CSV files or by providing company URLs'
              : 'Ajoutez des prospects depuis des fichiers CSV ou en fournissant des URLs d\'entreprise'}
          </p>
        </div>

        {/* ICP Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {lang === 'en' ? '1. Select Target ICP' : '1. Sélectionner l\'ICP Cible'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {icps.map((icp) => (
              <div
                key={icp.id}
                onClick={() => setSelectedICP(icp.id)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                  selectedICP === icp.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{icp.name}</h3>
                    <p className="text-sm text-gray-500">
                      {icp.prospects} {lang === 'en' ? 'prospects' : 'prospects'}
                    </p>
                  </div>
                  {selectedICP === icp.id && (
                    <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </div>
            ))}
            <Link
              href="/dashboard/icp/new"
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition flex items-center justify-center"
            >
              <div className="text-center">
                <UserGroupIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-600">
                  {lang === 'en' ? 'Create New ICP' : 'Créer un Nouvel ICP'}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Import Type Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {lang === 'en' ? '2. Choose Import Method' : '2. Choisir la Méthode d\'Import'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setImportType('csv')}
              className={`border-2 rounded-lg p-6 transition ${
                importType === 'csv'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <DocumentTextIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">
                {lang === 'en' ? 'Upload CSV' : 'Télécharger CSV'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {lang === 'en' 
                  ? 'Import from spreadsheet'
                  : 'Importer depuis une feuille de calcul'}
              </p>
            </button>
            
            <button
              onClick={() => setImportType('url')}
              className={`border-2 rounded-lg p-6 transition ${
                importType === 'url'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <GlobeAltIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">
                {lang === 'en' ? 'Scrape URLs' : 'Extraire URLs'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {lang === 'en' 
                  ? 'Extract from websites'
                  : 'Extraire depuis des sites web'}
              </p>
            </button>
          </div>
        </div>

        {/* CSV Upload Section */}
        {importType === 'csv' && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {lang === 'en' ? '3. Upload CSV File' : '3. Télécharger le Fichier CSV'}
            </h2>
            
            {!csvFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <input
                  type="file"
                  id="csv-upload"
                  accept=".csv,.xlsx"
                  onChange={handleCsvUpload}
                  className="hidden"
                />
                <label
                  htmlFor="csv-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mb-4" />
                  <span className="text-sm font-medium text-gray-900">
                    {lang === 'en' 
                      ? 'Click to upload or drag and drop'
                      : 'Cliquez pour télécharger ou glissez-déposez'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    CSV or XLSX (max 10MB)
                  </span>
                </label>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{csvFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {Math.round(csvFile.size / 1024)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCsvFile(null)
                      setMappingPreview(null)
                    }}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    {lang === 'en' ? 'Remove' : 'Supprimer'}
                  </button>
                </div>

                {/* CSV Preview */}
                {mappingPreview && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      {lang === 'en' ? 'Data Preview' : 'Aperçu des Données'}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {mappingPreview.headers.map((header: string, idx: number) => (
                              <th
                                key={idx}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {mappingPreview.sampleRows.map((row: string[], idx: number) => (
                            <tr key={idx}>
                              {row.map((cell: string, cellIdx: number) => (
                                <td
                                  key={cellIdx}
                                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm text-green-800">
                          {lang === 'en' 
                            ? 'Columns automatically mapped to fields'
                            : 'Colonnes automatiquement mappées aux champs'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Download Template */}
            <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600">
                  {lang === 'en' 
                    ? 'Need help formatting your data?'
                    : 'Besoin d\'aide pour formater vos données?'}
                </p>
              </div>
              <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                {lang === 'en' ? 'Download Template' : 'Télécharger le Modèle'}
              </button>
            </div>
          </div>
        )}

        {/* URL Scraping Section */}
        {importType === 'url' && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {lang === 'en' ? '3. Enter Company URLs' : '3. Entrer les URLs d\'Entreprise'}
            </h2>
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder={lang === 'en' 
                ? 'Enter one URL per line\nhttps://example.com\nhttps://company.com'
                : 'Entrez une URL par ligne\nhttps://example.com\nhttps://company.com'
              }
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">
              {lang === 'en' 
                ? 'We\'ll extract company information, employee contacts, and relevant data from these websites'
                : 'Nous extrairons les informations de l\'entreprise, les contacts des employés et les données pertinentes de ces sites web'}
            </p>
          </div>
        )}

        {/* AI Qualification Preview */}
        {(csvFile || urls) && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow p-6 mb-6">
            <div className="flex items-start">
              <SparklesIcon className="h-6 w-6 text-purple-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">
                  {lang === 'en' ? 'AI Qualification Preview' : 'Aperçu de Qualification IA'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {lang === 'en'
                    ? 'Our AI will automatically qualify prospects based on your ICP criteria:'
                    : 'Notre IA qualifiera automatiquement les prospects selon vos critères ICP:'}
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>{lang === 'en' ? 'BANT scoring (Budget, Authority, Need, Timing)' : 'Score BANT (Budget, Autorité, Besoin, Timing)'}</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>{lang === 'en' ? 'Buying signal detection' : 'Détection de signaux d\'achat'}</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>{lang === 'en' ? 'Personalized messaging suggestions' : 'Suggestions de messages personnalisés'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            {lang === 'en' ? 'Cancel' : 'Annuler'}
          </Link>
          
          <button
            onClick={handleImport}
            disabled={!selectedICP || (!csvFile && !urls) || isProcessing}
            className={`px-6 py-3 rounded-lg font-medium transition flex items-center ${
              !selectedICP || (!csvFile && !urls) || isProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {lang === 'en' ? 'Processing...' : 'Traitement...'}
              </>
            ) : (
              <>
                <SparklesIcon className="h-5 w-5 mr-2" />
                {lang === 'en' ? 'Import & Qualify' : 'Importer & Qualifier'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}