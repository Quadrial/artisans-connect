import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBriefcase, FiClock, FiDollarSign, FiMapPin, FiCalendar, FiUser, FiX, FiCheck, FiAlertCircle, FiMessageCircle, FiMail, FiPhone } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/Button';
import { postService } from '../services/postService';
import { jobApplicationService } from '../services/jobApplicationService';
import { messageService } from '../services/messageService';

const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [showMyApplicationModal, setShowMyApplicationModal] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  
  // Application form state
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchJobs();
    if (user?.role === 'artisan') {
      fetchMyApplications();
    }
  }, [user]);

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

  const fetchMyApplications = async () => {
    try {
      const applications = await jobApplicationService.getMyApplications();
      setMyApplications(applications);
    } catch (err) {
      console.error('Failed to fetch my applications:', err);
    }
  };

  const getJobApplication = (jobId: string) => {
    return myApplications.find(app => {
      const appJobId = app.job?._id || app.job?.id || app.job;
      return appJobId === jobId;
    });
  };

  const openApplicationModal = (job: any) => {
    console.log('Opening application modal for job:', job);
    setSelectedJob(job);
    setShowApplicationModal(true);
    setCoverLetter('');
    setProposedPrice('');
    setEstimatedDuration('');
    setSubmitError('');
  };

  const closeApplicationModal = () => {
    setShowApplicationModal(false);
    setSelectedJob(null);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      console.log('Submitting application for job:', selectedJob._id);
      await jobApplicationService.applyForJob(selectedJob._id, {
        coverLetter,
        proposedPrice: parseFloat(proposedPrice),
        estimatedDuration,
      });
      
      closeApplicationModal();
      await fetchMyApplications(); // Refresh applications
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Application submission error:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const openMyApplicationModal = (application: any) => {
    setSelectedApplication(application);
    setShowMyApplicationModal(true);
  };

  const openApplicationsModal = async (job: any) => {
    setSelectedJob(job);
    setShowApplicationsModal(true);
    try {
      const result = await jobApplicationService.getJobApplications(job._id);
      setApplications(result.applications || []);
    } catch (err) {
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

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxImages.length]);

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
                    <div 
                      className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                      onClick={() => {
                        setSelectedProfile(job.user);
                        setShowProfileModal(true);
                      }}
                    >
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
                      <p 
                        className="text-sm text-gray-500 mb-2 cursor-pointer hover:text-blue-600"
                        onClick={() => {
                          setSelectedProfile(job.user);
                          setShowProfileModal(true);
                        }}
                      >
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

                      {/* Job Images */}
                      {job.images && job.images.length > 0 && (
                        <div className="mb-3">
                          {job.images.length === 1 ? (
                            <div 
                              className="cursor-pointer overflow-hidden rounded-lg"
                              onClick={() => openLightbox(job.images, 0)}
                            >
                              <img
                                src={job.images[0]}
                                alt="Job reference"
                                className="w-full h-auto object-contain max-h-64 hover:opacity-95 transition-opacity"
                              />
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 gap-2">
                              {job.images.slice(0, 3).map((image: string, index: number) => (
                                <div 
                                  key={index}
                                  className="cursor-pointer overflow-hidden rounded-lg"
                                  onClick={() => openLightbox(job.images, index)}
                                >
                                  <img
                                    src={image}
                                    alt={`Job reference ${index + 1}`}
                                    className="w-full h-32 object-cover hover:opacity-95 transition-opacity"
                                  />
                                </div>
                              ))}
                              {job.images.length > 3 && (
                                <div 
                                  className="cursor-pointer overflow-hidden rounded-lg relative"
                                  onClick={() => openLightbox(job.images, 3)}
                                >
                                  <img
                                    src={job.images[3]}
                                    alt="Job reference 4"
                                    className="w-full h-32 object-cover hover:opacity-95 transition-opacity"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                    <span className="text-white text-xl font-bold">+{job.images.length - 3}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

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
                  {user?.role === 'artisan' ? (
                    (() => {
                      const application = getJobApplication(job._id);
                      if (application) {
                        return (
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                              application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {application.status === 'accepted' ? '✓ Accepted' :
                               application.status === 'rejected' ? '✗ Rejected' :
                               application.status === 'pending' ? '⏳ Pending' :
                               application.status}
                            </span>
                            <Button 
                              variant="secondary" 
                              size="small" 
                              onClick={() => openMyApplicationModal(application)}
                            >
                              View Application
                            </Button>
                          </div>
                        );
                      }
                      return (
                        <Button variant="primary" size="small" onClick={() => openApplicationModal(job)}>
                          Apply Now
                        </Button>
                      );
                    })()
                  ) : (
                    <Button variant="secondary" size="small" onClick={() => openApplicationsModal(job)}>
                      View Applications
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />

      {/* Application Modal */}
      {showApplicationModal && selectedJob ? (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ zIndex: 9999 }}>
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeApplicationModal}></div>

            <div className="relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 max-w-2xl w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Apply for Job</h3>
                  <button onClick={closeApplicationModal} className="text-gray-400 hover:text-gray-600">
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">{selectedJob.title}</h4>
                  <p className="text-sm text-gray-600">{selectedJob.description}</p>
                  {selectedJob.budget && (
                    <p className="text-sm text-green-600 font-medium mt-2">
                      Budget: ₦{selectedJob.budget.min} - ₦{selectedJob.budget.max}
                    </p>
                  )}
                </div>

                {submitError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <FiAlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                    <span className="text-sm text-red-800">{submitError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitApplication}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cover Letter *
                      </label>
                      <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        required
                        rows={4}
                        maxLength={1000}
                        placeholder="Explain why you're the best fit for this job..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">{coverLetter.length}/1000 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Proposed Price (₦) *
                      </label>
                      <input
                        type="number"
                        value={proposedPrice}
                        onChange={(e) => setProposedPrice(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                        placeholder="Enter your price"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Duration *
                      </label>
                      <input
                        type="text"
                        value={estimatedDuration}
                        onChange={(e) => setEstimatedDuration(e.target.value)}
                        required
                        placeholder="e.g., 2 weeks, 1 month"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <Button type="button" variant="secondary" onClick={closeApplicationModal}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Applications Modal (Customer View) */}
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
                    <FiBriefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {applications.map((app) => (
                      <div key={app._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
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
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {app.artisan?.profile?.fullName || app.artisan?.username}
                              </h4>
                              <p className="text-sm text-gray-500">{app.artisan?.email}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm">
                                <span className="text-green-600 font-medium">₦{app.proposedPrice}</span>
                                <span className="text-gray-500">{app.estimatedDuration}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {app.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => handleUpdateApplicationStatus(app._id, 'accepted')}
                                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center"
                                >
                                  <FiCheck className="w-4 h-4 mr-1" />
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleUpdateApplicationStatus(app._id, 'rejected')}
                                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center"
                                >
                                  <FiX className="w-4 h-4 mr-1" />
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{app.coverLetter}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Applied {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* My Application Modal (Artisan View) */}
      {showMyApplicationModal && selectedApplication ? (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ zIndex: 9999 }}>
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowMyApplicationModal(false)}></div>

            <div className="relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 max-w-2xl w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Your Application</h3>
                  <button onClick={() => setShowMyApplicationModal(false)} className="text-gray-400 hover:text-gray-600">
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">{selectedApplication.job?.title}</h4>
                  <p className="text-sm text-gray-600">{selectedApplication.job?.description}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedApplication.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      selectedApplication.status === 'withdrawn' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedApplication.status === 'pending' ? 'Pending Review' :
                       selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Proposed Price</label>
                    <p className="text-lg font-semibold text-green-600">₦{selectedApplication.proposedPrice}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration</label>
                    <p className="text-gray-900">{selectedApplication.estimatedDuration}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Applied On</label>
                    <p className="text-sm text-gray-600">{new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  {selectedApplication.status === 'pending' && (
                    <button
                      onClick={async () => {
                        if (confirm('Are you sure you want to withdraw this application?')) {
                          try {
                            await jobApplicationService.withdrawApplication(selectedApplication._id);
                            setShowMyApplicationModal(false);
                            fetchMyApplications();
                            alert('Application withdrawn successfully');
                          } catch (error) {
                            alert('Failed to withdraw application');
                          }
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Withdraw Application
                    </button>
                  )}
                  <button
                    onClick={() => setShowMyApplicationModal(false)}
                    className="ml-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* User Profile Modal */}
      {showProfileModal && selectedProfile ? (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ zIndex: 9999 }}>
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowProfileModal(false)}></div>

            <div className="relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 max-w-2xl w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
                  <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-600">
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                    {selectedProfile?.profile?.profilePicture ? (
                      <img
                        src={selectedProfile.profile.profilePicture}
                        alt={selectedProfile.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-10 h-10 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedProfile?.profile?.fullName || selectedProfile?.username}
                    </h2>
                    <p className="text-sm text-gray-500 capitalize">{selectedProfile?.role}</p>
                    {selectedProfile?.profile?.profession && (
                      <p className="text-sm text-gray-600 mt-1">{selectedProfile.profile.profession}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedProfile?.profile?.bio && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                      <p className="text-gray-700">{selectedProfile.profile.bio}</p>
                    </div>
                  )}

                  {selectedProfile?.email && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FiMail className="w-4 h-4" />
                      <span className="text-sm">{selectedProfile.email}</span>
                    </div>
                  )}

                  {selectedProfile?.profile?.phone && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FiPhone className="w-4 h-4" />
                      <span className="text-sm">{selectedProfile.profile.phone}</span>
                    </div>
                  )}

                  {(selectedProfile?.profile?.city || selectedProfile?.profile?.state) && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FiMapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {selectedProfile.profile.city && selectedProfile.profile.state
                          ? `${selectedProfile.profile.city}, ${selectedProfile.profile.state}`
                          : selectedProfile.profile.city || selectedProfile.profile.state}
                      </span>
                    </div>
                  )}

                  {selectedProfile?.profile?.skills && selectedProfile.profile.skills.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfile.profile.skills.map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProfile?.profile?.yearsOfExperience && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                      <p className="text-gray-700">{selectedProfile.profile.yearsOfExperience} years</p>
                    </div>
                  )}

                  {selectedProfile?.profile?.hourlyRate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
                      <p className="text-green-600 font-semibold">₦{selectedProfile.profile.hourlyRate}/hour</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                  {user?.role === 'customer' && selectedProfile?.role === 'artisan' && (
                    <button
                      onClick={async () => {
                        try {
                          await messageService.sendMessage(
                            selectedProfile._id || selectedProfile.id,
                            `Hi! I'm interested in discussing a project with you.`
                          );
                          setShowProfileModal(false);
                          navigate('/messages');
                        } catch (error) {
                          console.error('Failed to start conversation:', error);
                          alert('Failed to start conversation. Please try again.');
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <FiMessageCircle className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Image Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {lightboxImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 text-white hover:text-gray-300 z-50 bg-black bg-opacity-50 rounded-full p-2"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 text-white hover:text-gray-300 z-50 bg-black bg-opacity-50 rounded-full p-2"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div 
            className="max-w-7xl max-h-[90vh] w-full px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImages[currentImageIndex]}
              alt={`Full size ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
            {lightboxImages.length > 1 && (
              <div className="text-center text-white mt-4">
                <span className="text-lg">
                  {currentImageIndex + 1} / {lightboxImages.length}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
