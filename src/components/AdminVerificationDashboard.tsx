import React, { useState, useEffect } from 'react';
import { 
  FiShield, FiCheck, FiX, FiClock, FiExternalLink, FiSearch, 
  FiFilter, FiDownload, FiEye, FiRefreshCw 
} from 'react-icons/fi';
import { Button } from './Button';

interface VerificationRecord {
  userId: string;
  username: string;
  email: string;
  status: 'none' | 'initiated' | 'pending' | 'verified' | 'rejected';
  isVerified: boolean;
  trustScore: number;
  completedAt?: string;
  blockchain: {
    hash?: string;
    txHash?: string;
    verified: boolean;
  };
  createdAt: string;
}

interface AdminVerificationDashboardProps {
  className?: string;
}

const AdminVerificationDashboard: React.FC<AdminVerificationDashboardProps> = ({ 
  className = '' 
}) => {
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecord | null>(null);
  const [verifyingHash, setVerifyingHash] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadVerifications();
  }, [page, statusFilter]);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/verification/admin/all?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('craft_connect_token')}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setVerifications(result.verifications);
        setTotalPages(result.pagination.pages);
      }
    } catch (error) {
      console.error('Error loading verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyBlockchainHash = async (userId: string, hash: string) => {
    try {
      setVerifyingHash(hash);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/verification/verify-blockchain`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('craft_connect_token')}`,
          },
          body: JSON.stringify({ userId, hash }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert(`Blockchain Verification Result:\n\nHash Match: ${result.verification.hashMatch ? 'Yes' : 'No'}\nBlockchain Status: ${result.verification.blockchain.verified ? 'Verified' : 'Not Found'}\nBlock Height: ${result.verification.blockchain.blockHeight || 'N/A'}`);
      } else {
        alert(`Verification Failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Error verifying hash:', error);
      alert('Failed to verify blockchain hash');
    } finally {
      setVerifyingHash(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <FiCheck className="w-4 h-4 text-green-500" />;
      case 'pending':
      case 'initiated':
        return <FiClock className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
        return <FiX className="w-4 h-4 text-red-500" />;
      default:
        return <FiShield className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'initiated':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredVerifications = verifications.filter(record =>
    record.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.blockchain.hash?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ['Username', 'Email', 'Status', 'Trust Score', 'Blockchain Hash', 'TX Hash', 'Completed At'];
    const csvData = filteredVerifications.map(record => [
      record.username,
      record.email,
      record.status,
      record.trustScore,
      record.blockchain.hash || '',
      record.blockchain.txHash || '',
      record.completedAt || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verifications_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Verification Dashboard</h2>
            <p className="text-gray-600">Manage and verify user identity verifications</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={loadVerifications}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={exportToCSV}
              className="flex items-center space-x-2"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by username, email, or hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FiFilter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="none">Not Started</option>
            </select>
          </div>
        </div>
      </div>

      {/* Verification Records */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trust Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blockchain
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <FiRefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-2" />
                    <span className="text-gray-500">Loading verifications...</span>
                  </div>
                </td>
              </tr>
            ) : filteredVerifications.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No verification records found
                </td>
              </tr>
            ) : (
              filteredVerifications.map((record) => (
                <tr key={record.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {record.username}
                      </div>
                      <div className="text-sm text-gray-500">{record.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(record.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${record.trustScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{record.trustScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {record.blockchain.hash ? (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {record.blockchain.hash.substring(0, 16)}...
                          </code>
                          {record.blockchain.verified && (
                            <FiCheck className="w-3 h-3 text-green-500" />
                          )}
                        </div>
                        {record.blockchain.txHash && (
                          <div className="text-xs text-gray-500">
                            TX: {record.blockchain.txHash.substring(0, 12)}...
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No hash</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      {record.blockchain.hash && (
                        <button
                          onClick={() => verifyBlockchainHash(record.userId, record.blockchain.hash!)}
                          disabled={verifyingHash === record.blockchain.hash}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          <FiShield className={`w-4 h-4 ${verifyingHash === record.blockchain.hash ? 'animate-spin' : ''}`} />
                        </button>
                      )}
                      {record.blockchain.txHash && (
                        <button
                          onClick={() => {
                            // In production, this would link to Cardano explorer
                            alert(`Transaction Hash: ${record.blockchain.txHash}`);
                          }}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Verification Details</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Username</label>
                  <p className="text-gray-900">{selectedRecord.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedRecord.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedRecord.status)}
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRecord.status)}`}>
                      {selectedRecord.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Trust Score</label>
                  <p className="text-gray-900">{selectedRecord.trustScore}/100</p>
                </div>
              </div>
              
              {selectedRecord.blockchain.hash && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Blockchain Information</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Verification Hash</label>
                      <code className="block text-sm bg-gray-100 p-2 rounded mt-1 break-all">
                        {selectedRecord.blockchain.hash}
                      </code>
                    </div>
                    {selectedRecord.blockchain.txHash && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Transaction Hash</label>
                        <code className="block text-sm bg-gray-100 p-2 rounded mt-1 break-all">
                          {selectedRecord.blockchain.txHash}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerificationDashboard;