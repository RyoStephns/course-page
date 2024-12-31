const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

// Public routes
router.get('/', courseController.getCourses);
router.get('/:courseSerial', courseController.getCourseDetails);

// Protected routes
router.post('/enroll', 
  authMiddleware, 
  checkRole(['student']), 
  courseController.enrollCourse
);

module.exports = router;