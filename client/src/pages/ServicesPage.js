import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaBuilding, 
  FaShieldAlt, 
  FaSearch, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaCheckCircle,
  FaStar,
  FaHandshake,
  FaChartLine,
  FaTools,
  FaUserTie,
  FaClipboardList,
  FaCalendarAlt,
  FaFileContract,
  FaMoneyBillWave,
  FaCamera,
  FaVideo,
  FaMobile,
  FaDesktop,
  FaHeadset,
  FaRocket
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const ServicesPage = () => {
  const { serviceType } = useParams();

  const services = {
    tenants: {
      title: "For Tenants",
      subtitle: "Find Your Perfect Home",
      description: "Discover verified properties and connect directly with owners. Our platform makes finding your ideal rental property simple and secure.",
      icon: FaHome,
      color: "blue",
      features: [
        {
          icon: FaSearch,
          title: "Advanced Search",
          description: "Filter by location, price, amenities, and more"
        },
        {
          icon: FaShieldAlt,
          title: "Verified Listings",
          description: "All properties are verified by our team"
        },
        {
          icon: FaPhone,
          title: "Direct Contact",
          description: "Connect directly with property owners"
        },
        {
          icon: FaCheckCircle,
          title: "Secure Process",
          description: "Safe and transparent rental process"
        }
      ],
      benefits: [
        "Browse thousands of verified properties",
        "Advanced search and filtering options",
        "Direct communication with owners",
        "Property viewing scheduling",
        "Document management",
        "Rental agreement assistance"
      ]
    },
    owners: {
      title: "For Property Owners",
      subtitle: "List Your Properties",
      description: "Reach thousands of potential tenants. Our platform helps you list, manage, and rent your properties efficiently.",
      icon: FaBuilding,
      color: "green",
      features: [
        {
          icon: FaRocket,
          title: "Easy Listing",
          description: "List your property in minutes with our simple form"
        },
        {
          icon: FaUsers,
          title: "Wide Reach",
          description: "Connect with thousands of potential tenants"
        },
        {
          icon: FaChartLine,
          title: "Analytics",
          description: "Track views, inquiries, and performance"
        },
        {
          icon: FaTools,
          title: "Management Tools",
          description: "Manage inquiries and property status easily"
        }
      ],
      benefits: [
        "Free property listing",
        "Professional property presentation",
        "Inquiry management system",
        "Property status management",
        "Analytics and insights",
        "Direct tenant communication"
      ]
    },
    agents: {
      title: "For Real Estate Agents",
      subtitle: "Grow Your Business",
      description: "Expand your reach and manage your listings efficiently. Our platform provides tools for professional real estate agents.",
      icon: FaUserTie,
      color: "purple",
      features: [
        {
          icon: FaHandshake,
          title: "Professional Profile",
          description: "Showcase your expertise and listings"
        },
        {
          icon: FaClipboardList,
          title: "Listing Management",
          description: "Manage multiple properties efficiently"
        },
        {
          icon: FaCalendarAlt,
          title: "Viewing Coordination",
          description: "Schedule and manage property viewings"
        },
        {
          icon: FaFileContract,
          title: "Deal Management",
          description: "Track deals and client communications"
        }
      ],
      benefits: [
        "Professional agent profile",
        "Multiple property listings",
        "Client management tools",
        "Viewing coordination",
        "Deal tracking",
        "Commission management"
      ]
    },
    management: {
      title: "Property Management",
      subtitle: "Professional Management Services",
      description: "Comprehensive property management services for owners who want professional handling of their rental properties.",
      icon: FaTools,
      color: "orange",
      features: [
        {
          icon: FaMoneyBillWave,
          title: "Rent Collection",
          description: "Automated rent collection and payment processing"
        },
        {
          icon: FaCamera,
          title: "Property Maintenance",
          description: "Regular inspections and maintenance coordination"
        },
        {
          icon: FaVideo,
          title: "Tenant Screening",
          description: "Comprehensive tenant verification and screening"
        },
        {
          icon: FaHeadset,
          title: "24/7 Support",
          description: "Round-the-clock support for tenants and owners"
        }
      ],
      benefits: [
        "Complete property management",
        "Tenant screening and placement",
        "Rent collection and accounting",
        "Maintenance and repairs",
        "Legal compliance",
        "Financial reporting"
      ]
    }
  };

  const currentService = services[serviceType] || services.tenants;

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
              <currentService.icon className="text-3xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {currentService.title}
            </h1>
            <p className="text-xl md:text-2xl mb-6 opacity-90">
              {currentService.subtitle}
            </p>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              {currentService.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the features and benefits that make PakProperty the leading choice for property rentals in Pakistan.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentService.features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <feature.icon className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Key Benefits
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the advantages of using Pakistan's most trusted property platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {currentService.benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <div className="container-responsive text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users who trust PakProperty for their property needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Service Navigation */}
      <div className="py-12 bg-gray-100">
        <div className="container-responsive">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Explore Our Services
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(services).map(([key, service]) => (
              <Link
                key={key}
                to={`/services/${key}`}
                className={`bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow ${
                  serviceType === key ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <service.icon className="text-blue-600 text-xl" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {service.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {service.description.substring(0, 80)}...
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage; 