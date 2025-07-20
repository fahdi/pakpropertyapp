import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFileAlt, 
  FaShieldAlt, 
  FaUserShield, 
  FaGavel, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaBuilding,
  FaHome,
  FaLock,
  FaEye,
  FaHandshake
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const TermsPage = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white">
        <div className="container-responsive py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <FaFileAlt className="text-3xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Last updated: {currentDate}
            </p>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              Please read these terms carefully before using PakProperty. By using our platform, you agree to these terms.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Terms Content */}
      <div className="py-16">
        <div className="container-responsive">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-700 mb-6">
                  By accessing and using PakProperty ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  2. Description of Service
                </h2>
                <p className="text-gray-700 mb-6">
                  PakProperty is a property rental platform that connects tenants with property owners and real estate agents. Our services include:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Property listings and search functionality</li>
                  <li>User registration and profile management</li>
                  <li>Communication tools between tenants and owners</li>
                  <li>Property management tools for owners and agents</li>
                  <li>Inquiry and viewing coordination</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  3. User Accounts and Registration
                </h2>
                <p className="text-gray-700 mb-4">
                  To access certain features of the Platform, you must register for an account. You agree to:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  4. User Responsibilities
                </h2>
                <p className="text-gray-700 mb-4">
                  As a user of PakProperty, you agree to:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Use the Platform only for lawful purposes</li>
                  <li>Provide accurate and truthful information</li>
                  <li>Respect the rights of other users</li>
                  <li>Not engage in fraudulent or deceptive practices</li>
                  <li>Not interfere with the Platform's functionality</li>
                  <li>Not attempt to gain unauthorized access to the Platform</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  5. Property Listings and Content
                </h2>
                <p className="text-gray-700 mb-4">
                  Property owners and agents are responsible for:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Providing accurate and up-to-date property information</li>
                  <li>Ensuring they have the right to list the property</li>
                  <li>Maintaining current contact information</li>
                  <li>Responding to inquiries in a timely manner</li>
                  <li>Updating property status (available, rented, etc.)</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  6. Privacy and Data Protection
                </h2>
                <p className="text-gray-700 mb-6">
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  7. Intellectual Property Rights
                </h2>
                <p className="text-gray-700 mb-6">
                  The Platform and its original content, features, and functionality are owned by PakProperty and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  8. Disclaimers and Limitations
                </h2>
                <p className="text-gray-700 mb-4">
                  PakProperty provides the Platform "as is" and makes no warranties regarding:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>The accuracy of property information</li>
                  <li>The availability of the Platform</li>
                  <li>The conduct of other users</li>
                  <li>The outcome of rental transactions</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  9. Limitation of Liability
                </h2>
                <p className="text-gray-700 mb-6">
                  PakProperty shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  10. Indemnification
                </h2>
                <p className="text-gray-700 mb-6">
                  You agree to defend, indemnify, and hold harmless PakProperty and its affiliates from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Platform.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  11. Termination
                </h2>
                <p className="text-gray-700 mb-6">
                  We may terminate or suspend your account and bar access to the Platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  12. Governing Law
                </h2>
                <p className="text-gray-700 mb-6">
                  These Terms shall be interpreted and governed by the laws of Pakistan, without regard to its conflict of law provisions.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  13. Changes to Terms
                </h2>
                <p className="text-gray-700 mb-6">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  14. Contact Information
                </h2>
                <p className="text-gray-700 mb-6">
                  If you have any questions about these Terms, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="text-blue-600" />
                      <span className="text-gray-700">legal@pakproperty.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaPhone className="text-blue-600" />
                      <span className="text-gray-700">+92 300 123 4567</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaMapMarkerAlt className="text-blue-600" />
                      <span className="text-gray-700">Karachi, Pakistan</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaCalendarAlt className="text-blue-600" />
                      <span className="text-gray-700">Last updated: {currentDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Related Legal Pages */}
      <div className="py-12 bg-gray-100">
        <div className="container-responsive">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Related Legal Documents
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Link
              to="/privacy"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <FaUserShield className="text-blue-600 text-2xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Privacy Policy</h4>
              <p className="text-sm text-gray-600">How we protect your data</p>
            </Link>
            
            <Link
              to="/cookies"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <FaEye className="text-blue-600 text-2xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Cookie Policy</h4>
              <p className="text-sm text-gray-600">How we use cookies</p>
            </Link>
            
            <Link
              to="/data-protection"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <FaLock className="text-blue-600 text-2xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Data Protection</h4>
              <p className="text-sm text-gray-600">Your data rights</p>
            </Link>
            
            <Link
              to="/contact"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <FaHandshake className="text-blue-600 text-2xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Contact Us</h4>
              <p className="text-sm text-gray-600">Get in touch</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 