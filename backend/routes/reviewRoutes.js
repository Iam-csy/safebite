const express = require('express');
const router = express.Router();
const { addReview, getReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), addReview);
router.get('/:businessId', getReviews);

module.exports = router;
