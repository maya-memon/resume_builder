import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaDownload, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import ResumePreview from './ResumePreview';
import exportService from '../services/exportService';

export default function SharedResumeView() {
  const { shareId } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadSharedResume();
  }, [shareId]);

  const loadSharedResume = async () => {
    try {
      setLoading(true);
      const result = await exportService.getSharedResume(shareId);
      
      if (result.success) {
        setResumeData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!resumeData) return;
    
    try {
      setDownloading(true);
      const filename = `${resumeData.resumeData.personalInfo?.firstName || 'Resume'}_${resumeData.resumeData.personalInfo?.lastName || 'Document'}.pdf`;
      await exportService.exportToPDF(
        resumeData.resumeData,
        resumeData.template,
        resumeData.sections,
        filename
      );
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            This link may have expired or the resume may no longer be available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {resumeData?.resumeData?.personalInfo?.firstName && resumeData?.resumeData?.personalInfo?.lastName
                  ? `${resumeData.resumeData.personalInfo.firstName} ${resumeData.resumeData.personalInfo.lastName}'s Resume`
                  : 'Resume'
                }
              </h1>
              <p className="text-sm text-gray-500">Shared resume view</p>
            </div>
            
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {downloading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaDownload className="mr-2" />
              )}
              {downloading ? 'Downloading...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div id="resume-preview" className="p-8">
            <ResumePreview
              template={resumeData.template}
              data={resumeData.resumeData}
              sections={resumeData.sections}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Created with Resume Builder
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Shared on {new Date(resumeData.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
