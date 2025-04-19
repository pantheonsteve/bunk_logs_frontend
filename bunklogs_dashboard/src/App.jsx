import React, { useEffect } from 'react';
import { Navigate,useParams } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BunkProvider } from './contexts/BunkContext';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import BunkDashboard from './pages/BunkDashboard';
import CamperDashboard from './pages/CamperDashboard';
import Dashboard from './pages/Dashboard';
import Signin from './pages/Signin';

function BunkRedirect() {
  const { bunk_id } = useParams();
  const today = new Date().toISOString().split('T')[0];
  return <Navigate to={`/bunk/${bunk_id}/${today}`} replace />;
}

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <AuthProvider>
      <BunkProvider>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/bunk/:bunk_id" element={<BunkRedirect />} />
          <Route exact path="/bunk/:bunk_id/:date" element={<BunkDashboard />} />
          <Route exact path="/camper/:camper_id" element={<CamperDashboard />} />
          <Route exact path="/" element={<Dashboard />} />
        </Routes>
      </BunkProvider>
    </AuthProvider>
  );
}

export default App;
