const User = require('../models/User');
const Business = require('../models/Business');
const Complaint = require('../models/Complaint');
const HygieneReport = require('../models/HygieneReport');
const { calculateHygieneScore, getBadge } = require('../utils/hygieneCalculator');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalBusinesses, totalComplaints, pendingComplaints, verifiedBusinesses, riskyBusinesses] = await Promise.all([
      User.countDocuments(),
      Business.countDocuments(),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'pending' }),
      Business.countDocuments({ isVerified: true }),
      Business.countDocuments({ hygieneScore: { $lt: 50 }, isActive: true }),
    ]);

    const recentComplaints = await Complaint.find()
      .populate('userId', 'name')
      .populate('businessId', 'name')
      .sort('-createdAt')
      .limit(5);

    const recentBusinesses = await Business.find()
      .populate('ownerId', 'name email')
      .sort('-createdAt')
      .limit(5);

    res.json({
      success: true,
      stats: { totalUsers, totalBusinesses, totalComplaints, pendingComplaints, verifiedBusinesses, riskyBusinesses },
      recentComplaints,
      recentBusinesses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all businesses for admin
// @route   GET /api/admin/businesses
// @access  Private (admin)
const getAllBusinesses = async (req, res, next) => {
  try {
    const { verified, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (verified !== undefined) query.isVerified = verified === 'true';
    if (search) query.name = new RegExp(search, 'i');

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Business.countDocuments(query);
    const businesses = await Business.find(query)
      .populate('ownerId', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, businesses });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify/unverify business + set inspection score
// @route   PUT /api/admin/businesses/:id/verify
// @access  Private (admin)
const verifyBusiness = async (req, res, next) => {
  try {
    const { isVerified, inspectionScore, note } = req.body;
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    business.isVerified = isVerified;
    if (inspectionScore !== undefined) {
      business.scores.inspection = inspectionScore;
      business.lastInspectionDate = new Date();
    }

    // Recalculate score
    const newScore = calculateHygieneScore({
      cleanlinessScore: business.scores.cleanliness,
      foodStorageScore: business.scores.foodStorage,
      staffHygieneScore: business.scores.staffHygiene,
      customerReportScore: business.scores.customerReport,
      inspectionScore: business.scores.inspection,
    });
    business.hygieneScore = newScore;
    business.badge = getBadge(newScore);

    await business.save();
    res.json({ success: true, message: `Business ${isVerified ? 'verified' : 'unverified'}`, business });
  } catch (error) {
    next(error);
  }
};

// @desc    Get risky businesses
// @route   GET /api/admin/risky
// @access  Private (admin)
const getRiskyBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.find({ hygieneScore: { $lt: 50 }, isActive: true })
      .populate('ownerId', 'name email')
      .sort('hygieneScore');

    res.json({ success: true, businesses });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
// @access  Private (admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getAllBusinesses, verifyBusiness, getRiskyBusinesses, getAllUsers, toggleUserStatus };
