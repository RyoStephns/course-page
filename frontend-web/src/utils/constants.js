export const API_URL = process.env.REACT_APP_API_URL;

export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student'
};

export const ENROLLMENT_STATUS = {
  ONGOING: 'ongoing',
  COMPLETED: 'completed'
};

export const ERROR_MESSAGES = {
  AUTH_ERROR: 'Authentication failed',
  NETWORK_ERROR: 'Network error',
  API_ERROR: 'API error',
  ENROLLMENT_ERROR: 'Enrollment failed'
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  COURSE_DETAIL: '/courses/:courseSerial'
};