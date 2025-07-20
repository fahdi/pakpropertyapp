import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaBed, 
  FaBath, 
  FaRulerCombined,
  FaHeart,
  FaFilter,
  FaSort,
  FaEye,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaTimes
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_LIMIT = 12;

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Get filters from URL params
  const getFiltersFromParams = () => {
    return {
      search: searchParams.get('search') || '',
      city: searchParams.get('city') || '',
      propertyType: searchParams.get('propertyType') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      bathrooms: searchParams.get('bathrooms') || '',
      furnishing: searchParams.get('furnishing') || '',
      amenities: searchParams.getAll('amenities') || [],
      page: parseInt(searchParams.get('page')) || 1,
      limit: parseInt(searchParams.get('limit')) || DEFAULT_LIMIT,
    };
  };

  const [filters, setFilters] = useState(getFiltersFromParams());

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Fetch properties with filters
  const { data: propertiesData, isLoading, error } = useQuery(
    ['properties', filters, sortBy],
    async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.set(key, value);
          }
        }
      });
      params.set('sort', sortBy);
      const response = await api.get(`/properties?${params.toString()}`);
      return response.data;
    },
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000 // 2 minutes
    }
  );

  const properties = propertiesData?.data || [];
  const totalProperties = propertiesData?.total || 0;
  const totalPages = propertiesData?.pagination?.pages || 1;
  const currentPage = propertiesData?.pagination?.page || 1;

  // Fetch saved properties to check which ones are saved
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

  // Handle save/unsave property
  const handleSaveProperty = (propertyId) => {
    if (!isAuthenticated) {
      toast.error('Please login to save properties');
      return;
    }

    const isSaved = savedProperties?.some(saved => saved._id === propertyId);
    
    if (isSaved) {
      removeFromSavedMutation.mutate(propertyId);
    } else {
      savePropertyMutation.mutate(propertyId);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page on filter change
    }));
  };

  // Handle amenity toggle
  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
      page: 1
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      furnishing: '',
      amenities: [],
      page: 1,
      limit: DEFAULT_LIMIT
    });
  };

  // Pagination handlers
  const goToPage = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };
  const goToPrev = () => {
    if (currentPage > 1) setFilters(prev => ({ ...prev, page: currentPage - 1 }));
  };
  const goToNext = () => {
    if (currentPage < totalPages) setFilters(prev => ({ ...prev, page: currentPage + 1 }));
  };

  // Property card component
  const PropertyCard = ({ property }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="relative h-48 bg-gray-200">
        {property.images?.[0] && (
          <img
            src={property.images[0].url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSaveProperty(property._id);
            }}
            disabled={savePropertyMutation.isLoading || removeFromSavedMutation.isLoading}
            className={`bg-white/80 hover:bg-white p-2 rounded-full transition-colors ${
              savedProperties?.some(saved => saved._id === property._id) 
                ? 'text-red-500' 
                : 'text-gray-600'
            }`}
            title={savedProperties?.some(saved => saved._id === property._id) ? 'Remove from saved' : 'Save property'}
          >
            <FaHeart className={savedProperties?.some(saved => saved._id === property._id) ? 'fill-current' : ''} />
          </button>
          <Link
            to={`/properties/${property._id}`}
            className="bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
          >
            <FaEye className="text-gray-600" />
          </Link>
        </div>
        {property.isFeatured && (
          <div className="absolute top-4 left-4 bg-accent-400 text-white px-2 py-1 rounded-full text-xs font-medium shadow-soft">
            Featured
          </div>
        )}
        {property.isVerified && (
          <div className="absolute bottom-4 left-4 bg-success-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-soft">
            Verified
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 min-w-0 mr-3">
            {property.title}
          </h3>
          <div className="text-lg font-bold text-primary-600 flex-shrink-0">
            PKR {property.rent?.toLocaleString()}
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <FaMapMarkerAlt className="mr-1 flex-shrink-0" />
          <span className="text-sm truncate">
            {property.location?.area}, {property.location?.city}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
          {property.specifications?.bedrooms && (
            <div className="flex items-center">
              <FaBed className="mr-1 flex-shrink-0" />
              <span>{property.specifications.bedrooms} Beds</span>
            </div>
          )}
          {property.specifications?.bathrooms && (
            <div className="flex items-center">
              <FaBath className="mr-1 flex-shrink-0" />
              <span>{property.specifications.bathrooms} Baths</span>
            </div>
          )}
          {property.area?.size && (
            <div className="flex items-center">
              <FaRulerCombined className="mr-1 flex-shrink-0" />
              <span className="truncate">{property.area.size} {property.area.unit}</span>
            </div>
          )}
        </div>
        
        {property.features?.furnishing && (
          <div className="mb-3">
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {property.features.furnishing}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <Link
            to={`/properties/${property._id}`}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View Details
          </Link>
          <div className="flex space-x-2">
            <button className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors">
              <FaWhatsapp />
            </button>
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
              <FaPhone />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Property list item component
  const PropertyListItem = ({ property }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative w-full lg:w-64 h-48 bg-gray-200 rounded-lg overflow-hidden">
          {property.images?.[0] && (
            <img
              src={property.images[0].url}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          )}
          {property.isFeatured && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {property.title}
              </h3>
              <div className="flex items-center text-gray-600 mb-3">
                <FaMapMarkerAlt className="mr-1" />
                <span>{property.location?.area}, {property.location?.city}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              PKR {property.rent?.toLocaleString()}
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
            {property.specifications?.bedrooms && (
              <div className="flex items-center">
                <FaBed className="mr-1" />
                <span>{property.specifications.bedrooms} Bedrooms</span>
              </div>
            )}
            {property.specifications?.bathrooms && (
              <div className="flex items-center">
                <FaBath className="mr-1" />
                <span>{property.specifications.bathrooms} Bathrooms</span>
              </div>
            )}
            {property.area?.size && (
              <div className="flex items-center">
                <FaRulerCombined className="mr-1" />
                <span>{property.area.size} {property.area.unit}</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-2">
            {property.shortDescription || property.description?.substring(0, 150)}...
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {property.features?.furnishing && (
                <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {property.features.furnishing}
                </span>
              )}
              {property.features?.condition && (
                <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {property.features.condition}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                to={`/properties/${property._id}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View Details
              </Link>
              <div className="flex space-x-2">
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                  <FaWhatsapp />
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                  <FaPhone />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-responsive py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Properties for Rent
          </h1>
          <p className="text-gray-600">
            Found {totalProperties} properties matching your criteria
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial</option>
                <option value="office">Office</option>
                <option value="shop">Shop</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FaFilter />
                <span>Filters</span>
              </button>
            </div>

            {/* Sort and View */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="size-desc">Largest First</option>
              </select>

              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Rent (PKR)
                    </label>
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Rent (PKR)
                    </label>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Furnishing
                    </label>
                    <select
                      value={filters.furnishing}
                      onChange={(e) => handleFilterChange('furnishing', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="unfurnished">Unfurnished</option>
                      <option value="semi-furnished">Semi-furnished</option>
                      <option value="fully-furnished">Fully furnished</option>
                    </select>
                  </div>
                </div>
                
                {/* Amenities */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['electricity', 'gas', 'water', 'internet', 'generator', 'airConditioning', 'security', 'parking'].map((amenity) => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="mr-2"
                        />
                        <span className="text-sm capitalize">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={clearFilters}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear All Filters
                  </button>
                  
                  <div className="text-sm text-gray-600">
                    {Object.values(filters).filter(v => v && (Array.isArray(v) ? v.length > 0 : true)).length} filters applied
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Properties Grid/List */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">Error loading properties</div>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg mb-4">No properties found matching your criteria</div>
            <button
              onClick={clearFilters}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            <AnimatePresence>
              {properties.map((property) => (
                <div key={property._id}>
                  {viewMode === 'grid' ? (
                    <PropertyCard property={property} />
                  ) : (
                    <PropertyListItem property={property} />
                  )}
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={goToPrev}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-2 border rounded-md ${
                    page === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                disabled={currentPage === totalPages}
                onClick={goToNext}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage; 