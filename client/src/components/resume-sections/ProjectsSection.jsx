import React, { useState } from 'react';
import { FaPlus, FaTrash, FaTimes, FaCode, FaCalendar, FaMagic } from 'react-icons/fa';

export default function ProjectsSection({ data, onChange }) {
  const projects = data || [];
  const [newTech, setNewTech] = useState({});

  const addProject = () => {
    const newProject = {
      name: '',
      description: '',
      technologies: [],
      date: '',
      url: '',
      github: ''
    };
    onChange([...projects, newProject]);
  };

  const updateProject = (index, field, value) => {
    const updated = projects.map((project, i) => 
      i === index ? { ...project, [field]: value } : project
    );
    onChange(updated);
  };

  const removeProject = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    onChange(updated);
  };

  const addTechnology = (projectIndex) => {
    const tech = newTech[projectIndex]?.trim();
    if (tech && !projects[projectIndex].technologies.includes(tech)) {
      const updated = projects.map((project, i) => 
        i === projectIndex 
          ? { ...project, technologies: [...project.technologies, tech] }
          : project
      );
      onChange(updated);
      setNewTech({ ...newTech, [projectIndex]: '' });
    }
  };

  const removeTechnology = (projectIndex, techIndex) => {
    const updated = projects.map((project, i) => 
      i === projectIndex 
        ? { ...project, technologies: project.technologies.filter((_, ti) => ti !== techIndex) }
        : project
    );
    onChange(updated);
  };

  const generateProjectDescription = async (index) => {
    const project = projects[index];
    if (!project.name) {
      alert('Please fill in project name first');
      return;
    }
    
    // TODO: Integrate with Gemini AI
    const aiDescription = `Developed a comprehensive ${project.name} application with modern web technologies. Key features include user authentication, real-time data processing, and responsive design. Implemented best practices for code organization, testing, and deployment. Successfully delivered the project on time with positive user feedback.`;
    
    updateProject(index, 'description', aiDescription);
  };

  const handleTechKeyPress = (e, projectIndex) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology(projectIndex);
    }
  };

  return (
    <div className="space-y-6">
      {projects.map((project, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">Project {index + 1}</h4>
            <button
              onClick={() => removeProject(index)}
              className="text-red-600 hover:text-red-700 p-1"
            >
              <FaTrash />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCode className="inline mr-2" />
                  Project Name *
                </label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="E-commerce Platform"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendar className="inline mr-2" />
                  Date
                </label>
                <input
                  type="month"
                  value={project.date}
                  onChange={(e) => updateProject(index, 'date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project URL
                </label>
                <input
                  type="url"
                  value={project.url}
                  onChange={(e) => updateProject(index, 'url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://myproject.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Repository
                </label>
                <input
                  type="url"
                  value={project.github}
                  onChange={(e) => updateProject(index, 'github', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Project Description
                </label>
                <button
                  onClick={() => generateProjectDescription(index)}
                  className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <FaMagic className="text-xs" />
                  <span>AI Generate</span>
                </button>
              </div>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the project, your role, and key achievements..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies Used
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    {tech}
                    <button
                      onClick={() => removeTechnology(index, techIndex)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTech[index] || ''}
                  onChange={(e) => setNewTech({ ...newTech, [index]: e.target.value })}
                  onKeyPress={(e) => handleTechKeyPress(e, index)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., React, Node.js, MongoDB..."
                />
                <button
                  onClick={() => addTechnology(index)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addProject}
        className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
      >
        <FaPlus />
        <span>Add Project</span>
      </button>
    </div>
  );
}
