import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { darkThemeOptions } from '../../utils/chartConfig';

interface SparklineChartProps {
  data: number[];
  color?: string;
  id: string;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({ data, color = '#4F46E5', id }) => {
  const chartRef = useRef(null);

  const chartData = {
    labels: data.map((_, i) => i),
    datasets: [
      {
        data,
        borderColor: color,
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    ...darkThemeOptions,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  };

  return (
    <div className="h-12">
      <Line 
        ref={chartRef}
        data={chartData} 
        options={options}
        key={id} // Add unique key to force re-render
      />
    </div>
  );
};