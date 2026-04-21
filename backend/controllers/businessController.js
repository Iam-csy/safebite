const Business = require('../models/Business');
const HygieneReport = require('../models/HygieneReport');
const Review = require('../models/Review');
const { calculateHygieneScore, getBadge } = require('../utils/hygieneCalculator');
const qrcode = require('qrcode');

// @desc    Get all businesses (with filters)
// @route   GET /api/businesses
// @access  Public
const getBusinesses = async (req, res, next) => {
  try {
    const {
      city = 'Prayagraj',
      category,
      foodType,
      minScore,
      search,
      sort = '-hygieneScore',
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (category) query.category = category;
    if (foodType) query.foodType = foodType;
    if (minScore) query.hygieneScore = { $gte: Number(minScore) };
    if (search) query.name = new RegExp(search, 'i');

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Business.countDocuments(query);
    const businesses = await Business.find(query)
      .populate('ownerId', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      businesses,
    });
  } catch (error) {
    next(error);
  }
};


const getBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('ownerId', 'name email');

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    const reviews = await Review.find({ businessId: req.params.id })
      .populate('userId', 'name avatar')
      .sort('-createdAt')
      .limit(10);

    const recentReports = await HygieneReport.find({ businessId: req.params.id })
      .sort('-createdAt')
      .limit(3);

    res.json({ success: true, business, reviews, recentReports });
  } catch (error) {
    next(error);
  }
};


const createBusiness = async (req, res, next) => {
  try {
    const existing = await Business.findOne({ ownerId: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have a registered business' });
    }

    const businessData = { ...req.body, ownerId: req.user._id };
    const business = await Business.create(businessData);

    // Generate QR Code
    const qrUrl = `${process.env.CLIENT_URL}/qr/${business._id}`;
    const qrDataUrl = await qrcode.toDataURL(qrUrl);
    business.qrCode = qrDataUrl;
    await business.save();

    res.status(201).json({ success: true, message: 'Business registered successfully', business });
  } catch (error) {
    next(error);
  }
};

const updateBusiness = async (req, res, next) => {
  try {
    const business = await Business.findOne({ _id: req.params.id, ownerId: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found or unauthorized' });
    }

    const updated = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, business: updated });
  } catch (error) {
    next(error);
  }
};

const getMyBusiness = async (req, res, next) => {
  try {
    const business = await Business.findOne({ ownerId: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'No business registered yet' });
    }

    const reports = await HygieneReport.find({ businessId: business._id })
      .sort('-createdAt').limit(5);

    res.json({ success: true, business, reports });
  } catch (error) {
    next(error);
  }
};


const updateChecklist = async (req, res, next) => {
  try {
    const business = await Business.findOne({ _id: req.params.id, ownerId: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    business.checklistStatus = { ...business.checklistStatus.toObject?.() || {}, ...req.body };
    business.checklistLastUpdated = new Date();

    // Auto-update staff hygiene score based on checklist
    const checklistItems = Object.values(business.checklistStatus);
    const completedCount = checklistItems.filter(Boolean).length;
    const staffScore = Math.round((completedCount / checklistItems.length) * 100);
    business.scores.staffHygiene = staffScore;

    // Recalculate total score
    const newScore = calculateHygieneScore({
      cleanlinessScore: business.scores.cleanliness,
      foodStorageScore: business.scores.foodStorage,
      staffHygieneScore: staffScore,
      customerReportScore: business.scores.customerReport,
      inspectionScore: business.scores.inspection,
    });
    business.hygieneScore = newScore;
    business.badge = getBadge(newScore);

    await business.save();
    res.json({ success: true, message: 'Checklist updated', business });
  } catch (error) {
    next(error);
  }
};


const getLeaderboard = async (req, res, next) => {
  try {
    const businesses = await Business.find({ isActive: true, isVerified: true })
      .sort('-hygieneScore')
      .limit(10)
      .select('name hygieneScore badge category address averageRating logo');

    res.json({ success: true, businesses });
  } catch (error) {
    next(error);
  }
};

const getTemperatureData = async (req, res, next) => {
  try {
    const zones = [
      { zone: 'Main Refrigerator', safe_range: [2, 8], unit: '°C' },
      { zone: 'Freezer Unit', safe_range: [-20, -15], unit: '°C' },
      { zone: 'Vegetable Cold Room', safe_range: [5, 10], unit: '°C' },
      { zone: 'Meat Storage', safe_range: [1, 4], unit: '°C' },
    ];

    const readings = zones.map(z => {
      const [min, max] = z.safe_range;
      const deviation = (Math.random() - 0.3) * 8;
      const current = parseFloat((min + (max - min) / 2 + deviation).toFixed(1));
      return {
        zone: z.zone,
        current,
        safeMin: min,
        safeMax: max,
        unit: z.unit,
        safe: current >= min && current <= max,
        timestamp: new Date(),
      };
    });

    res.json({ success: true, readings });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  getMyBusiness,
  updateChecklist,
  getLeaderboard,
  getTemperatureData,
};
