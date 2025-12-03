import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiBell, FiUser, FiLogOut, FiPlus } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import { Button } from './Button';
import CreatePostModal from './CreatePostModal';

const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50 md:ml-64">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Only on mobile */}
          <div className="flex items-center shrink-0 md:hidden">
            <img 
              src="/images/logo3.png" 
              alt="CraftConnect Logo" 
              className="w-7 h-7 sm:w-8 sm:h-8 mr-2 sm:mr-3 object-contain"
            />
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 hidden xs:block">CraftConnect</h1>
          </div>

          {/* Page Title - Desktop only */}
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-gray-900">
              {location.pathname === '/dashboard' && 'Home'}
              {location.pathname === '/discover' && 'Discover Artisans'}
              {location.pathname === '/jobs' && 'Available Jobs'}
              {location.pathname === '/my-hires' && 'My Hires'}
              {location.pathname === '/messages' && 'Messages'}
              {location.pathname === '/profile' && 'Profile'}
            </h1>
          </div>

          {/* Search Bar - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4 lg:mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-9 lg:pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Search artisans, skills..."
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Search Button */}
            <button className="md:hidden p-2 text-gray-400 hover:text-gray-500">
              <FiSearch className="h-5 w-5" />
            </button>

            {/* Create Post Button */}
            <Button 
              variant="primary" 
              size="small" 
              className="flex items-center text-xs sm:text-sm"
              onClick={() => setIsCreatePostOpen(true)}
            >
              <FiPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{user?.role === 'artisan' ? 'Share Work' : 'Post Job'}</span>
              <span className="sm:hidden">+</span>
            </Button>

            {/* Notifications */}
            <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-500 relative">
              <FiBell className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            {/* User Menu - Mobile only */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:hidden">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-1 transition-colors"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.username} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <FiUser className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </button>
              
              <button
                onClick={handleLogout}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-500"
                title="Logout"
              >
                <FiLogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreatePostModal 
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSuccess={() => {
          // Refresh the page or update the feed
          window.location.reload();
        }}
      />
    </header>
  );
};

export default DashboardHeader;