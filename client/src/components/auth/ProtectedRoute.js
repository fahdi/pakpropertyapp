import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaLock, FaUserShield } from 'react-icons/fa';

const ProtectedRoute = ({ children, allowedRoles = [], requireVerification = false }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Check if email verification is required
  if (requireVerification && user && !user.isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
              <FaUserShield className="text-white text-xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Email Verification Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please verify your email address to access this page.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                We've sent a verification email to <strong>{user.email}</strong>. 
                Please check your inbox and click the verification link.
              </p>
            </div>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Resend Verification Email
              </button>
              <button className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors">
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
              <FaLock className="text-white text-xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                This page requires one of the following roles: <strong>{allowedRoles.join(', ')}</strong>
              </p>
              <p className="text-sm text-red-800 mt-2">
                Your current role: <strong>{user.role}</strong>
              </p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => window.history.back()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Go Back
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If all checks pass, render the children
  return children;
};

export default ProtectedRoute; 