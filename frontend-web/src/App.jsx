import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './router/ProtectedRoute';

// Lazy loaded components
const Courses = React.lazy(() => import('./pages/courses/Courses'));
const CourseDetail = React.lazy(() => import('./pages/courses/CourseDetail'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const SignUp = React.lazy(() => import('./pages/auth/SignUp'));
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Suspense fallback={<LoadingSpinner size="large" />}>
                <Routes>
                  <Route path="/" element={<Courses />} />
                  <Route path="/courses/:courseSerial" element={<CourseDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute adminOnly>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;