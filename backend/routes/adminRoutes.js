const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getAllBusinesses, verifyBusiness,
  getRiskyBusinesses, getAllUsers, toggleUserStatus,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/businesses', getAllBusinesses);
router.put('/businesses/:id/verify', verifyBusiness);
router.get('/risky', getRiskyBusinesses);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);

module.exports = router;
