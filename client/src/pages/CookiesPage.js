import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaEye, 
  FaCookieBite, 
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
  FaCog
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const CookiesPage = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container-responsive py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <FaCookieBite className="text-3xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cookie Policy
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Last updated: {currentDate}
            </p>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              Learn how we use cookies and similar technologies to enhance your experience on PakProperty.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Cookie Content */}
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
                  What Are Cookies?
                </h2>
                <p className="text-gray-700 mb-6">
                  Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our platform.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Types of Cookies We Use
                </h2>
                
                <div className="space-y-6 mb-8">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FaCheckCircle className="text-green-600 mr-2" />
                      Essential Cookies
                    </h3>
                    <p className="text-gray-700 mb-3">
                      These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas.
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Authentication and security</li>
                      <li>Session management</li>
                      <li>Basic functionality</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FaCog className="text-blue-600 mr-2" />
                      Functional Cookies
                    </h3>
                    <p className="text-gray-700 mb-3">
                      These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Language preferences</li>
                      <li>Search history</li>
                      <li>Saved properties</li>
                      <li>User preferences</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FaDatabase className="text-purple-600 mr-2" />
                      Analytics Cookies
                    </h3>
                    <p className="text-gray-700 mb-3">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Page views and navigation</li>
                      <li>User behavior analysis</li>
                      <li>Performance monitoring</li>
                      <li>Error tracking</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FaEye className="text-orange-600 mr-2" />
                      Marketing Cookies
                    </h3>
                    <p className="text-gray-700 mb-3">
                      These cookies are used to track visitors across websites to display relevant advertisements.
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Ad targeting</li>
                      <li>Social media integration</li>
                      <li>Retargeting campaigns</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  How to Manage Cookies
                </h2>
                <p className="text-gray-700 mb-4">
                  You can control and manage cookies in several ways:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li><strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies through their settings</li>
                  <li><strong>Cookie Consent:</strong> We provide cookie consent options when you first visit our site</li>
                  <li><strong>Third-Party Opt-out:</strong> You can opt out of third-party cookies through their respective websites</li>
                  <li><strong>Contact Us:</strong> Reach out to us for assistance with cookie management</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Third-Party Cookies
                </h2>
                <p className="text-gray-700 mb-6">
                  We may use third-party services that place cookies on your device. These services help us provide better functionality and analyze our website performance.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Updates to This Policy
                </h2>
                <p className="text-gray-700 mb-6">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>
                <p className="text-gray-700 mb-6">
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="text-green-600" />
                      <span className="text-gray-700">privacy@pakproperty.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaPhone className="text-green-600" />
                      <span className="text-gray-700">+92 300 123 4567</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaMapMarkerAlt className="text-green-600" />
                      <span className="text-gray-700">Karachi, Pakistan</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaCalendarAlt className="text-green-600" />
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
              to="/data-protection"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <FaShieldAlt className="text-blue-600 text-2xl mx-auto mb-3" />
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

export default CookiesPage; 