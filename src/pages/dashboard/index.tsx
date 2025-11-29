// src/pages/dashboard/index.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const DashboardHomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard, {user?.username || 'User'}!</h1>
      <p className="text-gray-700 mb-6">Here you can manage your posts, skills, and other profile information.</p>
      <nav className="flex space-x-4">
        <Link to="/dashboard/posts" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Manage Your Posts
        </Link>
        <Link to="/dashboard/skills" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Manage Your Skills
        </Link>
      </nav>
    </div>
  );
};

export default DashboardHomePage;
