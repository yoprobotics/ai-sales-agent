import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy - AI Sales Agent',
  description: 'Cookie Policy for AI Sales Agent platform'
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy / Politique de Cookies</h1>
        
        <div className="prose prose-lg max-w-none">
          {/* English Version */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">English Version</h2>
            
            <h3 className="text-xl font-semibold mb-3">What are cookies?</h3>
            <p className="mb-4">Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience.</p>

            <h3 className="text-xl font-semibold mb-3">Types of cookies we use</h3>
            
            <h4 className="text-lg font-semibold mb-2">Essential Cookies</h4>
            <p className="mb-4">Required for the website to function properly:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Authentication and session management</li>
              <li>Security and fraud prevention</li>
              <li>Basic functionality and preferences</li>
            </ul>

            <h4 className="text-lg font-semibold mb-2">Analytics Cookies</h4>
            <p className="mb-4">Help us understand how you use our platform:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Usage statistics and performance monitoring</li>
              <li>Feature adoption and user behavior</li>
              <li>Platform optimization insights</li>
            </ul>

            <h4 className="text-lg font-semibold mb-2">Marketing Cookies (Optional)</h4>
            <p className="mb-4">Used only with your consent:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Personalized content and recommendations</li>
              <li>Campaign effectiveness measurement</li>
              <li>Third-party advertising (opt-in only)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Managing cookies</h3>
            <p className="mb-4">You can control cookies through your browser settings. Disabling essential cookies may affect site functionality.</p>

            <h3 className="text-xl font-semibold mb-3">Third-party cookies</h3>
            <p className="mb-4">We use services that may set their own cookies:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Stripe (payment processing)</li>
              <li>Google Analytics (usage analytics)</li>
              <li>Intercom (customer support)</li>
            </ul>
          </section>

          <hr className="my-12" />

          {/* French Version */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Version française</h2>
            
            <h3 className="text-xl font-semibold mb-3">Que sont les cookies?</h3>
            <p className="mb-4">Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez notre site.</p>

            <h3 className="text-xl font-semibold mb-3">Types de cookies utilisés</h3>
            
            <h4 className="text-lg font-semibold mb-2">Cookies essentiels</h4>
            <p className="mb-4">Nécessaires au fonctionnement du site :</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Authentification et gestion de session</li>
              <li>Sécurité et prévention de la fraude</li>
              <li>Fonctionnalités de base et préférences</li>
            </ul>

            <h4 className="text-lg font-semibold mb-2">Cookies analytiques</h4>
            <p className="mb-4">Nous aident à comprendre votre utilisation :</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Statistiques d'utilisation et performance</li>
              <li>Adoption de fonctionnalités</li>
              <li>Insights d'optimisation</li>
            </ul>

            <h4 className="text-lg font-semibold mb-2">Cookies marketing (Optionnels)</h4>
            <p className="mb-4">Utilisés uniquement avec votre consentement :</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Contenu personnalisé et recommandations</li>
              <li>Mesure de l'efficacité des campagnes</li>
              <li>Publicité tierce (opt-in uniquement)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Gestion des cookies</h3>
            <p className="mb-4">Vous pouvez contrôler les cookies via les paramètres de votre navigateur.</p>

            <h3 className="text-xl font-semibold mb-3">Cookies tiers</h3>
            <p className="mb-4">Nous utilisons des services qui peuvent définir leurs propres cookies :</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Stripe (traitement des paiements)</li>
              <li>Google Analytics (analyses d'utilisation)</li>
              <li>Intercom (support client)</li>
            </ul>
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