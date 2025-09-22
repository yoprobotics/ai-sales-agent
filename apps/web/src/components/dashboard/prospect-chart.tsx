'use client'

interface ProspectChartProps {
  timeRange: string
}

export function ProspectChart({ timeRange }: ProspectChartProps) {
  // Placeholder chart - in production, use recharts or similar
  return (
    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-sm text-gray-500">Prospect trends for {timeRange}</p>
        <p className="text-xs text-gray-400 mt-2">Chart visualization coming soon</p>
      </div>
    </div>
  )
}