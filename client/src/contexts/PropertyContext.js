import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const PropertyContext = createContext();

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

export const PropertyProvider = ({ children }) => {
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    area: '',
    propertyType: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    furnishing: '',
    sort: 'date-desc',
    page: 1,
    limit: 12,
    search: ''
  });

  const [savedProperties, setSavedProperties] = useState([]);
  const queryClient = useQueryClient();

  // Fetch properties with filters
  const {
    data: propertiesData,
    isLoading: propertiesLoading,
    error: propertiesError,
    refetch: refetchProperties
  } = useQuery(
    ['properties', searchFilters],
    async () => {
      const params = new URLSearchParams();
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/properties?${params.toString()}`);
      return response.data;
    },
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch featured properties
  const {
    data: featuredProperties,
    isLoading: featuredLoading
  } = useQuery(
    'featured-properties',
    async () => {
      const response = await api.get('/properties/featured');
      return response.data;
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Fetch saved properties
  const {
    data: savedPropertiesData,
    isLoading: savedLoading,
    refetch: refetchSaved
  } = useQuery(
    'saved-properties',
    async () => {
      const response = await api.get('/users/saved-properties');
      return response.data;
    },
    {
      enabled: false, // Only fetch when user is authenticated
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  // Save property mutation
  const savePropertyMutation = useMutation(
    async (propertyId) => {
      const response = await api.post(`/users/saved-properties/${propertyId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('saved-properties');
        toast.success('Property saved successfully');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to save property';
        toast.error(message);
      }
    }
  );

  // Remove saved property mutation
  const removeSavedPropertyMutation = useMutation(
    async (propertyId) => {
      const response = await api.delete(`/users/saved-properties/${propertyId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('saved-properties');
        toast.success('Property removed from saved list');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to remove property';
        toast.error(message);
      }
    }
  );

  // Create property mutation
  const createPropertyMutation = useMutation(
    async (propertyData) => {
      const formData = new FormData();
      
      // Append property data
      Object.keys(propertyData).forEach(key => {
        if (key === 'images') {
          propertyData[key].forEach((image, index) => {
            formData.append('images', image);
            formData.append(`imageCaption${index}`, image.name || '');
          });
        } else if (typeof propertyData[key] === 'object') {
          formData.append(key, JSON.stringify(propertyData[key]));
        } else {
          formData.append(key, propertyData[key]);
        }
      });

      const response = await api.post('/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('properties');
        queryClient.invalidateQueries('my-properties');
        toast.success('Property created successfully');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to create property';
        toast.error(message);
      }
    }
  );

  // Update property mutation
  const updatePropertyMutation = useMutation(
    async ({ propertyId, propertyData }) => {
      const formData = new FormData();
      
      // Append property data
      Object.keys(propertyData).forEach(key => {
        if (key === 'images') {
          propertyData[key].forEach((image, index) => {
            if (image instanceof File) {
              formData.append('images', image);
              formData.append(`imageCaption${index}`, image.name || '');
            }
          });
        } else if (typeof propertyData[key] === 'object') {
          formData.append(key, JSON.stringify(propertyData[key]));
        } else {
          formData.append(key, propertyData[key]);
        }
      });

      const response = await api.put(`/properties/${propertyId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('properties');
        queryClient.invalidateQueries('my-properties');
        toast.success('Property updated successfully');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update property';
        toast.error(message);
      }
    }
  );

  // Delete property mutation
  const deletePropertyMutation = useMutation(
    async (propertyId) => {
      const response = await api.delete(`/properties/${propertyId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('properties');
        queryClient.invalidateQueries('my-properties');
        toast.success('Property deleted successfully');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to delete property';
        toast.error(message);
      }
    }
  );

  // Update search filters
  const updateFilters = (newFilters) => {
    setSearchFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setSearchFilters({
      city: '',
      area: '',
      propertyType: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      furnishing: '',
      sort: 'date-desc',
      page: 1,
      limit: 12,
      search: ''
    });
  };

  // Save property
  const saveProperty = (propertyId) => {
    savePropertyMutation.mutate(propertyId);
  };

  // Remove saved property
  const removeSavedProperty = (propertyId) => {
    removeSavedPropertyMutation.mutate(propertyId);
  };

  // Create property
  const createProperty = (propertyData) => {
    createPropertyMutation.mutate(propertyData);
  };

  // Update property
  const updateProperty = (propertyId, propertyData) => {
    updatePropertyMutation.mutate({ propertyId, propertyData });
  };

  // Delete property
  const deleteProperty = (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deletePropertyMutation.mutate(propertyId);
    }
  };

  // Check if property is saved
  const isPropertySaved = (propertyId) => {
    return savedPropertiesData?.data?.some(property => property._id === propertyId) || false;
  };

  const value = {
    // Properties data
    properties: propertiesData?.data || [],
    totalProperties: propertiesData?.total || 0,
    pagination: propertiesData?.pagination || {},
    propertiesLoading,
    propertiesError,
    
    // Featured properties
    featuredProperties: featuredProperties?.data || [],
    featuredLoading,
    
    // Saved properties
    savedProperties: savedPropertiesData?.data || [],
    savedLoading,
    
    // Filters
    searchFilters,
    updateFilters,
    resetFilters,
    
    // Mutations
    saveProperty,
    removeSavedProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    
    // Utilities
    isPropertySaved,
    refetchProperties,
    refetchSaved
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}; 