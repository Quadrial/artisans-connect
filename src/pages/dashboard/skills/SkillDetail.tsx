// src/pages/dashboard/skills/SkillDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import skillService from '../../../services/skillService';
import { Skill } from '../../../types/skill';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';

const SkillDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkill = async () => {
      if (!id) {
        setError('No skill ID provided');
        setLoading(false);
        return;
      }
      try {
        const data = await skillService.getSkillById(id);
        setSkill(data);
      } catch (err) {
        setError('Failed to fetch skill');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkill();
  }, [id]);

  if (loading) {
    return <div className="text-center p-4">Loading skill...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!skill) {
    return <div className="text-center p-4 text-gray-700">Skill not found.</div>;
  }

  return (
    <div className="p-4 flex justify-center">
      <Card className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">{skill.name}</h1>
        <p className="text-gray-700 mb-4">{skill.description}</p>
        <div className="mt-6 flex space-x-2">
          {/* Add Edit/Delete buttons here if authorized */}
          <Link to="/dashboard/skills">
            <Button variant="secondary">Back to Skills</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SkillDetailPage;
