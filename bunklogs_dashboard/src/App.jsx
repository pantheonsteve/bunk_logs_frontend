import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthCallback from './components/AuthCallback';
import AuthSuccess from './components/AuthSuccess';
import SignInPage from './pages/SigninPage';
import Dashboard from './pages/Dashboard';
import BunkDashboard from './pages/BunkDashboard';
import CamperDashboard from './pages/CamperDashboard';

import './css/style.css';

import './charts/ChartjsConfig';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* Updated route with exact match and proper component rendering */}
        <Route path="/api/v1/auth/social/:provider/callback" element={<AuthCallback />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bunk/:bunk_id/:date" element={<BunkDashboard />} />
        <Route path="/camper/:camperId" element={<CamperDashboard />} />
        {/* Other routes */}
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;