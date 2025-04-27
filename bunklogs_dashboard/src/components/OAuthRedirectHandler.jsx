import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * This component handles OAuth redirects and ensures authentication state is properly captured
 */
const OAuthRedirectHandler = () => {
  const { checkAuthStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // This is crucial - we need to check auth status after redirect
    const handleRedirect = async () => {
      console.log('OAuth redirect handler - checking auth status');
      
      // Add a small delay to ensure the session is set on the server
      setTimeout(async () => {
        const isAuthenticated = await checkAuthStatus();
        console.log('Authentication check result:', isAuthenticated);
        
        if (isAuthenticated) {
          // If authenticated, redirect to dashboard
          navigate('/dashboard');
        } else {
          // If auth failed, redirect to signin
          navigate('/signin');
        }
      }, 1000); // 1 second delay
    };

    handleRedirect();
  }, [checkAuthStatus, navigate]);

  return (
    <div className="oauth-redirect-handler">
      <p>Processing authentication...</p>
    </div>
  );
};

export default OAuthRedirectHandler;