const express = require('express');
const router = express.Router();
const { scanKitchen, checkFreshness, getReports, getScoreTrend } = require('../controllers/hygieneController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/scan/:businessId', protect, authorize('owner', 'admin'), upload.single('image'), scanKitchen);
router.post('/freshness', protect, upload.single('image'), checkFreshness);
router.get('/reports/:businessId', protect, getReports);
router.get('/trend/:businessId', protect, getScoreTrend);

module.exports = router;
