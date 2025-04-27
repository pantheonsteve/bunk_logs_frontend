import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { checkPermission } from '../utils/permissions';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If roles are specified and user doesn't have required role, redirect to unauthorized page
  if (roles.length > 0 && !checkPermission(user?.role, roles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;