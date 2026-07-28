const mongoose = require('mongoose');
const applyToJSON = require('../utils/toJSON');

const ParentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  children: [{
    name: { type: String, required: true },
    studentId: { type: String, required: true }
  }]
}, { timestamps: true });

applyToJSON(ParentSchema);

module.exports = mongoose.model('Parent', ParentSchema);
