const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

const dashboardController = {
  async getDashboardStats(req, res) {
    try {
      console.log('Starting to fetch dashboard stats...');
      
      // Get total users
      console.log('Fetching total users...');
      const totalUsers = await User.getTotalUsers();
      console.log('Total users:', totalUsers);

      // Get enrollment statistics
      console.log('Fetching enrollment stats...');
      const enrollmentStats = await Enrollment.getEnrollmentStats();
      console.log('Enrollment stats:', enrollmentStats);

      // Get recent enrollments
      console.log('Fetching recent enrollments...');
      const recentEnrollments = await Enrollment.getRecentEnrollments(5);
      console.log('Recent enrollments:', recentEnrollments);

      // Calculate completion rate
      const completionRate = enrollmentStats.total_enrollments > 0
        ? (enrollmentStats.completed_courses / enrollmentStats.total_enrollments * 100).toFixed(2)
        : 0;

      res.json({
        status: 'success',
        data: {
          totalUsers,
          enrollmentStats: {
            ...enrollmentStats,
            completionRate: parseFloat(completionRate)
          },
          recentEnrollments
        }
      });
    } catch (error) {
      console.error('Get dashboard stats error details:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching dashboard statistics'
      });
    }
  }
};

module.exports = dashboardController;