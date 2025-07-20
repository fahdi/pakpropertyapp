import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUserShield, 
  FaShieldAlt, 
  FaLock, 
  FaEye, 
  FaHandshake,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimes,
  FaInfoCircle,
  FaDatabase,
  FaMobile,
  FaDesktop,
  FaServer
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const PrivacyPage = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container-responsive py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <FaUserShield className="text-3xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Last updated: {currentDate}
            </p>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              We are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Privacy Content */}
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
                  1. Information We Collect
                </h2>
                <p className="text-gray-700 mb-4">
                  We collect information you provide directly to us, such as when you:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Create an account or profile</li>
                  <li>List a property</li>
                  <li>Contact property owners or agents</li>
                  <li>Submit inquiries or feedback</li>
                  <li>Use our services</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  2. Types of Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Name and contact details</li>
                      <li>Email address and phone number</li>
                      <li>Profile information</li>
                      <li>Property details (for owners/agents)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Information</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>IP address and device information</li>
                      <li>Browser type and version</li>
                      <li>Usage data and analytics</li>
                      <li>Cookies and tracking data</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  3. How We Use Your Information
                </h2>
                <p className="text-gray-700 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Provide and maintain our services</li>
                  <li>Process property listings and inquiries</li>
                  <li>Communicate with you about our services</li>
                  <li>Improve and personalize your experience</li>
                  <li>Ensure platform security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  4. Information Sharing
                </h2>
                <p className="text-gray-700 mb-4">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>With your consent</li>
                  <li>To facilitate property transactions</li>
                  <li>With service providers who assist our operations</li>
                  <li>To comply with legal requirements</li>
                  <li>To protect our rights and safety</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  5. Data Security
                </h2>
                <p className="text-gray-700 mb-6">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  6. Your Rights
                </h2>
                <p className="text-gray-700 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Data portability</li>
                  <li>Withdraw consent</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  7. Cookies and Tracking
                </h2>
                <p className="text-gray-700 mb-6">
                  We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  8. Third-Party Services
                </h2>
                <p className="text-gray-700 mb-6">
                  Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  9. Data Retention
                </h2>
                <p className="text-gray-700 mb-6">
                  We retain your personal information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your data at any time.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  10. Children's Privacy
                </h2>
                <p className="text-gray-700 mb-6">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  11. International Transfers
                </h2>
                <p className="text-gray-700 mb-6">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  12. Changes to This Policy
                </h2>
                <p className="text-gray-700 mb-6">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  13. Contact Us
                </h2>
                <p className="text-gray-700 mb-6">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="text-blue-600" />
                      <span className="text-gray-700">privacy@pakproperty.com</span>
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
              to="/terms"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <FaHandshake className="text-blue-600 text-2xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Terms of Service</h4>
              <p className="text-sm text-gray-600">Platform terms and conditions</p>
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
              <FaInfoCircle className="text-blue-600 text-2xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Contact Us</h4>
              <p className="text-sm text-gray-600">Get in touch</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage; 