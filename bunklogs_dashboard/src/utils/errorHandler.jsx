import axios from 'axios';

/**
 * Handles API errors in a consistent way throughout the application
 * @param {Error} error - The error object from axios or other source
 * @param {Function} setError - State setter for error message
 * @param {Object} options - Additional options for error handling
 * @returns {String} Formatted error message
 */
export const handleApiError = (error, setError, options = {}) => {
  const { defaultMessage = 'An unexpected error occurred' } = options;
  
  let errorMessage = defaultMessage;
  
  if (axios.isAxiosError(error)) {
    // Handle network errors
    if (!error.response) {
      errorMessage = 'Network error: Unable to connect to the server';
    } 
    // Handle HTTP error responses
    else {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data.message || 'Invalid request data';
          break;
        case 401:
          errorMessage = 'Authentication required. Please sign in again.';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action';
          break;
        case 404:
          errorMessage = 'The requested resource was not found';
          break;
        case 500:
          errorMessage = 'Server error: Please try again later or contact support';
          break;
        default:
          errorMessage = data.message || `Error ${status}: ${defaultMessage}`;
      }
      
      // Handle special error cases
      if (data?.error === 'MultipleObjectsReturned') {
        errorMessage = 'Authentication error: Please contact your administrator.';
      }
    }
  }
  
  // If setError function is provided, update the error state
  if (setError && typeof setError === 'function') {
    setError(errorMessage);
  }
  
  // Log error for debugging
  console.error('API Error:', error);
  
  return errorMessage;
};

/**
 * Creates an authentication error message
 * @param {String} message - Optional custom message
 * @returns {String} Formatted auth error message
 */
export const createAuthError = (message = null) => {
  return message || 'Authentication failed. Please sign in again.';
};
