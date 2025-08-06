import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe, FaCalendar } from 'react-icons/fa';

const ModernTemplate = ({ data, sections }) => (
  <div className="bg-white p-8 min-h-[800px] text-sm">
    {/* Header */}
    {sections.includes('personalInfo') && (
      <div className="border-b-2 border-blue-600 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1">
              <FaEnvelope className="text-blue-600" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <FaPhone className="text-blue-600" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.address && (
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-blue-600" />
              <span>{data.personalInfo.address}</span>
            </div>
          )}
        </div>
        {(data.personalInfo.linkedin || data.personalInfo.website) && (
          <div className="flex flex-wrap gap-4 text-gray-600 mt-2">
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-1">
                <FaLinkedin className="text-blue-600" />
                <span>{data.personalInfo.linkedin}</span>
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center gap-1">
                <FaGlobe className="text-blue-600" />
                <span>{data.personalInfo.website}</span>
              </div>
            )}
          </div>
        )}
        {data.personalInfo.summary && (
          <p className="mt-4 text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        )}
      </div>
    )}

    {/* Work Experience */}
    {sections.includes('workExperience') && data.workExperience.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-600 mb-4">Work Experience</h2>
        <div className="space-y-4">
          {data.workExperience.map((job, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{job.position}</h3>
                  <p className="text-gray-700">{job.company}</p>
                </div>
                <div className="text-right text-gray-600">
                  <p>{job.startDate} - {job.endDate || 'Present'}</p>
                  {job.location && <p>{job.location}</p>}
                </div>
              </div>
              {job.description && (
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Education */}
    {sections.includes('education') && data.education.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-600 mb-4">Education</h2>
        <div className="space-y-3">
          {data.education.map((edu, index) => (
            <div key={index} className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-700">{edu.school}</p>
                {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
              </div>
              <div className="text-right text-gray-600">
                <p>{edu.startDate} - {edu.endDate || 'Present'}</p>
                {edu.location && <p>{edu.location}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Skills */}
    {sections.includes('skills') && (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-600 mb-4">Skills</h2>
        <div className="space-y-3">
          {data.skills.technical.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.technical.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {data.skills.soft.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Soft Skills</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.soft.map((skill, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {data.skills.languages.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.languages.map((lang, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Projects */}
    {sections.includes('projects') && data.projects.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-600 mb-4">Projects</h2>
        <div className="space-y-4">
          {data.projects.map((project, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                {project.date && <span className="text-gray-600">{project.date}</span>}
              </div>
              {project.description && (
                <p className="text-gray-700 leading-relaxed mb-2">{project.description}</p>
              )}
              {project.technologies && (
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Certifications */}
    {sections.includes('certifications') && data.certifications.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-600 mb-4">Certifications</h2>
        <div className="space-y-3">
          {data.certifications.map((cert, index) => (
            <div key={index} className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                <p className="text-gray-700">{cert.issuer}</p>
              </div>
              <div className="text-right text-gray-600">
                {cert.date && <p>{cert.date}</p>}
                {cert.expiryDate && <p>Expires: {cert.expiryDate}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Hobbies */}
    {sections.includes('hobbies') && data.hobbies.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-600 mb-4">Hobbies & Interests</h2>
        <div className="flex flex-wrap gap-2">
          {data.hobbies.map((hobby, index) => (
            <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
              {hobby}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

const ClassicTemplate = ({ data, sections }) => (
  <div className="bg-white p-8 min-h-[800px] text-sm font-serif">
    {/* Header */}
    {sections.includes('personalInfo') && (
      <div className="text-center border-b border-gray-300 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <div className="text-gray-600 space-y-1">
          {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
          {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
          {data.personalInfo.address && <p>{data.personalInfo.address}</p>}
        </div>
        {data.personalInfo.summary && (
          <p className="mt-4 text-gray-700 leading-relaxed italic">{data.personalInfo.summary}</p>
        )}
      </div>
    )}

    {/* Work Experience */}
    {sections.includes('workExperience') && data.workExperience.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
          Professional Experience
        </h2>
        <div className="space-y-4">
          {data.workExperience.map((job, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">{job.position}</h3>
                  <p className="italic text-gray-700">{job.company}</p>
                </div>
                <div className="text-right text-gray-600">
                  <p>{job.startDate} - {job.endDate || 'Present'}</p>
                  {job.location && <p>{job.location}</p>}
                </div>
              </div>
              {job.description && (
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Education */}
    {sections.includes('education') && data.education.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
          Education
        </h2>
        <div className="space-y-3">
          {data.education.map((edu, index) => (
            <div key={index} className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="italic text-gray-700">{edu.school}</p>
                {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
              </div>
              <div className="text-right text-gray-600">
                <p>{edu.startDate} - {edu.endDate || 'Present'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Skills */}
    {sections.includes('skills') && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
          Skills
        </h2>
        <div className="space-y-2">
          {data.skills.technical.length > 0 && (
            <p><span className="font-semibold">Technical:</span> {data.skills.technical.join(', ')}</p>
          )}
          {data.skills.soft.length > 0 && (
            <p><span className="font-semibold">Soft Skills:</span> {data.skills.soft.join(', ')}</p>
          )}
          {data.skills.languages.length > 0 && (
            <p><span className="font-semibold">Languages:</span> {data.skills.languages.join(', ')}</p>
          )}
        </div>
      </div>
    )}

    {/* Other sections follow similar pattern... */}
  </div>
);

const templates = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  creative: ModernTemplate, // For now, use modern as fallback
  minimal: ClassicTemplate, // For now, use classic as fallback
  corporate: ClassicTemplate // For now, use classic as fallback
};

export default function ResumePreview({ template, data, sections }) {
  const TemplateComponent = templates[template] || ModernTemplate;
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg" style={{ transform: 'scale(0.8)', transformOrigin: 'top left' }}>
      <TemplateComponent data={data} sections={sections} />
    </div>
  );
}
