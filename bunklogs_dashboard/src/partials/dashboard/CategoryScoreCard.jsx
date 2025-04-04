import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoughnutChart from '../../charts/DoughnutChart';

// Import utilities
import { getCssVariable } from '../../utils/Utils';

/**
 * Calculates the distribution of scores for a given category from camper data
 * @param {Array} data - Array of camper data objects
 * @param {string} category - Category to analyze ('Social', 'Behavior', or 'Participation')
 * @returns {Array} Array of length 5 containing count of scores [count of 1s, 2s, 3s, 4s, 5s]
 */
function calculateScoreDistribution(data, category) {
  // Initialize array of length 5 with zeros
  const distribution = [0, 0, 0, 0, 0];
  
  // Convert category to lowercase key name
  const categoryKey = category.toLowerCase();
  
  // Loop through data
  data.forEach(entry => {
    // Get the score, convert to number
    const score = Number(entry[categoryKey]);
    
    // Only count if it's a valid number between 1-5
    if (!isNaN(score) && score >= 1 && score <= 5) {
      // Increment the corresponding index (score - 1 since array is 0-based)
      distribution[score - 1]++;
    }
  });
  
  return distribution;
}

function CategoryScoreCard({ category, bunk, date }) {
  console.log('Rendering CategoryScoreCard:', category, bunk, date); // Debug
  const [data, setData] = useState([0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [month, day, year] = date.split('/');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        
        console.log('Fetching data for:', formattedDate); // Debug
        
        const response = await axios.get(
          `https://dev-camper-care-bunk-logs.pantheonsite.io/api/v1/${bunk}/${formattedDate}`
        );
        
        console.log('Response:', response.data); // Debug
        
        // Use calculateScoreDistribution instead of reduce
        const counts = calculateScoreDistribution(response.data, category);
        
        console.log('Counts:', counts); // Debug
        setData(counts);
      } catch (error) {
        console.error('Error:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [category, bunk, date]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data); // Debug

  const chartData = {
    labels: [1,2,3,4,5],
    datasets: [{
      label: `${category} Scores`,
      data: data,
      backgroundColor: [
        getCssVariable('--color-score-1'),
        getCssVariable('--color-score-2'),
        getCssVariable('--color-score-3'),
        getCssVariable('--color-score-4'),
        getCssVariable('--color-score-5'),
      ],
      hoverBackgroundColor: [
        getCssVariable('--color-score-1'),
        getCssVariable('--color-score-2'),
        getCssVariable('--color-score-3'),
        getCssVariable('--color-score-4'),
        getCssVariable('--color-score-5'),
      ],
      borderWidth: 0,
    }],
  };

  console.log('Rendering CategoryScoreCard:', category, bunk, date); // Debug
  console.log('ChartData:', chartData); // Debug

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">{category} Scores</h2>
      </header>
      <DoughnutChart data={chartData} width={389} height={260} />
    </div>
  );
}

export default CategoryScoreCard;