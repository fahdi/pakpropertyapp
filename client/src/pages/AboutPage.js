import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaShieldAlt, 
  FaMapMarkerAlt, 
  FaChartLine, 
  FaHeart,
  FaAward,
  FaHandshake,
  FaLightbulb,
  FaRocket,
  FaStar,
  FaCheck
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const AboutPage = () => {
  const stats = [
    { number: '10,000+', label: 'Properties Listed', icon: FaHome },
    { number: '5,000+', label: 'Happy Tenants', icon: FaUsers },
    { number: '500+', label: 'Verified Agents', icon: FaShieldAlt },
    { number: '15+', label: 'Cities Covered', icon: FaMapMarkerAlt }
  ];

  const values = [
    {
      icon: FaShieldAlt,
      title: 'Trust & Security',
      description: 'We prioritize the security and trust of our users with verified listings and secure transactions.'
    },
    {
      icon: FaUsers,
      title: 'Community First',
      description: 'Building a strong community of property owners, agents, and tenants across Pakistan.'
    },
    {
      icon: FaHandshake,
      title: 'Transparency',
      description: 'Complete transparency in property details, pricing, and communication between parties.'
    },
    {
      icon: FaRocket,
      title: 'Innovation',
      description: 'Continuously innovating to provide the best property rental experience in Pakistan.'
    }
  ];

  const team = [
    {
      name: 'Ahmed Khan',
      position: 'CEO & Founder',
      image: '/images/team/ceo.jpg',
      bio: 'Former real estate professional with 15+ years of experience in the Pakistani property market.'
    },
    {
      name: 'Fatima Ali',
      position: 'CTO',
      image: '/images/team/cto.jpg',
      bio: 'Tech leader with expertise in building scalable platforms and user-centric applications.'
    },
    {
      name: 'Usman Hassan',
      position: 'Head of Operations',
      image: '/images/team/operations.jpg',
      bio: 'Operations expert specializing in customer service and platform optimization.'
    },
    {
      name: 'Ayesha Malik',
      position: 'Head of Marketing',
      image: '/images/team/marketing.jpg',
      bio: 'Marketing strategist focused on building brand awareness and user engagement.'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Platform Launch',
      description: 'PakProperty officially launched in Karachi with 100+ properties.'
    },
    {
      year: '2021',
      title: 'Expansion',
      description: 'Expanded to Lahore and Islamabad with 1,000+ properties listed.'
    },
    {
      year: '2022',
      title: 'Mobile App',
      description: 'Launched mobile applications for iOS and Android platforms.'
    },
    {
      year: '2023',
      title: 'National Reach',
      description: 'Coverage extended to 15+ cities across Pakistan.'
    },
    {
      year: '2024',
      title: 'Market Leader',
      description: 'Became Pakistan\'s leading property rental platform with 10,000+ properties.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container-responsive text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              About PakProperty
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Pakistan's leading property rental platform, connecting property owners, agents, and tenants 
              through innovative technology and trusted relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/properties"
                className="btn btn-primary btn-lg bg-white text-blue-600 hover:bg-gray-100"
              >
                Browse Properties
              </Link>
              <Link
                to="/contact"
                className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-blue-600"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container-responsive">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To revolutionize the property rental market in Pakistan by providing a transparent, 
                efficient, and user-friendly platform that connects property owners with quality tenants.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We believe everyone deserves to find their perfect home, and every property owner 
                deserves reliable tenants. Our platform makes this connection seamless and secure.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaCheck className="text-green-600 text-xl" />
                  <span className="text-gray-700">Verified property listings</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheck className="text-green-600 text-xl" />
                  <span className="text-gray-700">Secure communication platform</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheck className="text-green-600 text-xl" />
                  <span className="text-gray-700">24/7 customer support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheck className="text-green-600 text-xl" />
                  <span className="text-gray-700">Mobile-first experience</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Vision</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaLightbulb className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Innovation</h4>
                    <p className="text-gray-600">Leading the digital transformation of Pakistan's real estate market.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaUsers className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Community</h4>
                    <p className="text-gray-600">Building the largest property community in Pakistan.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaRocket className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Growth</h4>
                    <p className="text-gray-600">Expanding to serve every major city in Pakistan.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Numbers that tell our story of growth and success
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="text-4xl text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6 text-center"
              >
                <value.icon className="text-4xl text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind PakProperty's success
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-6 text-center"
              >
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaUsers className="text-gray-600 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-16">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key milestones in our growth story
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200"></div>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container-responsive text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Join the PakProperty Community
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Whether you're looking to rent a property or list your own, we're here to help you 
            find the perfect match in Pakistan's property market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn btn-primary btn-lg bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Started Today
            </Link>
            <Link
              to="/contact"
              className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-blue-600"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 