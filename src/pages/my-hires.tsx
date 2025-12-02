import React from 'react';
import { FiUsers, FiCheckCircle, FiDollarSign } from 'react-icons/fi';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/Button';

const MyHiresPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Sidebar />
      <DashboardHeader />

      <main className="md:ml-64 max-w-6xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            My Hires
          </h1>
          <p className="text-gray-600">
            Manage your hired artisans and ongoing projects
          </p>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Hiring Management Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            Track your hired artisans, manage projects, and handle payments seamlessly all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary">
              Get Notified
            </Button>
            <Button variant="secondary">
              Learn More
            </Button>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Artisan Management
            </h3>
            <p className="text-sm text-gray-600">
              View all your hired artisans and their current projects in one dashboard
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Project Milestones
            </h3>
            <p className="text-sm text-gray-600">
              Track progress with milestone-based project management
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <FiDollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Payment Tracking
            </h3>
            <p className="text-sm text-gray-600">
              Manage payments, invoices, and transaction history
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default MyHiresPage;
