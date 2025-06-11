import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ScorecardBarChart = ({ scores, isDark }) => {
  const categories = Object.keys(scores);
  const data = {
    labels: categories.map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1)),
    datasets: [
      {
        label: 'Score',
        data: categories.map((cat) => {
          const value = scores[cat];
          if (typeof value === 'object' && value !== null && 'score' in value) {
            return parseFloat(value.score);
          }
          return parseFloat(value);
        }),
        backgroundColor: isDark
          ? ['#13FFAA', '#1E67C6', '#CE84CF', '#DD335C']
          : ['#0ea5e9', '#f59e42', '#f43f5e', '#10b981'],
        borderRadius: 8,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: { stepSize: 1, color: isDark ? '#fff' : '#222' },
        grid: { color: isDark ? '#444' : '#ddd' },
      },
      x: {
        ticks: { color: isDark ? '#fff' : '#222' },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="my-8">
      <Bar data={data} options={options} height={220} />
    </div>
  );
};

export default ScorecardBarChart;
