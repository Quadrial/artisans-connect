import React, { useState } from 'react';
import { FiX, FiImage, FiMapPin, FiDollarSign, FiCalendar, FiTag } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import { Button } from './Button';
import { postService } from '../services/postService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [postType, setPostType] = useState<'work' | 'job'>('work');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: [] as string[],
    priceMin: '',
    priceMax: '',
    state: '',
    city: '',
    deadline: '',
    jobType: 'one-time' as 'one-time' | 'ongoing' | 'contract',
  });

  const [newSkill, setNewSkill] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (imagePreviews.length + files.length > 5) {
      setError('You can upload maximum 5 images');
      return;
    }

    const newImages: string[] = [];
    let processedCount = 0;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError('Each image must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        processedCount++;
        
        if (processedCount === files.length) {
          setImagePreviews(prev => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const baseData = {
        title: formData.title,
        description: formData.description,
        skills: formData.skills,
        type: (user?.role === 'artisan' ? 'work' : postType) as 'work' | 'job',
        location: (formData.state || formData.city) ? {
          state: formData.state,
          city: formData.city,
        } : undefined,
      };

      const priceData = (formData.priceMin || formData.priceMax) ? {
        min: parseFloat(formData.priceMin) || 0,
        max: parseFloat(formData.priceMax) || 0,
      } : undefined;

      const postData = {
        ...baseData,
        images: imagePreviews.length > 0 ? imagePreviews : undefined,
        ...(user?.role === 'artisan' || postType === 'work' ? { priceRange: priceData } : { budget: priceData }),
        ...(postType === 'job' ? {
          deadline: formData.deadline || undefined,
          jobType: formData.jobType,
        } : {}),
      };

      await postService.createPost(postData);
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPostType('work');
    setFormData({
      title: '',
      description: '',
      skills: [],
      priceMin: '',
      priceMax: '',
      state: '',
      city: '',
      deadline: '',
      jobType: 'one-time',
    });
    setNewSkill('');
    setImagePreviews([]);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {user?.role === 'artisan' ? 'Share Your Work' : postType === 'job' ? 'Post a Job' : 'Share a Post'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          
          {/* Post Type Toggle for Customers */}
          {user?.role === 'customer' && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPostType('work')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  postType === 'work'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Regular Post
              </button>
              <button
                type="button"
                onClick={() => setPostType('job')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  postType === 'job'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Job Post
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={user?.role === 'artisan' ? 'e.g., Custom Oak Dining Table' : 'e.g., Need a Carpenter for Kitchen Renovation'}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={user?.role === 'artisan' 
                ? 'Describe your work, materials used, and what makes it special...' 
                : 'Describe the job, requirements, and what you\'re looking for...'}
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiImage className="inline w-4 h-4 mr-1" />
              Images (Max 5)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={imagePreviews.length >= 5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {imagePreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-lg"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">{imagePreviews.length}/5 images uploaded</p>
          </div>

          {/* Skills - Only for job posts */}
          {postType === 'job' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiTag className="inline w-4 h-4 mr-1" />
              Required Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a skill or tag"
              />
              <Button type="button" onClick={handleAddSkill} variant="secondary">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
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
          )}

          {/* Budget - Only for job posts */}
          {postType === 'job' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiDollarSign className="inline w-4 h-4 mr-1" />
              Budget (₦)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={formData.priceMin}
                onChange={(e) => setFormData({ ...formData, priceMin: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Min"
                min="0"
              />
              <input
                type="number"
                value={formData.priceMax}
                onChange={(e) => setFormData({ ...formData, priceMax: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Max"
                min="0"
              />
            </div>
          </div>
          )}

          {/* Location - Only for job posts */}
          {postType === 'job' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiMapPin className="inline w-4 h-4 mr-1" />
              Location
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="State"
              />
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="City"
              />
            </div>
          </div>
          )}

          {/* Job-specific fields */}
          {postType === 'job' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline w-4 h-4 mr-1" />
                  Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  value={formData.jobType}
                  onChange={(e) => setFormData({ ...formData, jobType: e.target.value as 'one-time' | 'ongoing' | 'contract' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="one-time">One-time</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
