import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaExclamationTriangle, 
  FaBug, 
  FaQuestionCircle, 
  FaPhone, 
  FaEnvelope, 
  FaHeadset,
  FaFileAlt,
  FaUpload,
  FaDesktop,
  FaMobile,
  FaBrowser,
  FaCheckCircle,
  FaTimes,
  FaInfoCircle,
  FaRocket,
  FaShieldAlt,
  FaUsers,
  FaBuilding
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    issueType: '',
    subject: '',
    description: '',
    browser: '',
    device: '',
    screenshots: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const issueTypes = [
    { value: 'bug', label: 'Bug Report', icon: FaBug },
    { value: 'feature', label: 'Feature Request', icon: FaRocket },
    { value: 'technical', label: 'Technical Issue', icon: FaDesktop },
    { value: 'account', label: 'Account Problem', icon: FaUsers },
    { value: 'payment', label: 'Payment Issue', icon: FaShieldAlt },
    { value: 'other', label: 'Other', icon: FaQuestionCircle }
  ];

  const browsers = [
    'Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Other'
  ];

  const devices = [
    'Desktop', 'Laptop', 'Tablet', 'Mobile', 'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      screenshots: [...prev.screenshots, ...files]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Issue reported successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        issueType: '',
        subject: '',
        description: '',
        browser: '',
        device: '',
        screenshots: []
      });
    } catch (error) {
      toast.error('Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container-responsive py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <FaExclamationTriangle className="text-3xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Report an Issue
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Help us improve by reporting bugs or issues
            </p>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              Found a bug or experiencing an issue? Let us know and we'll work to fix it as quickly as possible.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Issue Report Form */}
      <div className="py-16">
        <div className="container-responsive">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Report Your Issue
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Issue Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Issue Type *
                  </label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {issueTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.issueType === type.value
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="issueType"
                          value={type.value}
                          checked={formData.issueType === type.value}
                          onChange={(e) => handleInputChange('issueType', e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          <type.icon className={`text-lg ${
                            formData.issueType === type.value ? 'text-red-600' : 'text-gray-400'
                          }`} />
                          <span className="font-medium">{type.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Brief description of the issue"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Please provide a detailed description of the issue, including steps to reproduce if applicable..."
                  />
                </div>

                {/* Technical Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Browser
                    </label>
                    <select
                      value={formData.browser}
                      onChange={(e) => handleInputChange('browser', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select browser</option>
                      {browsers.map(browser => (
                        <option key={browser} value={browser}>{browser}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Device Type
                    </label>
                    <select
                      value={formData.device}
                      onChange={(e) => handleInputChange('device', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select device</option>
                      {devices.map(device => (
                        <option key={device} value={device}>{device}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Screenshots */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Screenshots (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FaUpload className="text-gray-400 text-3xl mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">
                      Drag and drop files here, or click to select
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="screenshots"
                    />
                    <label
                      htmlFor="screenshots"
                      className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      Choose Files
                    </label>
                  </div>
                  
                  {/* File List */}
                  {formData.screenshots.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.screenshots.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Issue'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Alternative Support Options */}
      <div className="py-16 bg-white">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Other Ways to Get Help
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Need immediate assistance? Try these alternative support channels.
            </p>
          </motion.div>

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
              to="/faqs"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <FaInfoCircle className="text-blue-600 text-2xl mx-auto mb-3" />
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

export default SupportPage; 