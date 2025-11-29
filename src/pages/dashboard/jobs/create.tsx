// src/pages/dashboard/jobs/create.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jobService from '../../../services/jobService';
import API from '../../../services/api'; // To fetch artisans
import { Button } from '../../../components/Button';
import useAuth from '../../../hooks/useAuth';

interface ArtisanOption {
  _id: string;
  username: string;
  profile: {
    fullName: string;
  };
}

const CreateJobPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    artisan: '',
    title: '',
    description: '',
    scheduledDate: '',
    location: '',
  });
  const [artisans, setArtisans] = useState<ArtisanOption[]>([]);
  const [loadingArtisans, setLoadingArtisans] = useState<boolean>(true);
  const [errorArtisans, setErrorArtisans] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const response = await API.get('/users/artisans'); // Assuming this endpoint exists
        setArtisans(response.data);
      } catch (err) {
        setErrorArtisans('Failed to fetch artisans');
        console.error(err);
      } finally {
        setLoadingArtisans(false);
      }
    };
    fetchArtisans();
  }, []);

  const { artisan, title, description, scheduledDate, location } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role !== 'customer') {
      alert('Only customers can create job requests.');
      return;
    }
    try {
      await jobService.createJob(formData);
      navigate('/dashboard/jobs');
    } catch (err) {
      console.error(err);
      // Handle error
    }
  };

  if (loadingArtisans) {
    return <div className="p-4">Loading artisans...</div>;
  }

  if (errorArtisans) {
    return <div className="p-4 text-red-500">{errorArtisans}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Create New Job Request</h1>
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="artisan">
            Select Artisan
          </label>
          <select
            id="artisan"
            name="artisan"
            value={artisan}
            onChange={onChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">-- Select an Artisan --</option>
            {artisans.map((art) => (
              <option key={art._id} value={art._id}>
                {art.profile?.fullName || art.username}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Job Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., Repair leaky faucet"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Job Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            placeholder="Describe the job in detail..."
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scheduledDate">
            Scheduled Date (Optional)
          </label>
          <input
            type="date"
            id="scheduledDate"
            name="scheduledDate"
            value={scheduledDate}
            onChange={onChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={onChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., 123 Main St, Anytown"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <Button type="submit" variant="primary" size="large">
            Submit Job Request
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/jobs')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobPage;
