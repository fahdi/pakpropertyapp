import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube,
  FaHeart,
  FaShieldAlt,
  FaUsers,
  FaBuilding,
  FaSearch,
  FaQuestionCircle,
  FaFileAlt,
  FaUserShield
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Properties', path: '/properties' },
      { name: 'Featured Listings', path: '/properties?featured=true' },
      { name: 'New Arrivals', path: '/properties?sort=newest' },
      { name: 'Popular Areas', path: '/properties?popular=true' }
    ],
    services: [
      { name: 'For Tenants', path: '/services/tenants' },
      { name: 'For Owners', path: '/services/owners' },
      { name: 'For Agents', path: '/services/agents' },
      { name: 'Property Management', path: '/services/management' }
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'FAQs', path: '/faqs' },
      { name: 'Report Issue', path: '/support' }
    ],
    legal: [
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'Data Protection', path: '/data-protection' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, url: 'https://facebook.com/pakproperty', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: FaTwitter, url: 'https://twitter.com/pakproperty', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: FaInstagram, url: 'https://instagram.com/pakproperty', color: 'hover:text-pink-600' },
    { name: 'LinkedIn', icon: FaLinkedin, url: 'https://linkedin.com/company/pakproperty', color: 'hover:text-blue-700' },
    { name: 'YouTube', icon: FaYoutube, url: 'https://youtube.com/pakproperty', color: 'hover:text-red-600' }
  ];

  const features = [
    { icon: FaSearch, title: 'Advanced Search', description: 'Find properties with detailed filters' },
    { icon: FaShieldAlt, title: 'Verified Listings', description: 'All properties are verified by our team' },
    { icon: FaUsers, title: 'Direct Contact', description: 'Connect directly with property owners' },
    { icon: FaBuilding, title: 'Multiple Cities', description: 'Properties across major Pakistani cities' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-responsive py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FaHome className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold">PakProperty</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Pakistan's leading property rental platform. Find your perfect home with thousands of verified 
              properties across major cities. Connect directly with property owners and agents.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-blue-400" />
                <span className="text-gray-300">Karachi, Lahore, Islamabad, Pakistan</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-blue-400" />
                <a href="tel:+923001234567" className="text-gray-300 hover:text-white transition-colors">
                  +92 300 123 4567
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-blue-400" />
                <a href="mailto:info@pakproperty.com" className="text-gray-300 hover:text-white transition-colors">
                  info@pakproperty.com
                </a>
              </div>
            </div>

            {/* Social Links */}
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
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h3 className="text-lg font-semibold mb-6 text-center">Why Choose PakProperty?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-3">
                  <feature.icon className="text-white text-xl" />
                </div>
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container-responsive py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-4">
              <p className="text-gray-300 text-sm">
                © {currentYear} PakProperty. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms
                </Link>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Cookies
                </Link>
              </div>
            </div>

            {/* Additional Links */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <FaShieldAlt className="text-green-400" />
                <span className="text-gray-300">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaUserShield className="text-blue-400" />
                <span className="text-gray-300">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaHeart className="text-red-400" />
                <span className="text-gray-300">Made in Pakistan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup (Optional) */}
      <div className="bg-gray-800">
        <div className="container-responsive py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-300 mb-4">
              Get notified about new properties and market updates
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-l-md border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 