// src/pages/dashboard.tsx
import React, { useState, useEffect } from 'react';
import { FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal, FiMapPin, FiStar, FiBookmark, FiSearch, FiFilter, FiGrid, FiList, FiUsers } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/Button';
import { postService } from '../services/postService';
// import { Post } from '../types';




const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getPosts();
        setPosts(data.posts);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch posts.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Mock artisan data for search
  const mockArtisans = [
    {
      id: 1,
      name: 'Maria Rodriguez',
      role: 'Master Carpenter',
      location: 'Austin, TX',
      avatar: '/images/image.png',
      rating: 4.9,
      reviewCount: 127,
      verified: true,
      skills: ['Woodworking', 'Custom Furniture', 'Restoration', 'Cabinetry'],
      priceRange: '$50-100/hr',
      completedProjects: 89,
      responseTime: '2 hours',
      description: 'Specializing in custom furniture and restoration with 15+ years of experience. I create heirloom pieces that tell stories.',
      portfolio: ['/images/image.png', '/images/image 2.png']
    },
    {
      id: 2,
      name: 'James Chen',
      role: 'Metalwork Artisan',
      location: 'Portland, OR',
      avatar: '/images/image 2.png',
      rating: 4.8,
      reviewCount: 94,
      verified: true,
      skills: ['Blacksmithing', 'Restoration', 'Custom Metalwork', 'Welding'],
      priceRange: '$60-120/hr',
      completedProjects: 67,
      responseTime: '1 hour',
      description: 'Traditional blacksmith creating modern solutions. From decorative pieces to functional hardware.',
      portfolio: ['/images/image 2.png', '/images/image.png']
    },
    {
      id: 3,
      name: 'Sarah Thompson',
      role: 'Ceramic Artist',
      location: 'Santa Fe, NM',
      avatar: '/images/image.png',
      rating: 4.9,
      reviewCount: 156,
      verified: true,
      skills: ['Pottery', 'Glazing', 'Custom Ceramics', 'Sculpture'],
      priceRange: '$30-80/hr',
      completedProjects: 203,
      responseTime: '4 hours',
      description: 'Creating unique ceramic pieces that blend traditional techniques with contemporary design.',
      portfolio: ['/images/image.png', '/images/image 2.png']
    }
  ];

  const skills = ['All Skills', 'Woodworking', 'Metalwork', 'Pottery', 'Restoration', 'Custom Furniture', 'Blacksmithing', 'Glazing'];
  const locations = ['All Locations', 'Austin, TX', 'Portland, OR', 'Santa Fe, NM', 'Denver, CO', 'Seattle, WA'];
  const priceRanges = ['Any Price', '$20-50/hr', '$50-100/hr', '$100-150/hr', '$150+/hr'];

  const filteredArtisans = mockArtisans.filter(artisan => {
    const matchesSearch = artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artisan.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artisan.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSkill = !selectedSkill || selectedSkill === 'All Skills' || artisan.skills.includes(selectedSkill);
    const matchesLocation = !selectedLocation || selectedLocation === 'All Locations' || artisan.location === selectedLocation;
    const matchesPrice = !priceRange || priceRange === 'Any Price' || artisan.priceRange.includes(priceRange.split('/')[0].replace('$', ''));
    
    return matchesSearch && matchesSkill && matchesLocation && matchesPrice;
  });

  const ArtisanCard = ({ artisan }: { artisan: typeof mockArtisans[0] }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${viewMode === 'list' ? 'sm:flex' : ''}`}>
      {/* Artisan Image */}
      <div className={`${viewMode === 'list' ? 'sm:w-48 sm:shrink-0' : ''}`}>
        <img
          src={artisan.portfolio[0]}
          alt={`${artisan.name}'s work`}
          className={`w-full object-cover ${viewMode === 'list' ? 'h-48 sm:h-full' : 'h-40 sm:h-48'}`}
        />
      </div>
      
      <div className="p-4 sm:p-6 flex-1">
        {/* Artisan Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <img
              src={artisan.avatar}
              alt={artisan.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{artisan.name}</h3>
                {artisan.verified && (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{artisan.role}</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-500 mt-1 space-y-1 sm:space-y-0">
                <div className="flex items-center">
                  <FiMapPin className="w-3 h-3 mr-1 shrink-0" />
                  <span className="truncate">{artisan.location}</span>
                </div>
                <div className="flex items-center">
                  <FiStar className="w-3 h-3 mr-1 text-yellow-400 fill-current shrink-0" />
                  <span>{artisan.rating} ({artisan.reviewCount})</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0 ml-2">
            <p className="text-sm sm:text-lg font-bold text-green-600">{artisan.priceRange}</p>
            <p className="text-xs text-gray-500 hidden sm:block">Responds in {artisan.responseTime}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">{artisan.description}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
          {artisan.skills.slice(0, viewMode === 'list' ? 3 : 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
            >
              {skill}
            </span>
          ))}
          {artisan.skills.length > (viewMode === 'list' ? 3 : 4) && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{artisan.skills.length - (viewMode === 'list' ? 3 : 4)} more
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
          <span>{artisan.completedProjects} projects</span>
          <span className="text-green-600">Available now</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="primary" size="small" className="flex-1 text-xs sm:text-sm">
            Contact
          </Button>
          <Button variant="secondary" size="small" className="sm:flex-shrink-0 text-xs sm:text-sm">
            Portfolio
          </Button>
          <button className="p-2 text-gray-400 hover:text-red-500 self-center sm:self-auto">
            <FiHeart className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const PostCard = ({ post }: { post: Post }) => {
    const [comment, setComment] = useState('');

    const handleLike = async () => {
      try {
        await postService.toggleLike(post.id);
        // Here you might want to update the post in the posts state
      } catch (error) {
        console.error('Failed to like post', error);
      }
    };

    const handleComment = async () => {
      if (!comment.trim()) return;
      try {
        await postService.addComment(post.id, comment);
        setComment('');
        // Here you might want to update the post in the posts state
      } catch (error) {
        console.error('Failed to add comment', error);
      }
    };

    const handleSave = async () => {
      try {
        await postService.toggleSave(post.id);
        // Here you might want to update the post in the posts state
      } catch (error) {
        console.error('Failed to save post', error);
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4 sm:mb-6">
        {/* Post Header */}
        <div className="p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <img
              src={post.user.profilePicture || '/images/logo3.png'}
              alt={post.user.username}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{post.user.username}</h3>
                {post.user.verified && (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-xs sm:text-sm text-gray-500">
                <span className="truncate">{post.user.role}</span>
                <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center">
                    <FiMapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">{post.user.location}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <FiStar className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                    {post.user.rating}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-full shrink-0">
            <FiMoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </button>
        </div>

        {/* Post Content */}
        <div className="px-3 sm:px-4 pb-3">
          <h2 className="font-bold text-lg mb-2">{post.title}</h2>
          <p className="text-gray-800 leading-relaxed text-sm sm:text-base">{post.description}</p>
          
          {/* Skills Tags */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-3">
            {post.skills.map((skill, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 text-xs sm:text-sm rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Price Range */}
          <div className="mt-3">
            <span className="text-green-600 font-semibold text-sm sm:text-base">Starting at {post.price}</span>
          </div>
        </div>

        {/* Post Images */}
        {post.images.length > 0 && (
          <div className="px-3 sm:px-4 pb-3 sm:pb-4">
            <img
              src={post.images[0]}
              alt="Work showcase"
              className="w-full h-48 sm:h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Post Actions */}
        <div className="px-3 sm:px-4 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <button onClick={handleLike} className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                <FiHeart className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">{post.likes.length}</span>
              </button>
              <button onClick={handleComment} className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                <FiMessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="flex xs sm:text-sm font-medium">{post.comments.length}</span>
              </button>
              <button className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                <FiShare2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Share</span>
              </button>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button onClick={handleSave} className="text-gray-400 hover:text-gray-600 p-1">
                <FiBookmark className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <Button variant="primary" size="small" className="text-xs sm:text-sm">
                {user?.role === 'customer' ? 'Contact' : 'Connect'}
              </Button>
            </div>
          </div>
        </div>
        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Time */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Sidebar />
      <DashboardHeader />

      <main className="md:ml-64 max-w-4xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {user?.role === 'artisan' 
              ? 'Discover what fellow artisans are creating and share your latest work.'
              : 'Explore amazing work from talented artisans and find the perfect match for your project.'
            }
          </p>
        </div>

        {/* Main Navigation Tabs */}
        <div className="mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('feed')}
                className={`border-b-2 py-2 px-1 text-xs sm:text-sm font-medium whitespace-nowrap ${
                  activeTab === 'feed' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Feed
              </button>
              {user?.role === 'customer' && (
                <button 
                  onClick={() => setActiveTab('browse')}
                  className={`border-b-2 py-2 px-1 text-xs sm:text-sm font-medium whitespace-nowrap ${
                    activeTab === 'browse' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FiSearch className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Browse Artisans</span>
                  <span className="sm:hidden">Browse</span>
                </button>
              )}
              <button 
                onClick={() => setActiveTab('following')}
                className={`border-b-2 py-2 px-1 text-xs sm:text-sm font-medium whitespace-nowrap ${
                  activeTab === 'following' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Following
              </button>
              <button 
                onClick={() => setActiveTab('trending')}
                className={`border-b-2 py-2 px-1 text-xs sm:text-sm font-medium whitespace-nowrap ${
                  activeTab === 'trending' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Trending
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'browse' && user?.role === 'customer' ? (
          <div>
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="w-full">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      placeholder="Search artisans..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                  >
                    {skills.map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>

                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>

                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                  >
                    {priceRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>

                  <button className="px-2 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center text-xs sm:text-sm">
                    <FiFilter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">More</span>
                    <span className="sm:hidden">+</span>
                  </button>
                </div>

                {/* Results and View Toggle */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-3 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600">
                    {filteredArtisans.length} artisan{filteredArtisans.length !== 1 ? 's' : ''} found
                  </p>
                  <div className="flex items-center justify-between sm:justify-end">
                    <span className="text-xs sm:text-sm text-gray-600 sm:mr-3">View:</span>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <FiGrid className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <FiList className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Artisans Grid/List */}
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6' : 'space-y-4'}`}>
              {filteredArtisans.map((artisan) => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
              ))}
            </div>

            {/* No Results */}
            {filteredArtisans.length === 0 && (
              <div className="text-center py-12">
                <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No artisans found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSkill('');
                    setSelectedLocation('');
                    setPriceRange('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Feed Content */}
            {activeTab === 'feed' && (
              <div className="mb-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
                      For You
                    </button>
                    <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                      Recent
                    </button>
                    <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                      Local
                    </button>
                  </nav>
                </div>
              </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-6">
              {loading && <p>Loading posts...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {activeTab === 'feed' && !loading && !error && posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              {activeTab === 'following' && (
                <div className="text-center py-12">
                  <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts from followed artisans</h3>
                  <p className="text-gray-500 mb-4">Start following artisans to see their latest work here</p>
                  <Button variant="primary" onClick={() => setActiveTab('browse')}>
                    Browse Artisans
                  </Button>
                </div>
              )}
              {activeTab === 'trending' && (
                <div className="text-center py-12">
                  <FiStar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Trending content coming soon</h3>
                  <p className="text-gray-500">Check back later for trending posts and popular artisans</p>
                </div>
              )}
            </div>

            {/* Load More */}
            {activeTab === 'feed' && (
              <div className="text-center mt-8">
                <Button variant="secondary" size="large">
                  Load More Posts
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default DashboardPage;
