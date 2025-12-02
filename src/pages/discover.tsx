import React, { useState } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/Button';

const DiscoverPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Sidebar />
      <DashboardHeader />

      <main className="md:ml-64 max-w-6xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Discover Artisans
          </h1>
          <p className="text-gray-600">
            Find skilled professionals for your next project
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by skill, name, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-3 mt-4">
            <Button variant="secondary" size="small" className="flex items-center">
              <FiFilter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="secondary" size="small">
              Nearby
            </Button>
            <Button variant="secondary" size="small">
              Top Rated
            </Button>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Discover Feature Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            We're building an amazing search experience to help you find the perfect artisan for your project.
          </p>
          <Button variant="primary">
            Get Notified
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default DiscoverPage;
