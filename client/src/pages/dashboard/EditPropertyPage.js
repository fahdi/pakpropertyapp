import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import { 
  FaUpload, 
  FaMapMarkerAlt, 
  FaBed, 
  FaRulerCombined,
  FaSave,
  FaTimes,
  FaStar,
  FaSpinner,
  FaTrash
} from 'react-icons/fa';

const EditPropertyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    propertyType: '',
    category: '',
    rent: '',
    rentType: 'monthly',
    currency: 'PKR',
    securityDeposit: '',
    advanceRent: '',
    address: '',
    city: '',
    area: '',
    sector: '',
    town: '',
    block: '',
    street: '',
    postalCode: '',
    bedrooms: '',
    bathrooms: '',
    kitchens: '1',
    drawingRooms: '1',
    servantQuarters: '0',
    parkingSpaces: '0',
    size: '',
    unit: 'sqft',
    coveredArea: '',
    coveredAreaUnit: 'sqft',
    furnishing: 'unfurnished',
    condition: 'good',
    age: '',
    floor: '',
    totalFloors: '',
    availableFrom: '',
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  });

  const [amenities, setAmenities] = useState({
    electricity: true,
    gas: true,
    water: true,
    internet: false,
    generator: false,
    backup: false,
    airConditioning: false,
    heating: false,
    elevator: false,
    security: false,
    cctv: false,
    guard: false,
    garden: false,
    balcony: false,
    terrace: false,
    basement: false,
    store: false,
    servantQuarter: false,
    mosque: false,
    school: false,
    hospital: false,
    market: false,
    transport: false
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch property data
  const { isLoading: fetchingProperty, error } = useQuery(
    ['property', id],
    async () => {
      const response = await api.get(`/properties/${id}`);
      return response.data.data;
    },
    {
      enabled: !!id,
      onSuccess: (data) => {
        // Check if user owns this property
        if (data.owner._id !== user._id && data.agent?._id !== user._id) {
          toast.error('You are not authorized to edit this property');
          navigate('/my-properties');
          return;
        }

        // Populate form data
        setFormData({
          title: data.title || '',
          description: data.description || '',
          shortDescription: data.shortDescription || '',
          propertyType: data.propertyType || '',
          category: data.category || '',
          rent: data.rent || '',
          rentType: data.rentType || 'monthly',
          currency: data.currency || 'PKR',
          securityDeposit: data.securityDeposit || '',
          advanceRent: data.advanceRent || '',
          address: data.location?.address || '',
          city: data.location?.city || '',
          area: data.location?.area || '',
          sector: data.location?.sector || '',
          town: data.location?.town || '',
          block: data.location?.block || '',
          street: data.location?.street || '',
          postalCode: data.location?.postalCode || '',
          bedrooms: data.specifications?.bedrooms || '',
          bathrooms: data.specifications?.bathrooms || '',
          kitchens: data.specifications?.kitchens || '1',
          drawingRooms: data.specifications?.drawingRooms || '1',
          servantQuarters: data.specifications?.servantQuarters || '0',
          parkingSpaces: data.specifications?.parkingSpaces || '0',
          size: data.area?.size || '',
          unit: data.area?.unit || 'sqft',
          coveredArea: data.area?.coveredArea || '',
          coveredAreaUnit: data.area?.coveredAreaUnit || 'sqft',
          furnishing: data.features?.furnishing || 'unfurnished',
          condition: data.features?.condition || 'good',
          age: data.features?.age || '',
          floor: data.features?.floor || '',
          totalFloors: data.features?.totalFloors || '',
          availableFrom: data.availableFrom ? new Date(data.availableFrom).toISOString().split('T')[0] : '',
          contactName: data.contactInfo?.name || '',
          contactPhone: data.contactInfo?.phone || '',
          contactEmail: data.contactInfo?.email || ''
        });

        setAmenities(data.amenities || {
          electricity: true,
          gas: true,
          water: true,
          internet: false,
          generator: false,
          backup: false,
          airConditioning: false,
          heating: false,
          elevator: false,
          security: false,
          cctv: false,
          guard: false,
          garden: false,
          balcony: false,
          terrace: false,
          basement: false,
          store: false,
          servantQuarter: false,
          mosque: false,
          school: false,
          hospital: false,
          market: false,
          transport: false
        });

        setImages(data.images || []);
        setLoading(false);
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to load property';
        toast.error(message);
        navigate('/my-properties');
      }
    }
  );

  // Update property mutation
  const updatePropertyMutation = useMutation(
    async (propertyData) => {
      const response = await api.put(`/properties/${id}`, propertyData);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Property updated successfully!');
        queryClient.invalidateQueries(['property', id]);
        queryClient.invalidateQueries('userProperties');
        navigate('/my-properties');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update property';
        toast.error(message);
      }
    }
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle amenities changes
  const handleAmenityChange = (amenity) => {
    setAmenities(prev => ({
      ...prev,
      [amenity]: !prev[amenity]
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await api.post('/properties/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        return response.data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);
      toast.success('Images uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Set primary image
  const setPrimaryImage = (index) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isPrimary: i === index
    })));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    const propertyData = {
      ...formData,
      amenities,
      images: images.map((image, index) => ({
        url: typeof image === 'string' ? image : image.url,
        isPrimary: typeof image === 'string' ? index === 0 : image.isPrimary,
        order: index
      })),
      contactInfo: {
        name: formData.contactName || user.fullName,
        phone: formData.contactPhone || user.phone,
        email: formData.contactEmail || user.email
      }
    };

    updatePropertyMutation.mutate(propertyData);
  };

  if (fetchingProperty || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-responsive">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <FaSpinner className="text-4xl text-blue-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Property</h2>
              <p className="text-gray-600">Please wait while we load the property details...</p>
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
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Property</h2>
              <p className="text-gray-600 mb-4">Failed to load the property. Please try again.</p>
              <button
                onClick={() => navigate('/my-properties')}
                className="btn btn-primary"
              >
                Back to My Properties
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit Property
            </h1>
            <p className="text-gray-600">
              Update your property listing to keep it current and attractive
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Basic Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Modern 2-Bedroom Apartment in DHA"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Property Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial</option>
                    <option value="office">Office</option>
                    <option value="shop">Shop</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="plot">Plot</option>
                    <option value="room">Room</option>
                    <option value="portion">Portion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="agricultural">Agricultural</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rent Amount (PKR) *
                  </label>
                  <input
                    type="number"
                    name="rent"
                    value={formData.rent}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 50000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Deposit (PKR)
                  </label>
                  <input
                    type="number"
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 100000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Advance Rent (PKR)
                  </label>
                  <input
                    type="number"
                    name="advanceRent"
                    value={formData.advanceRent}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 50000"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Brief description (max 200 characters)"
                  maxLength={200}
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="form-textarea"
                  placeholder="Provide detailed information about the property..."
                  required
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <FaMapMarkerAlt className="inline mr-2" />
                Location Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select City</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Quetta">Quetta</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area/Sector *
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., DHA, Gulberg, F-7"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sector (for Islamabad)
                  </label>
                  <input
                    type="text"
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., F-7, G-8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Town (for Lahore)
                  </label>
                  <input
                    type="text"
                    name="town"
                    value={formData.town}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Gulberg, Model Town"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Block
                  </label>
                  <input
                    type="text"
                    name="block"
                    value={formData.block}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Block A, Block 5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Street 1, Main Boulevard"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complete Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Complete address of the property"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Property Specifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <FaBed className="inline mr-2" />
                Property Specifications
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kitchens
                  </label>
                  <input
                    type="number"
                    name="kitchens"
                    value={formData.kitchens}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="1"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drawing Rooms
                  </label>
                  <input
                    type="number"
                    name="drawingRooms"
                    value={formData.drawingRooms}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="1"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Servant Quarters
                  </label>
                  <input
                    type="number"
                    name="servantQuarters"
                    value={formData.servantQuarters}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parking Spaces
                  </label>
                  <input
                    type="number"
                    name="parkingSpaces"
                    value={formData.parkingSpaces}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Area Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <FaRulerCombined className="inline mr-2" />
                Area Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Size *
                  </label>
                  <input
                    type="number"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 1000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size Unit *
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="sqft">Square Feet</option>
                    <option value="sqyard">Square Yards</option>
                    <option value="marla">Marla</option>
                    <option value="kanal">Kanal</option>
                    <option value="acre">Acre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Covered Area
                  </label>
                  <input
                    type="number"
                    name="coveredArea"
                    value={formData.coveredArea}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Covered Area Unit
                  </label>
                  <select
                    name="coveredAreaUnit"
                    value={formData.coveredAreaUnit}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="sqft">Square Feet</option>
                    <option value="sqyard">Square Yards</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Property Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Property Features
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Furnishing Status
                  </label>
                  <select
                    name="furnishing"
                    value={formData.furnishing}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="unfurnished">Unfurnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="fully-furnished">Fully-Furnished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Condition
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="average">Average</option>
                    <option value="needs-renovation">Needs Renovation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Age (years)
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 5"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor Number
                  </label>
                  <input
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 2"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Floors
                  </label>
                  <input
                    type="number"
                    name="totalFloors"
                    value={formData.totalFloors}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 5"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available From
                  </label>
                  <input
                    type="date"
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Amenities & Facilities
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(amenities).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handleAmenityChange(key)}
                      className="form-checkbox"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images Upload */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <FaUpload className="inline mr-2" />
                Property Images
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                    uploading
                      ? 'bg-gray-400 text-gray-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <FaUpload className="mr-2" />
                  {uploading ? 'Uploading...' : 'Upload More Images'}
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  Upload additional images (JPG, PNG, max 5MB each)
                </p>
              </div>

              {/* Display uploaded images */}
              {images.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Property Images</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={typeof image === 'string' ? image : image.url}
                          alt={`Property ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                            <button
                              type="button"
                              onClick={() => setPrimaryImage(index)}
                              className={`p-2 rounded-full ${
                                (typeof image === 'string' ? index === 0 : image.isPrimary)
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-gray-600 hover:bg-blue-500 hover:text-white'
                              } transition-colors`}
                              title="Set as primary"
                            >
                              <FaStar className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-2 rounded-full bg-white text-gray-600 hover:bg-red-500 hover:text-white transition-colors"
                              title="Remove image"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        {(typeof image === 'string' ? index === 0 : image.isPrimary) && (
                          <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Contact Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder={user?.fullName || 'Your name'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder={user?.phone || 'Your phone number'}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder={user?.email || 'Your email'}
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/my-properties')}
                className="btn btn-outline"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={updatePropertyMutation.isLoading || uploading}
                className="btn btn-primary"
              >
                <FaSave className="mr-2" />
                {updatePropertyMutation.isLoading ? 'Updating Property...' : 'Update Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPropertyPage; 