// src/pages/profile.tsx - Professional View/Edit Mode
import React, { useState, useEffect } from 'react';
import { 
  FiUser, FiMapPin, FiPhone, FiMail, FiBriefcase, FiDollarSign, 
  FiCamera, FiEdit2, FiX, FiCheck, FiAlertCircle, FiAward, FiClock, FiArrowLeft,
  FiHeart, FiMessageCircle, FiBookmark, FiMoreHorizontal, FiTrash2, FiEdit3, FiShield
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/Button';
import VerificationStatus from '../components/VerificationStatus';
import profileService from '../services/profileService';

// Nigerian States
const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara'
];

// Artisan Categories
const artisanCategories = [
  'Carpenter', 'Plumber', 'Electrician', 'Mason', 'Painter', 'Welder', 'Tailor',
  'Mechanic', 'Tiler', 'Roofer', 'Blacksmith', 'Upholsterer', 'Glazier', 'HVAC Technician',
  'Landscaper', 'Bricklayer', 'Plasterer', 'Metalworker', 'Furniture Maker', 'Other'
];

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  address: string;
  profession: string;
  bio: string;
  hourlyRate: string;
  yearsOfExperience: string;
  skills: string[];
}

interface Post {
  _id: string;
  title: string;
  description: string;
  images: string[];
  type: 'work' | 'job';
  likes: string[];
  comments: Array<{
    _id: string;
    user: {
      _id: string;
      username: string;
      profile?: {
        profilePicture?: string;
        fullName?: string;
      };
    };
    text: string;
    createdAt: string;
  }>;
  saves: string[];
  shares?: string[];
  views: number;
  createdAt: string;
  postType?: 'owned' | 'shared' | 'saved';
  user: {
    _id: string;
    username: string;
    profile?: {
      profilePicture?: string;
      fullName?: string;
    };
  };
}

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  
  // State
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    email: user?.email || '',
    phone: '',
    state: '',
    city: '',
    address: '',
    profession: '',
    bio: '',
    hourlyRate: '',
    yearsOfExperience: '',
    skills: [],
  });

  const [editData, setEditData] = useState<ProfileData>(profileData);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [newSkill, setNewSkill] = useState('');
  
  // Posts state
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'posts'>('profile');
  const [showPostOptions, setShowPostOptions] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await profileService.getProfile();
        const data = {
          fullName: profile.profile?.fullName || '',
          email: profile.email || user?.email || '',
          phone: profile.profile?.phone || '',
          state: profile.profile?.state || '',
          city: profile.profile?.city || '',
          address: profile.profile?.address || '',
          profession: profile.profile?.profession || '',
          bio: profile.profile?.bio || '',
          hourlyRate: profile.profile?.hourlyRate?.toString() || '',
          yearsOfExperience: profile.profile?.yearsOfExperience?.toString() || '',
          skills: profile.profile?.skills || [],
        };
        setProfileData(data);
        setEditData(data);
        if (profile.profile?.profilePicture) {
          setProfilePicture(profile.profile.profilePicture);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    
    loadProfile();
  }, [user?.email]);

  // Load user posts
  useEffect(() => {
    const loadUserPosts = async () => {
      if (activeTab === 'posts') {
        setLoadingPosts(true);
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/user`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('craft_connect_token')}`,
            },
          });
          const result = await response.json();
          if (result.success) {
            setUserPosts(result.posts);
          }
        } catch (error) {
          console.error('Error loading posts:', error);
        } finally {
          setLoadingPosts(false);
        }
      }
    };

    loadUserPosts();
  }, [activeTab]);

  // Close post options when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPostOptions(null);
    };

    if (showPostOptions) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showPostOptions]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setUploadingPhoto(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        await profileService.uploadProfilePhoto(base64String);
        setProfilePicture(base64String);
        updateUser({ profilePicture: base64String });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch {
        setError('Failed to upload photo');
        setTimeout(() => setError(''), 3000);
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const detectLocation = async () => {
    setDetectingLocation(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
              { headers: { 'Accept-Language': 'en' } }
            );
            
            const data = await response.json();
            
            if (data && data.address) {
              const address = data.address;
              setEditData(prev => ({
                ...prev,
                state: address.state || '',
                city: address.city || address.town || '',
                address: address.road || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
              }));
            }
          } catch (error) {
            console.error('Geocoding error:', error);
          } finally {
            setDetectingLocation(false);
          }
        },
        () => {
          alert('Unable to detect location. Please enter manually.');
          setDetectingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    
    try {
      await profileService.updateProfile({
        ...editData,
        hourlyRate: editData.hourlyRate,
        yearsOfExperience: editData.yearsOfExperience,
      });
      
      setProfileData(editData);
      setIsEditMode(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditMode(false);
    setError('');
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !editData.skills.includes(newSkill.trim())) {
      setEditData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // Post management functions
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('craft_connect_token')}`,
        },
      });
      
      if (response.ok) {
        setUserPosts(prev => prev.filter(post => post._id !== postId));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('craft_connect_token')}`,
        },
      });
      
      const result = await response.json();
      if (result.success) {
        setUserPosts(prev => prev.map(post => {
          if (post._id === postId) {
            const isLiked = result.liked;
            const newLikes = isLiked 
              ? [...post.likes, user?.id || '']
              : post.likes.filter(id => id !== user?.id);
            return { ...post, likes: newLikes };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (postId: string) => {
    const commentText = newComment[postId]?.trim();
    if (!commentText) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('craft_connect_token')}`,
        },
        body: JSON.stringify({ text: commentText }),
      });
      
      const result = await response.json();
      if (result.success) {
        setUserPosts(prev => prev.map(post => {
          if (post._id === postId) {
            return { ...post, comments: result.comments };
          }
          return post;
        }));
        setNewComment(prev => ({ ...prev, [postId]: '' }));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Sidebar />
      <DashboardHeader />

      <main className="md:ml-64 max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your profile information and settings</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
            <FiCheck className="w-5 h-5 mr-2" />
            Profile updated successfully!
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
            <FiAlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* NFT-Style Profile Header */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl mb-8">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 opacity-90">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{top: '20%', left: '10%', animationDelay: '0s'}}></div>
              <div className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{top: '60%', left: '80%', animationDelay: '1s'}}></div>
              <div className="absolute w-3 h-3 bg-white/10 rounded-full animate-pulse" style={{top: '80%', left: '20%', animationDelay: '2s'}}></div>
              <div className="absolute w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse" style={{top: '30%', left: '70%', animationDelay: '1.5s'}}></div>
            </div>
          </div>

          <div className="relative z-10 p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                {/* NFT-Style Profile Picture */}
                <div className="relative group">
                  {/* Holographic border effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full opacity-75 group-hover:opacity-100 animate-pulse blur-sm"></div>
                  <div className="relative w-40 h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center overflow-hidden border-4 border-white/20 backdrop-blur-sm">
                    {profilePicture ? (
                      <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <FiUser className="w-20 h-20 text-white/70" />
                    )}
                    {/* Verification badge overlay */}
                    {user?.isVerified && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                        <FiCheck className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Upload button with Web3 styling */}
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <label htmlFor="photo-upload">
                    <button
                      type="button"
                      onClick={() => document.getElementById('photo-upload')?.click()}
                      disabled={uploadingPhoto}
                      className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 shadow-lg border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                    >
                      <FiCamera className="w-5 h-5" />
                    </button>
                  </label>
                </div>

                {/* Profile Information with Web3 styling */}
                <div className="text-center lg:text-left text-white">
                  <div className="mb-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                      {profileData.fullName || user?.username || 'Your Name'}
                    </h1>
                    <div className="flex items-center justify-center lg:justify-start space-x-3 mb-3">
                      <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 capitalize">
                        {user?.role}
                      </span>
                      {user?.isVerified && (
                        <span className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-full text-sm font-medium border border-green-400/30 text-green-300 flex items-center">
                          <FiCheck className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                    {profileData.profession && (
                      <p className="text-xl font-semibold text-cyan-300 mb-3">{profileData.profession}</p>
                    )}
                  </div>

                  {/* Stats with holographic effect */}
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    {profileData.state && (
                      <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                        <div className="flex items-center text-sm">
                          <FiMapPin className="w-4 h-4 mr-2 text-cyan-300" />
                          <span>{profileData.city}, {profileData.state}</span>
                        </div>
                      </div>
                    )}
                    {user?.role === 'artisan' && profileData.yearsOfExperience && (
                      <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                        <div className="flex items-center text-sm">
                          <FiClock className="w-4 h-4 mr-2 text-purple-300" />
                          <span>{profileData.yearsOfExperience} years exp.</span>
                        </div>
                      </div>
                    )}
                    {user?.role === 'artisan' && profileData.hourlyRate && (
                      <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                        <div className="flex items-center text-sm">
                          <FiDollarSign className="w-4 h-4 mr-2 text-green-300" />
                          <span>₦{profileData.hourlyRate}/hr</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Skills preview with Web3 styling */}
                  {user?.role === 'artisan' && profileData.skills.length > 0 && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        {profileData.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full text-xs font-medium border border-purple-400/30 text-purple-200"
                          >
                            {skill}
                          </span>
                        ))}
                        {profileData.skills.length > 3 && (
                          <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium border border-white/20 text-white/70">
                            +{profileData.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Button with Web3 styling */}
              <div className="mt-6 lg:mt-0">
                <button
                  onClick={() => setIsEditMode(true)}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                >
                  <FiEdit2 className="w-5 h-5" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Bio section with glassmorphism */}
            {profileData.bio && (
              <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <FiUser className="w-5 h-5 mr-2 text-cyan-300" />
                  About
                </h3>
                <p className="text-white/90 leading-relaxed">{profileData.bio}</p>
              </div>
            )}
          </div>

          {/* Blockchain-inspired decorative elements */}
          <div className="absolute top-4 right-4 text-white/20">
            <div className="flex items-center space-x-1 text-xs font-mono">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Web3 Profile</span>
            </div>
          </div>
        </div>

        {/* NFT-Style Profile Tabs */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm overflow-hidden">
            {/* Holographic border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-pink-500/10 opacity-50"></div>
            
            <div className="relative flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`relative px-8 py-5 font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'profile'
                    ? 'text-white bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="relative z-10 flex items-center">
                  <FiUser className="w-4 h-4 mr-2" />
                  Profile Information
                </span>
                {activeTab === 'profile' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg"></div>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('posts')}
                className={`relative px-8 py-5 font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'posts'
                    ? 'text-white bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="relative z-10 flex items-center">
                  <FiEdit3 className="w-4 h-4 mr-2" />
                  My Posts
                  <span className="ml-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs">
                    {userPosts.length}
                  </span>
                </span>
                {activeTab === 'posts' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' ? (
          /* NFT-Style Profile Content Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Contact & Location */}
            <div className="space-y-8">
              {/* Contact Information Card */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-sm"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/95 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                      <FiMail className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Contact Information
                    </h2>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start group/item">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform duration-200">
                        <FiMail className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="text-gray-900 font-medium">{profileData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start group/item">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform duration-200">
                        <FiPhone className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Phone</p>
                        <p className="text-gray-900 font-medium">{profileData.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-start group/item">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform duration-200">
                        <FiMapPin className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Location</p>
                        <p className="text-gray-900 font-medium">
                          {profileData.city && profileData.state
                            ? `${profileData.city}, ${profileData.state}`
                            : 'Not provided'}
                        </p>
                        {profileData.address && (
                          <p className="text-sm text-gray-600 mt-1">{profileData.address}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Info Card (Artisans Only) */}
              {user?.role === 'artisan' && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-sm"></div>
                  
                  <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 p-8 backdrop-blur-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                        <FiBriefcase className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Professional Details
                      </h2>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex items-start group/item">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center mr-4 group-hover/item:from-purple-500/30 group-hover/item:to-indigo-500/30 transition-all duration-300">
                          <FiBriefcase className="w-4 h-4 text-purple-300" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-400 mb-1">Profession</p>
                          <p className="text-white font-medium">{profileData.profession || 'Not specified'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start group/item">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center mr-4 group-hover/item:from-green-500/30 group-hover/item:to-emerald-500/30 transition-all duration-300">
                          <FiDollarSign className="w-4 h-4 text-green-300" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-400 mb-1">Hourly Rate</p>
                          <p className="text-white font-medium">
                            {profileData.hourlyRate ? `₦${profileData.hourlyRate}/hr` : 'Not set'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start group/item">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center mr-4 group-hover/item:from-yellow-500/30 group-hover/item:to-orange-500/30 transition-all duration-300">
                          <FiAward className="w-4 h-4 text-yellow-300" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-400 mb-1">Experience</p>
                          <p className="text-white font-medium">
                            {profileData.yearsOfExperience 
                              ? `${profileData.yearsOfExperience} years` 
                              : 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  </div>
                </div>
              )}

              {/* Enhanced Identity Verification */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-sm"></div>
                
                <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 p-8 backdrop-blur-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mr-4">
                      <FiShield className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Identity Verification
                    </h2>
                  </div>
                  
                  <VerificationStatus 
                    onVerificationUpdate={(verified) => {
                      if (verified) {
                        setSuccess(true);
                        setTimeout(() => setSuccess(false), 3000);
                      }
                    }}
                  />
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                </div>
              </div>
            </div>

            {/* Right Column - Bio & Skills */}
            <div className="lg:col-span-2 space-y-8">
              {/* About/Bio Card */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-sm"></div>
                
                <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 p-8 backdrop-blur-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <FiUser className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      About Me
                    </h2>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                    <p className="text-white/90 leading-relaxed text-lg pl-6">
                      {profileData.bio || (
                        <span className="text-gray-400 italic">
                          No bio added yet. Click "Edit Profile" to add information about yourself and showcase your personality to potential clients.
                        </span>
                      )}
                    </p>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                </div>
              </div>

              {/* Skills Card (Artisans Only) */}
              {user?.role === 'artisan' && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-sm"></div>
                  
                  <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 p-8 backdrop-blur-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mr-4">
                        <FiAward className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Skills & Expertise
                      </h2>
                    </div>
                    
                    {profileData.skills.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {profileData.skills.map((skill, index) => (
                          <div
                            key={index}
                            className="group/skill relative overflow-hidden"
                          >
                            {/* Holographic effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-rose-500 opacity-0 group-hover/skill:opacity-30 transition-opacity duration-300 rounded-xl blur-sm"></div>
                            
                            <div className="relative px-4 py-3 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                              <span className="text-pink-300 font-medium text-sm">
                                {skill}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-500/30">
                          <FiAward className="w-8 h-8 text-pink-300" />
                        </div>
                        <p className="text-gray-400 italic">
                          No skills added yet. Click "Edit Profile" to showcase your expertise and attract more clients.
                        </p>
                      </div>
                    )}
                    
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-rose-400 rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* NFT-Style Posts Tab Content */
          <div className="space-y-8">
            {loadingPosts ? (
              <div className="text-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500/20 border-t-purple-500 mx-auto"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-purple-500/10 mx-auto"></div>
                </div>
                <p className="text-gray-400 mt-4 font-medium">Loading your posts...</p>
              </div>
            ) : userPosts.length === 0 ? (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-sm"></div>
                
                <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 p-12 text-center backdrop-blur-sm">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                    <FiEdit3 className="w-10 h-10 text-purple-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">No posts yet</h3>
                  <p className="text-gray-400 mb-8 text-lg">Share your work or post a job to get started on your Web3 journey</p>
                  <button
                    onClick={() => navigate('/jobs')}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    Create Your First Post
                  </button>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-6 right-6 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-6 left-6 w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
              </div>
            ) : (
              /* NFT-Style Posts List */
              <div className="space-y-8">
                {userPosts.map((post) => (
                  <div key={post._id} className="relative group">
                    {/* Holographic border effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-sm"></div>
                    
                    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm overflow-hidden">
                      {/* NFT-Style Post Header */}
                      <div className="p-8 border-b border-gray-700/50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Profile picture with holographic border */}
                            <div className="relative">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-75 animate-pulse blur-sm"></div>
                              <div className="relative w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/20">
                                {profilePicture ? (
                                  <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                  <FiUser className="w-6 h-6 text-white/70" />
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-white text-lg">
                                {profileData.fullName || user?.username}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <p className="text-sm text-gray-400">{formatTimeAgo(post.createdAt)}</p>
                                {post.postType && post.postType !== 'owned' && (
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    post.postType === 'shared' 
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  }`}>
                                    {post.postType === 'shared' ? 'Shared' : 'Saved'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Post Options */}
                          <div className="relative">
                            <button
                              onClick={() => setShowPostOptions(showPostOptions === post._id ? null : post._id)}
                              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                            >
                              <FiMoreHorizontal className="w-5 h-5" />
                            </button>
                            
                            {showPostOptions === post._id && (
                              <div className="absolute right-0 top-12 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-10 min-w-[140px] backdrop-blur-sm">
                                <button
                                  onClick={() => {
                                    navigate(`/jobs?edit=${post._id}`);
                                    setShowPostOptions(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 flex items-center rounded-t-xl"
                                >
                                  <FiEdit2 className="w-4 h-4 mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    handleDeletePost(post._id);
                                    setShowPostOptions(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 flex items-center rounded-b-xl"
                                >
                                  <FiTrash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* NFT-Style Post Content */}
                      <div className="p-8">
                        <h3 className="text-xl font-bold text-white mb-3">{post.title}</h3>
                        <p className="text-gray-300 mb-6 leading-relaxed">{post.description}</p>
                      
                        {/* Post Images */}
                        {post.images && post.images.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {post.images.slice(0, 4).map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={image}
                                  alt={`Post image ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                {index === 3 && post.images.length > 4 && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-medium">+{post.images.length - 4}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Post Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                          <div className="flex items-center space-x-6">
                            <span className="flex items-center">
                              <FiHeart className="w-4 h-4 mr-1" />
                              {post.likes.length} likes
                            </span>
                            <span className="flex items-center">
                              <FiMessageCircle className="w-4 h-4 mr-1" />
                              {post.comments.length} comments
                            </span>
                            <span>{post.views} views</span>
                          </div>
                          <span className="capitalize px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300">
                            {post.type === 'work' ? 'Work Post' : 'Job Post'}
                          </span>
                        </div>

                        {/* NFT-Style Post Actions */}
                        <div className="flex items-center justify-between border-t border-gray-700/50 pt-6">
                          <button
                            onClick={() => handleLikePost(post._id)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                              post.likes.includes(user?.id || '')
                                ? 'text-red-400 bg-red-500/20 border border-red-500/30'
                                : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-gray-700/50 hover:border-red-500/30'
                            }`}
                          >
                            <FiHeart className={`w-5 h-5 ${post.likes.includes(user?.id || '') ? 'fill-current' : ''}`} />
                            <span>Like</span>
                          </button>
                        
                          <button className="flex items-center space-x-2 px-6 py-3 rounded-xl text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300">
                            <FiMessageCircle className="w-5 h-5" />
                            <span>Comment</span>
                          </button>
                          
                          <button className="flex items-center space-x-2 px-6 py-3 rounded-xl text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
                            <FiBookmark className="w-5 h-5" />
                            <span>Save</span>
                          </button>
                        </div>

                        {/* Comments Section */}
                        {post.comments.length > 0 && (
                          <div className="mt-4 space-y-3">
                            <h4 className="font-medium text-white">Comments</h4>
                            {post.comments.map((comment) => (
                              <div key={comment._id} className="flex space-x-3">
                                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                  {comment.user.profile?.profilePicture ? (
                                    <img 
                                      src={comment.user.profile.profilePicture} 
                                      alt="Commenter" 
                                      className="w-full h-full object-cover" 
                                    />
                                  ) : (
                                    <FiUser className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700/50">
                                    <p className="font-medium text-sm text-white">
                                      {comment.user.profile?.fullName || comment.user.username}
                                    </p>
                                    <p className="text-gray-300 text-sm">{comment.text}</p>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(comment.createdAt)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Comment */}
                        <div className="mt-6 flex space-x-3">
                          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                            {profilePicture ? (
                              <img src={profilePicture} alt="Your profile" className="w-full h-full object-cover" />
                            ) : (
                              <FiUser className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 flex space-x-2">
                            <input
                              type="text"
                              value={newComment[post._id] || ''}
                              onChange={(e) => setNewComment(prev => ({ ...prev, [post._id]: e.target.value }))}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                              placeholder="Write a comment..."
                              className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
                            />
                            <Button
                              variant="primary"
                              size="small"
                              onClick={() => handleAddComment(post._id)}
                              disabled={!newComment[post._id]?.trim()}
                            >
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
          
      {/* Edit Modal */}
      {isEditMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editData.fullName}
                      onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+234 800 000 0000"
                    />
                  </div>

                  {user?.role === 'artisan' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profession
                      </label>
                      <select
                        value={editData.profession}
                        onChange={(e) => setEditData({...editData, profession: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select profession</option>
                        {artisanCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={detectLocation}
                    disabled={detectingLocation}
                  >
                    <FiMapPin className="w-4 h-4 mr-2" />
                    {detectingLocation ? 'Detecting...' : 'Detect Location'}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <select
                      value={editData.state}
                      onChange={(e) => setEditData({...editData, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select state</option>
                      {nigerianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City/LGA</label>
                    <input
                      type="text"
                      value={editData.city}
                      onChange={(e) => setEditData({...editData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter city or LGA"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      value={editData.address}
                      onChange={(e) => setEditData({...editData, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter street address"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Details (Artisans Only) */}
              {user?.role === 'artisan' && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hourly Rate (₦)
                        </label>
                        <input
                          type="number"
                          value={editData.hourlyRate}
                          onChange={(e) => setEditData({...editData, hourlyRate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="5000"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          value={editData.yearsOfExperience}
                          onChange={(e) => setEditData({...editData, yearsOfExperience: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="5"
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio / About Me</label>
                      <textarea
                        value={editData.bio}
                        onChange={(e) => setEditData({...editData, bio: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell customers about yourself..."
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add a skill"
                      />
                      <Button type="button" onClick={handleAddSkill} variant="secondary">
                        Add
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {editData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 text-blue-500 hover:text-blue-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSave}
                disabled={loading}
                className="flex items-center"
              >
                {loading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
