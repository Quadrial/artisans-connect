import React, { useState, useEffect } from 'react';
import { FiShield, FiCheck, FiClock, FiX, FiExternalLink, FiInfo, FiRefreshCw } from 'react-icons/fi';
import { Button } from './Button';

interface VerificationData {
  status: 'none' | 'initiated' | 'pending' | 'verified' | 'rejected';
  isVerified: boolean;
  level?: string;
  trustScore: number;
  completedAt?: string;
  expiresAt?: string;
  blockchain: {
    verified: boolean;
    hash?: string;
    txHash?: string;
    network?: string;
  };
}

interface VerificationStatusProps {
  onVerificationUpdate?: (verified: boolean) => void;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({ 
  onVerificationUpdate 
}) => {
  const [verification, setVerification] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verification/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('craft_connect_token')}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setVerification(result.verification);
      }
    } catch (error) {
      console.error('Error loading verification status:', error);
    } finally {
      setLoading(false);
    }
  };



  const resetVerification = async () => {
    try {
      setResetting(true);
      setError('');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/verification/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('craft_connect_token')}`,
        },
      });

      const result = await response.json();
      
      if (result.success) {
        // Reload verification status
        await loadVerificationStatus();
      } else {
        setError(result.message || 'Failed to reset verification');
      }
    } catch (error) {
      console.error('Error resetting verification:', error);
      setError('Failed to reset verification');
    } finally {
      setResetting(false);
    }
  };

  const simulateComplete = async () => {
    try {
      setCompleting(true);
      setError('');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/verification/simulate-complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('craft_connect_token')}`,
        },
      });

      const result = await response.json();
      
      if (result.success) {
        // Reload verification status
        await loadVerificationStatus();
        if (onVerificationUpdate) {
          onVerificationUpdate(true);
        }
      } else {
        setError(result.message || 'Failed to complete verification');
      }
    } catch (error) {
      console.error('Error completing verification:', error);
      setError('Failed to complete verification');
    } finally {
      setCompleting(false);
    }
  };



  const isSessionExpired = () => {
    if (!verification || verification.status === 'none' || verification.status === 'verified') {
      return false;
    }

    if (verification.expiresAt) {
      return new Date() > new Date(verification.expiresAt);
    }

    // If no expiresAt, consider initiated status expired after 2 hours
    // This is a fallback for sessions created before expiration was added
    return verification.status === 'initiated';
  };

  const getStatusIcon = () => {
    if (!verification) return <FiShield className="w-5 h-5 text-gray-400" />;

    switch (verification.status) {
      case 'verified':
        return <FiCheck className="w-5 h-5 text-green-500" />;
      case 'pending':
      case 'initiated':
        return <FiClock className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <FiX className="w-5 h-5 text-red-500" />;
      default:
        return <FiShield className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    if (!verification) return 'Not Verified';

    switch (verification.status) {
      case 'verified':
        return 'Identity Verified';
      case 'pending':
        return 'Verification Pending';
      case 'initiated':
        return 'Verification Started';
      case 'rejected':
        return 'Verification Failed';
      default:
        return 'Not Verified';
    }
  };

  const getStatusColor = () => {
    if (!verification) return 'text-gray-600';

    switch (verification.status) {
      case 'verified':
        return 'text-green-600';
      case 'pending':
      case 'initiated':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-gray-900">Identity Verification</h3>
            <p className={`text-sm ${getStatusColor()}`}>{getStatusText()}</p>
          </div>
        </div>

        {verification?.status === 'none' && (
          <div className="space-y-2">
            <Button
              variant="primary"
              size="small"
              onClick={() => window.location.href = '/verification'}
              className="flex items-center space-x-2"
            >
              <FiShield className="w-4 h-4" />
              <span>Verify with NIN</span>
            </Button>
            <p className="text-xs text-gray-500">
              Verify your identity using your National Identification Number
            </p>
          </div>
        )}

        {(verification?.status === 'initiated' || verification?.status === 'pending') && (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="small"
                onClick={resetVerification}
                disabled={resetting}
                className="flex items-center space-x-2"
              >
                <FiX className="w-4 h-4" />
                <span>{resetting ? 'Resetting...' : 'Start Over'}</span>
              </Button>
              {isSessionExpired() && (
                <span className="text-xs text-orange-600">Session expired</span>
              )}
            </div>
            
            {/* Development Helper - Remove in production */}
            {import.meta.env.DEV && verification?.status === 'initiated' && (
              <Button
                variant="primary"
                size="small"
                onClick={simulateComplete}
                disabled={completing}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <FiCheck className="w-4 h-4" />
                <span>{completing ? 'Completing...' : 'Mark as Complete (Dev)'}</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
          {error.includes('popup') && (
            <div className="mt-2 text-xs text-red-500">
              <p><strong>To enable popups:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Chrome: Click the popup icon in address bar</li>
                <li>Firefox: Click "Options" → "Allow popups"</li>
                <li>Safari: Safari menu → Preferences → Websites → Pop-ups</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {verification && (
        <div className="space-y-3">
          {/* Trust Score */}
          {verification.trustScore > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Trust Score</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${verification.trustScore}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {verification.trustScore}/100
                </span>
              </div>
            </div>
          )}

          {/* Verification Level */}
          {verification.level && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Verification Level</span>
              <span className="text-sm font-medium text-gray-900 capitalize">
                {verification.level}
              </span>
            </div>
          )}

          {/* Blockchain Verification */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Blockchain Verified</span>
            <div className="flex items-center space-x-2">
              {verification.blockchain.verified ? (
                <FiCheck className="w-4 h-4 text-green-500" />
              ) : (
                <FiX className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-900">
                {verification.blockchain.verified ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          {/* Blockchain Hash (for verified users) */}
          {verification.blockchain.verified && verification.blockchain.hash && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Blockchain Hash</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">
                    Cardano {verification.blockchain.network === 'mainnet' ? 'Mainnet' : 'Testnet'}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${
                    verification.blockchain.network === 'mainnet' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <code className="text-xs text-gray-600 bg-white px-2 py-1 rounded border flex-1 truncate">
                  {verification.blockchain.hash}
                </code>
                {verification.blockchain.txHash && (
                  <button
                    onClick={() => {
                      // Open Cardano explorer for mainnet transactions
                      const explorerUrl = verification.blockchain.network === 'mainnet' 
                        ? `https://cardanoscan.io/transaction/${verification.blockchain.txHash}`
                        : `https://preprod.cardanoscan.io/transaction/${verification.blockchain.txHash}`;
                      window.open(explorerUrl, '_blank');
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <FiExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Completion Date */}
          {verification.completedAt && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Verified on</span>
              <span>{new Date(verification.completedAt).toLocaleDateString()}</span>
            </div>
          )}

          {/* Status Messages */}
          {verification.status === 'initiated' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-blue-700">
                    <FiInfo className="w-4 h-4 inline mr-2" />
                    {isSessionExpired() 
                      ? 'Verification session expired. Click "Start Over" to begin again.'
                      : 'Complete your verification in the opened window. This page will update automatically.'
                    }
                  </p>
                  {!isSessionExpired() && (
                    <p className="text-xs text-blue-600 mt-2">
                      Completed verification? 
                      <button 
                        onClick={loadVerificationStatus}
                        className="ml-1 underline hover:no-underline"
                      >
                        Refresh status
                      </button>
                    </p>
                  )}
                </div>
                {!isSessionExpired() && (
                  <button
                    onClick={loadVerificationStatus}
                    disabled={loading}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                )}
              </div>
              {isSessionExpired() && (
                <Button
                  variant="primary"
                  size="small"
                  onClick={resetVerification}
                  disabled={resetting}
                  className="mt-2"
                >
                  Start Over
                </Button>
              )}
            </div>
          )}

          {verification.status === 'pending' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                <FiClock className="w-4 h-4 inline mr-2" />
                Your verification is being reviewed. This usually takes 1-2 business days.
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                If you haven't heard back in 3 days, you can start over.
              </p>
            </div>
          )}

          {verification.status === 'rejected' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                <FiX className="w-4 h-4 inline mr-2" />
                Verification was not successful. Please try again or contact support.
              </p>
              <Button
                variant="secondary"
                size="small"
                onClick={resetVerification}
                disabled={resetting}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerificationStatus;