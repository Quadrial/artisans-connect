// src/pages/dashboard/posts/create.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import postService from '../../../services/postService';
import { Button } from '../../../components/Button';

const CreatePostPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const navigate = useNavigate();

  const { title, content } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postService.createPost({ title, content });
      navigate('/dashboard/posts');
    } catch (err) {
      console.error(err);
      // Handle error
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Post Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Post Title"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            Post Content
          </label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={onChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            placeholder="Write your post content here..."
            required
          ></textarea>
        </div>
        <div className="flex items-center justify-between">
          <Button type="submit" variant="primary" size="large">
            Create Post
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/posts')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
