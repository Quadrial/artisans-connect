// src/pages/dashboard/skills/create.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import skillService from '../../../services/skillService';
import { Button } from '../../../components/Button';

const CreateSkillPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const navigate = useNavigate();

  const { name, description } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await skillService.createSkill({ name, description });
      navigate('/dashboard/skills');
    } catch (err) {
      console.error(err);
      // Handle error
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Add New Skill</h1>
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Skill Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Skill Name"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Skill Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            placeholder="Describe the skill..."
            required
          ></textarea>
        </div>
        <div className="flex items-center justify-between">
          <Button type="submit" variant="primary" size="large">
            Add Skill
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/skills')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSkillPage;
