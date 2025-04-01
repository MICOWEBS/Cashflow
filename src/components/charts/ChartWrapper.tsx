"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type ChartType = 'line' | 'bar';

interface ChartWrapperProps {
  type: ChartType;
  data: ChartData<ChartType>;
  options?: ChartOptions<ChartType>;
  height?: number;
}

export function ChartWrapper({ type, data, options, height = 300 }: ChartWrapperProps) {
  const defaultOptions: ChartOptions<ChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div style={{ height: height }}>
      {type === 'line' ? (
        <Line data={data as ChartData<'line'>} options={options || defaultOptions as ChartOptions<'line'>} />
      ) : (
        <Bar data={data as ChartData<'bar'>} options={options || defaultOptions as ChartOptions<'bar'>} />
      )}
    </div>
  );
} 