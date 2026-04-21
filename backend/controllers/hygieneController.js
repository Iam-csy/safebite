const HygieneReport = require('../models/HygieneReport');
const Business = require('../models/Business');
const { simulateAIAnalysis, simulateFreshnessAnalysis, calculateHygieneScore, getBadge } = require('../utils/hygieneCalculator');
const path = require('path');

// @desc    AI Hygiene Scanner - Upload kitchen image
// @route   POST /api/hygiene/scan/:businessId
// @access  Private (owner/admin)
const scanKitchen = async (req, res, next) => {
  try {
    const { businessId } = req.params;

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Check ownership (owner) or admin
    if (req.user.role === 'owner' && business.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const analysis = simulateAIAnalysis(imageUrl);

    // Component scores from AI analysis
    const severityMap = { critical: 0, high: 20, medium: 50, low: 75 };
    const issueCount = analysis.detectedIssues.length;
    const cleanlinessScore = Math.max(100 - issueCount * 18, 20);
    const foodStorageScore = Math.max(100 - issueCount * 12, 30);
    const staffHygieneScore = Math.max(100 - issueCount * 10, 35);

    // Save report
    const report = await HygieneReport.create({
      businessId,
      uploadedBy: req.user._id,
      imageUrl,
      hygieneScore: analysis.hygieneScore,
      detectedIssues: analysis.detectedIssues,
      suggestions: analysis.suggestions,
      componentScores: { cleanliness: cleanlinessScore, foodStorage: foodStorageScore, staffHygiene: staffHygieneScore },
    });

    // Update business scores
    business.scores.cleanliness = cleanlinessScore;
    business.scores.foodStorage = foodStorageScore;
    business.scores.staffHygiene = staffHygieneScore;

    const newScore = calculateHygieneScore({
      cleanlinessScore,
      foodStorageScore,
      staffHygieneScore,
      customerReportScore: business.scores.customerReport,
      inspectionScore: business.scores.inspection,
    });

    business.hygieneScore = newScore;
    business.badge = getBadge(newScore);
    await business.save();

    res.json({
      success: true,
      message: 'Kitchen scan complete',
      analysis: { ...analysis, hygieneScore: newScore },
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Food Freshness Checker
// @route   POST /api/hygiene/freshness
// @access  Private
const checkFreshness = async (req, res, next) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const result = simulateFreshnessAnalysis();

    res.json({
      success: true,
      imageUrl,
      ...result,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get hygiene reports for a business
// @route   GET /api/hygiene/reports/:businessId
// @access  Private
const getReports = async (req, res, next) => {
  try {
    const reports = await HygieneReport.find({ businessId: req.params.businessId })
      .populate('uploadedBy', 'name role')
      .sort('-createdAt')
      .limit(20);

    res.json({ success: true, reports });
  } catch (error) {
    next(error);
  }
};

// @desc    Get score trend data (for chart)
// @route   GET /api/hygiene/trend/:businessId
// @access  Private (owner)
const getScoreTrend = async (req, res, next) => {
  try {
    const reports = await HygieneReport.find({ businessId: req.params.businessId })
      .sort('createdAt')
      .limit(30)
      .select('hygieneScore createdAt');

    // Generate mock trend if insufficient data
    if (reports.length < 3) {
      const mockTrend = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        score: 55 + Math.floor(Math.random() * 30),
      }));
      return res.json({ success: true, trend: mockTrend });
    }

    const trend = reports.map(r => ({
      date: new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      score: r.hygieneScore,
    }));

    res.json({ success: true, trend });
  } catch (error) {
    next(error);
  }
};

module.exports = { scanKitchen, checkFreshness, getReports, getScoreTrend };
