const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

// Admin only routes
router.get('/stats', 
  authMiddleware,
  checkRole(['admin']),
  dashboardController.getDashboardStats
);

module.exports = router;