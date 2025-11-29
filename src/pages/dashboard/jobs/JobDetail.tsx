// src/pages/dashboard/jobs/JobDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jobService, { Job } from '../../../services/jobService';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import useAuth from '../../../hooks/useAuth';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        setError('No job ID provided');
        setLoading(false);
        return;
      }
      try {
        const data = await jobService.getJobById(id);
        setJob(data);
      } catch (err) {
        setError('Failed to fetch job');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleUpdateStatus = async (newStatus: Job['status']) => {
    if (!job || !user || job.artisan._id !== user.id) return; // Only artisan can update status
    try {
      const updatedJob = await jobService.updateJobStatus(job._id, newStatus);
      setJob(updatedJob);
    } catch (err) {
      console.error('Failed to update job status:', err);
    }
  };

  const handleDeleteJob = async () => {
    if (!job) return;
    if (window.confirm('Are you sure you want to cancel/decline this job?')) {
      try {
        await jobService.deleteJob(job._id);
        navigate('/dashboard/jobs'); // Go back to job list after deletion
      } catch (err) {
        console.error('Failed to delete job:', err);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading job details...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!job) {
    return <div className="text-center p-4 text-gray-700">Job not found.</div>;
  }

  const isCustomer = user?.id === job.customer._id;
  const isArtisan = user?.id === job.artisan._id;
  const canUpdateStatus = isArtisan;
  const canDelete = (isCustomer && job.status === 'pending') || (isArtisan && job.status === 'pending'); // Customer can cancel pending, Artisan can decline pending

  return (
    <div className="p-4 flex justify-center">
      <Card className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
        <p className="text-gray-700 mb-4">{job.description}</p>

        <div className="mb-4">
          <p className="text-gray-800">
            <strong>Status:</strong> <span className="font-medium capitalize">{job.status.replace('_', ' ')}</span>
          </p>
          <p className="text-gray-800">
            <strong>Customer:</strong> {job.customer.profile.fullName || job.customer.username}
          </p>
          <p className="text-gray-800">
            <strong>Artisan:</strong> {job.artisan.profile.fullName || job.artisan.username}
          </p>
          {job.scheduledDate && (
            <p className="text-gray-800">
              <strong>Scheduled Date:</strong> {new Date(job.scheduledDate).toLocaleDateString()}
            </p>
          )}
          <p className="text-gray-800">
            <strong>Location:</strong> {job.location}
          </p>
          {job.price && (
            <p className="text-gray-800">
              <strong>Price:</strong> ${job.price}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Created on {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </div>

        {(canUpdateStatus || canDelete) && (
          <div className="mt-6 flex flex-wrap gap-2">
            {canUpdateStatus && job.status === 'pending' && (
              <Button onClick={() => handleUpdateStatus('accepted')} variant="primary">Accept Job</Button>
            )}
            {canUpdateStatus && job.status === 'accepted' && (
              <Button onClick={() => handleUpdateStatus('in_progress')} variant="primary">Start Job</Button>
            )}
            {canUpdateStatus && job.status === 'in_progress' && (
              <Button onClick={() => handleUpdateStatus('completed')} variant="primary">Mark as Complete</Button>
            )}
            {canDelete && (job.status === 'pending') && (
              <Button onClick={handleDeleteJob} variant="danger">
                {isCustomer ? 'Cancel Job Request' : 'Decline Job Request'}
              </Button>
            )}
            {/* Add more status update buttons as needed */}
            <Button onClick={() => navigate('/dashboard/jobs')} variant="secondary">Back to Jobs</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default JobDetailPage;
