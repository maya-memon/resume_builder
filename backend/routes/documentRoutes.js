// routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
console.log('📦 documentRoutes loaded');


// Create or Save Document
router.post('/', async (req, res) => {
  try {
    const { userId, title, type, content, documentId } = req.body;

    let document;
    if (documentId) {
      // Update existing
      document = await Document.findByIdAndUpdate(
        documentId,
        { title, type, content, updatedAt: new Date() },
        { new: true }
      );
    } else {
      // New document
      document = new Document({ userId, title, type, content });
      await document.save();
    }

    res.json({ success: true, document });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ success: false, message: 'Failed to save document' });
  }
});
router.get('/ping', (req, res) => {
  res.send('pong!');
});


// Get All User Documents
// Get All Documents for User
router.get('/user/:userId', async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.params.userId }).sort({ updatedAt: -1 });
    res.json({ success: true, documents });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load documents' });
  }
});


// Delete
router.delete('/:documentId/:userId', async (req, res) => {
  try {
    const { documentId, userId } = req.params;
    await Document.deleteOne({ _id: documentId, userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete document' });
  }
});

// Duplicate
router.post('/duplicate', async (req, res) => {
  try {
    const { documentId, userId } = req.body;
    const original = await Document.findById(documentId);

    if (!original) return res.status(404).json({ success: false, message: 'Original not found' });

    const duplicate = new Document({
      userId,
      title: original.title + ' (Copy)',
      type: original.type,
      content: original.content
    });

    await duplicate.save();

    res.json({ success: true, document: duplicate });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to duplicate' });
  }
});

module.exports = router;
