import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Legal Disclaimer - AI Sales Agent',
  description: 'Legal Disclaimer for AI Sales Agent platform'
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Legal Disclaimer / Avis légal</h1>
        
        <div className="prose prose-lg max-w-none">
          {/* English Version */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">English Version</h2>
            
            <h3 className="text-xl font-semibold mb-3">General Information</h3>
            <p className="mb-4">The information provided on AI Sales Agent platform is for general informational purposes only. All information is provided in good faith, however we make no representation or warranty of any kind.</p>

            <h3 className="text-xl font-semibold mb-3">AI-Generated Content</h3>
            <p className="mb-4">Our platform uses artificial intelligence to generate content and insights. While we strive for accuracy:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>AI suggestions are recommendations, not guarantees</li>
              <li>Results may vary based on input data quality</li>
              <li>Human review is recommended for important decisions</li>
              <li>We are not liable for decisions based on AI output</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">External Links</h3>
            <p className="mb-4">Our platform may contain links to external websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of third-party sites.</p>

            <h3 className="text-xl font-semibold mb-3">Professional Advice</h3>
            <p className="mb-4">The platform does not provide legal, financial, or professional advice. Always consult appropriate professionals for specific advice.</p>

            <h3 className="text-xl font-semibold mb-3">Limitation of Liability</h3>
            <p className="mb-4">In no event shall AI Sales Agent, its affiliates, or their respective officers, directors, employees, or agents be liable for any direct, indirect, incidental, special, consequential, or punitive damages.</p>

            <h3 className="text-xl font-semibold mb-3">Fair Use</h3>
            <p className="mb-4">All content, trademarks, and data on this platform are the property of AI Sales Agent. Unauthorized use is prohibited.</p>
          </section>

          <hr className="my-12" />

          {/* French Version */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Version française</h2>
            
            <h3 className="text-xl font-semibold mb-3">Informations générales</h3>
            <p className="mb-4">Les informations fournies sur la plateforme AI Sales Agent sont à titre informatif uniquement.</p>

            <h3 className="text-xl font-semibold mb-3">Contenu généré par IA</h3>
            <p className="mb-4">Notre plateforme utilise l'intelligence artificielle pour générer du contenu :</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Les suggestions IA sont des recommandations</li>
              <li>Les résultats peuvent varier</li>
              <li>La révision humaine est recommandée</li>
              <li>Nous ne sommes pas responsables des décisions basées sur l'IA</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Liens externes</h3>
            <p className="mb-4">Notre plateforme peut contenir des liens vers des sites externes dont nous ne contrôlons pas le contenu.</p>

            <h3 className="text-xl font-semibold mb-3">Conseils professionnels</h3>
            <p className="mb-4">La plateforme ne fournit pas de conseils juridiques, financiers ou professionnels.</p>

            <h3 className="text-xl font-semibold mb-3">Limitation de responsabilité</h3>
            <p className="mb-4">En aucun cas AI Sales Agent ne sera responsable de dommages directs, indirects, accessoires ou consécutifs.</p>

            <h3 className="text-xl font-semibold mb-3">Utilisation équitable</h3>
            <p className="mb-4">Tout le contenu et les marques sur cette plateforme sont la propriété d'AI Sales Agent.</p>
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