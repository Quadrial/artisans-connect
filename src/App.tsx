import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
// import LandingPage from './pages';
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/login';
import RegisterPage from './pages/register';

// Protected Pages
import DashboardPage from './pages/dashboard';
import ProfilePage from './pages/profile';
import UserProfilePage from './pages/UserProfilePage';
import DiscoverPage from './pages/discover';
import JobsPage from './pages/jobs';
import MyHiresPage from './pages/my-hires';
import MessagesPage from './pages/messages';
import VerificationPage from './pages/verification';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';

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
      
      {/* Protected Routes - Profile */}
      <Route path="/profile" element={<ProtectedRoute />}>
        <Route index element={<ProfilePage />} />
      </Route>

      {/* Protected Routes - User Profile */}
      <Route path="/user/:userId" element={<ProtectedRoute />}>
        <Route index element={<UserProfilePage />} />
      </Route>

      {/* Protected Routes - Discover */}
      <Route path="/discover" element={<ProtectedRoute />}>
        <Route index element={<DiscoverPage />} />
      </Route>
      <Route path="/jobs" element={<ProtectedRoute />}>
        <Route index element={<JobsPage />} />
      </Route>

      {/* Protected Routes - My Hires */}
      <Route path="/my-hires" element={<ProtectedRoute />}>
        <Route index element={<MyHiresPage />} />
      </Route>

      {/* Protected Routes - Messages */}
      <Route path="/messages" element={<ProtectedRoute />}>
        <Route index element={<MessagesPage />} />
      </Route>

      {/* Protected Routes - Verification */}
      <Route path="/verification" element={<ProtectedRoute />}>
        <Route index element={<VerificationPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminProtectedRoute />}>
        <Route index element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
