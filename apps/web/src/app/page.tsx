export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            🚀 AI Sales Agent
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            AI-Powered B2B Prospecting Platform
          </p>
          
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-green-600 font-semibold">Deployment Successful</span>
            </div>
            <p className="text-gray-700 mb-2">
              Platform is live and ready for development
            </p>
            <p className="text-sm text-gray-500">
              Version 0.1.0 - MVP Build
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <a 
              href="/api/health"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              API Health Check
            </a>
            <a 
              href="https://github.com/yoprobotics/ai-sales-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Smart Qualification</h3>
            <p className="text-gray-600 text-sm">
              AI-powered BANT scoring with transparent explanations
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="text-lg font-semibold mb-2">Personalized Messaging</h3>
            <p className="text-gray-600 text-sm">
              Generate context-aware emails in French and English
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2">Visual Pipeline</h3>
            <p className="text-gray-600 text-sm">
              Manage prospects with a Kanban-style CRM interface
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">Built With</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Next.js 14',
              'TypeScript',
              'Tailwind CSS',
              'PostgreSQL',
              'Prisma ORM',
              'Vercel'
            ].map((tech) => (
              <span 
                key={tech}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-600">
          <p>© 2025 YoProbotics. All rights reserved.</p>
        </footer>
      </div>
    </main>
  )
}
