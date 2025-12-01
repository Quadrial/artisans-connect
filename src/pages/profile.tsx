// src/pages/profile.tsx
import React, { useState } from 'react';
import { FiUser, FiMapPin, FiPhone, FiMail, FiBriefcase, FiDollarSign, FiCamera, FiSave, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import DashboardHeader from '../components/DashboardHeader';
import { Button } from '../components/Button';

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
  portfolio: string[];
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: user?.username || '',
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
    portfolio: []
  });

  const [newSkill, setNewSkill] = useState('');

  // Detect user's location using browser geolocation
  const detectLocation = () => {
    setDetectingLocation(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // In a real app, you would use Google Maps Geocoding API or similar
          // For now, we'll simulate with a placeholder
          try {
            // Simulated reverse geocoding
            // In production, use: https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY
            
            // For demo purposes, set Lagos as default
            setProfileData(prev => ({
              ...prev,
              state: 'Lagos',
              city: 'Ikeja',
              address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
            }));
            
            setDetectingLocation(false);
          } catch (error) {
            console.error('Error reverse geocoding:', error);
            setDetectingLocation(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to detect location. Please enter manually.');
          setDetectingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setDetectingLocation(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Simulate API call
    setTimeout(() => {
      console.log('Profile data:', profileData);
      setLoading(false);
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                <FiUser className="w-12 h-12 text-gray-600" />
              </div>
              <div>
                <Button type="button" variant="secondary" size="small" className="flex items-center">
                  <FiCamera className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="inline w-4 h-4 mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMail className="inline w-4 h-4 mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiPhone className="inline w-4 h-4 mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+234 800 000 0000"
                  required
                />
              </div>

              {user?.role === 'artisan' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiBriefcase className="inline w-4 h-4 mr-1" />
                    Profession
                  </label>
                  <select
                    name="profession"
                    value={profileData.profession}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select your profession</option>
                    {artisanCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Location</h2>
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={detectLocation}
                disabled={detectingLocation}
                className="flex items-center"
              >
                <FiMapPin className="w-4 h-4 mr-2" />
                {detectingLocation ? 'Detecting...' : 'Detect Location'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  name="state"
                  value={profileData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select state</option>
                  {nigerianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City/LGA
                </label>
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your city or LGA"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your street address"
                />
              </div>
            </div>
          </div>

          {/* Professional Information (Artisans Only) */}
          {user?.role === 'artisan' && (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiDollarSign className="inline w-4 h-4 mr-1" />
                      Hourly Rate (₦)
                    </label>
                    <input
                      type="number"
                      name="hourlyRate"
                      value={profileData.hourlyRate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5000"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter amount in Nigerian Naira</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={profileData.yearsOfExperience}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio / About Me
                  </label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell customers about yourself, your experience, and what makes you unique..."
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a skill (e.g., Furniture Making, Welding)"
                  />
                  <Button type="button" onClick={handleAddSkill} variant="secondary">
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
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
                  {profileData.skills.length === 0 && (
                    <p className="text-sm text-gray-500">No skills added yet. Add your skills above.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex items-center"
            >
              <FiSave className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProfilePage;
