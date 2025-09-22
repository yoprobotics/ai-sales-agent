'use client'

interface PerformanceMetricsProps {
  timeRange: string
}

interface Metric {
  label: string
  value: number
  change: number
  unit?: string
}

export function PerformanceMetrics({ timeRange }: PerformanceMetricsProps) {
  // Mock metrics - will connect to API
  const metrics: Metric[] = [
    { label: 'Open Rate', value: 42.3, change: 5.2, unit: '%' },
    { label: 'Click Rate', value: 18.7, change: -2.1, unit: '%' },
    { label: 'Reply Rate', value: 8.4, change: 3.8, unit: '%' },
    { label: 'Meeting Booked', value: 12, change: 4, unit: '' },
  ]
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">{metric.label}</p>
          <p className="text-2xl font-bold text-gray-900">
            {metric.value}{metric.unit}
          </p>
          <p className={`text-sm ${
            metric.change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}{metric.unit}
          </p>
        </div>
      ))}
    </div>
  )
}