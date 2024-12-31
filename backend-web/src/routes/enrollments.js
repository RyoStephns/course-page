const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

// Protected routes for students and admins
router.get('/', 
  authMiddleware, 
  checkRole(['student', 'admin']), 
  enrollmentController.getUserEnrollments
);

// Routes for updating enrollment status
router.patch('/:enrollmentId/status', 
  authMiddleware,
  checkRole(['student']),
  enrollmentController.updateEnrollmentStatus
);

// Admin only routes
router.get('/stats', 
  authMiddleware,
  checkRole(['admin']),
  enrollmentController.getEnrollmentStats
);

module.exports = router;