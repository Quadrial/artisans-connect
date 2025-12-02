import React from 'react';
import { FiMessageCircle, FiSend, FiImage, FiPaperclip } from 'react-icons/fi';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/Button';

const MessagesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Sidebar />
      <DashboardHeader />

      <main className="md:ml-64 max-w-6xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Messages
          </h1>
          <p className="text-gray-600">
            Connect and communicate with artisans and clients
          </p>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FiMessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Messaging Feature Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            We're building a powerful messaging system to help you communicate seamlessly with your connections.
          </p>
          <Button variant="primary">
            Get Notified
          </Button>
        </div>

        {/* Feature Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FiSend className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Real-time Chat
            </h3>
            <p className="text-sm text-gray-600">
              Instant messaging with read receipts and typing indicators
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FiImage className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Media Sharing
            </h3>
            <p className="text-sm text-gray-600">
              Share images, documents, and project files easily
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <FiPaperclip className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Project Context
            </h3>
            <p className="text-sm text-gray-600">
              Keep conversations organized by project and job
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default MessagesPage;
