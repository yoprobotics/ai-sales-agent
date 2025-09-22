import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Subprocessors - AI Sales Agent',
  description: 'List of third-party subprocessors used by AI Sales Agent'
}

export default function SubprocessorsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Subprocessors</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <p className="mb-4">AI Sales Agent uses third-party subprocessors to provide our services. This page lists all subprocessors that may process personal data on our behalf.</p>
            <p className="mb-4">We ensure all subprocessors meet our security and privacy standards through contractual agreements.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Infrastructure Providers</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Processed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Vercel Inc.</td>
                    <td className="px-6 py-4">Application hosting & CDN</td>
                    <td className="px-6 py-4">United States</td>
                    <td className="px-6 py-4">Application data, user sessions</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Amazon Web Services</td>
                    <td className="px-6 py-4">Cloud infrastructure & storage</td>
                    <td className="px-6 py-4">Multiple regions</td>
                    <td className="px-6 py-4">Database, file storage, backups</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Neon Database</td>
                    <td className="px-6 py-4">PostgreSQL database hosting</td>
                    <td className="px-6 py-4">United States</td>
                    <td className="px-6 py-4">All application data</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Cloudflare</td>
                    <td className="px-6 py-4">DDoS protection & CDN</td>
                    <td className="px-6 py-4">Global</td>
                    <td className="px-6 py-4">Traffic data, cached content</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Service Providers</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Processed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Stripe, Inc.</td>
                    <td className="px-6 py-4">Payment processing</td>
                    <td className="px-6 py-4">United States</td>
                    <td className="px-6 py-4">Payment information, billing data</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">SendGrid (Twilio)</td>
                    <td className="px-6 py-4">Email delivery</td>
                    <td className="px-6 py-4">United States</td>
                    <td className="px-6 py-4">Email addresses, email content</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">OpenAI</td>
                    <td className="px-6 py-4">AI processing</td>
                    <td className="px-6 py-4">United States</td>
                    <td className="px-6 py-4">Anonymized text for AI processing</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Intercom</td>
                    <td className="px-6 py-4">Customer support</td>
                    <td className="px-6 py-4">United States</td>
                    <td className="px-6 py-4">Support communications</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Analytics & Monitoring</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Processed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Google Analytics</td>
                    <td className="px-6 py-4">Usage analytics</td>
                    <td className="px-6 py-4">United States</td>
                    <td className="px-6 py-4">Anonymized usage data</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Sentry</td>
                    <td className="px-6 py-4">Error tracking</td>
                    <td className="px-6 py-4">United States</td>
                    <td className="px-6 py-4">Error logs, stack traces</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">LogRocket</td>
                    <td className="px-6 py-4">Session replay</td>
                    <td className="px-6 py-4">United States</td>
                    <td className="px-6 py-4">Session recordings (opt-in)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Notification of Changes</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
              <p className="mb-4">We will notify customers via email at least 30 days before:</p>
              <ul className="list-disc ml-6 mb-4">
                <li>Adding a new subprocessor</li>
                <li>Removing an existing subprocessor</li>
                <li>Changing the purpose or scope of processing</li>
                <li>Changing the location of data processing</li>
              </ul>
              <p>Customers may object to new subprocessors by contacting us within 14 days of notification.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Due Diligence</h2>
            <p className="mb-4">For each subprocessor, we:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Conduct security and privacy assessments</li>
              <li>Execute data processing agreements</li>
              <li>Ensure appropriate safeguards for international transfers</li>
              <li>Monitor compliance and performance</li>
              <li>Maintain incident response procedures</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Questions or Concerns</h2>
            <p className="mb-4">If you have questions about our subprocessors or wish to request additional information about our data processing practices, please contact:</p>
            <p className="mb-4">
              <strong>Data Protection Officer</strong><br />
              Email: <a href="mailto:dpo@aisalesagent.com" className="text-blue-600 hover:underline">dpo@aisalesagent.com</a><br />
              Phone: +1 (888) AI-SALES
            </p>
          </section>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Last updated: December 2024<br />
            This list is updated regularly as we add or remove subprocessors.
          </p>
        </div>
      </div>
    </div>
  )
}