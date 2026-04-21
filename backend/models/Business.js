const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: {
    type: String,
    enum: ['restaurant', 'street_food', 'canteen', 'cloud_kitchen', 'mess', 'cafe', 'other'],
    default: 'restaurant',
  },
  foodType: {
    type: String,
    enum: ['veg', 'non_veg', 'both'],
    default: 'both',
  },
  address: {
    street: String,
    city: { type: String, default: 'Prayagraj' },
    state: { type: String, default: 'Uttar Pradesh' },
    pincode: String,
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [82.8468, 25.4358] }, // Prayagraj default
  },
  phone: String,
  email: String,
  website: String,
  images: [{ type: String }],
  logo: { type: String, default: '' },
  priceRange: {
    type: String,
    enum: ['budget', 'moderate', 'expensive'],
    default: 'moderate',
  },
  openingHours: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '22:00' },
    days: [{ type: String }],
  },
  hygieneScore: { type: Number, default: 0, min: 0, max: 100 },
  badge: {
    label: { type: String, default: 'Pending' },
    color: { type: String, default: '#6B7280' },
    emoji: { type: String, default: '⏳' },
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  qrCode: { type: String, default: '' },
  lastInspectionDate: { type: Date },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },

  // Hygiene component scores
  scores: {
    cleanliness: { type: Number, default: 0 },
    foodStorage: { type: Number, default: 0 },
    staffHygiene: { type: Number, default: 0 },
    customerReport: { type: Number, default: 100 },
    inspection: { type: Number, default: 0 },
  },

  // Temperature monitoring (mock IoT data)
  temperatureAlerts: [{
    zone: String,
    current: Number,
    safe: Boolean,
    timestamp: { type: Date, default: Date.now },
  }],

  checklistLastUpdated: { type: Date },
  checklistStatus: {
    floorCleaned: { type: Boolean, default: false },
    fridgeTempOk: { type: Boolean, default: false },
    staffGlovesWorn: { type: Boolean, default: false },
    foodCovered: { type: Boolean, default: false },
    wasteDisposed: { type: Boolean, default: false },
    handwashAvailable: { type: Boolean, default: false },
  },
}, { timestamps: true });

businessSchema.index({ location: '2dsphere' });
businessSchema.index({ hygieneScore: -1 });
businessSchema.index({ 'address.city': 1 });

module.exports = mongoose.model('Business', businessSchema);
