import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - AI Sales Agent',
  description: 'Privacy Policy for AI Sales Agent platform'
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy / Politique de confidentialité</h1>
        
        <div className="prose prose-lg max-w-none">
          {/* English Version */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">English Version</h2>
            
            <h3 className="text-xl font-semibold mb-3">1. Introduction</h3>
            <p className="mb-4">AI Sales Agent ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.</p>

            <h3 className="text-xl font-semibold mb-3">2. Information We Collect</h3>
            <ul className="list-disc ml-6 mb-4">
              <li><strong>Personal Information:</strong> Name, email address, company name, job title</li>
              <li><strong>Prospect Data:</strong> Contact information for your prospects</li>
              <li><strong>Usage Information:</strong> Platform activity and performance data</li>
              <li><strong>Payment Information:</strong> Processed securely by Stripe</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3. How We Use Your Information</h3>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Provide and maintain our prospecting platform</li>
              <li>Process prospects and generate AI insights</li>
              <li>Facilitate email sequences and campaigns</li>
              <li>Send service notifications and updates</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">4. Data Security</h3>
            <p className="mb-4">We implement industry-standard security measures including:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Encryption at rest and in transit</li>
              <li>Role-based access controls</li>
              <li>Regular security audits</li>
              <li>Secure authentication with JWT tokens</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">5. Data Retention</h3>
            <p className="mb-4">We retain your data while your account is active. You may request deletion at any time.</p>

            <h3 className="text-xl font-semibold mb-3">6. Your Rights (GDPR/CCPA/PIPEDA)</h3>
            <ul className="list-disc ml-6 mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion (Right to be Forgotten)</li>
              <li>Data portability</li>
              <li>Opt-out of data processing</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">7. International Data Transfers</h3>
            <p className="mb-4">You can choose your data residency: US, EU, or Canadian data centers.</p>

            <h3 className="text-xl font-semibold mb-3">8. Contact Information</h3>
            <p className="mb-4">For privacy-related questions: privacy@aisalesagent.com</p>
          </section>

          <hr className="my-12" />

          {/* French Version */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Version française</h2>
            
            <h3 className="text-xl font-semibold mb-3">1. Introduction</h3>
            <p className="mb-4">AI Sales Agent s'engage à protéger votre vie privée. Cette Politique explique comment nous collectons et utilisons vos informations.</p>

            <h3 className="text-xl font-semibold mb-3">2. Informations que nous collectons</h3>
            <ul className="list-disc ml-6 mb-4">
              <li><strong>Informations personnelles :</strong> Nom, e-mail, entreprise, titre</li>
              <li><strong>Données de prospects :</strong> Informations de contact</li>
              <li><strong>Informations d'utilisation :</strong> Activité de la plateforme</li>
              <li><strong>Informations de paiement :</strong> Traitées par Stripe</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3. Comment nous utilisons vos informations</h3>
            <p className="mb-4">Nous utilisons vos informations pour :</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Fournir notre plateforme de prospection</li>
              <li>Traiter les prospects et générer des insights IA</li>
              <li>Faciliter les séquences d'e-mails</li>
              <li>Envoyer des notifications de service</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">4. Sécurité des données</h3>
            <p className="mb-4">Nous mettons en œuvre des mesures de sécurité standard :</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Chiffrement au repos et en transit</li>
              <li>Contrôles d'accès basés sur les rôles</li>
              <li>Audits de sécurité réguliers</li>
              <li>Authentification sécurisée avec tokens JWT</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">5. Conservation des données</h3>
            <p className="mb-4">Nous conservons vos données pendant que votre compte est actif.</p>

            <h3 className="text-xl font-semibold mb-3">6. Vos droits (RGPD/LCAP/PIPEDA)</h3>
            <ul className="list-disc ml-6 mb-4">
              <li>Accéder à vos données personnelles</li>
              <li>Corriger les informations inexactes</li>
              <li>Demander la suppression (Droit à l'oubli)</li>
              <li>Portabilité des données</li>
              <li>Se désabonner du traitement des données</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">7. Transferts internationaux de données</h3>
            <p className="mb-4">Choisissez votre résidence de données : États-Unis, UE ou Canada.</p>

            <h3 className="text-xl font-semibold mb-3">8. Informations de contact</h3>
            <p className="mb-4">Pour les questions sur la confidentialité : privacy@aisalesagent.com</p>
          </section>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Last updated / Dernière mise à jour: December 2024
          </p>
        </div>
      </div>
    </div>
  )
}