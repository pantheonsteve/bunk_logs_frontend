import React from 'react';
import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-10v4m0 0v4m0-4h4m-4 0H9" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          <div className="flex justify-center">
            <Link 
              to="/dashboard" 
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
