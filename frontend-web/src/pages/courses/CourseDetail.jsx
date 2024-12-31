import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getCourseDetail, enrollCourse } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CourseDetail = () => {
    const { courseSerial } = useParams();
    const location = useLocation();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [error, setError] = useState('');
    
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const response = await getCourseDetail(courseSerial);
        setCourse(response.data.data);
      } catch (err) {
        setError('Failed to fetch course details');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseSerial]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      // Save current location before redirecting to login
      navigate('/login', { 
        state: { 
          from: location.pathname,
          enrollIntent: true // Flag to indicate user was trying to enroll
        } 
      });
      return;
    }

    try {
      setEnrolling(true);
      await enrollCourse(courseSerial);
      // Refresh course details to update enrollment status
      const response = await getCourseDetail(courseSerial);
      setCourse(response.data.data);
    } catch (err) {
      setError('Failed to enroll in course');
      console.error('Error enrolling:', err);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-700">Course not found</h2>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Course Header */}
      <div className="relative">
        <img 
          src={course.imageURL} 
          alt={course.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
            {course.rating && (
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1">
                  {course.rating.average} ({course.rating.total} reviews)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Instructor Info */}
        {course.instructor && (
          <div className="flex items-center mb-6 p-4 bg-gray-50 rounded">
            <img 
              src={course.instructor.profilePicture} 
              alt={course.instructor.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="ml-4">
              <h3 className="font-semibold">{course.instructor.name}</h3>
              <p className="text-gray-600">{course.instructor.jobTitle}</p>
              <p className="text-sm text-gray-500 mt-1">
                {course.instructor.description}
              </p>
            </div>
          </div>
        )}

        {/* Course Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">About This Course</h2>
          <p className="text-gray-600">{course.description}</p>
        </div>

        {/* Course Highlights */}
        {course.topicHighlight && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Course Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Duration:</span>{' '}
                  {Math.round(course.topicHighlight.totalDuration / 3600)} hours
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Videos:</span>{' '}
                  {course.topicHighlight.totalVideo}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Quizzes:</span>{' '}
                  {course.topicHighlight.totalQuiz}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Certificate:</span>{' '}
                  {course.topicHighlight.isHaveCertificate ? 'Yes' : 'No'}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Documents:</span>{' '}
                  {course.topicHighlight.totalDocument}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enrollment Status or Action */}
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Price</p>
              <p className="text-2xl font-bold text-primary-600">
                Rp {course.price.price.toLocaleString()}
              </p>
            </div>
            
            {course.enrollment ? (
              <div className="px-6 py-3 bg-green-100 text-green-800 rounded-lg">
                Status: {course.enrollment.status}
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;