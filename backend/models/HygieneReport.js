const mongoose = require('mongoose');

const hygieneReportSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: { type: String, default: '' },
  hygieneScore: { type: Number, required: true },
  detectedIssues: [{
    id: String,
    label: String,
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
  }],
  suggestions: [{ type: String }],
  componentScores: {
    cleanliness: Number,
    foodStorage: Number,
    staffHygiene: Number,
  },
  analyzedAt: { type: Date, default: Date.now },
  approvedByAdmin: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('HygieneReport', hygieneReportSchema);
