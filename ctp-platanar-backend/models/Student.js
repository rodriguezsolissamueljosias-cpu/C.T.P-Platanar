const mongoose = require('mongoose');
const applyToJSON = require('../utils/toJSON');

const StudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, trim: true },
  firstName: { type: String, required: true },
  lastName: { type: String, default: '' },
  grade: { type: String, required: true },
  section: { type: String, required: true },
  parentEmail: { type: String, default: '' },
  parentPhone: { type: String, default: '' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
}, { timestamps: true });

StudentSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

applyToJSON(StudentSchema);

module.exports = mongoose.model('Student', StudentSchema);
