// src/pages/dashboard/posts/PostDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import postService from '../../../services/postService';
import { Post } from '../../../types/post';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('No post ID provided');
        setLoading(false);
        return;
      }
      try {
        const data = await postService.getPostById(id);
        setPost(data);
      } catch (err) {
        setError('Failed to fetch post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="text-center p-4">Loading post...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="text-center p-4 text-gray-700">Post not found.</div>;
  }

  return (
    <div className="p-4 flex justify-center">
      <Card className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-700 mb-4">{post.content}</p>
        <p className="text-sm text-gray-500">
          Posted by {post.author.username} on {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div className="mt-6 flex space-x-2">
          {/* Add Edit/Delete buttons here if authorized */}
          <Link to="/dashboard/posts">
            <Button variant="secondary">Back to Posts</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default PostDetailPage;
