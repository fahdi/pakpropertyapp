import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaLock, 
  FaShieldAlt, 
  FaUserShield, 
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
  FaServer,
  FaKey,
  FaEye,
  FaDownload
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const DataProtectionPage = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="container-responsive py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <FaLock className="text-3xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Data Protection
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Last updated: {currentDate}
            </p>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              Your data rights and how we protect your personal information in accordance with data protection laws.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Data Protection Content */}
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
                  Your Data Rights
                </h2>
                <p className="text-gray-700 mb-6">
                  Under data protection laws, you have several rights regarding your personal information. We are committed to upholding these rights and making it easy for you to exercise them.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FaEye className="text-blue-600 mr-2" />
                      Right to Access
                    </h3>
                    <p className="text-gray-700 mb-3">
                      You have the right to request a copy of the personal information we hold about you.
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>What data we have about you</li>
                      <li>How we use your data</li>
                      <li>Who we share it with</li>
                      <li>How long we keep it</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FaCheckCircle className="text-green-600 mr-2" />
                      Right to Rectification
                    </h3>
                    <p className="text-gray-700 mb-3">
                      You can request that we correct any inaccurate or incomplete personal information.
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Update your contact details</li>
                      <li>Correct property information</li>
                      <li>Fix profile information</li>
                      <li>Update preferences</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FaTimes className="text-red-600 mr-2" />
                      Right to Erasure
                    </h3>
                    <p className="text-gray-700 mb-3">
                      You can request that we delete your personal information in certain circumstances.
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Close your account</li>
                      <li>Remove property listings</li>
                      <li>Delete saved properties</li>
                      <li>Remove contact information</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FaDownload className="text-purple-600 mr-2" />
                      Right to Portability
                    </h3>
                    <p className="text-gray-700 mb-3">
                      You can request a copy of your data in a structured, machine-readable format.
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Export your data</li>
                      <li>Transfer to another service</li>
                      <li>Backup your information</li>
                      <li>Data in common formats</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  How to Exercise Your Rights
                </h2>
                <p className="text-gray-700 mb-4">
                  You can exercise your data rights by:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li><strong>Email:</strong> privacy@pakproperty.com</li>
                  <li><strong>Phone:</strong> +92 300 123 4567</li>
                  <li><strong>Dashboard:</strong> Use your account settings to manage your data</li>
                  <li><strong>Contact Form:</strong> Use our contact form for data requests</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Data Security Measures
                </h2>
                <p className="text-gray-700 mb-4">
                  We implement comprehensive security measures to protect your data:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                  <li><strong>Access Controls:</strong> Strict access controls and authentication</li>
                  <li><strong>Regular Audits:</strong> Security audits and vulnerability assessments</li>
                  <li><strong>Staff Training:</strong> Regular data protection training for staff</li>
                  <li><strong>Incident Response:</strong> Procedures for data breach response</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Data Retention
                </h2>
                <p className="text-gray-700 mb-6">
                  We retain your personal information only for as long as necessary to provide our services and comply with legal obligations. Different types of data have different retention periods:
                </p>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Retention Periods</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Account Data</h4>
                      <p className="text-sm text-gray-700">Retained while account is active, deleted 30 days after deactivation</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Property Listings</h4>
                      <p className="text-sm text-gray-700">Retained while active, archived after 2 years of inactivity</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Inquiries</h4>
                      <p className="text-sm text-gray-700">Retained for 3 years for customer service purposes</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Analytics Data</h4>
                      <p className="text-sm text-gray-700">Anonymized after 2 years, deleted after 5 years</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  International Data Transfers
                </h2>
                <p className="text-gray-700 mb-6">
                  Your data may be transferred to and processed in countries other than Pakistan. We ensure appropriate safeguards are in place for such transfers, including:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Standard contractual clauses</li>
                  <li>Adequacy decisions</li>
                  <li>Certification schemes</li>
                  <li>Binding corporate rules</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Automated Decision Making
                </h2>
                <p className="text-gray-700 mb-6">
                  We may use automated systems to process your data for purposes such as property recommendations and fraud detection. You have the right to request human review of automated decisions that significantly affect you.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Complaints
                </h2>
                <p className="text-gray-700 mb-6">
                  If you believe we have not handled your data protection rights properly, you have the right to lodge a complaint with the relevant data protection authority in Pakistan.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>
                <p className="text-gray-700 mb-6">
                  For any questions about your data rights or to exercise them, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="text-purple-600" />
                      <span className="text-gray-700">privacy@pakproperty.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaPhone className="text-purple-600" />
                      <span className="text-gray-700">+92 300 123 4567</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaMapMarkerAlt className="text-purple-600" />
                      <span className="text-gray-700">Karachi, Pakistan</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaCalendarAlt className="text-purple-600" />
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

export default DataProtectionPage; 