import React, { useEffect, useRef } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart, LineController, PointElement, LineElement, Filler, CategoryScale, LinearScale, RadialLinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(LineController, PointElement, LineElement, Filler, CategoryScale, LinearScale, RadialLinearScale, Tooltip, Legend);

const ScorecardAnalytics = ({ scores, isDark, benchmarkScores }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup: Destroy chart instance on unmount
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  const categories = Object.keys(scores);
  const data = {
    labels: categories.map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1)),
    datasets: [
      {
        label: 'Your Scores',
        data: categories.map((cat) => parseFloat(scores[cat].score)),
        backgroundColor: isDark ? 'rgba(19, 255, 170, 0.2)' : 'rgba(14, 165, 233, 0.2)',
        borderColor: isDark ? '#13FFAA' : '#0ea5e9',
        borderWidth: 2,
        pointBackgroundColor: isDark ? '#13FFAA' : '#0ea5e9',
      },
      {
        label: 'Benchmark',
        data: categories.map((cat) => benchmarkScores[cat]),
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
        borderColor: '#808080',
        borderWidth: 2,
        pointBackgroundColor: '#808080',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: isDark ? '#fff' : '#222' } },
      tooltip: { enabled: true },
    },
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: { stepSize: 2, color: isDark ? '#fff' : '#222' },
        grid: { color: isDark ? '#444' : '#ddd' },
        pointLabels: { font: { size: 14 }, color: isDark ? '#fff' : '#222' },
      },
    },
  };

  return (
    <div className="my-8">
     
      <Radar ref={chartRef} data={data} options={options} height={300} />
    </div>
  );
};

export default ScorecardAnalytics;