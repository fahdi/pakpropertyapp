import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaQuestionCircle, 
  FaSearch, 
  FaUser, 
  FaBuilding, 
  FaShieldAlt, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronRight,
  FaHome,
  FaMoneyBillWave,
  FaFileAlt,
  FaHeadset,
  FaRocket,
  FaStar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaLock,
  FaCreditCard,
  FaMobile,
  FaDesktop,
  FaCamera,
  FaCalendarAlt,
  FaHandshake
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const FAQsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState('general');
  const [expandedItem, setExpandedItem] = useState(null);

  const faqCategories = {
    general: {
      title: 'General Questions',
      icon: FaQuestionCircle,
      items: [
        {
          question: 'What is PakProperty?',
          answer: 'PakProperty is Pakistan\'s leading property rental platform that connects tenants with property owners and agents. We provide a secure, transparent, and efficient way to find and list rental properties across major Pakistani cities.',
          tags: ['platform', 'overview', 'introduction']
        },
        {
          question: 'How much does it cost to use PakProperty?',
          answer: 'Basic property listings and searches are completely free. Premium features like featured listings, advanced analytics, and priority support may have associated costs. We believe in transparency and will always clearly communicate any fees.',
          tags: ['cost', 'pricing', 'fees']
        },
        {
          question: 'Which cities does PakProperty cover?',
          answer: 'We currently cover major cities including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, and Quetta. We\'re continuously expanding to serve more areas across Pakistan.',
          tags: ['cities', 'locations', 'coverage']
        },
        {
          question: 'Is PakProperty available on mobile?',
          answer: 'Yes! Our website is fully responsive and works perfectly on all devices including smartphones and tablets. We\'re also developing a dedicated mobile app for even better mobile experience.',
          tags: ['mobile', 'app', 'responsive']
        }
      ]
    },
    tenants: {
      title: 'For Tenants',
      icon: FaUser,
      items: [
        {
          question: 'How do I find properties to rent?',
          answer: 'You can search for properties using our advanced search filters. Browse by location, price range, property type, number of bedrooms, and other criteria. You can also save properties you\'re interested in for later viewing.',
          tags: ['search', 'browse', 'find properties']
        },
        {
          question: 'How do I contact a property owner?',
          answer: 'On any property detail page, you\'ll find the owner\'s contact information including phone number, email, and WhatsApp. You can also use our inquiry form to send a message directly through the platform.',
          tags: ['contact', 'owner', 'communication']
        },
        {
          question: 'What documents do I need to rent a property?',
          answer: 'Typically you\'ll need: CNIC copy, proof of income/employment, bank statements, and references. Specific requirements may vary by owner. We recommend discussing requirements directly with the property owner.',
          tags: ['documents', 'requirements', 'rental']
        },
        {
          question: 'How do I schedule a property viewing?',
          answer: 'Contact the property owner through the property detail page. Most owners are flexible with viewing times and will work with you to find a convenient time. Some also offer virtual tours.',
          tags: ['viewing', 'schedule', 'appointment']
        },
        {
          question: 'Can I save properties I\'m interested in?',
          answer: 'Yes! Click the heart icon on any property card or detail page to save it. You can view all your saved properties in your dashboard under "Saved Properties".',
          tags: ['save', 'favorites', 'bookmark']
        }
      ]
    },
    owners: {
      title: 'For Property Owners',
      icon: FaBuilding,
      items: [
        {
          question: 'How do I list my property?',
          answer: 'Create an account, go to your dashboard, and click "Add Property". Fill in all the details including photos, amenities, pricing, and contact information. Your listing will be reviewed and published within 24 hours.',
          tags: ['list', 'add property', 'posting']
        },
        {
          question: 'How much does it cost to list a property?',
          answer: 'Basic property listings are completely free. Premium features like featured listings, priority placement, and advanced analytics may have associated costs. We\'ll always clearly communicate any fees upfront.',
          tags: ['cost', 'listing fees', 'pricing']
        },
        {
          question: 'How do I manage property inquiries?',
          answer: 'All inquiries appear in your dashboard under "Inquiries". You can respond directly, schedule viewings, or mark inquiries as resolved. You\'ll receive notifications for new inquiries.',
          tags: ['inquiries', 'management', 'responses']
        },
        {
          question: 'How do I update my property status?',
          answer: 'In your dashboard under "My Properties", you can mark properties as rented, available, or under maintenance using the status toggle buttons. This helps keep your listings current.',
          tags: ['status', 'update', 'management']
        },
        {
          question: 'Can I upload multiple photos of my property?',
          answer: 'Yes! You can upload up to 10 high-quality photos of your property. We recommend including photos of all rooms, amenities, and the exterior to give potential tenants a complete view.',
          tags: ['photos', 'images', 'upload']
        }
      ]
    },
    agents: {
      title: 'For Real Estate Agents',
      icon: FaHandshake,
      items: [
        {
          question: 'How do I register as a real estate agent?',
          answer: 'During registration, select "Agent" as your role and provide your license information. We\'ll verify your credentials and activate your agent account within 24-48 hours.',
          tags: ['registration', 'agent', 'license']
        },
        {
          question: 'Can I list multiple properties?',
          answer: 'Yes! As a verified agent, you can list unlimited properties. You can manage all your listings from your dashboard and track performance for each property.',
          tags: ['multiple listings', 'management', 'dashboard']
        },
        {
          question: 'How do I manage client inquiries?',
          answer: 'All client inquiries are organized in your dashboard. You can respond directly, schedule viewings, and track communication history. You\'ll receive notifications for new inquiries.',
          tags: ['client management', 'inquiries', 'communication']
        },
        {
          question: 'Do you provide commission tracking?',
          answer: 'Yes! Our platform includes tools to track deals, commissions, and client communications. You can generate reports and manage your business efficiently.',
          tags: ['commission', 'tracking', 'reports']
        }
      ]
    },
    security: {
      title: 'Security & Privacy',
      icon: FaShieldAlt,
      items: [
        {
          question: 'Is my personal information secure?',
          answer: 'Yes, we use industry-standard encryption and security measures to protect your data. We never share your personal information with third parties without your explicit consent.',
          tags: ['security', 'privacy', 'data protection']
        },
        {
          question: 'How do you verify property listings?',
          answer: 'We have a dedicated team that verifies all property listings. This includes checking property details, owner information, and conducting quality reviews to ensure accuracy.',
          tags: ['verification', 'quality', 'accuracy']
        },
        {
          question: 'What payment methods are secure?',
          answer: 'We use secure payment gateways and accept major credit cards, bank transfers, and mobile payment services. All transactions are encrypted and protected.',
          tags: ['payments', 'security', 'encryption']
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can delete your account at any time from your profile settings. Please note that this will permanently remove your data and cannot be undone.',
          tags: ['account deletion', 'privacy', 'data removal']
        }
      ]
    },
    technical: {
      title: 'Technical Support',
      icon: FaHeadset,
      items: [
        {
          question: 'The website is not loading properly',
          answer: 'Try refreshing the page, clearing your browser cache, or using a different browser. If the issue persists, contact our technical support team with details about your browser and device.',
          tags: ['technical', 'loading', 'browser']
        },
        {
          question: 'I can\'t upload property photos',
          answer: 'Ensure your photos are in JPG, PNG, or WebP format and under 5MB each. Try using a different browser or contact support if the issue continues.',
          tags: ['photos', 'upload', 'images']
        },
        {
          question: 'How do I reset my password?',
          answer: 'On the login page, click "Forgot Password" and enter your email address. You\'ll receive a reset link via email. Make sure to check your spam folder if you don\'t see the email.',
          tags: ['password', 'reset', 'security']
        },
        {
          question: 'How do I report a bug or issue?',
          answer: 'Use the "Report Issue" link in the footer or contact our support team directly. Please include details about the issue and your browser/device information for faster resolution.',
          tags: ['bug', 'report', 'technical']
        }
      ]
    }
  };

  // Filter categories and items based on search query
  const filteredCategories = Object.entries(faqCategories).map(([key, category]) => ({
    key,
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(category => category.items.length > 0);

  const toggleCategory = (categoryKey) => {
    setExpandedCategory(expandedCategory === categoryKey ? null : categoryKey);
  };

  const toggleItem = (itemIndex) => {
    setExpandedItem(expandedItem === itemIndex ? null : itemIndex);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Find quick answers to common questions
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="py-16">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers organized by topic to help you quickly locate the information you need.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.entries(faqCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => toggleCategory(key)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  expandedCategory === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <category.icon />
                  <span>{category.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto">
            {filteredCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + categoryIndex * 0.1 }}
                className={`bg-white rounded-lg shadow-lg mb-6 overflow-hidden ${
                  expandedCategory === category.key ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="p-6 space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleItem(`${category.key}-${itemIndex}`)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">
                          {item.question}
                        </span>
                        {expandedItem === `${category.key}-${itemIndex}` ? (
                          <FaChevronDown className="text-gray-400" />
                        ) : (
                          <FaChevronRight className="text-gray-400" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {expandedItem === `${category.key}-${itemIndex}` && (
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
              Still have questions?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help.
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
            Related Resources
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Link
              to="/help"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <FaQuestionCircle className="text-blue-600 text-2xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Help Center</h4>
              <p className="text-sm text-gray-600">Detailed help articles</p>
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

export default FAQsPage; 