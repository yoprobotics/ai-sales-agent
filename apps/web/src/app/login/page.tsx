'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lang, setLang] = useState('en')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (response.ok) {
        // Store token in localStorage for now (will move to httpOnly cookies)
        localStorage.setItem('token', result.token)
        localStorage.setItem('user', JSON.stringify(result.user))
        
        toast.success(lang === 'en' ? 'Login successful!' : 'Connexion réussie!')
        router.push('/dashboard')
      } else {
        toast.error(result.message || (lang === 'en' ? 'Login failed' : 'Échec de connexion'))
      }
    } catch (error) {
      toast.error(lang === 'en' ? 'Something went wrong' : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      {/* Language Toggle */}
      <button
        onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
        className="absolute top-4 right-4 text-sm text-gray-600 hover:text-gray-900"
      >
        {lang === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
      </button>

      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center">
            <span className="text-4xl">🚀</span>
            <span className="ml-3 text-3xl font-bold text-gray-900">AI Sales Agent</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {lang === 'en' ? 'Welcome back' : 'Bon retour'}
          </h2>
          <p className="text-gray-600 mb-6">
            {lang === 'en' 
              ? 'Enter your credentials to access your account'
              : 'Entrez vos identifiants pour accéder à votre compte'}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {lang === 'en' ? 'Email Address' : 'Adresse Email'}
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

            {/* Password Field */}
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isLoading}
                />
                <label className="ml-2 text-sm text-gray-600">
                  {lang === 'en' ? 'Remember me' : 'Se souvenir de moi'}
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {lang === 'en' ? 'Forgot password?' : 'Mot de passe oublié?'}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading 
                ? (lang === 'en' ? 'Signing in...' : 'Connexion...') 
                : (lang === 'en' ? 'Sign in' : 'Se connecter')}
            </button>
          </form>

          {/* Demo Account Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-2">
              {lang === 'en' ? 'Demo Account:' : 'Compte Démo:'}
            </p>
            <p className="text-xs text-blue-700">Email: demo@aisalesagent.com</p>
            <p className="text-xs text-blue-700">Password: Demo123!</p>
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            {lang === 'en' ? "Don't have an account?" : "Pas encore de compte?"}
            {' '}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              {lang === 'en' ? 'Sign up for free' : 'Créer un compte gratuit'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
