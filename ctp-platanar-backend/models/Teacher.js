const mongoose = require('mongoose');
const applyToJSON = require('../utils/toJSON');

const TeacherSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  password: { type: String, required: true },
  subject: { type: String, default: '' },
  role: { type: String, enum: ['teacher', 'admin'], default: 'teacher' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

applyToJSON(TeacherSchema);

module.exports = mongoose.model('Teacher', TeacherSchema);
