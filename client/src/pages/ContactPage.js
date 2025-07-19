import React, { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaUser,
  FaBuilding,
  FaComments,
  FaCheck,
  FaArrowRight,
  FaPaperPlane
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useResizeObserverFix } from '../utils/useResizeObserverFix';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Use the custom ResizeObserver fix hook
  useResizeObserverFix();

  // Additional cleanup for Contact page animations
  useEffect(() => {
    // Ensure stable DOM after component mounts
    const timer = setTimeout(() => {
      // Force a repaint to stabilize any ResizeObserver instances
      window.dispatchEvent(new Event('resize'));
    }, 200);

    // Cleanup function to handle component unmounting
    return () => {
      clearTimeout(timer);
      // Force cleanup of any remaining ResizeObserver instances
      window.dispatchEvent(new Event('resize'));
    };
  }, []);

  const offices = [
    {
      city: 'Karachi',
      address: 'Suite 101, Business Center, Clifton Block 5, Karachi',
      phone: '+92 21 1234 5678',
      email: 'karachi@pakproperty.com',
      hours: 'Mon - Fri: 9:00 AM - 6:00 PM',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      iconColor: 'text-white'
    },
    {
      city: 'Lahore',
      address: 'Office 205, Mall Road, Gulberg III, Lahore',
      phone: '+92 42 1234 5678',
      email: 'lahore@pakproperty.com',
      hours: 'Mon - Fri: 9:00 AM - 6:00 PM',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      iconColor: 'text-white'
    },
    {
      city: 'Islamabad',
      address: 'Floor 3, Blue Area, F-7 Markaz, Islamabad',
      phone: '+92 51 1234 5678',
      email: 'islamabad@pakproperty.com',
      hours: 'Mon - Fri: 9:00 AM - 6:00 PM',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      iconColor: 'text-white'
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, url: 'https://facebook.com/pakproperty', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: FaTwitter, url: 'https://twitter.com/pakproperty', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: FaInstagram, url: 'https://instagram.com/pakproperty', color: 'hover:text-pink-600' },
    { name: 'LinkedIn', icon: FaLinkedin, url: 'https://linkedin.com/company/pakproperty', color: 'hover:text-blue-700' }
  ];

  const supportTopics = [
    {
      icon: FaUser,
      title: 'Account Support',
      description: 'Help with account creation, login, and profile management',
      contact: 'accounts@pakproperty.com',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      iconColor: 'text-white'
    },
    {
      icon: FaBuilding,
      title: 'Property Listings',
      description: 'Assistance with property listing, editing, and management',
      contact: 'listings@pakproperty.com',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      iconColor: 'text-white'
    },
    {
      icon: FaComments,
      title: 'General Inquiries',
      description: 'General questions about our platform and services',
      contact: 'info@pakproperty.com',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      iconColor: 'text-white'
    }
  ];

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-primary-700 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`
          }}
        ></div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/85 to-primary-700/80"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="glass" className="mb-6">
                <FaPaperPlane className="mr-2" />
                Get in Touch
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Contact <span className="bg-gradient-to-r from-accent-400 to-secondary-400 bg-clip-text text-transparent">Us</span>
              </h1>
              
              <p className="text-xl lg:text-2xl mb-8 text-white/90 leading-relaxed">
                Get in touch with our team. We're here to help you with all your property rental needs.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <FaPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <div className="text-white/80 text-sm">Call us</div>
                    <div className="text-white font-semibold">+92 21 1234 5678</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <div>
                    <div className="text-white/80 text-sm">Email us</div>
                    <div className="text-white font-semibold">info@pakproperty.com</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">Quick Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Response Time</span>
                    <Badge variant="success" className="text-xs">
                      Within 24 hours
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Support Hours</span>
                    <span className="text-white font-semibold">24/7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Languages</span>
                    <span className="text-white font-semibold">English, Urdu</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge variant="accent" className="mb-6">
                Send Message
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                            errors.name ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Your full name"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                          placeholder="03XXXXXXXXX"
                        />
                      </div>

                      <div>
                        <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                          Inquiry Type
                        </label>
                        <select
                          id="inquiryType"
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="partnership">Partnership</option>
                          <option value="feedback">Feedback</option>
                          <option value="complaint">Complaint</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                          errors.subject ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="What is this about?"
                      />
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="6"
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                          errors.message ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Tell us how we can help you..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      size="lg"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              {/* General Contact Info */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">General Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">+92 300 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">info@pakproperty.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaClock className="text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Business Hours</p>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Topics */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Support Topics</h3>
                <div className="space-y-4">
                  {supportTopics.map((topic, index) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <topic.icon className="text-blue-600" />
                        <h4 className="font-medium text-gray-900">{topic.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                      <p className="text-sm text-blue-600">{topic.contact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Follow Us</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-400 ${social.color} transition-colors`}
                      aria-label={social.name}
                    >
                      <social.icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-white">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Offices
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visit us at any of our office locations across Pakistan
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <FaMapMarkerAlt className="text-blue-600 text-xl" />
                  <h3 className="text-xl font-semibold text-gray-900">{office.city}</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <p className="text-gray-900">{office.address}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <a href={`tel:${office.phone}`} className="text-blue-600 hover:text-blue-700">
                      {office.phone}
                    </a>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <a href={`mailto:${office.email}`} className="text-blue-600 hover:text-blue-700">
                      {office.email}
                    </a>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Hours</p>
                    <p className="text-gray-900">{office.hours}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How do I list my property?</h3>
              <p className="text-gray-600">
                Create an account, verify your email, and use our property listing form to add your property 
                with photos and details.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How do I contact a property owner?</h3>
              <p className="text-gray-600">
                Click on any property listing and use the contact form or call/WhatsApp the provided contact information.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is PakProperty free to use?</h3>
              <p className="text-gray-600">
                Basic features are free for tenants. Property owners pay a small fee for premium listings and features.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How do I verify my account?</h3>
              <p className="text-gray-600">
                Check your email after registration and click the verification link. You can also request a new link if needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container-responsive text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of satisfied users who have found their perfect rental property through PakProperty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="btn btn-primary btn-lg bg-white text-blue-600 hover:bg-gray-100"
            >
              Create Account
            </a>
            <a
              href="/properties"
              className="btn btn-outline btn-lg border-white text-blue-600 bg-white"
            >
              Browse Properties
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 