const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware'); // must set user on req

router.use(authMiddleware); // All routes below require login

router.post('/save', resumeController.saveResume);
router.get('/my-resumes', resumeController.getUserResumes);

module.exports = router;
