import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Information - AI Sales Agent',
  description: 'Contact information and support for AI Sales Agent'
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Contact Information / Coordonnées</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* General Contact */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">🏢 General Contact</h3>
              <p className="mb-2"><strong>Company:</strong> YoProbotics Inc.</p>
              <p className="mb-2"><strong>Email:</strong> <a href="mailto:hello@aisalesagent.com" className="text-blue-600 hover:underline">hello@aisalesagent.com</a></p>
              <p className="mb-2"><strong>Phone:</strong> +1 (888) AI-SALES</p>
              <p className="mb-2"><strong>Business Hours:</strong> Mon-Fri, 9 AM - 5 PM EST</p>
            </div>

            {/* Support */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">💬 Customer Support</h3>
              <p className="mb-2"><strong>Email:</strong> <a href="mailto:support@aisalesagent.com" className="text-blue-600 hover:underline">support@aisalesagent.com</a></p>
              <p className="mb-2"><strong>Response Time:</strong> Within 24 hours</p>
              <p className="mb-2"><strong>Priority Support:</strong> Pro & Business plans</p>
              <p className="mb-2"><strong>Documentation:</strong> <a href="/docs" className="text-blue-600 hover:underline">docs.aisalesagent.com</a></p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Legal & Privacy */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">⚖️ Legal & Privacy</h3>
              <p className="mb-2"><strong>Legal Inquiries:</strong> <a href="mailto:legal@aisalesagent.com" className="text-blue-600 hover:underline">legal@aisalesagent.com</a></p>
              <p className="mb-2"><strong>Privacy Officer:</strong> <a href="mailto:privacy@aisalesagent.com" className="text-blue-600 hover:underline">privacy@aisalesagent.com</a></p>
              <p className="mb-2"><strong>Data Protection:</strong> <a href="mailto:dpo@aisalesagent.com" className="text-blue-600 hover:underline">dpo@aisalesagent.com</a></p>
              <p className="mb-2"><strong>GDPR Requests:</strong> EU residents</p>
            </div>

            {/* Security & Technical */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">🔒 Security & Technical</h3>
              <p className="mb-2"><strong>Security Issues:</strong> <a href="mailto:security@aisalesagent.com" className="text-red-600 hover:underline font-semibold">security@aisalesagent.com</a></p>
              <p className="mb-2"><strong>Bug Reports:</strong> <a href="mailto:bugs@aisalesagent.com" className="text-blue-600 hover:underline">bugs@aisalesagent.com</a></p>
              <p className="mb-2"><strong>API Support:</strong> <a href="mailto:api@aisalesagent.com" className="text-blue-600 hover:underline">api@aisalesagent.com</a></p>
              <p className="mb-2"><strong>Status Page:</strong> <a href="https://status.aisalesagent.com" className="text-blue-600 hover:underline">status.aisalesagent.com</a></p>
            </div>
          </div>

          {/* Office Locations */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <h3 className="text-xl font-semibold mb-4">🗺️ Office Locations</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">🇨🇦 Canada (HQ)</h4>
                <p className="text-sm text-gray-600">
                  123 Innovation Drive<br />
                  Toronto, ON M5V 3A8<br />
                  Canada
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🇺🇸 United States</h4>
                <p className="text-sm text-gray-600">
                  456 Tech Boulevard<br />
                  San Francisco, CA 94105<br />
                  United States
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🇪🇺 European Union</h4>
                <p className="text-sm text-gray-600">
                  789 Digital Avenue<br />
                  Dublin 2, D02 VK60<br />
                  Ireland
                </p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <h3 className="text-xl font-semibold mb-4">🌐 Connect With Us</h3>
            
            <div className="flex flex-wrap gap-4">
              <a href="https://github.com/yoprobotics" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                💙 GitHub
              </a>
              <a href="https://linkedin.com/company/aisalesagent" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                💼 LinkedIn
              </a>
              <a href="https://twitter.com/aisalesagent" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                🐦 Twitter/X
              </a>
              <a href="https://youtube.com/@aisalesagent" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                🎥 YouTube
              </a>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2 text-red-800">🆘 Emergency Contact</h3>
            <p className="text-red-700">
              For critical security vulnerabilities or urgent matters:<br />
              <strong>24/7 Hotline:</strong> +1 (888) URGENT-1<br />
              <strong>Emergency Email:</strong> <a href="mailto:urgent@aisalesagent.com" className="text-red-600 hover:underline font-semibold">urgent@aisalesagent.com</a>
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            We aim to respond to all inquiries within 24-48 hours during business days.<br />
            Nous visons à répondre à toutes les demandes dans les 24-48 heures pendant les jours ouvrables.
          </p>
        </div>
      </div>
    </div>
  )
}