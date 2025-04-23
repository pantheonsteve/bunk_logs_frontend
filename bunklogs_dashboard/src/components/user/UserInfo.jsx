import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import BunkTile from './BunkTile';

const UserInfo = () => {
    const { user, isAuthenticated, loading, error, logout, setError } = useAuth();
    const navigate = useNavigate();
  
    // Redirect to signin if not authenticated
    useEffect(() => {
      if (!isAuthenticated && !loading) {
        navigate('/signin');
      }
    }, [isAuthenticated, loading, navigate]);
  
    if (loading) {
      return (
        <div style={{ 
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <LoadingSpinner />
          <p style={{ textAlign: 'center' }}>Loading dashboard...</p>
        </div>
      );
    }
  
    if (!isAuthenticated) {
      return null; // Will redirect via useEffect
    }
  
    return (
      <div style={{ 
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
  
        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={() => setError(null)} 
          />
        )}
        <div className="flex flex-col col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl p-4">
            <div className="mb-4">
              <strong className="font-medium text-gray-800 dark:text-gray-100">{user?.name || user?.email} | Role: {user?.role}</strong>
            </div>
            
            {user?.bunks ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.bunks.map((bunk) => (
                  <BunkTile key={bunk.id} bunk_name={bunk.name} bunk_id={bunk.id} />
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 dark:text-gray-400">No Bunks Assigned</div>
            )}
        </div>
      </div>
    );
  };
  
  export default UserInfo;