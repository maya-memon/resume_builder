import React, { useState } from 'react';
import { FaPlus, FaTimes, FaCode, FaUsers, FaGlobe, FaMagic } from 'react-icons/fa';

export default function SkillsSection({ data, onChange }) {
  const skills = data || { technical: [], soft: [], languages: [] };
  const [newSkill, setNewSkill] = useState({ technical: '', soft: '', languages: '' });

  const addSkill = (category) => {
    const skill = newSkill[category].trim();
    if (skill && !skills[category].includes(skill)) {
      const updated = {
        ...skills,
        [category]: [...skills[category], skill]
      };
      onChange(updated);
      setNewSkill({ ...newSkill, [category]: '' });
    }
  };

  const removeSkill = (category, index) => {
    const updated = {
      ...skills,
      [category]: skills[category].filter((_, i) => i !== index)
    };
    onChange(updated);
  };

  const generateSkills = async (category) => {
    // TODO: Integrate with Gemini AI
    const aiSkills = {
      technical: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
      soft: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 'Time Management'],
      languages: ['English (Native)', 'Spanish (Intermediate)', 'French (Basic)']
    };
    
    const suggested = aiSkills[category] || [];
    const newSkills = suggested.filter(skill => !skills[category].includes(skill));
    
    if (newSkills.length > 0) {
      const updated = {
        ...skills,
        [category]: [...skills[category], ...newSkills.slice(0, 3)] // Add up to 3 suggestions
      };
      onChange(updated);
    }
  };

  const handleKeyPress = (e, category) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(category);
    }
  };

  const SkillCategory = ({ category, icon, title, placeholder }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-900 flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h4>
        <button
          onClick={() => generateSkills(category)}
          className="flex items-center space-x-1 px-2 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FaMagic className="text-xs" />
          <span>AI Suggest</span>
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {skills[category].map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {skill}
            <button
              onClick={() => removeSkill(category, index)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaTimes className="text-xs" />
            </button>
          </span>
        ))}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill[category]}
          onChange={(e) => setNewSkill({ ...newSkill, [category]: e.target.value })}
          onKeyPress={(e) => handleKeyPress(e, category)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
        />
        <button
          onClick={() => addSkill(category)}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SkillCategory
        category="technical"
        icon={<FaCode className="text-blue-600" />}
        title="Technical Skills"
        placeholder="e.g., JavaScript, Python, React..."
      />
      
      <SkillCategory
        category="soft"
        icon={<FaUsers className="text-green-600" />}
        title="Soft Skills"
        placeholder="e.g., Leadership, Communication..."
      />
      
      <SkillCategory
        category="languages"
        icon={<FaGlobe className="text-purple-600" />}
        title="Languages"
        placeholder="e.g., English (Native), Spanish..."
      />
    </div>
  );
}
