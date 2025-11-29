// src/pages/dashboard/jobs/index.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import jobService, { Job } from '../../../services/jobService';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import useAuth from '../../../hooks/useAuth';

const JobsListPage: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getMyJobs();
        setJobs(data);
      } catch (err) {
        setError('Failed to fetch jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading jobs...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Jobs</h1>
        {user?.role === 'customer' && (
          <Link to="/dashboard/jobs/create">
            <Button variant="primary">Create New Job Request</Button>
          </Link>
        )}
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-700">You have no job requests or assigned jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job._id} className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <p className="text-gray-600 mb-2">{job.description}</p>
                <p className="text-sm text-gray-500">Status: <span className="font-medium capitalize">{job.status.replace('_', ' ')}</span></p>
                <p className="text-sm text-gray-500">
                  {user?.role === 'customer' ? `Artisan: ${job.artisan?.profile?.fullName || job.artisan?.username}` : `Customer: ${job.customer?.profile?.fullName || job.customer?.username}`}
                </p>
                {job.scheduledDate && <p className="text-sm text-gray-500">Scheduled: {new Date(job.scheduledDate).toLocaleDateString()}</p>}
                {job.price && <p className="text-sm text-gray-500">Price: ${job.price}</p>}
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <Link to={`/dashboard/jobs/${job._id}`}>
                  <Button variant="secondary" size="small">View Details</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsListPage;
