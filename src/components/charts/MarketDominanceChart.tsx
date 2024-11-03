import React, { useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { darkThemeOptions } from '../../utils/chartConfig';

interface MarketDominanceChartProps {
  data: {
    [key: string]: number;
  };
  id: string;
}

export const MarketDominanceChart: React.FC<MarketDominanceChartProps> = ({ data, id }) => {
  const chartRef = useRef(null);

  const chartData = {
    labels: Object.keys(data).map(key => key.toUpperCase()),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          '#4F46E5',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#EC4899',
        ],
      },
    ],
  };

  const options = {
    ...darkThemeOptions,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#E5E7EB',
        },
      },
    },
  };

  return (
    <Doughnut 
      ref={chartRef}
      data={chartData} 
      options={options}
      key={id} // Add unique key to force re-render
    />
  );
};