import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const error = searchParams.get('error');
    
    if (error) {
      setError(`Authentication failed: ${error}`);
      // Redirect to signin after a short delay
      setTimeout(() => navigate('/signin', { replace: true }), 3000);
      return;
    }
    
    // No error, check auth status
    checkAuth()
      .then(user => {
        if (user) {
          // Redirect based on user role
          if (user.role === 'Counselor' && user.bunks && user.bunks.length > 0) {
            navigate(`/bunk/${user.bunks[0].id}`, { replace: true });
          } else if (user.role === 'Unit Head' && user.units && user.units.length > 0) {
            navigate(`/unit/${user.units[0].id}`, { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        } else {
          // No user, redirect to signin
          navigate('/signin', { replace: true });
        }
      })
      .catch(err => {
        console.error('Auth check failed:', err);
        setError('Failed to verify authentication. Please try again.');
        setTimeout(() => navigate('/signin', { replace: true }), 3000);
      });
  }, [searchParams, navigate, checkAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {error ? (
          <div className="text-red-500 text-center">
            <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
            <p>{error}</p>
            <p className="mt-4 text-sm text-gray-500">Redirecting to sign in page...</p>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Authentication Successful</h2>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;