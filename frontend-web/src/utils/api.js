import axios from 'axios';
import { LOCAL_STORAGE_KEYS } from './constants';

// Base API
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for API calls
api.interceptors.request.use(config => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for API calls
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (email, password) => 
  api.post('/auth/login', { email, password });

export const signup = (email, password) =>
  api.post('/auth/register', { email, password });

// User Profile
export const getProfile = () =>
  api.get('/auth/profile');

// Course APIs
export const getCourses = (page = 1, pageSize = 9) => 
  api.get('/courses', {
    params: { page, pageSize }
  });

export const getCourseDetail = (courseSerial) => 
  api.get(`/courses/${courseSerial}`);

export const enrollCourse = (courseSerial) => 
  api.post('/courses/enroll', { courseSerial });

// Dashboard APIs (Admin Only)
export const getDashboardStats = () => 
  api.get('/dashboard/stats');

// Enrollment APIs
export const getEnrollments = () => 
  api.get('/enrollments');

// Check if token is valid
export const validateToken = () =>
  api.get('/auth/validate');

export default api;