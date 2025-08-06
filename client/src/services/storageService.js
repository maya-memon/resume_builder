const API_BASE = 'http://localhost:5000/api/documents';

export const storageService = {
 getUserDocuments: async (uid) => {
  const res = await fetch(`${API_BASE}/user/${uid}`);
  return res.json();
},


  saveDocument: async (data) => {
    const res = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteDocument: async (documentId, userId) => {
    const res = await fetch(`${API_BASE}/${documentId}/${userId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  duplicateDocument: async (documentId, userId) => {
    const res = await fetch(`${API_BASE}/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId, userId })
    });
    return res.json();
  },

  saveResume: async (userId, resumeData, template, sections, documentId = null) => {
    const payload = {
      userId,
      title: `${resumeData.personalInfo?.firstName || 'My'} Resume`,
      type: 'resume',
      content: { resumeData, template, sections }
    };
    if (documentId) payload.documentId = documentId;

    const res = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  autoSave: async (userId, documentId, contentData) => {
    const payload = {
      userId,
      title: `${contentData.resumeData?.personalInfo?.firstName || 'My'} Resume`,
      type: 'resume',
      content: contentData,
      documentId
    };
    const res = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
};
