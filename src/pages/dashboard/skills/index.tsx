// src/pages/dashboard/skills/index.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import skillService from '../../../services/skillService';
import { Skill } from '../../../types/skill';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';

const SkillsListPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await skillService.getSkills();
        setSkills(data);
      } catch (err) {
        setError('Failed to fetch skills');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading skills...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Skills</h1>
        <Link to="/dashboard/skills/create">
          <Button variant="primary">Add New Skill</Button>
        </Link>
      </div>

      {skills.length === 0 ? (
        <p className="text-gray-700">You haven't added any skills yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <Card key={skill.id} className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">{skill.name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{skill.description}</p>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <Link to={`/dashboard/skills/${skill.id}`}>
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

export default SkillsListPage;
