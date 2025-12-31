// src/pages/UserProfilePage.tsx - View Other Users' Profiles
import React, { useState, useEffect } from 'react';
import {
  FiUser, FiMapPin, FiPhone, FiMail, FiBriefcase, FiDollarSign,
  FiAlertCircle, FiClock, FiMessageCircle, FiShield, FiArrowLeft, FiGrid, FiList
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/Button';
import type { Post } from '../types';

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  role: string;
  profile: {
    fullName?: string;
    phone?: string;
    state?: string;
    city?: string;
    address?: string;
    profession?: string;
    bio?: string;
    hourlyRate?: number;
    yearsOfExperience?: number;
    skills?: string[];
    profilePicture?: string;
  };
  isVerified?: boolean;
  createdAt: string;
}

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('craft_connect_token')}`,
          },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Failed to load user profile');
        }

        setUserProfile(result.profile);
      } catch (error) {
        console.error('Error loading user profile:', error);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId]);

  // Load user posts
  useEffect(() => {
    const loadUserPosts = async () => {
      if (!userId || activeTab !== 'posts') return;

      setLoadingPosts(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('craft_connect_token')}`,
          },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Failed to load user posts');
        }

        setUserPosts(result.posts);
      } catch (error) {
        console.error('Error loading user posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    loadUserPosts();
  }, [userId, activeTab]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </main>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <FiAlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Profile</h3>
                <p className="text-gray-500">{error || 'User not found'}</p>
                <Button
                  onClick={() => navigate(-1)}
                  className="mt-4"
                  variant="primary"
                >
                  Go Back
                </Button>
              </div>
            </div>
          </main>
        </div>
        <BottomNav />
      </div>
    );
  }

  const profilePicture = userProfile.profile?.profilePicture;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
          {/* Back Button */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>

          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            <div className="max-w-6xl mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt={userProfile.profile?.fullName || userProfile.username}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <FiUser className="w-16 h-16 text-white/70" />
                    )}
                  </div>
                  {userProfile.isVerified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                      <FiShield className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left text-white">
                  <h1 className="text-3xl font-bold mb-2">
                    {userProfile.profile?.fullName || userProfile.username}
                  </h1>
                  <p className="text-xl text-white/90 mb-2 capitalize">
                    {userProfile.role === 'artisan' ? 'Artisan' : 'Customer'}
                  </p>

                  {userProfile.profile?.profession && (
                    <p className="text-lg text-white/80 mb-4">
                      {userProfile.profile.profession}
                    </p>
                  )}

                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                    {userProfile.profile?.state && userProfile.profile?.city && (
                      <div className="flex items-center space-x-1">
                        <FiMapPin className="w-4 h-4" />
                        <span>{userProfile.profile.city}, {userProfile.profile.state}</span>
                      </div>
                    )}

                    {userProfile.profile?.yearsOfExperience && (
                      <div className="flex items-center space-x-1">
                        <FiClock className="w-4 h-4" />
                        <span>{userProfile.profile.yearsOfExperience} years experience</span>
                      </div>
                    )}
                  </div>

                  {userProfile.profile?.bio && (
                    <p className="mt-4 text-white/90 max-w-2xl">
                      {userProfile.profile.bio}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                  <Button
                    variant="primary"
                    size="large"
                    className="bg-white text-purple-600 hover:bg-gray-50"
                  >
                    <FiMessageCircle className="w-5 h-5 mr-2" />
                    Message
                  </Button>

                  {userProfile.role === 'artisan' && (
                    <Button
                      variant="secondary"
                      size="large"
                      className="border-white text-white hover:bg-white hover:text-purple-600"
                    >
                      <FiBriefcase className="w-5 h-5 mr-2" />
                      Hire Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'posts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Posts ({userPosts.length})
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'about'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                About
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'posts' && (
              <div>
                {/* View Mode Toggle */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Posts</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <FiGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list'
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <FiList className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {loadingPosts ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : userPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <FiGrid className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-500">This user hasn't posted anything yet.</p>
                  </div>
                ) : (
                  <div className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1'
                  }`}>
                    {userPosts.map((post) => (
                      <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Post Header */}
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                              {profilePicture ? (
                                <img
                                  src={profilePicture}
                                  alt={userProfile.profile?.fullName || userProfile.username}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FiUser className="w-5 h-5 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {userProfile.profile?.fullName || userProfile.username}
                              </h4>
                              <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="p-4">
                          {post.images && post.images.length > 0 && (
                            <div className="mb-3">
                              <img
                                src={post.images[0]}
                                alt="Post"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            </div>
                          )}

                          <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                          <p className="text-gray-700 text-sm leading-relaxed">{post.description}</p>

                          {post.skills && post.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {post.skills.slice(0, 3).map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Post Footer */}
                        <div className="px-4 py-3 border-t border-gray-100">
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span>{post.likes?.length || 0} likes</span>
                              <span>{post.comments?.length || 0} comments</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <FiMail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{userProfile.email}</span>
                    </div>

                    {userProfile.profile?.phone && (
                      <div className="flex items-center space-x-3">
                        <FiPhone className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{userProfile.profile.phone}</span>
                      </div>
                    )}

                    {(userProfile.profile?.city || userProfile.profile?.state) && (
                      <div className="flex items-center space-x-3">
                        <FiMapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">
                          {userProfile.profile.city}, {userProfile.profile.state}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Information */}
                {userProfile.role === 'artisan' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                    <div className="space-y-3">
                      {userProfile.profile?.profession && (
                        <div className="flex items-center space-x-3">
                          <FiBriefcase className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">{userProfile.profile.profession}</span>
                        </div>
                      )}

                      {userProfile.profile?.hourlyRate && (
                        <div className="flex items-center space-x-3">
                          <FiDollarSign className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">${userProfile.profile.hourlyRate}/hour</span>
                        </div>
                      )}

                      {userProfile.profile?.yearsOfExperience && (
                        <div className="flex items-center space-x-3">
                          <FiClock className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">{userProfile.profile.yearsOfExperience} years experience</span>
                        </div>
                      )}
                    </div>

                    {userProfile.profile?.skills && userProfile.profile.skills.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {userProfile.profile.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default UserProfilePage;