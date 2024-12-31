const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ email, password, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async getTotalUsers() {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as total FROM users WHERE role = "student"'
    );
    return rows[0].total;
  }
}

module.exports = User;