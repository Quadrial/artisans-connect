import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiMapPin, FiDollarSign, FiUser, FiMessageCircle, FiCheck, FiAlertCircle } from 'react-icons/fi';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/Button';
import { artisanService } from '../services/artisanService';
import { messageService } from '../services/messageService';
import useAuth from '../hooks/useAuth';

interface Artisan {
  _id: string;
  username: string;
  email: string;
  profile?: {
    fullName?: string;
    profilePicture?: string;
    profession?: string;
    bio?: string;
    skills?: string[];
    state?: string;
    city?: string;
    hourlyRate?: number;
    yearsOfExperience?: number;
    phone?: string;
  };
  isVerified?: boolean;
}

const DiscoverPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [showFilters, setShowFilters] = useState(false);
  
  // Available options
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  
  // Profile modal - removed, now using dedicated user profile page
  // const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  // const [showProfileModal, setShowProfileModal] = useState(false);

  const fetchArtisans = useCallback(async () => {
    try {
      setLoading(true);
      const filters: Record<string, string | number> = {
        sort: sortBy,
        limit: 50,
      };

      if (searchQuery) filters.search = searchQuery;
      if (selectedSkill) filters.skills = selectedSkill;
      if (selectedState) filters.state = selectedState;
      if (selectedCity) filters.city = selectedCity;
      if (minRate) filters.minRate = parseFloat(minRate);
      if (maxRate) filters.maxRate = parseFloat(maxRate);

      const result = await artisanService.getArtisans(filters);
      setArtisans(result.artisans || []);
    } catch (error) {
      console.error('Failed to fetch artisans:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedSkill, selectedState, selectedCity, minRate, maxRate, sortBy]);

  useEffect(() => {
    fetchArtisans();
    fetchFilterOptions();
  }, [fetchArtisans]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchArtisans();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchArtisans]);

  const fetchFilterOptions = async () => {
    try {
      const [skills, locations] = await Promise.all([
        artisanService.getSkills(),
        artisanService.getLocations(),
      ]);
      
      setAvailableSkills(skills || []);
      setAvailableStates(locations.states || []);
      setAvailableCities(locations.cities || []);
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSkill('');
    setSelectedState('');
    setSelectedCity('');
    setMinRate('');
    setMaxRate('');
    setSortBy('-createdAt');
  };

  const handleMessageArtisan = async (artisan: Artisan) => {
    if (user?.role !== 'customer') {
      alert('Only customers can initiate messages to artisans');
      return;
    }

    if (user?.id === artisan._id) {
      alert('You cannot send a message to yourself');
      return;
    }

    try {
      await messageService.sendMessage(
        artisan._id,
        `Hi ${artisan.profile?.fullName || artisan.username}! I'm interested in your services.`
      );
      navigate('/messages');
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Sidebar />
      <DashboardHeader />

      <main className="md:ml-64 max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Discover Artisans
          </h1>
          <p className="text-gray-600">
            Find skilled professionals for your next project
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by skill, name, or profession..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="secondary" 
              size="small" 
              className="flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="profile.hourlyRate">Price: Low to High</option>
              <option value="-profile.hourlyRate">Price: High to Low</option>
              <option value="-profile.yearsOfExperience">Most Experienced</option>
            </select>
            {(searchQuery || selectedSkill || selectedState || selectedCity || minRate || maxRate) && (
              <Button variant="secondary" size="small" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Skills</option>
                  {availableSkills.map((skill) => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All States</option>
                  {availableStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Cities</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (₦)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minRate}
                    onChange={(e) => setMinRate(e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxRate}
                    onChange={(e) => setMaxRate(e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading artisans...</p>
          </div>
        ) : artisans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Artisans Found
            </h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search query
            </p>
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Found {artisans.length} artisan{artisans.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artisans.map((artisan) => (
                <div key={artisan._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div 
                        className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                        onClick={() => navigate(`/user/${artisan._id}`)}
                      >
                        {artisan.profile?.profilePicture ? (
                          <img
                            src={artisan.profile.profilePicture}
                            alt={artisan.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiUser className="w-8 h-8 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 
                            className="font-bold text-gray-900 text-lg cursor-pointer hover:text-blue-600 truncate"
                            onClick={() => navigate(`/user/${artisan._id}`)}
                          >
                            {artisan.profile?.fullName || artisan.username}
                          </h3>
                          {/* Verification Badge */}
                          {artisan.isVerified ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 shrink-0">
                              <FiCheck className="w-3 h-3 mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 shrink-0">
                              <FiAlertCircle className="w-3 h-3 mr-1" />
                              Unverified
                            </span>
                          )}
                        </div>
                        {artisan.profile?.profession && (
                          <p className="text-sm text-gray-600 mb-2">{artisan.profile.profession}</p>
                        )}
                        {(artisan.profile?.city || artisan.profile?.state) && (
                          <div className="flex items-center text-sm text-gray-500">
                            <FiMapPin className="w-4 h-4 mr-1" />
                            <span className="truncate">
                              {artisan.profile.city && artisan.profile.state
                                ? `${artisan.profile.city}, ${artisan.profile.state}`
                                : artisan.profile.city || artisan.profile.state}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {artisan.profile?.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {artisan.profile.bio}
                      </p>
                    )}

                    {artisan.profile?.skills && artisan.profile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {artisan.profile.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {artisan.profile.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{artisan.profile.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm mb-4">
                      {artisan.profile?.hourlyRate && (
                        <div className="flex items-center text-green-600 font-semibold">
                          <FiDollarSign className="w-4 h-4" />
                          <span>₦{artisan.profile.hourlyRate}/hr</span>
                        </div>
                      )}
                      {artisan.profile?.yearsOfExperience && (
                        <span className="text-gray-500">
                          {artisan.profile.yearsOfExperience} yrs exp
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="small"
                        className="flex-1"
                        onClick={() => navigate(`/user/${artisan._id}`)}
                      >
                        View Profile
                      </Button>
                      {user?.role === 'customer' && user?.id !== artisan._id && (
                        <button
                          onClick={() => handleMessageArtisan(artisan)}
                          className="p-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <FiMessageCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default DiscoverPage;
