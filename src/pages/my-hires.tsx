import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiDollarSign, FiCalendar, FiMapPin, FiEdit, FiTrash2, FiEye, FiPlus, FiX, FiCheck, FiUser, FiMessageCircle, FiAlertCircle } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/Button';
import { postService } from '../services/postService';
import { jobApplicationService } from '../services/jobApplicationService';
import { messageService } from '../services/messageService';
import CreatePostModal from '../components/CreatePostModal';

const MyHiresPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'jobs' | 'hires'>('jobs');
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);

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
      const userId = (user as any)?._id || user?.id;
      const userJobs = posts.posts?.filter((post: any) => {
        const postUserId = post.user?._id || post.user?.id;
        return postUserId === userId;
      }) || [];
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

  const openApplicationsModal = async (job: any) => {
    console.log('Opening applications modal for job:', job);
    setSelectedJob(job);
    setShowApplicationsModal(true);
    try {
      console.log('Fetching applications for job ID:', job._id);
      const result = await jobApplicationService.getJobApplications(job._id);
      console.log('Applications received:', result);
      setApplications(result.applications || []);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    }
  };

  const closeApplicationsModal = () => {
    setShowApplicationsModal(false);
    setSelectedJob(null);
    setApplications([]);
  };

  const handleUpdateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
    try {
      await jobApplicationService.updateApplicationStatus(applicationId, status);
      // Refresh applications
      const result = await jobApplicationService.getJobApplications(selectedJob._id);
      setApplications(result.applications || []);
      alert(`Application ${status} successfully!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update application');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Sidebar />
      <DashboardHeader />

      <main className="md:ml-64 max-w-6xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              My Jobs & Hires
            </h1>
            <p className="text-gray-600">
              Manage your job posts and hired artisans
            </p>
          </div>
          <Button 
            variant="primary" 
            size="small" 
            className="flex items-center"
            onClick={() => setIsCreatePostOpen(true)}
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
                <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No Job Posts Yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Start by posting a job to find the perfect artisan for your project.
                </p>
                {/* Create Post Button */}
                            <Button 
                              variant="primary" 
                              size="small" 
                              className="flex items-center text-xs sm:text-sm"
                              onClick={() => setIsCreatePostOpen(true)}
                            >
                              <FiPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">{user?.role === 'artisan' ? 'Share Work' : 'Post Job'}</span>
                              <span className="sm:hidden">+</span>
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
                        
                        {/* Job Images */}
                        {job.images && job.images.length > 0 && (
                          <div className="mb-3">
                            {job.images.length === 1 ? (
                              <img
                                src={job.images[0]}
                                alt="Job reference"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="grid grid-cols-3 gap-2">
                                {job.images.slice(0, 3).map((image: string, index: number) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Job reference ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                ))}
                                {job.images.length > 3 && (
                                  <div className="relative">
                                    <img
                                      src={job.images[3]}
                                      alt="Job reference 4"
                                      className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
                                      <span className="text-white text-lg font-bold">+{job.images.length - 3}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        
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
                      <Button 
                        variant="primary" 
                        size="small"
                        onClick={() => openApplicationsModal(job)}
                      >
                        View Applications
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
      
      <CreatePostModal 
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSuccess={() => {
          setIsCreatePostOpen(false);
          fetchMyJobs(); // Refresh the jobs list
        }}
      />

      {/* Applications Modal */}
      {showApplicationsModal && selectedJob ? (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ zIndex: 9999 }}>
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeApplicationsModal}></div>

            <div className="relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 max-w-4xl w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Applications for: {selectedJob.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{applications.length} application(s) received</p>
                  </div>
                  <button onClick={closeApplicationsModal} className="text-gray-400 hover:text-gray-600">
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No applications yet</p>
                    <p className="text-sm text-gray-400 mt-2">Artisans will see your job post and can apply</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {applications.map((app) => (
                      <div key={app._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                              {app.artisan?.profile?.profilePicture ? (
                                <img
                                  src={app.artisan.profile.profilePicture}
                                  alt={app.artisan.username}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FiUser className="w-6 h-6 text-gray-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">
                                  {app.artisan?.profile?.fullName || app.artisan?.username}
                                </h4>
                                {/* Verification Badge */}
                                {app.artisan?.isVerified ? (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    <FiCheck className="w-2.5 h-2.5 mr-0.5" />
                                    Verified
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    <FiAlertCircle className="w-2.5 h-2.5 mr-0.5" />
                                    Unverified
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{app.artisan?.email}</p>
                              {app.artisan?.profile?.city && (
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                  <FiMapPin className="w-3 h-3 mr-1" />
                                  {app.artisan.profile.city}, {app.artisan.profile.state}
                                </p>
                              )}
                              <div className="flex items-center space-x-4 mt-2 text-sm">
                                <span className="text-green-600 font-semibold flex items-center">
                                  <FiDollarSign className="w-4 h-4" />
                                  ₦{app.proposedPrice}
                                </span>
                                <span className="text-gray-500 flex items-center">
                                  <FiCalendar className="w-4 h-4 mr-1" />
                                  {app.estimatedDuration}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {app.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => handleUpdateApplicationStatus(app._id, 'accepted')}
                                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center transition-colors"
                                  title="Accept application"
                                >
                                  <FiCheck className="w-4 h-4 mr-1" />
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleUpdateApplicationStatus(app._id, 'rejected')}
                                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center transition-colors"
                                  title="Reject application"
                                >
                                  <FiX className="w-4 h-4 mr-1" />
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                                app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 mb-2">
                          <p className="text-xs font-medium text-gray-500 mb-1">Cover Letter:</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{app.coverLetter}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                          <div className="flex items-center space-x-2">
                            {app.status === 'accepted' && (
                              <span className="text-green-600 font-medium">✓ Hired</span>
                            )}
                            <button
                              onClick={async () => {
                                try {
                                  await messageService.sendMessage(app.artisan._id, `Hi! Regarding your application for "${selectedJob.title}"`);
                                  navigate('/messages');
                                } catch (error) {
                                  console.error('Failed to start conversation:', error);
                                }
                              }}
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium"
                            >
                              <FiMessageCircle className="w-4 h-4" />
                              <span>Message</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <Button variant="secondary" onClick={closeApplicationsModal}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MyHiresPage;
