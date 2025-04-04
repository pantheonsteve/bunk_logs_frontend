import React from 'react';
import DoughnutChart from '../../charts/DoughnutChart';

// Import utilities
import { getCssVariable } from '../../utils/Utils';

function CategoryScoreChartCard( {category, ones, twos, threes, fours, fives} ) {

  const chartData = {
    labels: ['United States', 'Italy', 'Israel', 'Other'],
    datasets: [
      {
        label: 'Top Countries',
        data: [
          35, 30, 35, 16
        ],
        backgroundColor: [
          getCssVariable('--color-score-1'),
          getCssVariable('--color-score-2'),
          getCssVariable('--color-score-3'),
          getCssVariable('--color-score-4'),
        ],
        hoverBackgroundColor: [
          getCssVariable('--color-violet-600'),
          getCssVariable('--color-sky-600'),
          getCssVariable('--color-violet-900'),
          getCssVariable('--color-violet-900'),
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">{bunk_label}</h2>
        <h3>{date}</h3>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <DoughnutChart data={chartData} width={389} height={260} />
    </div>
  );
}

export default CategoryScoreChartCard;
