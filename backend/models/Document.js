const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  content: { type: Object, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
