import React, { useState, useEffect } from 'react';
import { FiBriefcase, FiClock, FiDollarSign, FiMapPin, FiCalendar, FiUser } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/Button';
import { postService } from '../services/postService';

const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const result = await postService.getPosts({
        type: 'job',
        page: 1,
        limit: 50,
      });
      setJobs(result.posts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Sidebar />
      <DashboardHeader />

      <main className="md:ml-64 max-w-6xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {user?.role === 'artisan' ? 'Available Jobs' : 'My Hires'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'artisan' 
              ? 'Browse and apply for jobs that match your skills'
              : 'Manage your hired artisans and ongoing projects'
            }
          </p>
        </div>

        {/* Jobs List */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading jobs...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FiBriefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Jobs Available
            </h2>
            <p className="text-gray-600">
              Check back later for new job opportunities that match your skills.
            </p>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                      {job.user?.profile?.profilePicture ? (
                        <img
                          src={job.user.profile.profilePicture}
                          alt={job.user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Posted by {job.user?.profile?.fullName || job.user?.username}
                      </p>
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
                            <FiDollarSign className="w-4 h-4 mr-1 text-green-600" />
                            <span className="font-medium text-green-600">
                              ₦{job.budget.min} - ₦{job.budget.max}
                            </span>
                          </div>
                        )}
                        {job.deadline && (
                          <div className="flex items-center">
                            <FiCalendar className="w-4 h-4 mr-1" />
                            <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                        {job.location?.city && (
                          <div className="flex items-center">
                            <FiMapPin className="w-4 h-4 mr-1" />
                            <span>{job.location.city}, {job.location.state}</span>
                          </div>
                        )}
                        {job.jobType && (
                          <div className="flex items-center">
                            <FiClock className="w-4 h-4 mr-1" />
                            <span className="capitalize">{job.jobType}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <Button variant="primary" size="small">
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default JobsPage;
