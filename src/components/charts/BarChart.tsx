import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { darkThemeOptions } from '../../utils/chartConfig';

interface BarChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string;
    }>;
  };
  id: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, id }) => {
  const chartRef = useRef(null);

  return (
    <Bar 
      ref={chartRef}
      data={data} 
      options={darkThemeOptions}
      key={id} // Add unique key to force re-render
    />
  );
};