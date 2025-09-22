import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Data Processing Agreement - AI Sales Agent',
  description: 'Data Processing Agreement for AI Sales Agent platform'
}

export default function DPAPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Data Processing Agreement (DPA)</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Definitions</h2>
            <ul className="list-disc ml-6 mb-4">
              <li><strong>"Controller"</strong>: The entity that determines the purposes and means of processing personal data</li>
              <li><strong>"Processor"</strong>: AI Sales Agent, processing data on behalf of the Controller</li>
              <li><strong>"Data Subject"</strong>: An identified or identifiable natural person</li>
              <li><strong>"Personal Data"</strong>: Any information relating to a Data Subject</li>
              <li><strong>"Processing"</strong>: Any operation performed on Personal Data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Scope and Purpose</h2>
            <p className="mb-4">This DPA applies to all Personal Data processed by AI Sales Agent on behalf of the Customer in connection with the provision of the Services.</p>
            <p className="mb-4">The purpose of processing is to provide B2B prospecting and sales automation services as described in the Terms of Service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Data Processing Details</h2>
            
            <h3 className="text-xl font-semibold mb-3">3.1 Categories of Data Subjects</h3>
            <ul className="list-disc ml-6 mb-4">
              <li>Customer's prospects and leads</li>
              <li>Customer's employees and authorized users</li>
              <li>Business contacts</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.2 Types of Personal Data</h3>
            <ul className="list-disc ml-6 mb-4">
              <li>Contact information (names, email addresses, phone numbers)</li>
              <li>Professional information (job titles, company names)</li>
              <li>Communication data (email content, interaction history)</li>
              <li>Usage data (platform activity, preferences)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.3 Duration of Processing</h3>
            <p className="mb-4">Personal Data will be processed for the duration of the Agreement and deleted within 30 days after termination, unless longer retention is required by law.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Processor Obligations</h2>
            <p className="mb-4">AI Sales Agent shall:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Process Personal Data only on documented instructions from the Controller</li>
              <li>Ensure persons authorized to process Personal Data are bound by confidentiality</li>
              <li>Implement appropriate technical and organizational security measures</li>
              <li>Assist the Controller in responding to data subject rights requests</li>
              <li>Delete or return all Personal Data at the end of the service provision</li>
              <li>Make available all information necessary to demonstrate compliance</li>
              <li>Allow for and contribute to audits and inspections</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Security Measures</h2>
            <p className="mb-4">We implement industry-standard security measures including:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Encryption of data in transit and at rest (AES-256)</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Regular security assessments and penetration testing</li>
              <li>Incident response and breach notification procedures</li>
              <li>Employee training on data protection</li>
              <li>Physical security of data centers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Sub-processors</h2>
            <p className="mb-4">The Controller consents to the engagement of the sub-processors listed at: <a href="/legal/subprocessors" className="text-blue-600 hover:underline">aisalesagent.com/legal/subprocessors</a></p>
            <p className="mb-4">We will notify you of any intended changes concerning sub-processors, giving you the opportunity to object to such changes.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. International Data Transfers</h2>
            <p className="mb-4">For transfers outside the EEA, we rely on:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>EU Standard Contractual Clauses (SCCs)</li>
              <li>Adequacy decisions where applicable</li>
              <li>Your explicit consent for specific transfers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Data Subject Rights</h2>
            <p className="mb-4">We will assist you in fulfilling your obligations to respond to data subject requests for:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Access to personal data</li>
              <li>Rectification or erasure</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Breach Notification</h2>
            <p className="mb-4">We will notify you without undue delay after becoming aware of a personal data breach, providing:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Description of the breach</li>
              <li>Categories and numbers of affected data subjects</li>
              <li>Likely consequences of the breach</li>
              <li>Measures taken or proposed to address the breach</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Audit Rights</h2>
            <p className="mb-4">You have the right to audit our compliance with this DPA, subject to:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Reasonable advance notice</li>
              <li>During regular business hours</li>
              <li>No more than once per year (unless required by regulators)</li>
              <li>Subject to confidentiality agreements</li>
            </ul>
          </section>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Last updated: December 2024<br />
            This DPA forms part of the Agreement between the parties.
          </p>
        </div>
      </div>
    </div>
  )
}