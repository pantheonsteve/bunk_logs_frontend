import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xl text-gray-800 dark:text-white mb-2">Page Not Found</p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className="flex justify-center">
            <Link 
              to="/" 
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
