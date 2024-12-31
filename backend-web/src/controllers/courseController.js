const skillAcademy = require('../config/skillacademy');
const Enrollment = require('../models/Enrollment');

const courseController = {
  async getCourses(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;

      const coursesResponse = await skillAcademy.getCourses(page, pageSize);

      // If user is logged in, check enrollments
      if (req.user) {
        const enrollments = await Enrollment.getUserEnrollments(req.user.id);
        const enrolledCourseSerials = new Set(enrollments.map(e => e.course_serial));

        // Add enrollment status to each course
        coursesResponse.data.courses = coursesResponse.data.courses.map(course => ({
          ...course,
          isEnrolled: enrolledCourseSerials.has(course.serial)
        }));
      }

      res.json(coursesResponse);
    } catch (error) {
      console.error('Get courses error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching courses'
      });
    }
  },

  async getCourseDetails(req, res) {
    try {
      const { courseSerial } = req.params;
      const courseDetails = await skillAcademy.getCourseDetails(courseSerial);

      // If user is logged in, check enrollment status
      if (req.user) {
        const enrollment = await Enrollment.findByUserIdAndCourseSerial(
          req.user.id,
          courseSerial
        );

        courseDetails.data.enrollment = enrollment || null;
      }

      res.json(courseDetails);
    } catch (error) {
      console.error('Get course details error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching course details'
      });
    }
  },

  async enrollCourse(req, res) {
    try {
      const { courseSerial } = req.body;
      const userId = req.user.id;

      // Check if already enrolled
      const existingEnrollment = await Enrollment.findByUserIdAndCourseSerial(
        userId,
        courseSerial
      );

      if (existingEnrollment) {
        return res.status(400).json({
          status: 'error',
          message: 'Already enrolled in this course'
        });
      }

      // Create order in SkillAcademy
      await skillAcademy.createOrder(req.user.email, courseSerial);

      // Create local enrollment record
      const enrollmentId = await Enrollment.create({
        userId,
        courseSerial
      });

      res.status(201).json({
        status: 'success',
        data: {
          enrollmentId,
          message: 'Successfully enrolled in course'
        }
      });
    } catch (error) {
      console.error('Course enrollment error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error enrolling in course'
      });
    }
  }
};

module.exports = courseController;