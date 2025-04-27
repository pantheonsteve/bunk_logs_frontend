// File: frontend/src/pages/SignIn.jsx

import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GoogleSignInButton from '../components/GoogleLoginButton';

const SignIn = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from location state, or fallback to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  
  // If user is already authenticated, redirect to intended destination
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, from]);
  
  // If still loading, show loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If not authenticated, show sign in page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Bunk Logs
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Track camper progress and daily activities
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          {/* Google Sign In Button */}
          <div>
            <GoogleSignInButton />
          </div>
          
          <div className="text-sm text-center">
            <p className="text-gray-500">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;