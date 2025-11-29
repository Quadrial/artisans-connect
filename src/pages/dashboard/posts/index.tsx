// src/pages/dashboard/posts/index.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import postService from '../../../services/postService';
import { Post } from '../../../types/post';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';

const PostsListPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getPosts();
        setPosts(data);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Posts</h1>
        <Link to="/dashboard/posts/create">
          <Button variant="primary">Create New Post</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-700">You haven't created any posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <Link to={`/dashboard/posts/${post.id}`}>
                  <Button variant="secondary" size="small">View</Button>
                </Link>
                {/* Add Edit/Delete buttons later */}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsListPage;
