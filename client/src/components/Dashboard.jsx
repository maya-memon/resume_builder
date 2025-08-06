import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storageService } from '../services/storageService';
import { FaSignOutAlt, FaUser, FaFileAlt, FaDownload, FaPlus, FaEdit, FaTrash, FaCopy, FaSpinner, FaCalendarAlt } from 'react-icons/fa';


export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'resumes', 'cover_letters'

  useEffect(() => {
    if (currentUser) {
      loadDocuments();
    }
  }, [currentUser]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const result = await storageService.getUserDocuments(currentUser.uid);
      if (result.success) {
        setDocuments(result.documents);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const result = await storageService.deleteDocument(documentId, currentUser.uid);
      if (result.success) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document');
    }
  };

  const handleDuplicateDocument = async (documentId) => {
    try {
      const result = await storageService.duplicateDocument(documentId, currentUser.uid);
      if (result.success) {
        loadDocuments(); // Reload to show the duplicated document
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error duplicating document:', error);
      alert('Failed to duplicate document');
    }
  };

  const handleEditDocument = (document) => {
    if (document.type === 'resume') {
      navigate(`/resume-builder/${document.id}`);
    } else {
      // Navigate to cover letter builder when implemented
      navigate(`/cover-letter-builder/${document.id}`);
    }
  };

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  const filteredDocuments = documents.filter(doc => {
    if (activeTab === 'all') return true;
    if (activeTab === 'resumes') return doc.type === 'resume';
    if (activeTab === 'cover_letters') return doc.type === 'cover_letter';
    return true;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-50 backdrop-blur-md bg-white/10 border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-8 w-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <FaFileAlt className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ResumeBuilder
              </span>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-400" />
                <span className="text-sm text-gray-300">
                  {currentUser?.displayName || currentUser?.email}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 backdrop-blur-sm"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
            Welcome back, {currentUser?.displayName?.split(' ')[0] || 'User'}!
          </h2>
          <p className="text-gray-300">
            Create professional resumes and cover letters with AI assistance.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/resume-builder')}
            className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl shadow-2xl hover:bg-white/20 transition-all duration-300 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FaFileAlt className="text-white text-xl" />
              </div>
              <FaPlus className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Create New Resume</h3>
            <p className="text-gray-300 text-sm">
              Build a professional resume with AI-powered content suggestions
            </p>
          </motion.button>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/cover-letter-builder')}
            className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl shadow-2xl hover:bg-white/20 transition-all duration-300 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FaFileAlt className="text-white text-xl" />
              </div>
              <FaPlus className="text-gray-400 group-hover:text-green-400 transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Create Cover Letter</h3>
            <p className="text-gray-300 text-sm">
              Write compelling cover letters tailored to specific job applications
            </p>
          </motion.button>

          <motion.div
            variants={itemVariants}
            className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <FaDownload className="text-white text-xl" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Export Options</h3>
            <p className="text-gray-300 text-sm">
              Download as PDF, Word, or share with a unique link
            </p>
          </motion.div>
        </motion.div>

        {/* Documents Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl"
        >
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Your Documents</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadDocuments}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                Refresh
              </motion.button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white/10 rounded-xl p-1 backdrop-blur-sm">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                All Documents ({documents.length})
              </button>
              <button
                onClick={() => setActiveTab('resumes')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'resumes'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Resumes ({documents.filter(d => d.type === 'resume').length})
              </button>
              <button
                onClick={() => setActiveTab('cover_letters')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'cover_letters'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Cover Letters ({documents.filter(d => d.type === 'cover_letter').length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <FaSpinner className="animate-spin text-2xl text-purple-400 mr-3" />
                <span className="text-gray-300">Loading documents...</span>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <FaFileAlt className="text-4xl text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-white mb-2">No documents found</h4>
                <p className="text-gray-300 mb-6">
                  {activeTab === 'all' 
                    ? "You haven't created any documents yet. Start by creating a new resume or cover letter."
                    : `You haven't created any ${activeTab.replace('_', ' ')} yet.`
                  }
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/resume-builder')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <FaPlus className="mr-2" />
                  Create New Resume
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((document, index) => (
                  <motion.div
                    key={document.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          document.type === 'resume' 
                            ? 'bg-gradient-to-r from-blue-400 to-blue-600' 
                            : 'bg-gradient-to-r from-green-400 to-green-600'
                        }`}>
                          <FaFileAlt className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white truncate">
                            {document.title}
                          </h4>
                          <p className="text-sm text-gray-300 capitalize">
                            {document.type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-gray-400 mb-4">
                      <FaCalendarAlt className="mr-1" />
                      Updated {formatDate(document.updatedAt)}
                    </div>

                    <div className="flex items-center justify-between">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditDocument(document)}
                        className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                      >
                        <FaEdit className="inline mr-1" />
                        Edit
                      </motion.button>
                      
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDuplicateDocument(document.id)}
                          className="text-gray-400 hover:text-white p-1 transition-colors"
                          title="Duplicate"
                        >
                          <FaCopy />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteDocument(document.id)}
                          className="text-red-400 hover:text-red-300 p-1 transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
