import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaQuestionCircle, 
  FaUser, 
  FaBuilding, 
  FaShieldAlt, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronRight,
  FaBook,
  FaVideo,
  FaFileAlt,
  FaHeadset,
  FaRocket,
  FaStar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: FaRocket,
      items: [
        {
          question: 'How do I create an account?',
          answer: 'Click the "Register" button in the top navigation. Fill in your details including name, email, phone number, and create a password. Verify your email to activate your account.',
          tags: ['account', 'registration', 'signup']
        },
        {
          question: 'How do I search for properties?',
          answer: 'Use the search bar on the homepage or go to the Properties page. You can filter by location, price range, property type, number of bedrooms, and other criteria.',
          tags: ['search', 'properties', 'filter']
        },
        {
          question: 'How do I contact a property owner?',
          answer: 'On any property detail page, you can use the contact form or call/WhatsApp the owner directly using the provided contact information.',
          tags: ['contact', 'owner', 'communication']
        }
      ]
    },
    {
      id: 'for-tenants',
      title: 'For Tenants',
      icon: FaUser,
      items: [
        {
          question: 'How do I schedule a property viewing?',
          answer: 'Contact the property owner through the property detail page. You can request a viewing time that works for both parties. Some owners also offer virtual tours.',
          tags: ['viewing', 'schedule', 'appointment']
        },
        {
          question: 'What documents do I need to rent a property?',
          answer: 'Typically you\'ll need: CNIC copy, proof of income/employment, bank statements, and references. Requirements may vary by owner.',
          tags: ['documents', 'requirements', 'rental']
        },
        {
          question: 'How do I save properties I\'m interested in?',
          answer: 'Click the heart icon on any property card or detail page to save it. You can view all saved properties in your dashboard under "Saved Properties".',
          tags: ['save', 'favorites', 'bookmark']
        }
      ]
    },
    {
      id: 'for-owners',
      title: 'For Property Owners',
      icon: FaBuilding,
      items: [
        {
          question: 'How do I list my property?',
          answer: 'Log in to your account, go to your dashboard, and click "Add Property". Fill in all the details including photos, amenities, and contact information.',
          tags: ['list', 'add property', 'posting']
        },
        {
          question: 'How do I manage property inquiries?',
          answer: 'All inquiries appear in your dashboard under "Inquiries". You can respond directly, schedule viewings, or mark inquiries as resolved.',
          tags: ['inquiries', 'management', 'responses']
        },
        {
          question: 'How do I update my property status?',
          answer: 'In your dashboard under "My Properties", you can mark properties as rented, available, or under maintenance using the status toggle buttons.',
          tags: ['status', 'update', 'management']
        }
      ]
    },
    {
      id: 'account-security',
      title: 'Account & Security',
      icon: FaShieldAlt,
      items: [
        {
          question: 'How do I reset my password?',
          answer: 'On the login page, click "Forgot Password" and enter your email address. You\'ll receive a reset link via email.',
          tags: ['password', 'reset', 'security']
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Go to your dashboard and click on "Profile". You can update your personal information, contact details, and preferences.',
          tags: ['profile', 'update', 'settings']
        },
        {
          question: 'Is my personal information secure?',
          answer: 'Yes, we use industry-standard encryption and security measures to protect your data. We never share your personal information with third parties without consent.',
          tags: ['security', 'privacy', 'data protection']
        }
      ]
    },
    {
      id: 'payments-billing',
      title: 'Payments & Billing',
      icon: FaCheckCircle,
      items: [
        {
          question: 'How do I pay for property listings?',
          answer: 'Basic property listings are free. Premium features and featured listings may have associated costs which can be paid through our secure payment system.',
          tags: ['payment', 'billing', 'fees']
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept major credit cards, bank transfers, and mobile payment services like EasyPaisa and JazzCash.',
          tags: ['payment methods', 'cards', 'mobile payments']
        },
        {
          question: 'How do I get a refund?',
          answer: 'Refund requests are handled on a case-by-case basis. Contact our support team with your order details and reason for the refund request.',
          tags: ['refund', 'cancellation', 'support']
        }
      ]
    },
    {
      id: 'technical-support',
      title: 'Technical Support',
      icon: FaHeadset,
      items: [
        {
          question: 'The website is not loading properly',
          answer: 'Try refreshing the page, clearing your browser cache, or using a different browser. If the issue persists, contact our technical support team.',
          tags: ['technical', 'loading', 'browser']
        },
        {
          question: 'I can\'t upload property photos',
          answer: 'Ensure your photos are in JPG, PNG, or WebP format and under 5MB each. Try using a different browser or contact support if the issue continues.',
          tags: ['photos', 'upload', 'images']
        },
        {
          question: 'How do I report a bug?',
          answer: 'Use the "Report Issue" link in the footer or contact our support team directly. Please include details about the issue and your browser/device information.',
          tags: ['bug', 'report', 'technical']
        }
      ]
    }
  ];

  // Filter categories and items based on search query
  const filteredCategories = helpCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(category => category.items.length > 0);

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleItem = (itemIndex) => {
    setExpandedItem(expandedItem === itemIndex ? null : itemIndex);
  };

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
              <FaQuestionCircle className="text-3xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Help Center
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Find answers to your questions
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Help Categories */}
      <div className="py-16">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How can we help you?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our help categories or search for specific topics to find the answers you need.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {filteredCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + categoryIndex * 0.1 }}
                className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <category.icon className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {category.items.length} articles
                      </p>
                    </div>
                  </div>
                  {expandedCategory === category.id ? (
                    <FaChevronDown className="text-gray-400" />
                  ) : (
                    <FaChevronRight className="text-gray-400" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedCategory === category.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200"
                    >
                      <div className="p-6 space-y-4">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="border border-gray-200 rounded-lg">
                            <button
                              onClick={() => toggleItem(`${category.id}-${itemIndex}`)}
                              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                              <span className="font-medium text-gray-900">
                                {item.question}
                              </span>
                              {expandedItem === `${category.id}-${itemIndex}` ? (
                                <FaChevronDown className="text-gray-400" />
                              ) : (
                                <FaChevronRight className="text-gray-400" />
                              )}
                            </button>
                            
                            <AnimatePresence>
                              {expandedItem === `${category.id}-${itemIndex}` && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="px-4 pb-3"
                                >
                                  <p className="text-gray-600 mb-3">
                                    {item.answer}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {item.tags.map((tag, tagIndex) => (
                                      <span
                                        key={tagIndex}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="py-16 bg-white">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Still need help?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <FaPhone className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600 mb-3">Speak with our support team</p>
                <a href="tel:+923001234567" className="text-blue-600 font-medium">
                  +92 300 123 4567
                </a>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <FaEnvelope className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600 mb-3">Send us a detailed message</p>
                <a href="mailto:support@pakproperty.com" className="text-blue-600 font-medium">
                  support@pakproperty.com
                </a>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <FaHeadset className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-3">Get instant help online</p>
                <Link to="/contact" className="text-blue-600 font-medium">
                  Start Chat
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="py-12 bg-gray-100">
        <div className="container-responsive">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Quick Links
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Link
              to="/faqs"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <FaQuestionCircle className="text-blue-600 text-2xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">FAQs</h4>
              <p className="text-sm text-gray-600">Frequently asked questions</p>
            </Link>
            
            <Link
              to="/contact"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <FaEnvelope className="text-blue-600 text-2xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
              <p className="text-sm text-gray-600">Get in touch with us</p>
            </Link>
            
            <Link
              to="/support"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <FaExclamationTriangle className="text-blue-600 text-2xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Report Issue</h4>
              <p className="text-sm text-gray-600">Report bugs or problems</p>
            </Link>
            
            <Link
              to="/terms"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <FaFileAlt className="text-blue-600 text-2xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Terms</h4>
              <p className="text-sm text-gray-600">Terms of service</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage; 