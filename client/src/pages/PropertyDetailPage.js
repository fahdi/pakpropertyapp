import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axios';
import { 
  FaMapMarkerAlt, 
  FaBed, 
  FaBath, 
  FaRulerCombined,
  FaHeart,
  FaShare,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaCalendar,
  FaClock,
  FaCheck,
  FaTimes,
  FaStar,
  FaEye,
  FaPrint,
  FaDownload,
  FaCamera,
  FaVideo,
  FaBuilding,
  FaShieldAlt,
  FaUsers,
  FaCar,
  FaWifi,
  FaSnowflake,
  FaLightbulb,
  FaLock,
  FaLeaf,
  FaHome,
  FaStore,
  FaHospital,
  FaGraduationCap,
  FaMosque
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activeImage, setActiveImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredContact: 'phone',
    scheduleViewing: false,
    viewingDate: '',
    viewingTime: ''
  });

  // Fetch property details
  const { data: property, isLoading, error } = useQuery(
    ['property', id],
    async () => {
      const response = await api.get(`/properties/${id}`);
      return response.data.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
    }
  );

  // Fetch related properties
  const { data: relatedProperties } = useQuery(
    ['relatedProperties', property?.location?.city, property?.propertyType],
    async () => {
      if (!property) return [];
      const response = await api.get(`/properties/related/${id}`);
      return response.data.data;
    },
    {
      enabled: !!property,
      staleTime: 5 * 60 * 1000
    }
  );

  // Check if property is saved
  const { data: savedProperties } = useQuery(
    'savedProperties',
    async () => {
      if (!isAuthenticated) return [];
      const response = await api.get('/users/saved-properties');
      return response.data.data;
    },
    {
      enabled: isAuthenticated,
      staleTime: 5 * 60 * 1000
    }
  );

  // Save property mutation
  const savePropertyMutation = useMutation(
    async (propertyId) => {
      await api.post(`/users/saved-properties/${propertyId}`);
    },
    {
      onSuccess: () => {
        toast.success('Property saved successfully!');
        queryClient.invalidateQueries('savedProperties');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to save property';
        toast.error(message);
      }
    }
  );

  // Remove from saved properties mutation
  const removeFromSavedMutation = useMutation(
    async (propertyId) => {
      await api.delete(`/users/saved-properties/${propertyId}`);
    },
    {
      onSuccess: () => {
        toast.success('Property removed from saved list');
        queryClient.invalidateQueries('savedProperties');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to remove property';
        toast.error(message);
      }
    }
  );

  // Check if current property is saved
  const isPropertySaved = savedProperties?.some(saved => saved._id === id);

  // Handle save/unsave property
  const handleSaveProperty = () => {
    if (!isAuthenticated) {
      toast.error('Please login to save properties');
      return;
    }

    if (isPropertySaved) {
      removeFromSavedMutation.mutate(id);
    } else {
      savePropertyMutation.mutate(id);
    }
  };

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to send inquiries');
      return;
    }

    try {
      await api.post('/inquiries', {
        property: id,
        ...contactForm
      });
      
      toast.success('Inquiry sent successfully!');
      setShowContactForm(false);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        message: '',
        preferredContact: 'phone',
        scheduleViewing: false,
        viewingDate: '',
        viewingTime: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send inquiry');
    }
  };

  // Handle form field changes
  const handleFormChange = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Format amenities for display
  const getAmenitiesList = () => {
    if (!property?.amenities) return [];
    
    const amenities = [];
    Object.entries(property.amenities).forEach(([key, value]) => {
      if (value) {
        amenities.push({
          key,
          label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          icon: getAmenityIcon(key)
        });
      }
    });
    
    return amenities;
  };

  // Get amenity icon
  const getAmenityIcon = (amenity) => {
    const iconMap = {
      electricity: FaLightbulb,
      gas: FaHome,
      water: FaHome,
      internet: FaWifi,
      generator: FaHome,
      backup: FaHome,
      airConditioning: FaSnowflake,
      heating: FaHome,
      elevator: FaBuilding,
      security: FaShieldAlt,
      cctv: FaEye,
      guard: FaUsers,
      garden: FaLeaf,
      balcony: FaHome,
      terrace: FaHome,
      basement: FaHome,
      store: FaStore,
      servantQuarter: FaHome,
      mosque: FaMosque,
      school: FaGraduationCap,
      hospital: FaHospital,
      market: FaStore,
      transport: FaCar,
      parking: FaCar
    };
    
    return iconMap[amenity] || FaHome;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-responsive py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-responsive py-8">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">Property not found</div>
            <Link to="/properties" className="btn btn-primary">
              Back to Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const amenities = getAmenitiesList();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-responsive py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li><Link to="/properties" className="hover:text-blue-600">Properties</Link></li>
            <li>/</li>
            <li className="text-gray-900">{property.title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="relative h-96 lg:h-[500px] bg-gray-200">
                {property.images?.[activeImage] && (
                  <img
                    src={property.images[activeImage].url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Image Navigation */}
                {property.images?.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage(Math.max(0, activeImage - 1))}
                      disabled={activeImage === 0}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setActiveImage(Math.min(property.images.length - 1, activeImage + 1))}
                      disabled={activeImage === property.images.length - 1}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                
                {/* Image Indicators */}
                {property.images?.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === activeImage ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {property.images?.length > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                          index === activeImage ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`${property.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Information */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{property.location?.area}, {property.location?.city}</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    PKR {property.rent?.toLocaleString()}
                    <span className="text-lg font-normal text-gray-600">/{property.rentType}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={handleSaveProperty}
                    disabled={savePropertyMutation.isLoading || removeFromSavedMutation.isLoading}
                    className={`p-3 rounded-full transition-colors ${
                      isPropertySaved 
                        ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    title={isPropertySaved ? 'Remove from saved' : 'Save property'}
                  >
                    <FaHeart className={isPropertySaved ? 'fill-current' : ''} />
                  </button>
                  <button className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <FaShare />
                  </button>
                  <button className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <FaPrint />
                  </button>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {property.specifications?.bedrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FaBed className="text-2xl text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold">{property.specifications.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                )}
                {property.specifications?.bathrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FaBath className="text-2xl text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold">{property.specifications.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                )}
                {property.area?.size && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FaRulerCombined className="text-2xl text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold">{property.area.size}</div>
                    <div className="text-sm text-gray-600">{property.area.unit}</div>
                  </div>
                )}
                {property.specifications?.parkingSpaces && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FaCar className="text-2xl text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold">{property.specifications.parkingSpaces}</div>
                    <div className="text-sm text-gray-600">Parking</div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Property Features */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Features</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Type:</span>
                        <span className="font-medium capitalize">{property.propertyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium capitalize">{property.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Furnishing:</span>
                        <span className="font-medium capitalize">{property.features?.furnishing}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Condition:</span>
                        <span className="font-medium capitalize">{property.features?.condition}</span>
                      </div>
                      {property.features?.age && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Age:</span>
                          <span className="font-medium">{property.features.age} years</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Pricing Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rent:</span>
                        <span className="font-medium">PKR {property.rent?.toLocaleString()}</span>
                      </div>
                      {property.securityDeposit && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Security Deposit:</span>
                          <span className="font-medium">PKR {property.securityDeposit?.toLocaleString()}</span>
                        </div>
                      )}
                      {property.advanceRent && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Advance Rent:</span>
                          <span className="font-medium">PKR {property.advanceRent?.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available From:</span>
                        <span className="font-medium">
                          {new Date(property.availableFrom).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {amenities.map((amenity) => (
                      <div key={amenity.key} className="flex items-center space-x-3">
                        <amenity.icon className="text-green-600" />
                        <span className="text-gray-700">{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              {property.terms && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        {property.terms.petsAllowed ? <FaCheck className="text-green-600" /> : <FaTimes className="text-red-600" />}
                        <span>Pets Allowed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {property.terms.smokingAllowed ? <FaCheck className="text-green-600" /> : <FaTimes className="text-red-600" />}
                        <span>Smoking Allowed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {property.terms.familyOnly ? <FaCheck className="text-green-600" /> : <FaTimes className="text-red-600" />}
                        <span>Family Only</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {property.terms.bachelorAllowed ? <FaCheck className="text-green-600" /> : <FaTimes className="text-red-600" />}
                        <span>Bachelors Allowed</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm">
                        <span className="text-gray-600">Minimum Lease:</span>
                        <span className="font-medium ml-2">{property.terms.minimumLease} months</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Related Properties */}
            {relatedProperties?.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Similar Properties</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProperties.slice(0, 3).map((relatedProperty) => (
                    <Link
                      key={relatedProperty._id}
                      to={`/properties/${relatedProperty._id}`}
                      className="block bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="h-32 bg-gray-200">
                        {relatedProperty.images?.[0] && (
                          <img
                            src={relatedProperty.images[0].url}
                            alt={relatedProperty.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 truncate">
                          {relatedProperty.title}
                        </h4>
                        <div className="text-sm text-gray-600 mb-2">
                          {relatedProperty.location?.area}, {relatedProperty.location?.city}
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          PKR {relatedProperty.rent?.toLocaleString()}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Owner</h3>
              
              {property.contactInfo && (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-gray-400" />
                    <span className="text-gray-700">{property.contactInfo.name}</span>
                  </div>
                  
                  {property.contactInfo.phone && (
                    <div className="flex items-center space-x-3">
                      <FaPhone className="text-gray-400" />
                      <a href={`tel:${property.contactInfo.phone}`} className="text-blue-600 hover:text-blue-700">
                        {property.contactInfo.phone}
                      </a>
                    </div>
                  )}
                  
                  {property.contactInfo.email && (
                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="text-gray-400" />
                      <a href={`mailto:${property.contactInfo.email}`} className="text-blue-600 hover:text-blue-700">
                        {property.contactInfo.email}
                      </a>
                    </div>
                  )}
                  
                  {property.contactInfo.whatsapp && (
                    <div className="flex items-center space-x-3">
                      <FaWhatsapp className="text-gray-400" />
                      <a href={`https://wa.me/${property.contactInfo.whatsapp}`} className="text-green-600 hover:text-green-700">
                        WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Send Inquiry
                </button>
                
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium">
                  <FaWhatsapp className="inline mr-2" />
                  WhatsApp
                </button>
                
                <button className="w-full bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors font-medium">
                  <FaPhone className="inline mr-2" />
                  Call Now
                </button>
              </div>
            </div>

            {/* Property Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium">{property.views || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Inquiries</span>
                  <span className="font-medium">{property.inquiries || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saved</span>
                  <span className="font-medium">{property.savedCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-medium">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        <AnimatePresence>
          {showContactForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Send Inquiry</h3>
                    <button
                      onClick={() => setShowContactForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactForm.phone}
                        onChange={(e) => handleFormChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Contact Method
                      </label>
                      <select
                        value={contactForm.preferredContact}
                        onChange={(e) => handleFormChange('preferredContact', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="phone">Phone</option>
                        <option value="email">Email</option>
                        <option value="whatsapp">WhatsApp</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        rows="4"
                        value={contactForm.message}
                        onChange={(e) => handleFormChange('message', e.target.value)}
                        placeholder="Tell us about your requirements..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="scheduleViewing"
                        checked={contactForm.scheduleViewing}
                        onChange={(e) => handleFormChange('scheduleViewing', e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="scheduleViewing" className="text-sm text-gray-700">
                        Schedule a viewing
                      </label>
                    </div>
                    
                    {contactForm.scheduleViewing && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            value={contactForm.viewingDate}
                            onChange={(e) => handleFormChange('viewingDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time
                          </label>
                          <input
                            type="time"
                            value={contactForm.viewingTime}
                            onChange={(e) => handleFormChange('viewingTime', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Send Inquiry
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PropertyDetailPage; 