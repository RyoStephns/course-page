-- Create database
CREATE DATABASE IF NOT EXISTS courses_db;
USE courses_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    course_serial VARCHAR(255) NOT NULL,
    status ENUM('ongoing', 'completed') DEFAULT 'ongoing',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_enrollment (user_id, course_serial)
);

-- Create initial admin user (password: admin123)
INSERT INTO users (email, password, role) VALUES 
('admin@example.com', '$2a$10$XbPRdqzBkX8IaPN8MJuDh.VO8D6QzI5KjbXUUwqJYGgNAUCxhTm.G', 'admin');