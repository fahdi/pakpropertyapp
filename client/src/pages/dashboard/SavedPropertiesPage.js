import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import { 
  FaHeart, 
  FaHeartBroken,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaEye,
  FaEnvelope,
  FaSearch,
  FaFilter,
  FaSort,
  FaTrash,
  FaShare
} from 'react-icons/fa';

const SavedPropertiesPage = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // Fetch saved properties
  const { data: savedProperties, isLoading, error } = useQuery(
    'savedProperties',
    async () => {
      const response = await api.get('/users/saved-properties');
      return response.data.data;
    },
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false
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
        setShowRemoveModal(false);
        setSelectedProperty(null);
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to remove property';
        toast.error(message);
      }
    }
  );

  // Handle remove confirmation
  const handleRemove = () => {
    if (selectedProperty) {
      removeFromSavedMutation.mutate(selectedProperty._id);
    }
  };

  // Handle share property
  const handleShare = (property) => {
    const shareUrl = `${window.location.origin}/properties/${property._id}`;
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Property link copied to clipboard');
    }
  };

  // Filter and sort properties
  const filteredAndSortedProperties = savedProperties
    ?.filter(property => {
      // Filter by status
      if (filter === 'all') return true;
      if (filter === 'available') return property.status === 'available';
      if (filter === 'rented') return property.status === 'rented';
      if (filter === 'featured') return property.isFeatured;
      return true;
    })
    ?.filter(property => {
      // Filter by search query
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        property.title?.toLowerCase().includes(query) ||
        property.location?.area?.toLowerCase().includes(query) ||
        property.location?.city?.toLowerCase().includes(query) ||
        property.description?.toLowerCase().includes(query)
      );
    })
    ?.sort((a, b) => {
      // Sort properties
      switch (sortBy) {
        case 'date':
          return new Date(b.savedAt || b.createdAt) - new Date(a.savedAt || a.createdAt);
        case 'price':
          return a.rent - b.rent;
        case 'price-desc':
          return b.rent - a.rent;
        case 'name':
          return (a.title || '').localeCompare(b.title || '');
        case 'location':
          return (a.location?.city || '').localeCompare(b.location?.city || '');
        default:
          return 0;
      }
    }) || [];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'rented':
        return 'bg-red-100 text-red-800';
      case 'under-maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'reserved':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-responsive">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-responsive">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Saved Properties</h2>
              <p className="text-gray-600 mb-4">Failed to load your saved properties. Please try again.</p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-responsive">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Saved Properties
                </h1>
                <p className="text-gray-600">
                  Your favorite properties for easy access and comparison
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-sm text-gray-600">
                  {savedProperties?.length || 0} saved properties
                </span>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search saved properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaFilter className="text-gray-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Properties</option>
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="featured">Featured</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <FaSort className="text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Date Saved</option>
                    <option value="price">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name</option>
                    <option value="location">Location</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          {filteredAndSortedProperties.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FaHeart className="text-6xl mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery || filter !== 'all' ? 'No Properties Found' : 'No Saved Properties'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || filter !== 'all' 
                  ? 'No saved properties match your search criteria.'
                  : 'You haven\'t saved any properties yet. Browse properties and save your favorites!'
                }
              </p>
              {!searchQuery && filter === 'all' && (
                <Link to="/properties" className="btn btn-primary">
                  Browse Properties
                </Link>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProperties.map((property) => (
                <div key={property._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Property Image */}
                  <div className="relative h-48 bg-gray-200">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images.find(img => img.isPrimary)?.url || property.images[0].url}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaHeart className="text-4xl" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {property.isFeatured && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <button
                        onClick={() => handleShare(property)}
                        className="p-1 rounded-full bg-white text-gray-600 hover:bg-blue-500 hover:text-white transition-colors"
                        title="Share property"
                      >
                        <FaShare className="w-3 h-3" />
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedProperty(property);
                          setShowRemoveModal(true);
                        }}
                        className="p-1 rounded-full bg-white text-gray-600 hover:bg-red-500 hover:text-white transition-colors"
                        title="Remove from saved"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.location.area}, {property.location.city}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {property.specifications.bedrooms > 0 && (
                          <div className="flex items-center">
                            <FaBed className="w-4 h-4 mr-1" />
                            <span>{property.specifications.bedrooms}</span>
                          </div>
                        )}
                        {property.specifications.bathrooms > 0 && (
                          <div className="flex items-center">
                            <FaBath className="w-4 h-4 mr-1" />
                            <span>{property.specifications.bathrooms}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <FaRulerCombined className="w-4 h-4 mr-1" />
                          <span>{property.area.size} {property.area.unit}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(property.rent)}
                        </p>
                        <p className="text-sm text-gray-600">per {property.rentType}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Link
                          to={`/properties/${property._id}`}
                          className="btn btn-outline btn-sm"
                        >
                          <FaEye className="mr-1" />
                          View Details
                        </Link>
                        
                        <Link
                          to={`/properties/${property._id}#contact`}
                          className="btn btn-primary btn-sm"
                        >
                          <FaEnvelope className="mr-1" />
                          Contact
                        </Link>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleShare(property)}
                          className="btn btn-outline btn-sm"
                        >
                          <FaShare className="mr-1" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {filteredAndSortedProperties.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    // TODO: Implement bulk inquiry feature
                    toast.info('Bulk inquiry feature coming soon!');
                  }}
                  className="btn btn-outline"
                >
                  <FaEnvelope className="mr-2" />
                  Inquire About All
                </button>
                
                <button
                  onClick={() => {
                    // TODO: Implement bulk remove feature
                    toast.info('Bulk remove feature coming soon!');
                  }}
                  className="btn btn-outline"
                >
                  <FaHeartBroken className="mr-2" />
                  Remove All
                </button>
                
                <Link
                  to="/properties"
                  className="btn btn-primary"
                >
                  Browse More Properties
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      {showRemoveModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Remove from Saved
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove "{selectedProperty.title}" from your saved properties?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                disabled={removeFromSavedMutation.isLoading}
                className="btn btn-danger"
              >
                {removeFromSavedMutation.isLoading ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPropertiesPage; 