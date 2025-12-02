// src/pages/profile.tsx - Professional View/Edit Mode
import React, { useState, useEffect } from 'react';
import { 
  FiUser, FiMapPin, FiPhone, FiMail, FiBriefcase, FiDollarSign, 
  FiCamera, FiEdit2, FiX, FiCheck, FiAlertCircle, FiAward, FiClock, FiArrowLeft 
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/Button';
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
      } catch (error) {
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

        {/* Profile Content Grid */}
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
