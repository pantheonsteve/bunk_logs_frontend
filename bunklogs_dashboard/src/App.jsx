import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { BunkProvider } from './contexts/BunkContext';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import BunkDashboard from './pages/BunkDashboard';
import CamperDashboard from './pages/CamperDashboard';
import Dashboard from './pages/Dashboard';
import SignInPage from './pages/SignInPage';

function BunkRedirect() {
  const { bunk_id } = useParams();
  const today = new Date().toISOString().split('T')[0];
  return <Navigate to={`/bunk/${bunk_id}/${today}`} replace />;
}

function App() {
  return (
    <AuthProvider>
      <BunkProvider>
        <Routes>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/bunk/:bunk_id" element={<BunkRedirect />} />
          <Route path="/bunk/:bunk_id/:date" element={<BunkDashboard />} />
          <Route path="/camper/:camper_id" element={<CamperDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/signin" />} />
          {/* Add other routes as needed */}
        </Routes>
      </BunkProvider>
    </AuthProvider>
  );
}

export default App;