require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const qrcode = require('qrcode');

const connectDB = require('./config/db');
const User = require('./models/User');
const Business = require('./models/Business');
const Review = require('./models/Review');

const { calculateHygieneScore, getBadge } = require('./utils/hygieneCalculator');

const seed = async () => {
  await connectDB();
  console.log('🌱 Starting database seed...');

  // Clear existing
  await Promise.all([User.deleteMany(), Business.deleteMany(), Review.deleteMany()]);
  console.log('🧹 Cleared existing data');

  // Create users
  const users = await User.create([
    { name: 'Admin User', email: 'admin@demo.com', password: 'demo123', role: 'admin', phone: '+91 9999900000' },
    { name: 'Ravi Kumar (Owner)', email: 'owner@demo.com', password: 'demo123', role: 'owner', phone: '+91 9876543210' },
    { name: 'Priya Sharma', email: 'customer@demo.com', password: 'demo123', role: 'customer', phone: '+91 9876543211' },
    { name: 'Amit Singh', email: 'amit@demo.com', password: 'demo123', role: 'owner', phone: '+91 9876543212' },
  ]);
  console.log('👥 Created demo users');

  const owner1 = users.find(u => u.email === 'owner@demo.com');
  const owner2 = users.find(u => u.email === 'amit@demo.com');
  const customer = users.find(u => u.email === 'customer@demo.com');

  // Create businesses
  const businessData = [
    {
      name: 'The Green Kitchen',
      description: 'Premium healthy restaurant with farm-to-table organic food',
      category: 'restaurant', foodType: 'veg', priceRange: 'moderate',
      ownerId: owner1._id,
      address: { street: '12, Civil Lines', city: 'Prayagraj', state: 'Uttar Pradesh', pincode: '211001' },
      location: { type: 'Point', coordinates: [81.8463, 25.4358] },
      scores: { cleanliness: 95, foodStorage: 90, staffHygiene: 88, customerReport: 100, inspection: 85 },
      isVerified: true, lastInspectionDate: new Date(),
    },
    {
      name: 'Mama\'s Dhaba',
      description: 'Authentic North Indian food since 1985',
      category: 'street_food', foodType: 'both', priceRange: 'budget',
      ownerId: owner2._id,
      address: { street: 'Johnsonganj Market', city: 'Prayagraj', state: 'Uttar Pradesh', pincode: '211003' },
      location: { type: 'Point', coordinates: [81.8534, 25.4521] },
      scores: { cleanliness: 72, foodStorage: 68, staffHygiene: 80, customerReport: 90, inspection: 75 },
      isVerified: true, lastInspectionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'IIT Canteen',
      description: 'Student-friendly canteen serving affordable meals',
      category: 'canteen', foodType: 'both', priceRange: 'budget',
      ownerId: owner1._id,
      address: { street: 'Teliarganj', city: 'Prayagraj', state: 'Uttar Pradesh', pincode: '211004' },
      location: { type: 'Point', coordinates: [81.7842, 25.4726] },
      scores: { cleanliness: 60, foodStorage: 55, staffHygiene: 65, customerReport: 75, inspection: 50 },
      isVerified: false,
    },
    {
      name: 'Cloud Spice Kitchen',
      description: 'Premium cloud kitchen delivering gourmet meals',
      category: 'cloud_kitchen', foodType: 'non_veg', priceRange: 'expensive',
      ownerId: owner2._id,
      address: { street: 'George Town', city: 'Prayagraj', state: 'Uttar Pradesh', pincode: '211002' },
      location: { type: 'Point', coordinates: [81.8639, 25.4292] },
      scores: { cleanliness: 88, foodStorage: 85, staffHygiene: 90, customerReport: 95, inspection: 80 },
      isVerified: true, lastInspectionDate: new Date(),
    },
    {
      name: 'Chai & Bytes Cafe',
      description: 'Cozy cafe with snacks, tea, and fast WiFi',
      category: 'cafe', foodType: 'veg', priceRange: 'budget',
      ownerId: owner1._id,
      address: { street: 'Allahabad University Road', city: 'Prayagraj', state: 'Uttar Pradesh', pincode: '211002' },
      location: { type: 'Point', coordinates: [81.8352, 25.4418] },
      scores: { cleanliness: 82, foodStorage: 78, staffHygiene: 85, customerReport: 88, inspection: 70 },
      isVerified: true, lastInspectionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ];

  const businesses = [];
  for (const bData of businessData) {
    const score = calculateHygieneScore({
      cleanlinessScore: bData.scores.cleanliness,
      foodStorageScore: bData.scores.foodStorage,
      staffHygieneScore: bData.scores.staffHygiene,
      customerReportScore: bData.scores.customerReport,
      inspectionScore: bData.scores.inspection,
    });
    const badge = getBadge(score);
    const b = await Business.create({ ...bData, hygieneScore: score, badge });

    // Generate QR code
    const qrUrl = `http://localhost:5173/qr/${b._id}`;
    b.qrCode = await qrcode.toDataURL(qrUrl);
    await b.save();
    businesses.push(b);
  }
  console.log('🏪 Created demo businesses');

  // Create reviews
  for (const b of businesses.slice(0, 3)) {
    await Review.create({
      userId: customer._id,
      businessId: b._id,
      rating: Math.floor(3 + Math.random() * 2),
      comment: 'Great food and clean environment! Would recommend.',
      hygieneRating: 4,
      foodRating: 4,
    });
    await Business.findByIdAndUpdate(b._id, { averageRating: (3 + Math.random() * 2).toFixed(1), totalReviews: 1 });
  }
  console.log('⭐ Created demo reviews');

  console.log('\n✅ Seed complete!\n');
  console.log('Demo Accounts:');
  console.log('  👤 Customer: customer@demo.com / demo123');
  console.log('  🏪 Owner:    owner@demo.com / demo123');
  console.log('  ⚙️  Admin:    admin@demo.com / demo123');
  process.exit(0);
};

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
