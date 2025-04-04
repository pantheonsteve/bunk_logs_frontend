import React from 'react';
import BarChart from '../../charts/BarChart01';

// Import utilities
import { getCssVariable } from '../../utils/Utils';

function DashboardCard04() {

  const chartData = {
    labels: [
      '06-28-2024', '06-29-2024', '06-30-2024', '07-01-2024', '07-02-2024', '07-03-2024', '07-04-2024',
      '07-05-2024', '07-06-2024', '07-07-2024', '07-08-2024', '07-09-2024', '07-10-2024', '07-11-2024',
      '07-12-2024', '07-13-2024', '07-14-2024', '07-15-2024', '07-16-2024', '07-17-2024', '07-18-2024',
      '07-19-2024', '07-20-2024', '07-21-2024', '07-22-2024', '07-23-2024', '07-24-2024', '07-25-2024',
      '07-26-2024', '07-27-2024', '07-28-2024', '07-29-2024', '07-30-2024', '07-31-2024', '08-01-2024',
      '08-02-2024', '08-03-2024', '08-04-2024', '08-05-2024', '08-06-2024', '08-07-2024', '08-08-2024',
      '08-09-2024', '08-10-2024', '08-11-2024', '08-12-2024', '08-13-2024', '08-14-2024', '08-15-2024',
    ],
    datasets: [
      // Light blue bars
      {
        label: 'Direct',
        data: [
          1, 3, 1, 2, 5, 4, 1, 3, 1, 2,
          5, 4, 1, 3, 1, 2, 5, 4, 1, 3,
          5, 4, 1, 3, 1, 2, 5, 4, 1, 3,
          1, 2, 5, 4, 1, 3, 1, 2, 5, 4,
          1, 3, 1, 2, 5, 4, 1, 3, 1
        ],
        backgroundColor: getCssVariable('--color-sky-500'),
        hoverBackgroundColor: getCssVariable('--color-sky-600'),
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
      // Blue bars
      {
        label: 'Indirect',
        data: [
          4, 1, 5, 4, 5, 4, 4, 1, 5, 4,
          5, 4, 4, 1, 5, 4, 5, 4, 4, 1,
          5, 4, 5, 4, 4, 1, 5, 4, 5, 4,
          4, 1, 5, 4, 5, 4, 4, 1, 5, 4,
          5, 4, 4, 1, 5, 4, 5, 4, 4 
        ],
        backgroundColor: getCssVariable('--color-violet-500'),
        hoverBackgroundColor: getCssVariable('--color-violet-600'),
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
      // Red bars
      {
        label: 'Other',
        data: [
          4, 2, 5, 4, 5, 4, 1, 1, 1, 1,
          1, 1, 4, 1, 1, 4, 1, 1, 2, 1,
          1, 1, 5, 1, 1, 5, 1, 1, 2, 1,
          1, 1, 3, 1, 1, 5, 1, 1, 2, 1,
          1, 1, 2, 1, 1, 3, 1, 1, 2
        ],
        backgroundColor: getCssVariable('--color-red-500'),
        hoverBackgroundColor: getCssVariable('--color-red-600'),
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Direct VS Indirect</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <BarChart data={chartData} width={595} height={248} />
    </div>
  );
}

export default DashboardCard04;
