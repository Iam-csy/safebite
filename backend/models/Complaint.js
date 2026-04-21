const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  type: {
    type: String,
    enum: ['dirty_food', 'hair_insect', 'food_poisoning', 'bad_smell', 'other'],
    required: true,
  },
  description: { type: String, required: true, trim: true },
  imageUrl: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'resolved', 'dismissed'],
    default: 'pending',
  },
  adminNote: { type: String, default: '' },
  resolvedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
