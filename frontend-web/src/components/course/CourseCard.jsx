import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const {
    serial,
    name,
    description,
    imageURL,
    price,
    rating,
    enrollment
  } = course;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="aspect-video">
        <img 
          src={imageURL || '/placeholder-course.jpg'} 
          alt={name}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {name}
        </h3>
        
        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}
        
        {/* Rating */}
        {rating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-sm text-gray-600">
                {rating.average} ({rating.total})
              </span>
            </div>
          </div>
        )}

        {/* Enrollment Status or Price */}
        <div className="mt-auto">
          {enrollment ? (
            <div className="flex justify-between items-center">
              <span className={`text-sm px-2 py-1 rounded ${
                enrollment.status === 'completed' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {enrollment.status}
              </span>
              <Link
                to={`/courses/${serial}`}
                className="text-primary-600 hover:text-primary-700"
              >
                View Course
              </Link>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              {price && (
                <span className="font-bold text-primary-600">
                  Rp {price.price?.toLocaleString() || 'Free'}
                </span>
              )}
              <Link
                to={`/courses/${serial}`}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;