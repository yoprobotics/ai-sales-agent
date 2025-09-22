'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon, CheckIcon } from '@heroicons/react/24/outline'

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  companyName: z.string().min(1, 'Company name is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
  language: z.enum(['en', 'fr']).default('en'),
  dataRegion: z.enum(['US', 'EU', 'CA']).default('EU')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lang, setLang] = useState('en')
  const [currentStep, setCurrentStep] = useState(1)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      language: 'en',
      dataRegion: 'EU'
    }
  })

  const password = watch('password')
  
  const passwordRequirements = [
    { text: lang === 'en' ? 'At least 8 characters' : 'Au moins 8 caractères', 
      met: password?.length >= 8 },
    { text: lang === 'en' ? 'One uppercase letter' : 'Une lettre majuscule', 
      met: /[A-Z]/.test(password || '') },
    { text: lang === 'en' ? 'One lowercase letter' : 'Une lettre minuscule', 
      met: /[a-z]/.test(password || '') },
    { text: lang === 'en' ? 'One number' : 'Un chiffre', 
      met: /\d/.test(password || '') },
    { text: lang === 'en' ? 'One special character' : 'Un caractère spécial', 
      met: /[@$!%*?&]/.test(password || '') }
  ]

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(lang === 'en' 
          ? 'Account created successfully!' 
          : 'Compte créé avec succès!')
        router.push('/login')
      } else {
        toast.error(result.message || (lang === 'en' 
          ? 'Registration failed' 
          : 'Échec de l\'inscription'))
      }
    } catch (error) {
      toast.error(lang === 'en' 
        ? 'Something went wrong' 
        : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      {/* Language Toggle */}
      <button
        onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
        className="absolute top-4 right-4 text-sm text-gray-600 hover:text-gray-900"
      >
        {lang === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
      </button>

      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center">
            <span className="text-4xl">🚀</span>
            <span className="ml-3 text-3xl font-bold text-gray-900">AI Sales Agent</span>
          </Link>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step}
                  </div>
                  {step < 2 && (
                    <div className={`w-24 h-1 ml-4 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {lang === 'en' 
              ? 'Start Your 14-Day Free Trial' 
              : 'Commencez Votre Essai Gratuit de 14 Jours'}
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            {lang === 'en' 
              ? 'No credit card required • Cancel anytime'
              : 'Sans carte de crédit • Annulez à tout moment'}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {currentStep === 1 ? (
              <>
                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {lang === 'en' ? 'First Name' : 'Prénom'}
                    </label>
                    <input
                      type="text"
                      {...register('firstName')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder={lang === 'en' ? 'John' : 'Jean'}
                      disabled={isLoading}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {lang === 'en' ? 'Last Name' : 'Nom'}
                    </label>
                    <input
                      type="text"
                      {...register('lastName')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder={lang === 'en' ? 'Doe' : 'Dupont'}
                      disabled={isLoading}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {lang === 'en' ? 'Work Email' : 'Email Professionnel'}
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder={lang === 'en' ? 'you@company.com' : 'vous@entreprise.com'}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {lang === 'en' ? 'Company Name' : 'Nom de l\'entreprise'}
                  </label>
                  <input
                    type="text"
                    {...register('companyName')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder={lang === 'en' ? 'Acme Corp' : 'Entreprise SARL'}
                    disabled={isLoading}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                  )}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  {lang === 'en' ? 'Next Step' : 'Étape Suivante'}
                </button>
              </>
            ) : (
              <>
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {lang === 'en' ? 'Password' : 'Mot de passe'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map((req, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckIcon className={`h-4 w-4 mr-2 ${
                          req.met ? 'text-green-500' : 'text-gray-300'
                        }`} />
                        <span className={req.met ? 'text-green-700' : 'text-gray-500'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {lang === 'en' ? 'Confirm Password' : 'Confirmer le mot de passe'}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Data Region */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {lang === 'en' ? 'Data Region' : 'Région des données'}
                  </label>
                  <select
                    {...register('dataRegion')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    disabled={isLoading}
                  >
                    <option value="EU">🇪🇺 {lang === 'en' ? 'Europe (GDPR)' : 'Europe (RGPD)'}</option>
                    <option value="US">🇺🇸 {lang === 'en' ? 'United States' : 'États-Unis'}</option>
                    <option value="CA">🇨🇦 Canada (PIPEDA)</option>
                  </select>
                </div>

                {/* Terms & Conditions */}
                <div>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      {...register('acceptTerms')}
                      className="h-4 w-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <label className="ml-2 text-sm text-gray-600">
                      {lang === 'en' 
                        ? 'I agree to the ' 
                        : 'J\'accepte les '}
                      <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                        {lang === 'en' ? 'Terms of Service' : 'Conditions d\'utilisation'}
                      </Link>
                      {' '}{lang === 'en' ? 'and ' : 'et la '}
                      <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                        {lang === 'en' ? 'Privacy Policy' : 'Politique de confidentialité'}
                      </Link>
                    </label>
                  </div>
                  {errors.acceptTerms && (
                    <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="w-1/3 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
                  >
                    {lang === 'en' ? 'Back' : 'Retour'}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-2/3 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {isLoading 
                      ? (lang === 'en' ? 'Creating Account...' : 'Création du compte...') 
                      : (lang === 'en' ? 'Create Account' : 'Créer le compte')}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            {lang === 'en' ? 'Already have an account?' : 'Déjà un compte?'}
            {' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              {lang === 'en' ? 'Sign in' : 'Se connecter'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
