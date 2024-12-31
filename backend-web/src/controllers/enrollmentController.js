const Enrollment = require('../models/Enrollment');
const skillAcademy = require('../config/skillacademy');

const enrollmentController = {
  async getUserEnrollments(req, res) {
    try {
      const enrollments = await Enrollment.getUserEnrollments(req.user.id);

      // Get course details for each enrollment
      const enrollmentsWithDetails = await Promise.all(
        enrollments.map(async (enrollment) => {
          const courseDetails = await skillAcademy.getCourseDetails(enrollment.course_serial);
          return {
            ...enrollment,
            courseDetails: courseDetails.data
          };
        })
      );

      res.json({
        status: 'success',
        data: {
          enrollments: enrollmentsWithDetails
        }
      });
    } catch (error) {
      console.error('Get user enrollments error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching enrollments'
      });
    }
  },

  async updateEnrollmentStatus(req, res) {
    try {
      const { enrollmentId } = req.params;
      const { status } = req.body;

      if (!['ongoing', 'completed'].includes(status)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid status value'
        });
      }

      await Enrollment.updateStatus(enrollmentId, status);

      res.json({
        status: 'success',
        message: 'Enrollment status updated successfully'
      });
    } catch (error) {
      console.error('Update enrollment status error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error updating enrollment status'
      });
    }
  },

  async getEnrollmentStats(req, res) {
    try {
      const stats = await Enrollment.getEnrollmentStats();
      res.json({
        status: 'success',
        data: {
          stats
        }
      });
    } catch (error) {
      console.error('Get enrollment stats error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching enrollment statistics'
      });
    }
  }
};

module.exports = enrollmentController;