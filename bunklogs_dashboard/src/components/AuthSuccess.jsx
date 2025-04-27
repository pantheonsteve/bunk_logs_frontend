import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthSuccess = () => {
  const auth = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authProcessed, setAuthProcessed] = useState(false); // Add tracking state
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Skip if we've already processed the auth
    if (authProcessed) return;
    
    const handleSuccess = async () => {
      try {
        // Get user data from URL
        const searchParams = new URLSearchParams(location.search);
        const userData = searchParams.get('data');
        
        if (!userData) {
          console.error('No user data received');
          setError('No user data received. Authentication failed.');
          setLoading(false);
          setAuthProcessed(true);
          return;
        }
        
        try {
          // Parse the JSON user data
          const user = JSON.parse(decodeURIComponent(userData));
          
          // Check if setUser exists
          if (auth && typeof auth.setUser === 'function') {
            auth.setUser(user);
            setAuthProcessed(true);
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              navigate('/dashboard');
            }, 500);
          } else {
            console.error('Auth context or setUser function is missing', auth);
            setError('Authentication context error');
          }
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          setError(`Error parsing authentication data: ${parseError.message}`);
        }
      } catch (err) {
        console.error('Error in auth success handling:', err);
        setError(`Authentication error: ${err.message}`);
      } finally {
        setLoading(false);
        setAuthProcessed(true);
      }
    };
    
    handleSuccess();
  }, [location.search, navigate, auth, authProcessed]); // Only include necessary dependencies
  
  if (loading) {
    return (
      <div className="auth-success-loading" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <h3>Finalizing your sign in...</h3>
        <div className="spinner" style={{
          border: '4px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '50%',
          borderTop: '4px solid #3498db',
          width: '30px',
          height: '30px',
          animation: 'spin 1s linear infinite',
          marginTop: '20px'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="auth-success-error" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        color: '#e74c3c'
      }}>
        <h3>Authentication Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/signin')}
          style={{
            marginTop: '20px',
            padding: '10px 15px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Sign In
        </button>
      </div>
    );
  }
  
  return null;
};

export default AuthSuccess;