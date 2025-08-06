import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FaArrowLeft, FaEye, FaDownload, FaSave, FaSpinner,
  FaFilePdf, FaFileWord, FaLink, FaTrash
} from 'react-icons/fa';
import ResumePreview from './ResumePreview';
import PersonalInfoSection from './resume-sections/PersonalInfoSection';
import WorkExperienceSection from './resume-sections/WorkExperienceSection';
import EducationSection from './resume-sections/EducationSection';
import SkillsSection from './resume-sections/SkillsSection';
import ProjectsSection from './resume-sections/ProjectsSection';
import CertificationsSection from './resume-sections/CertificationsSection';
import HobbiesSection from './resume-sections/HobbiesSection';
import exportService from '../services/exportService';
import { storageService } from '../services/storageService'; // adjust path if needed


const RESUME_TEMPLATES = [
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
  { id: 'classic', name: 'Classic', description: 'Traditional professional layout' },
  { id: 'creative', name: 'Creative', description: 'Bold design for creative fields' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' },
  { id: 'corporate', name: 'Corporate', description: 'Professional business style' }
];

const AVAILABLE_SECTIONS = [
  { id: 'personalInfo', name: 'Personal Information', required: true, component: PersonalInfoSection },
  { id: 'workExperience', name: 'Work Experience', required: false, component: WorkExperienceSection },
  { id: 'education', name: 'Education', required: false, component: EducationSection },
  { id: 'skills', name: 'Skills', required: false, component: SkillsSection },
  { id: 'projects', name: 'Projects', required: false, component: ProjectsSection },
  { id: 'certifications', name: 'Certifications', required: false, component: CertificationsSection },
  { id: 'hobbies', name: 'Hobbies', required: false, component: HobbiesSection }
];

export default function ResumeBuilderPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { resumeId } = useParams();

  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showPreview, setShowPreview] = useState(true);
  const [activeSections, setActiveSections] = useState(['personalInfo', 'workExperience', 'education', 'skills']);
  const [currentDocumentId, setCurrentDocumentId] = useState(resumeId || null);
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const [exportLoading, setExportLoading] = useState({ pdf: false, word: false, share: false });
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [resumeData, setResumeData] = useState({
    personalInfo: { firstName: '', lastName: '', email: currentUser?.email || '', phone: '', address: '', linkedin: '', website: '', summary: '' },
    workExperience: [], education: [], skills: { technical: [], soft: [], languages: [] },
    projects: [], certifications: [], hobbies: []
  });

  useEffect(() => {
    if (resumeId && currentUser) loadResume();
  }, [resumeId, currentUser]);

  useEffect(() => {
    if (currentDocumentId && currentUser) {
      const timer = setTimeout(() => handleAutoSave(), 2000);
      return () => clearTimeout(timer);
    }
  }, [resumeData, selectedTemplate, activeSections]);

  const loadResume = async () => {
    try {
      const result = await storageService.getDocument(resumeId, currentUser.uid);
      if (result.success) {
        const doc = result.document;
        setResumeData(doc.resumeData);
        setSelectedTemplate(doc.template);
        setActiveSections(doc.sections);
        setLastSaved(new Date(doc.updatedAt?.toDate?.() || doc.updatedAt));
      }
    } catch (error) {
      console.error('Load error:', error);
    }
  };

  const handleAutoSave = async () => {
    if (!currentDocumentId || !currentUser) return;
    try {
      setAutoSaving(true);
      await storageService.autoSave(currentUser.uid, currentDocumentId, {
        resumeData, template: selectedTemplate, sections: activeSections
      });
      setLastSaved(new Date());
    } catch (e) {
      console.error('Auto-save error:', e);
    } finally {
      setAutoSaving(false);
    }
  };

  const handleSaveResume = async () => {
    if (!currentUser) return;
    try {
      const result = await storageService.saveResume(currentUser.uid, resumeData, selectedTemplate, activeSections, currentDocumentId);
      if (result.success) {
        setCurrentDocumentId(result.documentId);
        setLastSaved(new Date());
        alert(result.message);
      } else alert(result.message);
    } catch (e) {
      console.error('Save error:', e);
      alert('Failed to save resume');
    }
  };

  const handleExportPDF = async () => {
    setExportLoading(p => ({ ...p, pdf: true }));
    try {
      const el = document.getElementById('resume-preview');
      const filename = `${resumeData.personalInfo.firstName || 'Resume'}_${resumeData.personalInfo.lastName || 'Document'}.pdf`;
      const result = await exportService.exportToPDF(el, filename);
      if (!result.success) alert(result.message);
    } catch (e) {
      console.error('PDF export error:', e);
      alert('Failed to export PDF');
    } finally {
      setExportLoading(p => ({ ...p, pdf: false }));
    }
  };

  const handleExportWord = async () => {
    setExportLoading(p => ({ ...p, word: true }));
    try {
      const filename = `${resumeData.personalInfo.firstName || 'Resume'}_${resumeData.personalInfo.lastName || 'Document'}.docx`;
      const result = await exportService.exportToWord(resumeData, selectedTemplate, activeSections, filename);
      if (!result.success) alert(result.message);
    } catch (e) {
      console.error('Word export error:', e);
      alert('Failed to export Word document');
    } finally {
      setExportLoading(p => ({ ...p, word: false }));
    }
  };

  const handleGenerateShareLink = async () => {
    if (!currentUser) return;
    setExportLoading(p => ({ ...p, share: true }));
    try {
      const result = await exportService.generateShareableLink(resumeData, selectedTemplate, activeSections, currentUser.uid);
      if (result.success) {
        setShareUrl(result.shareUrl);
        setShowShareModal(true);
      } else alert(result.message);
    } catch (e) {
      console.error('Share error:', e);
      alert('Failed to generate share link');
    } finally {
      setExportLoading(p => ({ ...p, share: false }));
    }
  };

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({ ...prev, [section]: data }));
  };

  const addSection = (sectionId) => {
    if (!activeSections.includes(sectionId)) {
      setActiveSections(prev => [...prev, sectionId]);
    }
  };

  const removeSection = (sectionId) => {
    const section = AVAILABLE_SECTIONS.find(s => s.id === sectionId);
    if (!section?.required) {
      setActiveSections(prev => prev.filter(id => id !== sectionId));
    }
  };

  const commonButtonStyle = "px-4 py-2 rounded-full text-white font-medium flex items-center gap-2 transition-colors duration-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-300 hover:text-white">
              <FaArrowLeft /> Dashboard
            </button>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleSaveResume} className={`bg-green-600 hover:bg-green-700 ${commonButtonStyle}`}>
                <FaSave /> Save
              </button>
              <button onClick={handleExportPDF} className={`bg-blue-600 hover:bg-blue-700 ${commonButtonStyle}`}>
                {exportLoading.pdf ? <FaSpinner className="animate-spin" /> : <FaFilePdf />} PDF
              </button>
              <button onClick={handleExportWord} className={`bg-sky-500 hover:bg-sky-600 ${commonButtonStyle}`}>
                {exportLoading.word ? <FaSpinner className="animate-spin" /> : <FaFileWord />} Word
              </button>
              <button onClick={handleGenerateShareLink} className={`bg-purple-500 hover:bg-purple-600 ${commonButtonStyle}`}>
                {exportLoading.share ? <FaSpinner className="animate-spin" /> : <FaLink />} Share
              </button>
              <button onClick={() => setShowPreview(!showPreview)} className={`bg-gray-700 hover:bg-gray-600 ${commonButtonStyle}`}>
                <FaEye /> {showPreview ? 'Hide' : 'Show'} Preview
              </button>
            </div>
          </div>

          <div className={`grid gap-8 ${showPreview ? 'lg:grid-cols-2' : ''}`}>
            <div className="space-y-6">
              <div className="bg-white/10 p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Choose Template</h2>
                <div className="grid grid-cols-2 gap-3">
                  {RESUME_TEMPLATES.map(template => (
                    <button key={template.id} onClick={() => setSelectedTemplate(template.id)} className={`p-3 rounded-xl ${selectedTemplate === template.id ? 'bg-purple-600 text-white' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                      <div className="font-semibold">{template.name}</div>
                      <p className="text-sm text-gray-300">{template.description}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white/10 p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Resume Sections</h2>
                <select onChange={(e) => addSection(e.target.value)} className="mb-4 px-3 py-2 rounded-md text-black">
                  <option value="">Add Section</option>
                  {AVAILABLE_SECTIONS.filter(s => !activeSections.includes(s.id)).map(section => (
                    <option key={section.id} value={section.id}>{section.name}</option>
                  ))}
                </select>
                <div className="space-y-4">
                  {activeSections.map(sectionId => {
                    const section = AVAILABLE_SECTIONS.find(s => s.id === sectionId);
                    const SectionComponent = section?.component;
                    if (!SectionComponent) return null;
                    return (
                      <div key={sectionId} className="bg-white/5 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold">{section.name}</h3>
                          {!section.required && (
                            <button onClick={() => removeSection(sectionId)} className="text-red-400 hover:text-red-600">
                              <FaTrash />
                            </button>
                          )}
                        </div>
                        <SectionComponent data={resumeData[sectionId]} onChange={data => updateResumeData(sectionId, data)} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {showPreview && (
              <div className="bg-white/5 p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Live Preview</h2>
                <div id="resume-preview">
                  <ResumePreview template={selectedTemplate} data={resumeData} sections={activeSections} />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
