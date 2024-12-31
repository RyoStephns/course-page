const db = require('../config/database');

class Enrollment {
  static async create({ userId, courseSerial }) {
    const [result] = await db.execute(
      'INSERT INTO enrollments (user_id, course_serial) VALUES (?, ?)',
      [userId, courseSerial]
    );
    return result.insertId;
  }

  static async findByUserIdAndCourseSerial(userId, courseSerial) {
    const [rows] = await db.execute(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_serial = ?',
      [userId, courseSerial]
    );
    return rows[0];
  }

  static async getUserEnrollments(userId) {
    const [rows] = await db.execute(
      'SELECT * FROM enrollments WHERE user_id = ? ORDER BY enrolled_at DESC',
      [userId]
    );
    return rows;
  }

  static async updateStatus(id, status) {
    await db.execute(
      'UPDATE enrollments SET status = ? WHERE id = ?',
      [status, id]
    );
  }

  static async getEnrollmentStats() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          IFNULL(COUNT(*), 0) as total_enrollments,
          IFNULL(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0) as completed_courses,
          IFNULL(SUM(CASE WHEN status = 'ongoing' THEN 1 ELSE 0 END), 0) as ongoing_courses
        FROM enrollments
      `);
      return {
        total_enrollments: parseInt(rows[0].total_enrollments),
        completed_courses: parseInt(rows[0].completed_courses),
        ongoing_courses: parseInt(rows[0].ongoing_courses)
      };
    } catch (error) {
      console.error('Error in getEnrollmentStats:', error);
      return {
        total_enrollments: 0,
        completed_courses: 0,
        ongoing_courses: 0
      };
    }
  }

  static async getRecentEnrollments(limit = 10) {
    try {
      const [rows] = await db.query(`
        SELECT 
          e.id,
          e.course_serial,
          e.status,
          e.enrolled_at,
          u.email 
        FROM enrollments e 
        JOIN users u ON e.user_id = u.id 
        ORDER BY e.enrolled_at DESC 
        LIMIT 5
      `);
      return rows;
    } catch (error) {
      console.error('Error in getRecentEnrollments:', error);
      return [];
    }
  }
}

module.exports = Enrollment;