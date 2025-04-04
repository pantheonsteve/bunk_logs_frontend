import React, { useEffect } from 'react';
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


function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/bunk/:bunk_id" element={<BunkDashboard />} />
        <Route exact path="/camper/:camper_id" element={<CamperDashboard />} />
        <Route exact path="/" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
