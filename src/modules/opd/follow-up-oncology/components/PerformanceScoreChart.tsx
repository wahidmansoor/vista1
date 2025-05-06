import React from 'react';
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
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceData {
  date: string;
  ecog: number;
  kps: number;
}

interface PerformanceScoreChartProps {
  data: PerformanceData[];
}

export const PerformanceScoreChart: React.FC<PerformanceScoreChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'ECOG Score',
        data: data.map(d => d.ecog),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        yAxisID: 'y',
      },
      {
        label: 'KPS Score',
        data: data.map(d => d.kps),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        yAxisID: 'y1',
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'ECOG Score'
        },
        min: 0,
        max: 4,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'KPS Score'
        },
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Performance Status Trends',
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Score Trends</h3>
      <div className="h-64">
        <Line options={options} data={chartData} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <p className="font-medium">ECOG Score Interpretation:</p>
          <ul className="list-disc list-inside">
            <li>0: Fully active</li>
            <li>1: Restricted but ambulatory</li>
            <li>2: Ambulatory, capable of self-care</li>
            <li>3: Limited self-care</li>
            <li>4: Completely disabled</li>
          </ul>
        </div>
        <div>
          <p className="font-medium">KPS Score Interpretation:</p>
          <ul className="list-disc list-inside">
            <li>100-90: Normal activity</li>
            <li>80-70: Normal activity with effort</li>
            <li>60-50: Occasional assistance needed</li>
            <li>40-30: Disabled, special care needed</li>
            <li>20-10: Very sick, hospitalization</li>
          </ul>
        </div>
      </div>
    </div>
  );
};