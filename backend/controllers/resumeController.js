const Resume = require('../models/Resume');

// Save or update resume
exports.saveResume = async (req, res) => {
  try {
    const { resumeId, resumeData, template, sections } = req.body;
    const userId = req.user._id; // from auth middleware

    let resume;
    if (resumeId) {
      resume = await Resume.findOneAndUpdate(
        { _id: resumeId, userId },
        { resumeData, template, sections },
        { new: true }
      );
    } else {
      resume = await Resume.create({ userId, resumeData, template, sections });
    }

    res.json({ success: true, resumeId: resume._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error saving resume' });
  }
};

// Fetch all resumes for a user
exports.getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching resumes' });
  }
};
