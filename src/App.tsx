import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import DashboardPage from './pages/dashboard';

import './App.css';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes - Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route index element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
;
