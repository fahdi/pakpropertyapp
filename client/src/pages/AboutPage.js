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
  FaCheck,
  FaArrowRight,
  FaPlay
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const AboutPage = () => {
  const stats = [
    { number: '10,000+', label: 'Properties Listed', icon: FaHome, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { number: '5,000+', label: 'Happy Tenants', icon: FaUsers, color: 'text-green-600', bgColor: 'bg-green-50' },
    { number: '500+', label: 'Verified Agents', icon: FaShieldAlt, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { number: '15+', label: 'Cities Covered', icon: FaMapMarkerAlt, color: 'text-orange-600', bgColor: 'bg-orange-50' }
  ];

  const values = [
    {
      icon: FaShieldAlt,
      title: 'Trust & Security',
      description: 'We prioritize the security and trust of our users with verified listings and secure transactions.',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      iconColor: 'text-white',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: FaUsers,
      title: 'Community First',
      description: 'Building a strong community of property owners, agents, and tenants across Pakistan.',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      iconColor: 'text-white',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: FaHandshake,
      title: 'Transparency',
      description: 'Complete transparency in property details, pricing, and communication between parties.',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      iconColor: 'text-white',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: FaRocket,
      title: 'Innovation',
      description: 'Continuously innovating to provide the best property rental experience in Pakistan.',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      iconColor: 'text-white',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const team = [
    {
      name: 'Ahmed Khan',
      position: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Former real estate professional with 15+ years of experience in the Pakistani property market.',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Fatima Ali',
      position: 'CTO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      bio: 'Tech leader with expertise in building scalable platforms and user-centric applications.',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Usman Hassan',
      position: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      bio: 'Operations expert specializing in customer service and platform optimization.',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Ayesha Malik',
      position: 'Head of Marketing',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Marketing strategist focused on building brand awareness and user engagement.',
      social: { linkedin: '#', twitter: '#' }
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Platform Launch',
      description: 'PakProperty officially launched in Karachi with 100+ properties.',
      icon: FaRocket,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      year: '2021',
      title: 'Expansion',
      description: 'Expanded to Lahore and Islamabad with 1,000+ properties listed.',
      icon: FaMapMarkerAlt,
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      year: '2022',
      title: 'Mobile App',
      description: 'Launched mobile applications for iOS and Android platforms.',
      icon: FaHome,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      year: '2023',
      title: 'National Reach',
      description: 'Coverage extended to 15+ cities across Pakistan.',
      icon: FaUsers,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600'
    },
    {
      year: '2024',
      title: 'Market Leader',
      description: 'Became Pakistan\'s leading property rental platform with 10,000+ properties.',
      icon: FaAward,
      color: 'bg-gradient-to-br from-red-500 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-primary-700 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80')`
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
                <FaAward className="mr-2" />
                Pakistan's Leading Property Platform
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                About <span className="bg-gradient-to-r from-accent-400 to-secondary-400 bg-clip-text text-transparent">PakProperty</span>
              </h1>
              
              <p className="text-xl lg:text-2xl mb-8 text-white/90 leading-relaxed">
                Pakistan's leading property rental platform, connecting property owners, agents, and tenants 
                through innovative technology and trusted relationships.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="accent"
                  size="lg"
                  asChild
                  className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Link to="/properties">
                    <FaArrowRight className="mr-2" />
                    Browse Properties
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-white text-white hover:bg-white hover:text-primary-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Link to="/contact">
                    Contact Us
                    <FaArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.bgColor} rounded-2xl mb-4 shadow-lg`}>
                        <stat.icon className={`text-2xl ${stat.color}`} />
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                      <div className="text-white/80 text-sm">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="mb-6">
                Our Mission
              </Badge>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Revolutionizing Property Rental in Pakistan
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
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-xl border-0 bg-gradient-to-br from-primary-50 to-secondary-50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Our Vision</CardTitle>
                  <CardDescription className="text-gray-600">
                    Leading the digital transformation of Pakistan's real estate market
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                      <p className="text-gray-600">Building strong relationships between property owners and tenants.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaShieldAlt className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Trust</h4>
                      <p className="text-gray-600">Creating a secure and transparent property rental ecosystem.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="accent" className="mb-6">
              Our Values
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              The Principles That Guide Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The core values that drive our mission to revolutionize property rental in Pakistan
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${value.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <value.icon className={`text-2xl ${value.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="purple" className="mb-6">
              Our Team
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Meet the Team Behind PakProperty
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The passionate individuals driving innovation in Pakistan's property rental market
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
                  <div className="relative h-48 bg-gradient-to-br from-primary-500 to-secondary-500">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg">{member.name}</h3>
                      <p className="text-white/90 text-sm">{member.position}</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="teal" className="mb-6">
              Our Journey
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Key Milestones in Our Growth
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From a small startup to Pakistan's leading property rental platform
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px w-0.5 h-full bg-gradient-to-b from-primary-500 to-secondary-500"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Content */}
                  <div className="w-5/12 p-8">
                    <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 rounded-xl ${milestone.color} flex items-center justify-center mr-4 shadow-lg`}>
                            <milestone.icon className="text-white text-xl" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary-600">{milestone.year}</div>
                            <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="w-2/12 flex justify-center">
                    <div className="w-8 h-8 bg-white border-4 border-primary-500 rounded-full shadow-lg"></div>
                  </div>
                  
                  {/* Empty space for alignment */}
                  <div className="w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-700 text-white relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80')`
          }}
        ></div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/85 to-primary-700/80"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Join the PakProperty Community
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Whether you're looking to rent a property or list your own, we're here to help you 
              find the perfect match in Pakistan's property market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="accent"
                size="lg"
                asChild
                className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/register">
                  <FaArrowRight className="mr-2" />
                  Get Started Today
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-white text-white hover:bg-white hover:text-primary-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/contact">
                  Contact Our Team
                  <FaArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 