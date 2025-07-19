import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../utils/axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaBed, 
  FaBath, 
  FaRulerCombined,
  FaHeart,
  FaWhatsapp,
  FaPhone,
  FaShieldAlt,
  FaUsers,
  FaCheckCircle,
  FaArrowRight,
  FaPlay,
  FaAward,
  FaEye,
  FaStar,
  FaChartLine,
  FaKey,
  FaHandshake,
  FaLightbulb,
  FaRocket,
  FaCrown,
} from 'react-icons/fa';
import { FaDiamond } from 'react-icons/fa6';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    furnished: ''
  });

  // Fetch featured properties
  const { data: featuredProperties, isLoading } = useQuery(
    'featuredProperties',
    async () => {
      const response = await api.get('/properties/featured');
      return response.data.data;
    },
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false
    }
  );

  console.log('DEBUG featuredProperties:', featuredProperties);
  console.log('DEBUG isLoading:', isLoading);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    window.location.href = `/properties?${params.toString()}`;
  };

  // Stats data
  const stats = [
    { number: '10,000+', label: 'Properties Listed', icon: FaBed, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { number: '5,000+', label: 'Happy Tenants', icon: FaUsers, color: 'text-green-600', bgColor: 'bg-green-50' },
    { number: '500+', label: 'Verified Agents', icon: FaShieldAlt, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { number: '15+', label: 'Cities Covered', icon: FaMapMarkerAlt, color: 'text-orange-600', bgColor: 'bg-orange-50' }
  ];

  // Features data
  const features = [
    {
      icon: FaSearch,
      title: 'Smart Search',
      description: 'AI-powered search with filters for location, price, amenities, and more',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      iconColor: 'text-white',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: FaShieldAlt,
      title: 'Verified Properties',
      description: '100% verified listings with property inspections and legal checks',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      iconColor: 'text-white',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: FaRocket,
      title: 'Instant Booking',
      description: 'Book properties instantly with our secure payment system',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      iconColor: 'text-white',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: FaHandshake,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your property needs',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      iconColor: 'text-white',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      icon: FaChartLine,
      title: 'Market Insights',
      description: 'Real-time market data and property price trends',
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      iconColor: 'text-white',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      icon: FaLightbulb,
      title: 'Smart Recommendations',
      description: 'Personalized property suggestions based on your preferences',
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      iconColor: 'text-white',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ];

  // Premium services data
  const premiumServices = [
    {
      icon: FaCrown,
      title: 'VIP Property Tours',
      description: 'Exclusive guided tours with our property experts',
      features: ['Personal property consultant', 'Flexible scheduling', 'Detailed property analysis'],
      price: 'PKR 5,000',
      color: 'from-yellow-400 to-yellow-500'
    },
    {
      icon: FaDiamond,
      title: 'Premium Listings',
      description: 'Get your property featured on top search results',
      features: ['Priority placement', 'Enhanced visuals', 'Verified badge'],
      price: 'PKR 15,000',
      color: 'from-purple-400 to-purple-500'
    },
    {
      icon: FaKey,
      title: 'Concierge Service',
      description: 'End-to-end assistance for property transactions',
      features: ['Legal documentation', 'Move-in assistance', 'Utility connections'],
      price: 'PKR 25,000',
      color: 'from-blue-400 to-blue-500'
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: 'Ahmed Khan',
      role: 'Tenant',
      city: 'Karachi',
      content: 'Found my perfect apartment in just 2 days! The verification process gave me peace of mind.',
      rating: 5,
      avatar: 'AK'
    },
    {
      name: 'Sarah Ahmed',
      role: 'Property Owner',
      city: 'Lahore',
      content: 'Listing my property was so easy. I got multiple inquiries within the first week.',
      rating: 5,
      avatar: 'SA'
    },
    {
      name: 'Usman Ali',
      role: 'Agent',
      city: 'Islamabad',
      content: 'Best platform for property management. The tools and support are excellent.',
      rating: 5,
      avatar: 'UA'
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
            backgroundImage: `url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        ></div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/85 to-primary-700/80"></div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 shadow-lg"
              >
                <FaAward className="mr-3 text-accent-400 text-lg" />
                Pakistan's #1 Property Platform
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
              >
                Find Your Perfect
                <span className="block bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 bg-clip-text text-transparent">
                  Rental Property
                </span>
                in Pakistan
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg sm:text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-3xl"
              >
                Discover thousands of verified rental properties across Pakistan. 
                From modern apartments in Karachi to luxury villas in Lahore, 
                find your ideal home with confidence.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  variant="warning"
                  size="lg"
                  className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <FaPlay className="mr-2" />
                  Watch Demo
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-900 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Browse Properties
                  <FaArrowRight className="ml-2" />
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Search Form */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 lg:p-10 border border-white/20 shadow-2xl">
                <h3 className="text-2xl lg:text-3xl font-bold mb-8 text-center">Find Your Home</h3>
                <form onSubmit={handleSearch} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        City
                      </label>
                      <select
                        value={searchFilters.city}
                        onChange={(e) => setSearchFilters({...searchFilters, city: e.target.value})}
                        className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 shadow-lg"
                      >
                        <option value="">All Cities</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Lahore">Lahore</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                        <option value="Faisalabad">Faisalabad</option>
                        <option value="Multan">Multan</option>
                        <option value="Peshawar">Peshawar</option>
                        <option value="Quetta">Quetta</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Property Type
                      </label>
                      <select
                        value={searchFilters.propertyType}
                        onChange={(e) => setSearchFilters({...searchFilters, propertyType: e.target.value})}
                        className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 shadow-lg"
                      >
                        <option value="">All Types</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="villa">Villa</option>
                        <option value="commercial">Commercial</option>
                        <option value="office">Office</option>
                        <option value="shop">Shop</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Min Rent (PKR)
                      </label>
                      <input
                        type="number"
                        placeholder="Min"
                        value={searchFilters.minPrice}
                        onChange={(e) => setSearchFilters({...searchFilters, minPrice: e.target.value})}
                        className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 shadow-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Max Rent (PKR)
                      </label>
                      <input
                        type="number"
                        placeholder="Max"
                        value={searchFilters.maxPrice}
                        onChange={(e) => setSearchFilters({...searchFilters, maxPrice: e.target.value})}
                        className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 shadow-lg"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Furnished
                      </label>
                      <select
                        value={searchFilters.furnished || ''}
                        onChange={(e) => setSearchFilters({...searchFilters, furnished: e.target.value})}
                        className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 shadow-lg"
                      >
                        <option value="">Any</option>
                        <option value="furnished">Furnished</option>
                        <option value="unfurnished">Unfurnished</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    variant="warning"
                    size="lg"
                    className="w-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <FaSearch className="mr-2" />
                    Search Properties
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-extrabold text-primary-500 mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-2xl text-neutral-400 max-w-3xl mx-auto">
              Join the growing community of satisfied users who found their perfect home
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 ${stat.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className={`text-3xl ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <hr className="my-12 border-t-2 border-gray-200 w-3/4 mx-auto" />

      {/* Featured Properties Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover handpicked properties that match your lifestyle and preferences
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties?.slice(0, 6).map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <div className="h-48 bg-primary-500 relative flex items-center justify-center">
                        {property.images && property.images.length > 0 && property.images[0] ? (
                          <img
                            src={property.images[0].url}
                            alt={property.title}
                            loading="lazy"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'flex';
                              }
                            }}
                          />
                        ) : (
                          <span className="text-white text-5xl font-bold">{property.title?.charAt(0) || 'P'}</span>
                        )}
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="success" className="text-xs bg-accent-400 text-neutral-900">
                          {property.propertyType}
                        </Badge>
                      </div>
                      <div className="absolute top-4 left-4">
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                          <FaHeart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {property.title}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-3">
                            <FaMapMarkerAlt className="mr-2 text-blue-500" />
                            <span>{property.location?.city}, {property.location?.area}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-accent-400">
                            PKR {property.price?.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">per month</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        {property.specifications?.bedrooms && (
                          <div className="flex items-center">
                            <FaBed className="mr-2 text-blue-500" />
                            <span className="font-medium">{property.specifications.bedrooms} Beds</span>
                          </div>
                        )}
                        {property.specifications?.bathrooms && (
                          <div className="flex items-center">
                            <FaBath className="mr-2 text-blue-500" />
                            <span className="font-medium">{property.specifications.bathrooms} Baths</span>
                          </div>
                        )}
                        {property.area?.size && (
                          <div className="flex items-center">
                            <FaRulerCombined className="mr-2 text-blue-500" />
                            <span className="font-medium">{property.area.size} {property.area.unit}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/properties/${property._id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
                          aria-label={`View details for ${property.title}`}
                        >
                          View Details
                          <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <div className="flex space-x-2">
                          <button className="p-3 text-green-600 hover:bg-green-50 rounded-full transition-colors" aria-label="Contact via WhatsApp">
                            <FaWhatsapp />
                          </button>
                          <button className="p-3 text-blue-600 hover:bg-blue-50 rounded-full transition-colors" aria-label="Contact via Phone">
                            <FaPhone />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              variant="accent"
              size="lg"
              asChild
              className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link to="/properties">
                View All Properties
                <FaArrowRight className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      <hr className="my-12 border-t-2 border-gray-200 w-3/4 mx-auto" />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-primary-500 mb-6">
              Why Choose PakProperty?
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Experience the future of property rental with our cutting-edge features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className={`relative overflow-hidden rounded-2xl border-2 ${feature.borderColor} ${feature.bgColor} p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full`}>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className={`text-2xl ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <hr className="my-12 border-t-2 border-gray-200 w-3/4 mx-auto" />

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Renting a property is easy with PakProperty. Just follow these simple steps:
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <FaSearch className="text-4xl text-primary-500 mb-4 mx-auto" />
              <h3 className="text-xl font-bold mb-2">1. Search</h3>
              <p className="text-gray-600">Browse thousands of verified properties using smart filters.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <FaHandshake className="text-4xl text-primary-500 mb-4 mx-auto" />
              <h3 className="text-xl font-bold mb-2">2. Connect</h3>
              <p className="text-gray-600">Contact property owners or agents directly and schedule visits.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <FaKey className="text-4xl text-primary-500 mb-4 mx-auto" />
              <h3 className="text-xl font-bold mb-2">3. Move In</h3>
              <p className="text-gray-600">Complete the paperwork and move into your new home with ease.</p>
            </div>
          </div>
        </div>
      </section>
      <hr className="my-12 border-t-2 border-gray-200 w-3/4 mx-auto" />

      {/* Newsletter Signup Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Stay Updated!</h2>
          <p className="text-lg text-gray-600 mb-6">Subscribe to our newsletter for the latest property listings and market insights.</p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg w-full sm:w-auto"
              aria-label="Email address"
              required
            />
            <Button type="submit" variant="default" size="lg">Subscribe</Button>
          </form>
        </div>
      </section>
      <hr className="my-12 border-t-2 border-gray-200 w-3/4 mx-auto" />

      {/* Premium Services Section */}
      <section className="py-20 bg-neutral-50 text-neutral-900 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80')`
          }}
        ></div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/80 via-neutral-800/70 to-neutral-700/60"></div>
        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30 shadow-lg mb-6 text-white">
                              <FaCrown className="mr-3 text-accent-400 text-lg" />
                Premium Services
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Elevated Property Experience
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
              Take your property journey to the next level with our exclusive premium services
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {premiumServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:-translate-y-2 h-full">
                  <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${service.color} rounded-t-2xl`}></div>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 bg-gradient-to-r ${service.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <service.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-accent-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-white mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-white">
                        <FaCheckCircle className="mr-3 text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-accent-400">
                      {service.price}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <hr className="my-12 border-t-2 border-gray-200 w-3/4 mx-auto" />

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied users who found their perfect home through PakProperty
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-lg" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-8 leading-relaxed text-lg italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                        <span className="text-white font-bold text-xl">
                          {testimonial.avatar}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role} • {testimonial.city}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <hr className="my-12 border-t-2 border-gray-200 w-3/4 mx-auto" />

      {/* CTA Section */}
      <section className="py-20 bg-primary-700 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Ready to Find Your Perfect Home?
            </h2>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Join thousands of satisfied tenants who found their ideal rental property 
              through PakProperty. Start your journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="accent"
                size="lg"
                asChild
                className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/register">
                  Get Started Today
                  <FaArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button
                variant="default"
                size="lg"
                asChild
                className="border-white text-white hover:bg-white hover:text-blue-900 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/properties">
                  Browse Properties
                  <FaEye className="ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 