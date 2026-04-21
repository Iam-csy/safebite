const Review = require('../models/Review');
const Business = require('../models/Business');


const addReview = async (req, res, next) => {
  try {
    const { businessId, rating, comment, hygieneRating, foodRating } = req.body;

    const existing = await Review.findOne({ userId: req.user._id, businessId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already reviewed this business' });
    }

    const review = await Review.create({
      userId: req.user._id,
      businessId,
      rating,
      comment,
      hygieneRating,
      foodRating,
    });

    // Update business average rating
    const reviews = await Review.find({ businessId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Business.findByIdAndUpdate(businessId, {
      averageRating: parseFloat(avgRating.toFixed(1)),
      totalReviews: reviews.length,
    });

    const populated = await review.populate('userId', 'name avatar');
    res.status(201).json({ success: true, review: populated });
  } catch (error) {
    next(error);
  }
};

const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ businessId: req.params.businessId })
      .populate('userId', 'name avatar')
      .sort('-createdAt')
      .limit(20);

    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = { addReview, getReviews };
