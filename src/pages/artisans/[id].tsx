// src/pages/artisans/[id].tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../services/api'; // Direct API call for user data for now
import reviewService, { Review } from '../../services/reviewService';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import useAuth from '../../hooks/useAuth';

interface ArtisanProfile {
  _id: string;
  username: string;
  email: string;
  profile: {
    fullName?: string;
    phone?: string;
    address?: string;
    bio?: string;
    ratings: {
      average: number;
      count: number;
    };
  };
  role: string;
}

const ArtisanProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user: currentUser } = useAuth();
  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    const fetchArtisanData = async () => {
      if (!id) {
        setError('No artisan ID provided');
        setLoading(false);
        return;
      }
      try {
        // Fetch artisan (user) details
        const artisanRes = await API.get(`/users/${id}`); // Assuming a /users/:id endpoint for user profiles
        setArtisan(artisanRes.data);

        // Fetch reviews for this artisan
        const reviewsRes = await reviewService.getReviewsByArtisan(id);
        setReviews(reviewsRes.data);
      } catch (err) {
        setError('Failed to fetch artisan data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtisanData();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artisan) return;
    try {
      const createdReview = await reviewService.createReview({
        artisan: artisan._id,
        rating: newReview.rating,
        comment: newReview.comment,
      });
      setReviews([...reviews, createdReview]);
      setShowReviewModal(false);
      setNewReview({ rating: 0, comment: '' }); // Reset form
      // Optionally, refetch artisan data to update average rating
    } catch (err) {
      console.error('Failed to submit review:', err);
      // Handle error
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading artisan profile...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!artisan) {
    return <div className="text-center p-4 text-gray-700">Artisan not found.</div>;
  }

  const isArtisan = currentUser?.role === 'artisan';
  const isCustomer = currentUser?.role === 'customer';

  return (
    <div className="p-4">
      <Card className="max-w-4xl mx-auto mb-6">
        <h1 className="text-4xl font-bold mb-2">{artisan.profile.fullName || artisan.username}</h1>
        <p className="text-gray-600 mb-4">{artisan.profile.bio || 'No bio provided.'}</p>
        <div className="flex items-center text-lg mb-4">
          <span className="text-yellow-500 mr-2">{'★'.repeat(Math.round(artisan.profile.ratings.average))}</span>
          <span className="text-gray-700">
            {artisan.profile.ratings.average.toFixed(1)} ({artisan.profile.ratings.count} reviews)
          </span>
        </div>
        {artisan.profile.phone && <p className="text-gray-700">Phone: {artisan.profile.phone}</p>}
        {artisan.profile.address && <p className="text-gray-700">Address: {artisan.profile.address}</p>}
        {/* Display skills and portfolio here */}
        <h2 className="text-2xl font-semibold mt-6 mb-3">Skills</h2>
        <p>Skills list goes here...</p> {/* Placeholder */}
        <h2 className="text-2xl font-semibold mt-6 mb-3">Portfolio</h2>
        <p>Portfolio posts go here...</p> {/* Placeholder */}
      </Card>

      <Card className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        {isAuthenticated && isCustomer && (
          <div className="mb-4">
            <Button onClick={() => setShowReviewModal(true)}>Leave a Review</Button>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-700">No reviews yet for this artisan.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center mb-1">
                  <p className="font-semibold mr-2">{review.customer.username}</p>
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                </div>
                <p className="text-gray-800">{review.comment}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Leave a Review">
        <form onSubmit={handleReviewSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Rating</label>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="0">Select a rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Comment (Optional)</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={4}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ArtisanProfilePage;
