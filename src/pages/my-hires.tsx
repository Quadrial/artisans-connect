import React, { useState, useEffect } from 'react';
import { FiUsers, FiDollarSign, FiCalendar, FiMapPin, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/Button';
import { postService } from '../services/postService';

const MyHiresPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'jobs' | 'hires'>('jobs');
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchMyJobs();
    }
  }, [user]);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const posts = await postService.getPosts({
        type: 'job',
        page: 1,
        limit: 50,
      });
      // Filter to only show current user's jobs
      const userJobs = posts.posts?.filter((post: any) => post.user._id === user?.id) || [];
      setMyJobs(userJobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job post?')) return;
    
    try {
      await postService.deletePost(jobId);
      setMyJobs(myJobs.filter(job => job._id !== jobId));
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Sidebar />
      <DashboardHeader />

      <main className="md:ml-64 max-w-6xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            My Jobs & Hires
          </h1>
          <p className="text-gray-600">
            Manage your job posts and hired artisans
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`border-b-2 py-2 px-1 text-sm font-medium ${
                  activeTab === 'jobs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Job Posts ({myJobs.length})
              </button>
              <button
                onClick={() => setActiveTab('hires')}
                className={`border-b-2 py-2 px-1 text-sm font-medium ${
                  activeTab === 'hires'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Hired Artisans (Coming Soon)
              </button>
            </nav>
          </div>
        </div>

        {/* My Job Posts Tab */}
        {activeTab === 'jobs' && (
          <div>
            {loading && (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading your jobs...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {!loading && !error && myJobs.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No Job Posts Yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Start by posting a job to find the perfect artisan for your project.
                </p>
                <Button variant="primary">
                  Post a Job
                </Button>
              </div>
            )}

            {!loading && !error && myJobs.length > 0 && (
              <div className="grid grid-cols-1 gap-4">
                {myJobs.map((job) => (
                  <div key={job._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{job.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.skills?.map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          {job.budget && (
                            <div className="flex items-center">
                              <FiDollarSign className="w-4 h-4 mr-1" />
                              <span>₦{job.budget.min} - ₦{job.budget.max}</span>
                            </div>
                          )}
                          {job.deadline && (
                            <div className="flex items-center">
                              <FiCalendar className="w-4 h-4 mr-1" />
                              <span>{new Date(job.deadline).toLocaleDateString()}</span>
                            </div>
                          )}
                          {job.location?.city && (
                            <div className="flex items-center">
                              <FiMapPin className="w-4 h-4 mr-1" />
                              <span>{job.location.city}, {job.location.state}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <FiEye className="w-4 h-4 mr-1" />
                            <span>{job.views || 0} views</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <Button variant="primary" size="small">
                        View Responses (0)
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Hired Artisans Tab */}
        {activeTab === 'hires' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Hiring Management Coming Soon
            </h2>
            <p className="text-gray-600 mb-6">
              Track your hired artisans, manage projects, and handle payments seamlessly.
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default MyHiresPage;
