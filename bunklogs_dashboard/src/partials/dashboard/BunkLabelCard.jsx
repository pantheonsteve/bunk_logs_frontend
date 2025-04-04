import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BunkLabelCard({ bunkLabel }) {
  console.log('BunkLabelCard:', bunkLabel);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Changed to false since data is passed as prop

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xs">
        <div className="animate-pulse h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xs">
        <div className="text-red-500">Failed to load bunk label</div>
      </div>
    );
  }

  return (
    <span>
        {bunkLabel}
    </span>
  );
}

export default BunkLabelCard;