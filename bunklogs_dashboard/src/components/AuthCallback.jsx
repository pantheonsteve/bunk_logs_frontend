import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AuthCallback() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { provider } = useParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse the query parameters from the URL
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        if (!code) {
          throw new Error('No authorization code received from the provider');
        }

        console.log('Auth callback received:', { provider, code, state });

        // Make a request to your backend to exchange the code for a token
        const response = await fetch('/api/v1/auth/token/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            state,
            provider: provider || 'google', // Default to google if provider not specified
          }),
          credentials: 'include', // Important for cookies
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Authentication failed');
        }

        const data = await response.json();
        
        // Call the login function from your auth context with the token
        login(data.token);
        
        // Redirect to dashboard after successful login
        navigate('/dashboard');
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err.message || 'An error occurred during authentication');
        // Redirect to signin page after error
        setTimeout(() => navigate('/signin'), 3000);
      }
    };

    handleCallback();
  }, [location, navigate, provider, login]);

  if (error) {
    return (
      <div className="flex h-screen">
        <div className="m-auto text-center">
          <h1 className="text-xl font-bold mb-4">Authentication Error</h1>
          <p className="text-red-500">{error}</p>
          <p className="mt-4">Redirecting to sign in page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="m-auto text-center">
        <h1 className="text-xl font-bold mb-4">Processing Authentication</h1>
        <p>Please wait while we complete the authentication process...</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default AuthCallback;