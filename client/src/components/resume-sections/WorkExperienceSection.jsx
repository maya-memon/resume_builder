import React from 'react';
import { FaPlus, FaTrash, FaBriefcase, FaBuilding, FaMapMarkerAlt, FaCalendar, FaMagic } from 'react-icons/fa';

export default function WorkExperienceSection({ data, onChange }) {
  const experiences = data || [];

  const addExperience = () => {
    const newExperience = {
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onChange([...experiences, newExperience]);
  };

  const updateExperience = (index, field, value) => {
    const updated = experiences.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    onChange(updated);
  };

  const removeExperience = (index) => {
    const updated = experiences.filter((_, i) => i !== index);
    onChange(updated);
  };

  const generateDescription = async (index) => {
    const experience = experiences[index];
    if (!experience.position || !experience.company) {
      alert('Please fill in position and company first');
      return;
    }
    
    // TODO: Integrate with Gemini AI
    const aiDescription = `• Led cross-functional teams to deliver high-impact projects
• Implemented innovative solutions that improved efficiency by 25%
• Collaborated with stakeholders to define requirements and deliverables
• Mentored junior team members and facilitated knowledge sharing`;
    
    updateExperience(index, 'description', aiDescription);
  };

  return (
    <div className="space-y-6">
      {experiences.map((experience, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
            <button
              onClick={() => removeExperience(index)}
              className="text-red-600 hover:text-red-700 p-1"
            >
              <FaTrash />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaBriefcase className="inline mr-2" />
                  Position *
                </label>
                <input
                  type="text"
                  value={experience.position}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="Software Engineer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaBuilding className="inline mr-2" />
                  Company *
                </label>
                <input
                  type="text"
                  value={experience.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="Tech Corp"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2" />
                Location
              </label>
              <input
                type="text"
                value={experience.location}
                onChange={(e) => updateExperience(index, 'location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="San Francisco, CA"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendar className="inline mr-2" />
                  Start Date
                </label>
                <input
                  type="month"
                  value={experience.startDate}
                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendar className="inline mr-2" />
                  End Date
                </label>
                <div className="space-y-2">
                  <input
                    type="month"
                    value={experience.endDate}
                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                    disabled={experience.current}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-black"
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={experience.current}
                      onChange={(e) => {
                        updateExperience(index, 'current', e.target.checked);
                        if (e.target.checked) {
                          updateExperience(index, 'endDate', '');
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Currently working here</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Job Description
                </label>
                <button
                  onClick={() => generateDescription(index)}
                  className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <FaMagic className="text-xs" />
                  <span>AI Generate</span>
                </button>
              </div>
              <textarea
                value={experience.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Describe your key responsibilities and achievements..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
      >
        <FaPlus />
        <span>Add Work Experience</span>
      </button>
    </div>
  );
}
