import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiBriefcase, FiMessageCircle, FiUser, FiLogOut } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

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
      label: user?.role === 'artisan' ? 'Jobs' : 'My Hires'
    },
    {
      name: 'Messages',
      icon: FiMessageCircle,
      path: '/messages',
      label: 'Messages',
      badge: 3 // Example badge count
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 md:bg-white md:border-r md:border-gray-200 md:z-30">
      {/* Logo Section */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <img 
          src="/images/logo3.png" 
          alt="CraftConnect Logo" 
          className="w-8 h-8 mr-3 object-contain"
        />
        <h1 className="text-xl font-bold text-gray-900">CraftConnect</h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                active 
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${active ? 'stroke-2' : ''}`} />
                <span className="text-sm">{item.label}</span>
              </div>
              {item.badge && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {user?.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={user.username} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <FiUser className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
