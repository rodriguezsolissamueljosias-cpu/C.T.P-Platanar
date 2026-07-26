const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  teacherId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  subject: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', TeacherSchema);
