const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 500 },
  hygieneRating: { type: Number, min: 1, max: 5 },
  foodRating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });


reviewSchema.index({ userId: 1, businessId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
