import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (token) {
        try {
          const response = await fetch('/api/v1/auth/user/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          });

          if (response.ok) {
            const userData = await response.json();
            console.log('User data:', userData);
            setUser(userData);
          } else {
            // If token is invalid, clear it
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Error checking auth status:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [token]);

  const login = useCallback((newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/v1/auth/logout/', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  }, []);

  // Create the value object with user state and functions
  const value = {
    user,
    loading,
    setUser,
    login,
    logout,
    isAuthenticated: !!user,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};