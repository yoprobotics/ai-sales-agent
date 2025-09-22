import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclosure Statement - AI Sales Agent',
  description: 'Important disclosures and transparency information for AI Sales Agent'
}

export default function DisclosurePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Disclosure Statement</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Business Information</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="mb-2"><strong>Legal Entity:</strong> YoProbotics Inc.</p>
              <p className="mb-2"><strong>Registration:</strong> Canadian Federal Corporation</p>
              <p className="mb-2"><strong>Business Number:</strong> 123456789RC0001</p>
              <p className="mb-2"><strong>Founded:</strong> 2024</p>
              <p className="mb-2"><strong>Headquarters:</strong> Toronto, Canada</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">AI Technology Disclosure</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
              <h3 className="text-xl font-semibold mb-3">How We Use AI</h3>
              <p className="mb-4">AI Sales Agent uses artificial intelligence technology to:</p>
              <ul className="list-disc ml-6 mb-4">
                <li>Analyze and qualify prospects based on multiple data points</li>
                <li>Generate personalized email and message content</li>
                <li>Provide insights and recommendations</li>
                <li>Optimize campaign performance</li>
                <li>Detect patterns and predict outcomes</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">AI Limitations</h3>
              <ul className="list-disc ml-6 mb-4">
                <li>AI-generated content should be reviewed before sending</li>
                <li>Qualification scores are estimates, not guarantees</li>
                <li>Results depend on data quality and completeness</li>
                <li>AI models are continuously improving</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">AI Partners</h3>
              <p className="mb-4">We use OpenAI's GPT-4 for natural language processing, with data processed according to our privacy policy.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Financial Relationships</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Affiliate Disclosure</h3>
              <p className="mb-4">We may earn commissions from affiliate links to third-party services mentioned on our platform.</p>
              
              <h3 className="text-xl font-semibold mb-3">Partner Services</h3>
              <ul className="list-disc ml-6 mb-4">
                <li><strong>Stripe:</strong> Payment processing partner</li>
                <li><strong>SendGrid:</strong> Email delivery infrastructure</li>
                <li><strong>AWS/Vercel:</strong> Cloud hosting providers</li>
                <li><strong>OpenAI:</strong> AI technology provider</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Collection & Usage</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <h3 className="text-xl font-semibold mb-3">What We Collect</h3>
              <ul className="list-disc ml-6 mb-4">
                <li>Account information you provide</li>
                <li>Prospect data you upload or import</li>
                <li>Usage analytics and platform interactions</li>
                <li>Communication preferences</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">How We Use It</h3>
              <ul className="list-disc ml-6 mb-4">
                <li>Provide and improve our services</li>
                <li>Generate AI insights and recommendations</li>
                <li>Send service updates and notifications</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">We Never</h3>
              <ul className="list-disc ml-6 mb-4">
                <li>Sell your data to third parties</li>
                <li>Use your prospect data for our own marketing</li>
                <li>Share data without your consent (except legally required)</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Compliance & Certifications</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">✅ GDPR Compliant</h4>
                <p className="text-sm">EU data protection standards</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">✅ CCPA Compliant</h4>
                <p className="text-sm">California privacy regulations</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">✅ PIPEDA Compliant</h4>
                <p className="text-sm">Canadian privacy standards</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">✅ SOC 2 (In Progress)</h4>
                <p className="text-sm">Security certification pending</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Content & Intellectual Property</h2>
            <p className="mb-4">All content on this platform, including but not limited to text, graphics, logos, and software, is the property of YoProbotics Inc. or its content suppliers and is protected by international copyright laws.</p>
            <p className="mb-4">Users retain ownership of their data but grant us a license to process it for service provision.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Accessibility Commitment</h2>
            <p className="mb-4">We are committed to making our platform accessible to all users. We follow WCAG 2.1 Level AA guidelines and continuously work to improve accessibility.</p>
            <p className="mb-4">If you encounter accessibility issues, please contact: <a href="mailto:accessibility@aisalesagent.com" className="text-blue-600 hover:underline">accessibility@aisalesagent.com</a></p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Environmental Responsibility</h2>
            <p className="mb-4">We are committed to reducing our environmental impact:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Carbon-neutral cloud hosting providers</li>
              <li>Efficient code to minimize computing resources</li>
              <li>Remote-first operations to reduce commuting</li>
              <li>Digital-only documentation and communications</li>
            </ul>
          </section>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Last updated: December 2024<br />
            We believe in transparency and will update this disclosure as our business evolves.
          </p>
        </div>
      </div>
    </div>
  )
}