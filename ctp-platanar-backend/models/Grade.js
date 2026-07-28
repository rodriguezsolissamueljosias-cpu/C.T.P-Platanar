const mongoose = require('mongoose');
const applyToJSON = require('../utils/toJSON');

const GradeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true });

applyToJSON(GradeSchema);

module.exports = mongoose.model('Grade', GradeSchema);
