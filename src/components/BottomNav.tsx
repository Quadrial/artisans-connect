import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiBriefcase, FiMessageCircle, FiUser } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    {
      name: 'Home',
      icon: FiHome,
      path: '/dashboard',
      label: 'Home'
    },
    {
      name: 'Discover',
      icon: FiSearch,
      path: '/discover',
      label: 'Discover'
    },
    {
      name: user?.role === 'artisan' ? 'Jobs' : 'My Hires',
      icon: FiBriefcase,
      path: user?.role === 'artisan' ? '/jobs' : '/my-hires',
      label: user?.role === 'artisan' ? 'Jobs' : 'Hires'
    },
    {
      name: 'Messages',
      icon: FiMessageCircle,
      path: '/messages',
      label: 'Messages'
    },
    {
      name: 'Profile',
      icon: FiUser,
      path: '/profile',
      label: 'Profile'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`w-6 h-6 ${active ? 'stroke-2' : ''}`} />
              <span className={`text-xs mt-1 ${active ? 'font-semibold' : 'font-normal'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
