// File: app/dashboardutama/components/ClientChartRenderer.tsx
'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ClientChartRendererProps {
  labels: string[];
  data: number[];
  type: 'income' | 'customers';
}

export default function ClientChartRenderer({ labels, data, type }: ClientChartRendererProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: type === 'income' ? 'Income (Rp)' : 'Unique Customers',
        data,
        borderColor: type === 'income' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
        backgroundColor: type === 'income' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fff',
        },
      },
      title: {
        display: true,
        text: type === 'income' ? 'Monthly Income' : 'Monthly Unique Customers',
        color: '#fff',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
}