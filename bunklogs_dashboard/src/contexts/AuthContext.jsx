import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csrfTokenInitialized, setCsrfTokenInitialized] = useState(false);

  // Configure axios with better defaults for Django
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:8000';
    axios.defaults.withCredentials = true;
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
  }, []);

  console.log('axios defaults:', axios.defaults);

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('/api/v1/csrf-token/');
      // Set CSRF token in axios headers
      axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
      setCsrfTokenInitialized(true);
      return response.data.csrfToken;
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      setError('Failed to connect to the server. Please try again.');
      return null;
    }
  };

  const checkAuthStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get CSRF token first if not initialized
      if (!csrfTokenInitialized) {
        await fetchCsrfToken();
      }
      
      // Check auth status
      const response = await axios.get('/api/v1/auth-status/');
      
      console.log('Auth status response:', response.data);
      
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
      } else {
        console.log('Not authenticated according to backend');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      setUser(null);
      setError('Authentication check failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Fetch CSRF token first, then check auth status
    const initAuth = async () => {
      await fetchCsrfToken();
      await checkAuthStatus();
    };
    
    initAuth();
    
    // Set up periodic auth check to maintain session
    const authCheckInterval = setInterval(() => {
      checkAuthStatus();
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    // Check URL for error parameters
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam) {
      if (errorParam === 'authentication_failed') {
        setError('Authentication failed. Please try again.');
      } else {
        setError('An error occurred during sign in. Please try again.');
      }
      
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
    
    return () => {
      clearInterval(authCheckInterval);
    };
  }, []);

  const loginWithGoogle = async () => {
    // Make sure CSRF token is set before redirecting
    await fetchCsrfToken();
    window.location.href = 'http://localhost:8000/accounts/google/login/';
  };

  const logout = async () => {
    try {
      // Get CSRF token first
      await fetchCsrfToken();
      
      // Logout request
      await axios.post('/accounts/logout/');
      setUser(null);
      window.location.href = '/signin';
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed. Please try again.');
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    loginWithGoogle,
    logout,
    checkAuthStatus,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;