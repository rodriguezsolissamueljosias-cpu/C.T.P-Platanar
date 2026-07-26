const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Presente', 'Tarde', 'Ausente', 'Justificado'], required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
