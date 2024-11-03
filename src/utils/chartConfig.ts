import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Default dark theme options
export const darkThemeOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#E5E7EB'
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(229, 231, 235, 0.1)'
      },
      ticks: {
        color: '#E5E7EB'
      }
    },
    y: {
      grid: {
        color: 'rgba(229, 231, 235, 0.1)'
      },
      ticks: {
        color: '#E5E7EB'
      }
    }
  }
};