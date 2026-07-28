const mongoose = require('mongoose');
const applyToJSON = require('../utils/toJSON');

const AttendanceSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Presente', 'Tarde', 'Ausente', 'Escapando', 'Justificado'],
    required: true
  },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
}, { timestamps: true });

applyToJSON(AttendanceSchema);

module.exports = mongoose.model('Attendance', AttendanceSchema);
