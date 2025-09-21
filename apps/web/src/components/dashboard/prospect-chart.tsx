'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

interface ProspectChartProps {
  timeRange: string;
}

export function ProspectChart({ timeRange }: ProspectChartProps) {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['prospect-chart', timeRange],
    queryFn: async (): Promise<ChartData> => {
      // Mock data for now
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'New Prospects',
            data: [12, 19, 3, 5, 2, 8, 15],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          },
          {
            label: 'Qualified',
            data: [8, 12, 2, 3, 1, 5, 10],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
          },
        ],
      };
    },
  });

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  // Simple chart visualization (in production, use a charting library like recharts)
  return (
    <div className="h-64 relative">
      <div className="absolute inset-0 flex flex-col justify-between">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between h-full text-xs text-gray-500 pr-2">
          <span>20</span>
          <span>15</span>
          <span>10</span>
          <span>5</span>
          <span>0</span>
        </div>
      </div>
      <div className="ml-8 h-full flex items-end justify-between gap-2">
        {/* Bars */}
        {chartData?.labels.map((label, index) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex gap-1 items-end h-48">
              <div
                className="flex-1 bg-blue-500 rounded-t"
                style={{
                  height: `${(chartData.datasets[0].data[index] / 20) * 100}%`,
                }}
              />
              <div
                className="flex-1 bg-green-500 rounded-t"
                style={{
                  height: `${(chartData.datasets[1].data[index] / 20) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex gap-4 justify-center mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-gray-600">New Prospects</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-600">Qualified</span>
        </div>
      </div>
    </div>
  );
}