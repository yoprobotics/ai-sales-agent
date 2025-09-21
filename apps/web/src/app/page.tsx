export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          🚀 AI Sales Agent
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-powered B2B prospecting platform
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-lg mb-2">Smart Qualification</h3>
            <p className="text-gray-600">AI-powered prospect scoring with transparent explanations</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">✉️</div>
            <h3 className="font-semibold text-lg mb-2">Email Sequences</h3>
            <p className="text-gray-600">Personalized outreach campaigns in FR/EN</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-lg mb-2">CRM Pipeline</h3>
            <p className="text-gray-600">Visual pipeline management with insights</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}
