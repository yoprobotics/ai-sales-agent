export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <main className="flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          AI Sales Agent
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          AI-powered B2B prospecting platform with intelligent qualification, 
          personalized messaging, and CRM pipeline management.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            🚀 Deployment Successful!
          </h2>
          <p className="text-blue-700">
            Your AI Sales Agent platform is now live and ready for development.
          </p>
        </div>
      </main>
    </div>
  );
}