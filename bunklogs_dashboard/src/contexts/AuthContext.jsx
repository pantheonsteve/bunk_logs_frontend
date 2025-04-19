// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Configure axios defaults for CSRF support
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;  // This enables sending cookies
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');

  // Get CSRF token on mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/csrf-token/');
        setCsrfToken(response.data.csrfToken);
        axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!csrfToken) return;

      try {
        const response = await axios.get('http://localhost:8000/api/v1/auth-status/');
        console.log('Auth status response:', response.data); // Debug the actual response
        
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
          console.log('User authenticated:', response.data.user);
        } else {
          console.log('User not authenticated according to response');
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [csrfToken]);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:8000/accounts/login/', credentials);
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        // Refresh auth status after login
        const authResponse = await axios.get('http://localhost:8000/api/v1/auth-status/');
        if (authResponse.data.isAuthenticated) {
          setUser(authResponse.data.user);
          return { success: true };
        }
      }
      return { success: false, message: response.data.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('http://localhost:8000/accounts/logout/');
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;