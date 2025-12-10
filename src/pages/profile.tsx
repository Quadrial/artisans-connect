// src/pages/profile.tsx - Professional View/Edit Mode
import React, { useState, useEffect } from 'react';
import { 
  FiUser, FiMapPin, FiPhone, FiMail, FiBriefcase, FiDollarSign, 
  FiCamera, FiEdit2, FiX, FiCheck, FiAlertCircle, FiAward, FiClock, FiArrowLeft,
  FiHeart, FiMessageCircle, FiBookmark, FiMoreHorizontal, FiTrash2, FiEdit3
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
  views: number;
  createdAt: string;
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

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser className="w-16 h-16 text-gray-600" />
                  )}
                </div>
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
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50"
                  >
                    <FiCamera className="w-4 h-4" />
                  </button>
                </label>
              </div>

              {/* Basic Info */}
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profileData.fullName || user?.username || 'Your Name'}
                </h1>
                <p className="text-gray-600 capitalize">{user?.role}</p>
                {profileData.profession && (
                  <p className="text-blue-600 font-medium mt-1">{profileData.profession}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  {profileData.state && (
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      <FiMapPin className="w-3 h-3 mr-1" />
                      {profileData.city}, {profileData.state}
                    </span>
                  )}
                  {user?.role === 'artisan' && profileData.yearsOfExperience && (
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      <FiClock className="w-3 h-3 mr-1" />
                      {profileData.yearsOfExperience} years exp.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              variant="primary"
              size="medium"
              onClick={() => setIsEditMode(true)}
              className="mt-4 md:mt-0 flex items-center"
            >
              <FiEdit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Posts ({userPosts.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' ? (
          /* Profile Content Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Contact & Location */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiMail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FiPhone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{profileData.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FiMapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">
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

            {/* Professional Info (Artisans Only) */}
            {user?.role === 'artisan' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FiBriefcase className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Profession</p>
                      <p className="text-gray-900">{profileData.profession || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiDollarSign className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Hourly Rate</p>
                      <p className="text-gray-900">
                        {profileData.hourlyRate ? `₦${profileData.hourlyRate}/hr` : 'Not set'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiAward className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="text-gray-900">
                        {profileData.yearsOfExperience 
                          ? `${profileData.yearsOfExperience} years` 
                          : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Identity Verification */}
            <VerificationStatus 
              onVerificationUpdate={(verified) => {
                if (verified) {
                  setSuccess(true);
                  setTimeout(() => setSuccess(false), 3000);
                }
              }}
            />
          </div>

          {/* Right Column - Bio & Skills */}
          <div className="lg:col-span-2 space-y-6">
            {/* About/Bio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {profileData.bio || 'No bio added yet. Click "Edit Profile" to add information about yourself.'}
              </p>
            </div>

            {/* Skills (Artisans Only) */}
            {user?.role === 'artisan' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
                {profileData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No skills added yet. Click "Edit Profile" to add your skills.</p>
                )}
              </div>
            )}
          </div>
        </div>
        ) : (
          /* Posts Tab Content */
          <div className="space-y-6">
            {loadingPosts ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading posts...</p>
              </div>
            ) : userPosts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <FiEdit3 className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">Share your work or post a job to get started</p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/jobs')}
                  className="mx-auto"
                >
                  Create Your First Post
                </Button>
              </div>
            ) : (
              /* Posts List */
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                    {/* Post Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                            {profilePicture ? (
                              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <FiUser className="w-5 h-5 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {profileData.fullName || user?.username}
                            </h4>
                            <p className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                          </div>
                        </div>
                        
                        {/* Post Options */}
                        <div className="relative">
                          <button
                            onClick={() => setShowPostOptions(showPostOptions === post._id ? null : post._id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <FiMoreHorizontal className="w-5 h-5" />
                          </button>
                          
                          {showPostOptions === post._id && (
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                              <button
                                onClick={() => {
                                  navigate(`/jobs?edit=${post._id}`);
                                  setShowPostOptions(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <FiEdit2 className="w-4 h-4 mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  handleDeletePost(post._id);
                                  setShowPostOptions(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                              >
                                <FiTrash2 className="w-4 h-4 mr-2" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-700 mb-4">{post.description}</p>
                      
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
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <span>{post.likes.length} likes</span>
                          <span>{post.comments.length} comments</span>
                          <span>{post.views} views</span>
                        </div>
                        <span className="capitalize px-2 py-1 bg-gray-100 rounded-full text-xs">
                          {post.type === 'work' ? 'Work Post' : 'Job Post'}
                        </span>
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <button
                          onClick={() => handleLikePost(post._id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            post.likes.includes(user?.id || '')
                              ? 'text-red-600 bg-red-50'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <FiHeart className={`w-4 h-4 ${post.likes.includes(user?.id || '') ? 'fill-current' : ''}`} />
                          <span>Like</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                          <FiMessageCircle className="w-4 h-4" />
                          <span>Comment</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                          <FiBookmark className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                      </div>

                      {/* Comments Section */}
                      {post.comments.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <h4 className="font-medium text-gray-900">Comments</h4>
                          {post.comments.map((comment) => (
                            <div key={comment._id} className="flex space-x-3">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                {comment.user.profile?.profilePicture ? (
                                  <img 
                                    src={comment.user.profile.profilePicture} 
                                    alt="Commenter" 
                                    className="w-full h-full object-cover" 
                                  />
                                ) : (
                                  <FiUser className="w-4 h-4 text-gray-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="bg-gray-50 rounded-lg px-3 py-2">
                                  <p className="font-medium text-sm text-gray-900">
                                    {comment.user.profile?.fullName || comment.user.username}
                                  </p>
                                  <p className="text-gray-700 text-sm">{comment.text}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(comment.createdAt)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment */}
                      <div className="mt-4 flex space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                          {profilePicture ? (
                            <img src={profilePicture} alt="Your profile" className="w-full h-full object-cover" />
                          ) : (
                            <FiUser className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1 flex space-x-2">
                          <input
                            type="text"
                            value={newComment[post._id] || ''}
                            onChange={(e) => setNewComment(prev => ({ ...prev, [post._id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                            placeholder="Write a comment..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
