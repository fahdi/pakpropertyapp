import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaSearch, 
  FaMapMarkerAlt, 
  FaArrowLeft,
  FaExclamationTriangle
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 404 Icon */}
          <div className="mx-auto h-32 w-32 bg-red-100 rounded-full flex items-center justify-center mb-8">
            <FaExclamationTriangle className="text-red-600 text-6xl" />
          </div>

          {/* Error Message */}
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Sorry, the page you're looking for doesn't exist. It might have been moved, 
            deleted, or you entered the wrong URL.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <Link
              to="/"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              <FaHome className="mr-2" />
              Go to Homepage
            </Link>
            
            <Link
              to="/properties"
              className="w-full bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 transition-colors font-medium flex items-center justify-center"
            >
              <FaSearch className="mr-2" />
              Browse Properties
            </Link>
          </div>

          {/* Popular Links */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Popular Pages
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <Link
                to="/properties"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaSearch className="text-blue-600" />
                <span className="text-gray-700">Search Properties</span>
              </Link>
              
              <Link
                to="/about"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaHome className="text-blue-600" />
                <span className="text-gray-700">About Us</span>
              </Link>
              
              <Link
                to="/contact"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaMapMarkerAlt className="text-blue-600" />
                <span className="text-gray-700">Contact Us</span>
              </Link>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mx-auto"
            >
              <FaArrowLeft />
              <span>Go Back</span>
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-sm text-gray-500">
            <p>If you believe this is an error, please contact our support team.</p>
            <Link to="/contact" className="text-blue-600 hover:text-blue-700">
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage; 