const express = require('express');
const router = express.Router();
const {
  getBusinesses, getBusiness, createBusiness, updateBusiness,
  getMyBusiness, updateChecklist, getLeaderboard, getTemperatureData,
} = require('../controllers/businessController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getBusinesses);
router.get('/leaderboard', getLeaderboard);
router.get('/my/business', protect, authorize('owner'), getMyBusiness);
router.post('/', protect, authorize('owner'), createBusiness);
router.get('/:id', getBusiness);
router.put('/:id', protect, authorize('owner'), updateBusiness);
router.put('/:id/checklist', protect, authorize('owner'), updateChecklist);
router.get('/:id/temperature', protect, authorize('owner', 'admin'), getTemperatureData);

module.exports = router;
