const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  resumeData: {
    personalInfo: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      linkedin: String,
      website: String,
      summary: String
    },
    workExperience: Array,
    education: Array,
    skills: {
      technical: [String],
      soft: [String],
      languages: [String]
    },
    projects: Array,
    certifications: Array,
    hobbies: Array
  },

  template: { type: String, default: 'modern' },
  sections: [String],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ResumeSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Resume', ResumeSchema);
