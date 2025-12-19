import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUsers, FiShield, FiLogOut, FiSettings, FiEye, FiCheck, FiX, 
  FiClock, FiDownload, FiRefreshCw, FiBarChart, FiAlertCircle 
} from 'react-icons/fi';
import { Button } from '../components/Button';

interface PendingVerification {
  userId: string;
  username: string;
  email: string;
  submittedAt: string;
  documents: {
    nin_number: string;
    nin_front: { filename: string; data: string; mimetype: string; };
    nin_back: { filename: string; data: string; mimetype: string; };
    selfie: { filename: string; data: string; mimetype: string; };
    video?: { filename: string; data: string; mimetype: string; };
  };
  metadata: {
    ipAddress: string;
    userAgent: string;
  };
}

interface DashboardStats {
  users: {
    total: number;
    verified: number;
    artisans: number;
    customers: number;
    recent: number;
  };
  verifications: {
    pending: number;
    verified: number;
    rejected: number;
    rate: number;
    recent: number;
  };
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'users' | 'settings'>('overview');
  const [pendingVerifications, setPendingVerifications] = useState<PendingVerification[]>([]);
  const [selectedVerification, setSelectedVerification] = useState<PendingVerification | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [nextRefresh, setNextRefresh] = useState<number>(60);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadPendingVerifications(),
        loadDashboardStats()
      ]);
      setLastRefresh(new Date());
      setNextRefresh(60); // Reset countdown
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadPendingVerifications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verification/admin/pending`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('craft_connect_token')}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setPendingVerifications(result.verifications);
      }
    } catch (error) {
      console.error('Error loading pending verifications:', error);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('craft_connect_token')}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Auto-refresh every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData();
    }, 60000); // 60 seconds = 1 minute

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  // Countdown timer for next refresh
  useEffect(() => {
    const countdown = setInterval(() => {
      setNextRefresh(prev => {
        if (prev <= 1) {
          return 60; // Reset when it reaches 0
        }
        return prev - 1;
      });
    }, 1000); // Update every second

    return () => clearInterval(countdown);
  }, []);

  const reviewVerification = async (userId: string, decision: 'approve' | 'reject') => {
    try {
      setProcessing(userId);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verification/admin/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('craft_connect_token')}`,
        },
        body: JSON.stringify({
          userId,
          decision,
          notes: reviewNotes
        }),
      });

      const result = await response.json();
      
      console.log('Verification review response:', result);
      
      if (result.success) {
        setPendingVerifications(prev => prev.filter(v => v.userId !== userId));
        setSelectedVerification(null);
        setReviewNotes('');
        await loadDashboardStats(); // Refresh stats
        
        // Show success message
        setError('');
      } else {
        console.error('Verification review failed:', result);
        const errorMessage = result.details 
          ? `${result.message}\n\nDetails: ${result.details}`
          : result.message;
        setError(`Failed to ${decision} verification: ${errorMessage}`);
      }
    } catch (error) {
      console.error(`Error ${decision}ing verification:`, error);
      setError(`Failed to ${decision} verification`);
    } finally {
      setProcessing(null);
    }
  };

  const downloadFile = (data: string, filename: string, mimetype: string) => {
    const link = document.createElement('a');
    link.href = `data:${mimetype};base64,${data}`;
    link.download = filename;
    link.click();
  };

  const handleLogout = () => {
    localStorage.removeItem('craft_connect_token');
    localStorage.removeItem('craft_connect_user');
    navigate('/admin/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                <FiShield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CraftConnect Admin</h1>
                <p className="text-sm text-gray-500">Identity Verification Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Auto-refresh indicator */}
              <div className="text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <FiClock className="w-4 h-4" />
                  <span>Next refresh: {nextRefresh}s</span>
                </div>
                {lastRefresh && (
                  <div className="text-xs text-gray-400">
                    Last: {lastRefresh.toLocaleTimeString()}
                  </div>
                )}
              </div>

              <Button
                variant="secondary"
                onClick={loadDashboardData}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Now</span>
              </Button>
              
              <Button
                variant="secondary"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: FiBarChart },
              { id: 'verifications', label: 'Verifications', icon: FiShield },
              { id: 'users', label: 'Users', icon: FiUsers },
              { id: 'settings', label: 'Settings', icon: FiSettings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'verifications' | 'users' | 'settings')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.id === 'verifications' && pendingVerifications.length > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                        {pendingVerifications.length}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <FiAlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="ml-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
                <p className="text-gray-600">Monitor system performance and verification statistics</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Auto-refresh enabled</span>
                </div>
                <p className="text-xs text-gray-400">Updates every minute</p>
              </div>
            </div>

            {stats && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FiUsers className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.users.total}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <FiCheck className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Verified Users</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.users.verified}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <FiClock className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.verifications.pending}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FiBarChart className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Verification Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.verifications.rate}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Artisans</span>
                        <span className="font-medium">{stats.users.artisans}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customers</span>
                        <span className="font-medium">{stats.users.customers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">New Users (30 days)</span>
                        <span className="font-medium">{stats.users.recent}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approved</span>
                        <span className="font-medium text-green-600">{stats.verifications.verified}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rejected</span>
                        <span className="font-medium text-red-600">{stats.verifications.rejected}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recent Verifications (30 days)</span>
                        <span className="font-medium">{stats.verifications.recent}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Verifications Tab */}
        {activeTab === 'verifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Identity Verifications</h2>
                <p className="text-gray-600">Review and manage user identity verification requests</p>
              </div>
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {pendingVerifications.length} Pending
              </div>
            </div>

            {/* Pending Verifications */}
            <div className="bg-white rounded-xl shadow-sm border">
              {loading ? (
                <div className="p-8 text-center">
                  <FiRefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Loading pending verifications...</p>
                </div>
              ) : pendingVerifications.length === 0 ? (
                <div className="p-8 text-center">
                  <FiCheck className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-500">No pending verifications to review</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {pendingVerifications.map((verification) => (
                    <div key={verification.userId} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <FiClock className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{verification.username}</h3>
                            <p className="text-sm text-gray-500">{verification.email}</p>
                            <p className="text-xs text-gray-400">
                              Submitted: {formatDate(verification.submittedAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right text-sm">
                            <p className="text-gray-900 font-mono">
                              NIN: {verification.documents.nin_number}
                            </p>
                            <p className="text-gray-500">
                              IP: {verification.metadata.ipAddress}
                            </p>
                          </div>
                          <Button
                            variant="primary"
                            size="small"
                            onClick={() => setSelectedVerification(verification)}
                            className="flex items-center space-x-1"
                          >
                            <FiEye className="w-4 h-4" />
                            <span>Review</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-500">Advanced user management features coming soon...</p>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <FiSettings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
            <p className="text-gray-500">System configuration options coming soon...</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Review Verification - {selectedVerification.username}
                  </h3>
                  <p className="text-gray-600">NIN: {selectedVerification.documents.nin_number}</p>
                </div>
                <button
                  onClick={() => setSelectedVerification(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* User Information */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">User Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Username:</span>
                    <span className="ml-2 text-gray-900">{selectedVerification.username}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 text-gray-900">{selectedVerification.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Submitted:</span>
                    <span className="ml-2 text-gray-900">
                      {formatDate(selectedVerification.submittedAt)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">IP Address:</span>
                    <span className="ml-2 text-gray-900">{selectedVerification.metadata.ipAddress}</span>
                  </div>
                </div>
              </div>

              {/* Documents Review */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-4">Documents</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                  {/* NIN Front */}
                  <div className="text-center">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">NIN Front</h5>
                      <button
                        onClick={() => downloadFile(
                          selectedVerification.documents.nin_front.data,
                          selectedVerification.documents.nin_front.filename,
                          selectedVerification.documents.nin_front.mimetype
                        )}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiDownload className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={`data:${selectedVerification.documents.nin_front.mimetype};base64,${selectedVerification.documents.nin_front.data}`}
                        alt="NIN Front"
                        className="w-full h-48 object-contain bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* NIN Back */}
                  <div className="text-center">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">NIN Back</h5>
                      <button
                        onClick={() => downloadFile(
                          selectedVerification.documents.nin_back.data,
                          selectedVerification.documents.nin_back.filename,
                          selectedVerification.documents.nin_back.mimetype
                        )}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiDownload className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={`data:${selectedVerification.documents.nin_back.mimetype};base64,${selectedVerification.documents.nin_back.data}`}
                        alt="NIN Back"
                        className="w-full h-48 object-contain bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Selfie */}
                  <div className="text-center">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">Selfie</h5>
                      <button
                        onClick={() => downloadFile(
                          selectedVerification.documents.selfie.data,
                          selectedVerification.documents.selfie.filename,
                          selectedVerification.documents.selfie.mimetype
                        )}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiDownload className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={`data:${selectedVerification.documents.selfie.mimetype};base64,${selectedVerification.documents.selfie.data}`}
                        alt="Selfie"
                        className="w-full h-48 object-contain bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Video */}
                  <div className="text-center">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">Video</h5>
                      {selectedVerification.documents.video && (
                        <button
                          onClick={() => downloadFile(
                            selectedVerification.documents.video!.data,
                            selectedVerification.documents.video!.filename,
                            selectedVerification.documents.video!.mimetype
                          )}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiDownload className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      {selectedVerification.documents.video ? (
                        <video
                          src={`data:${selectedVerification.documents.video.mimetype};base64,${selectedVerification.documents.video.data}`}
                          className="w-full h-48 object-contain bg-gray-50"
                          controls
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-500">No video submitted</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes (Optional)
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any notes about this verification review..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedVerification(null)}
                  disabled={processing === selectedVerification.userId}
                >
                  Cancel
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={() => reviewVerification(selectedVerification.userId, 'reject')}
                  disabled={processing === selectedVerification.userId}
                  className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                >
                  {processing === selectedVerification.userId ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin mr-2" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <FiX className="w-4 h-4 mr-2" />
                      Reject
                    </>
                  )}
                </Button>
                
                <Button
                  variant="primary"
                  onClick={() => reviewVerification(selectedVerification.userId, 'approve')}
                  disabled={processing === selectedVerification.userId}
                  className="bg-green-600 hover:bg-green-700 border-green-600"
                >
                  {processing === selectedVerification.userId ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin mr-2" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;