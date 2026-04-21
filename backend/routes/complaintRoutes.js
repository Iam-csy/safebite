const express = require('express');
const router = express.Router();
const { submitComplaint, getMyComplaints, getAllComplaints, updateComplaintStatus } = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, authorize('customer'), upload.single('image'), submitComplaint);
router.get('/my', protect, getMyComplaints);
router.get('/admin', protect, authorize('admin'), getAllComplaints);
router.put('/:id/status', protect, authorize('admin'), updateComplaintStatus);

module.exports = router;
