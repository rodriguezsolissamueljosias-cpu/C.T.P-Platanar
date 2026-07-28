const mongoose = require('mongoose');
const applyToJSON = require('../utils/toJSON');

const SectionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true });

applyToJSON(SectionSchema);

module.exports = mongoose.model('Section', SectionSchema);
