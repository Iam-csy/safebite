const Complaint = require('../models/Complaint');
const Business = require('../models/Business');
const { calculateHygieneScore, getBadge } = require('../utils/hygieneCalculator');

// @desc    Submit complaint
// @route   POST /api/complaints
// @access  Private (customer)
const submitComplaint = async (req, res, next) => {
  try {
    const { businessId, type, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    const complaint = await Complaint.create({
      userId: req.user._id,
      businessId,
      type,
      description,
      imageUrl,
    });

    // Reduce customer report score
    business.scores.customerReport = Math.max(business.scores.customerReport - 5, 0);
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

    res.status(201).json({ success: true, message: 'Complaint submitted successfully', complaint });
  } catch (error) {
    next(error);
  }
};

const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id })
      .populate('businessId', 'name address')
      .sort('-createdAt');

    res.json({ success: true, complaints });
  } catch (error) {
    next(error);
  }
};
const getAllComplaints = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('userId', 'name email')
      .populate('businessId', 'name address')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, complaints });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status (admin)
// @route   PUT /api/complaints/:id/status
// @access  Private (admin)
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, adminNote, ...(status === 'resolved' && { resolvedAt: new Date() }) },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitComplaint, getMyComplaints, getAllComplaints, updateComplaintStatus };
