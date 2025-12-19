import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { FiShield, FiRefreshCw } from 'react-icons/fi';

const AdminProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const token = localStorage.getItem('craft_connect_token');
      const user = localStorage.getItem('craft_connect_user');

      if (!token || !user) {
        setIsAuthenticated(false);
        return;
      }

      const userData = JSON.parse(user);
      
      // Check if user has admin role
      if (userData.role !== 'admin') {
        setIsAuthenticated(false);
        return;
      }

      // Verify token with backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.admin.role === 'admin') {
          setIsAuthenticated(true);
          setIsAdmin(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('craft_connect_token');
          localStorage.removeItem('craft_connect_user');
        }
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('craft_connect_token');
        localStorage.removeItem('craft_connect_user');
      }
    } catch (error) {
      console.error('Admin auth check error:', error);
      setIsAuthenticated(false);
      localStorage.removeItem('craft_connect_token');
      localStorage.removeItem('craft_connect_user');
    }
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiShield className="w-10 h-10 text-white" />
          </div>
          <FiRefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying Admin Access
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your administrative privileges...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated or not admin - redirect to admin login
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Authenticated admin - render protected content
  return <Outlet />;
};

export default AdminProtectedRoute;