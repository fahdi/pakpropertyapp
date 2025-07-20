import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaEyeSlash,
  FaStar,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaChartLine
} from 'react-icons/fa';

const MyPropertiesPage = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filter, setFilter] = useState('all');

  // Fetch user's properties
  const { data: properties, isLoading, error } = useQuery(
    'userProperties',
    async () => {
      const response = await api.get('/properties/my-properties');
      return response.data.data;
    },
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false
    }
  );

  // Delete property mutation
  const deletePropertyMutation = useMutation(
    async (propertyId) => {
      await api.delete(`/properties/${propertyId}`);
    },
    {
      onSuccess: () => {
        toast.success('Property deleted successfully');
        queryClient.invalidateQueries('userProperties');
        setShowDeleteModal(false);
        setSelectedProperty(null);
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to delete property';
        toast.error(message);
      }
    }
  );

  // Toggle property status mutation
  const toggleStatusMutation = useMutation(
    async ({ propertyId, status }) => {
      await api.patch(`/properties/${propertyId}/status`, { status });
    },
    {
      onSuccess: () => {
        toast.success('Property status updated successfully');
        queryClient.invalidateQueries('userProperties');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update status';
        toast.error(message);
      }
    }
  );

  // Toggle featured status mutation
  const toggleFeaturedMutation = useMutation(
    async ({ propertyId, isFeatured }) => {
      await api.patch(`/properties/${propertyId}/featured`, { isFeatured });
    },
    {
      onSuccess: () => {
        toast.success('Featured status updated successfully');
        queryClient.invalidateQueries('userProperties');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update featured status';
        toast.error(message);
      }
    }
  );

  // Handle delete confirmation
  const handleDelete = () => {
    if (selectedProperty) {
      deletePropertyMutation.mutate(selectedProperty._id);
    }
  };

  // Handle status toggle
  const handleStatusToggle = (property) => {
    const newStatus = property.status === 'available' ? 'rented' : 'available';
    toggleStatusMutation.mutate({ propertyId: property._id, status: newStatus });
  };

  // Handle featured toggle
  const handleFeaturedToggle = (property) => {
    toggleFeaturedMutation.mutate({ 
      propertyId: property._id, 
      isFeatured: !property.isFeatured 
    });
  };

  // Filter properties
  const filteredProperties = properties?.filter(property => {
    if (filter === 'all') return true;
    if (filter === 'available') return property.status === 'available';
    if (filter === 'rented') return property.status === 'rented';
    if (filter === 'featured') return property.isFeatured;
    return true;
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
      <div className="min-h-screen bg-gray-50 pt-24 lg:pt-28 pb-8">
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
      <div className="min-h-screen bg-gray-50 pt-24 lg:pt-28 pb-8">
        <div className="container-responsive">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Properties</h2>
              <p className="text-gray-600 mb-4">Failed to load your properties. Please try again.</p>
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
    <div className="min-h-screen bg-gray-50 pt-24 lg:pt-28 pb-8">
      <div className="container-responsive">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  My Properties
                </h1>
                <p className="text-gray-600">
                  Manage your property listings and track their performance
                </p>
              </div>
              <Link
                to="/dashboard/add-property"
                className="btn btn-primary mt-4 md:mt-0"
              >
                <FaPlus className="mr-2" />
                Add New Property
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaChartLine className="text-blue-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{properties?.length || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaEye className="text-green-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {properties?.filter(p => p.status === 'available').length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <FaEyeSlash className="text-red-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rented</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {properties?.filter(p => p.status === 'rented').length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FaStar className="text-yellow-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {properties?.filter(p => p.isFeatured).length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Properties ({properties?.length || 0})
              </button>
              <button
                onClick={() => setFilter('available')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'available'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Available ({properties?.filter(p => p.status === 'available').length || 0})
              </button>
              <button
                onClick={() => setFilter('rented')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'rented'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rented ({properties?.filter(p => p.status === 'rented').length || 0})
              </button>
              <button
                onClick={() => setFilter('featured')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'featured'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Featured ({properties?.filter(p => p.isFeatured).length || 0})
              </button>
            </div>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FaChartLine className="text-6xl mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No Properties Found' : `No ${filter} Properties`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'You haven\'t added any properties yet. Start by adding your first property listing.'
                  : `You don't have any ${filter} properties at the moment.`
                }
              </p>
              {filter === 'all' && (
                <Link to="/dashboard/add-property" className="btn btn-primary">
                  <FaPlus className="mr-2" />
                  Add Your First Property
                </Link>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
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
                        <FaChartLine className="text-4xl" />
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
                        onClick={() => handleFeaturedToggle(property)}
                        className={`p-1 rounded-full ${
                          property.isFeatured 
                            ? 'bg-yellow-500 text-white' 
                            : 'bg-white text-gray-600 hover:bg-yellow-500 hover:text-white border border-gray-300'
                        } transition-colors`}
                        title={property.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        <FaStar className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <FaMapMarkerAlt className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="text-sm truncate">{property.location.area}, {property.location.city}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {property.specifications.bedrooms > 0 && (
                          <div className="flex items-center">
                            <FaBed className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span>{property.specifications.bedrooms}</span>
                          </div>
                        )}
                        {property.specifications.bathrooms > 0 && (
                          <div className="flex items-center">
                            <FaBath className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span>{property.specifications.bathrooms}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <FaRulerCombined className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{property.area.size} {property.area.unit}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-xl font-bold text-gray-900 truncate">
                            {formatCurrency(property.rent)}
                          </p>
                          <p className="text-sm text-gray-600">per {property.rentType}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/properties/${property._id}`}
                          className="btn btn-outline btn-sm flex-1 mr-2"
                        >
                          <FaEye className="mr-1" />
                          View
                        </Link>
                        <Link
                          to={`/dashboard/edit-property/${property._id}`}
                          className="btn btn-outline btn-sm flex-1"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </Link>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleStatusToggle(property)}
                          className={`btn btn-sm flex-1 mr-2 ${
                            property.status === 'available' 
                              ? 'btn-outline' 
                              : 'btn-primary'
                          }`}
                        >
                          {property.status === 'available' ? 'Mark Rented' : 'Mark Available'}
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowDeleteModal(true);
                          }}
                          className="btn btn-danger btn-sm flex-1"
                        >
                          <FaTrash className="mr-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Property
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedProperty?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deletePropertyMutation.isLoading}
                className="btn btn-danger"
              >
                {deletePropertyMutation.isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPropertiesPage; 