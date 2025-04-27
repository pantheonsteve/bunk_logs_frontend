import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ErrorNotification from './ErrorNotification';

function ApiErrorBoundary({ children }) {
  const { error, setError, isAuthenticated } = useAuth();
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  // Reset error state when component mounts
  useEffect(() => {
    return () => {
      if (hasError) {
        setHasError(false);
      }
    };
  }, []);

  // Handle global errors
  useEffect(() => {
    const handleGlobalError = (event) => {
      console.error('Global error caught:', event.error);
      setHasError(true);
      
      // Check if the error is related to auth
      if (event.error?.message?.includes('authentication') || 
          event.error?.message?.includes('Authorization')) {
        setError('Authentication error. Please sign in again.');
        navigate('/signin');
      }
    };

    window.addEventListener('error', handleGlobalError);
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, [navigate, setError]);

  // If there's an auth error and not on signin page, redirect
  useEffect(() => {
    if (error && !isAuthenticated && !window.location.pathname.includes('/signin')) {
      const timer = setTimeout(() => {
        navigate('/signin');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error, isAuthenticated, navigate]);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="fixed top-4 right-4 z-50">
          <ErrorNotification 
            message={error} 
            onDismiss={() => setError(null)}
            className="w-72"
          />
        </div>
      )}
      {children}
    </>
  );
}

export default ApiErrorBoundary;
