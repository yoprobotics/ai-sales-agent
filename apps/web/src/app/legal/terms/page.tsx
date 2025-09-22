import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions - AI Sales Agent',
  description: 'Terms and Conditions for using AI Sales Agent platform'
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Terms & Conditions / Conditions générales</h1>
        
        <div className="prose prose-lg max-w-none">
          {/* English Version */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">English Version</h2>
            
            <h3 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h3>
            <p className="mb-4">By accessing or using AI Sales Agent ("Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you disagree with any part of these terms, you may not access the Service.</p>

            <h3 className="text-xl font-semibold mb-3">2. Description of Service</h3>
            <p className="mb-4">AI Sales Agent is a B2B prospecting platform that provides:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Prospect qualification using AI technology</li>
              <li>Personalized messaging and email sequences</li>
              <li>CRM pipeline management</li>
              <li>Analytics and insights</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3. User Accounts</h3>
            <p className="mb-4">You must provide accurate information and are responsible for safeguarding your account credentials.</p>

            <h3 className="text-xl font-semibold mb-3">4. Acceptable Use</h3>
            <p className="mb-4">Users must comply with all applicable laws and regulations, including anti-spam laws (CAN-SPAM, GDPR, CASL).</p>

            <h3 className="text-xl font-semibold mb-3">5. Subscription Plans and Billing</h3>
            <p className="mb-4">Subscriptions are billed monthly or annually in advance. Fees are non-refundable except as required by law.</p>

            <h3 className="text-xl font-semibold mb-3">6. Data Privacy</h3>
            <p className="mb-4">Your data is processed according to our Privacy Policy. You retain ownership of your prospect data.</p>

            <h3 className="text-xl font-semibold mb-3">7. Limitation of Liability</h3>
            <p className="mb-4">THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</p>

            <h3 className="text-xl font-semibold mb-3">8. Governing Law</h3>
            <p className="mb-4">These Terms are governed by the laws of Canada, without regard to conflict of law provisions.</p>
          </section>

          <hr className="my-12" />

          {/* French Version */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Version française</h2>
            
            <h3 className="text-xl font-semibold mb-3">1. Acceptation des conditions</h3>
            <p className="mb-4">En accédant ou en utilisant AI Sales Agent (« Service »), vous acceptez d'être lié par ces Conditions générales (« Conditions »).</p>

            <h3 className="text-xl font-semibold mb-3">2. Description du service</h3>
            <p className="mb-4">AI Sales Agent est une plateforme de prospection B2B qui fournit :</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Qualification de prospects utilisant la technologie IA</li>
              <li>Messages personnalisés et séquences d'e-mails</li>
              <li>Gestion de pipeline CRM</li>
              <li>Analyses et insights</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3. Comptes utilisateur</h3>
            <p className="mb-4">Vous devez fournir des informations exactes et êtes responsable de la protection de vos identifiants.</p>

            <h3 className="text-xl font-semibold mb-3">4. Utilisation acceptable</h3>
            <p className="mb-4">Les utilisateurs doivent se conformer à toutes les lois et réglementations applicables.</p>

            <h3 className="text-xl font-semibold mb-3">5. Plans d'abonnement et facturation</h3>
            <p className="mb-4">Les abonnements sont facturés mensuellement ou annuellement à l'avance.</p>

            <h3 className="text-xl font-semibold mb-3">6. Confidentialité des données</h3>
            <p className="mb-4">Vos données sont traitées selon notre Politique de confidentialité.</p>

            <h3 className="text-xl font-semibold mb-3">7. Limitation de responsabilité</h3>
            <p className="mb-4">LE SERVICE EST FOURNI "TEL QUEL" SANS GARANTIES D'AUCUNE SORTE.</p>

            <h3 className="text-xl font-semibold mb-3">8. Loi applicable</h3>
            <p className="mb-4">Ces Conditions sont régies par les lois du Canada.</p>
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