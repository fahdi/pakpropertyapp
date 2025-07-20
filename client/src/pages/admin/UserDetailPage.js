import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaUserEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaShieldAlt,
  FaCalendar,
  FaEye,
  FaEdit,
  FaSave,
  FaTimes,
  FaUser,
  FaHome,
  FaEnvelopeOpen,
  FaStar,
  FaChartLine
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // Fetch user data
  const { data: userData, isLoading, error } = useQuery(
    ['adminUser', id],
    async () => {
      const response = await api.get(`/admin/users/${id}`);
      return response.data.data;
    },
    {
      staleTime: 5 * 60 * 1000
    }
  );

  // Mutations
  const updateUserMutation = useMutation(
    async ({ userId, userData }) => {
      console.log('Frontend sending update data:', userData);
      const response = await api.put(`/admin/users/${userId}`, userData);
      console.log('Backend response:', response.data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        console.log('Update successful:', data);
        toast.success('User updated successfully');
        setIsEditing(false);
        queryClient.invalidateQueries(['adminUser', id]);
      },
      onError: (error) => {
        console.error('Update error:', error);
        console.error('Error response:', error.response?.data);
        toast.error(error.response?.data?.message || 'Failed to update user');
      }
    }
  );

  const deleteUserMutation = useMutation(
    async () => {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('User deleted successfully');
        navigate('/admin/users');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  );

  const handleEdit = () => {
    setEditForm({
      firstName: userData.user.firstName,
      lastName: userData.user.lastName,
      email: userData.user.email,
      phone: userData.user.phone,
      role: userData.user.role,
      gender: userData.user.gender,
      isActive: userData.user.isActive,
      isVerified: userData.user.isVerified,
      address: {
        city: userData.user.address?.city || '',
        street: userData.user.address?.street || '',
        area: userData.user.address?.area || '',
        postalCode: userData.user.address?.postalCode || ''
      },
      agentInfo: userData.user.agentInfo ? {
        licenseNumber: userData.user.agentInfo.licenseNumber || '',
        companyName: userData.user.agentInfo.companyName || '',
        experience: userData.user.agentInfo.experience || 0,
        specializations: userData.user.agentInfo.specializations || [],
        isVerified: userData.user.agentInfo.isVerified || false
      } : null
    });
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Prepare the data for update
    const updateData = {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email,
      phone: editForm.phone,
      role: editForm.role,
      gender: editForm.gender,
      isActive: editForm.isActive,
      isVerified: editForm.isVerified,
      address: editForm.address
    };

    // Add agent info if role is agent
    if (editForm.role === 'agent') {
      updateData.agentInfo = editForm.agentInfo;
    }

    console.log('Updating user with data:', updateData);
    updateUserMutation.mutate({ userId: id, userData: updateData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUserMutation.mutate();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'verified': return 'text-blue-600 bg-blue-100';
      case 'unverified': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-purple-600 bg-purple-100';
      case 'agent': return 'text-blue-600 bg-blue-100';
      case 'owner': return 'text-green-600 bg-green-100';
      case 'tenant': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-responsive py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-responsive py-8">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">User not found</div>
            <Link to="/admin/users" className="btn btn-primary">
              Back to Users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { user, relatedData } = userData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-responsive py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/users')}
                className="text-gray-600 hover:text-gray-900"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600">User Details</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <FaUserEdit />
                <span>Edit User</span>
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <FaTrash />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* User Information */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">User Information</h2>
                <div className="flex space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isActive ? 'active' : 'inactive')}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isVerified ? 'verified' : 'unverified')}`}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
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
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role *
                      </label>
                      <select
                        required
                        value={editForm.role}
                        onChange={(e) => {
                          const newRole = e.target.value;
                          setEditForm({
                            ...editForm, 
                            role: newRole,
                            // Initialize agent info if role is changed to agent
                            agentInfo: newRole === 'agent' ? {
                              licenseNumber: editForm.agentInfo?.licenseNumber || '',
                              companyName: editForm.agentInfo?.companyName || '',
                              experience: editForm.agentInfo?.experience || 0,
                              specializations: editForm.agentInfo?.specializations || [],
                              isVerified: editForm.agentInfo?.isVerified || false
                            } : null
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="tenant">Tenant</option>
                        <option value="agent">Agent</option>
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={editForm.gender}
                        onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <select
                        value={editForm.address?.city || ''}
                        onChange={(e) => setEditForm({
                          ...editForm, 
                          address: {...editForm.address, city: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={editForm.address?.street || ''}
                        onChange={(e) => setEditForm({
                          ...editForm, 
                          address: {...editForm.address, street: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Street address"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Area/Locality
                      </label>
                      <input
                        type="text"
                        value={editForm.address?.area || ''}
                        onChange={(e) => setEditForm({
                          ...editForm, 
                          address: {...editForm.address, area: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Area or locality"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={editForm.address?.postalCode || ''}
                        onChange={(e) => setEditForm({
                          ...editForm, 
                          address: {...editForm.address, postalCode: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Postal code"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editForm.isActive}
                            onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Active</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editForm.isVerified}
                            onChange={(e) => setEditForm({...editForm, isVerified: e.target.checked})}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Verified</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {editForm.role === 'agent' && (
                    <div className="border-t pt-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Agent Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            License Number *
                          </label>
                          <input
                            type="text"
                            required
                            value={editForm.agentInfo?.licenseNumber || ''}
                            onChange={(e) => setEditForm({
                              ...editForm, 
                              agentInfo: {
                                ...editForm.agentInfo,
                                licenseNumber: e.target.value
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Agent license number"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={editForm.agentInfo?.companyName || ''}
                            onChange={(e) => setEditForm({
                              ...editForm, 
                              agentInfo: {
                                ...editForm.agentInfo,
                                companyName: e.target.value
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Company name"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Experience (Years)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={editForm.agentInfo?.experience || 0}
                          onChange={(e) => setEditForm({
                            ...editForm, 
                            agentInfo: {
                              ...editForm.agentInfo,
                              experience: parseInt(e.target.value) || 0
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Specializations
                        </label>
                        <div className="space-y-2">
                          {['residential', 'commercial', 'industrial', 'luxury', 'affordable'].map((spec) => (
                            <label key={spec} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={editForm.agentInfo?.specializations?.includes(spec) || false}
                                onChange={(e) => {
                                  const currentSpecs = editForm.agentInfo?.specializations || [];
                                  const newSpecs = e.target.checked
                                    ? [...currentSpecs, spec]
                                    : currentSpecs.filter(s => s !== spec);
                                  setEditForm({
                                    ...editForm,
                                    agentInfo: {
                                      ...editForm.agentInfo,
                                      specializations: newSpecs
                                    }
                                  });
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">{spec}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={updateUserMutation.isLoading}
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                      <FaSave />
                      <span>{updateUserMutation.isLoading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors flex items-center space-x-2"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <p className="text-gray-900">{user.firstName} {user.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="flex items-center space-x-2">
                        <FaEnvelope className="text-gray-400" />
                        <a href={`mailto:${user.email}`} className="text-blue-600 hover:text-blue-700">
                          {user.email}
                        </a>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="flex items-center space-x-2">
                        <FaPhone className="text-gray-400" />
                        <a href={`tel:${user.phone}`} className="text-blue-600 hover:text-blue-700">
                          {user.phone}
                        </a>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <p className="text-gray-900 capitalize">{user.gender || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <div className="space-y-1">
                        {user.address?.city && (
                          <div className="flex items-center space-x-2">
                            <FaMapMarkerAlt className="text-gray-400" />
                            <span className="text-gray-900">{user.address.city}</span>
                          </div>
                        )}
                        {user.address?.street && (
                          <div className="text-sm text-gray-600 ml-6">
                            {user.address.street}
                          </div>
                        )}
                        {user.address?.area && (
                          <div className="text-sm text-gray-600 ml-6">
                            {user.address.area}
                          </div>
                        )}
                        {user.address?.postalCode && (
                          <div className="text-sm text-gray-600 ml-6">
                            Postal Code: {user.address.postalCode}
                          </div>
                        )}
                        {!user.address?.city && !user.address?.street && !user.address?.area && (
                          <span className="text-gray-500">Not specified</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                      <div className="flex items-center space-x-2">
                        <FaCalendar className="text-gray-400" />
                        <span className="text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                      <div className="flex items-center space-x-2">
                        <FaUser className="text-gray-400" />
                        <span className="text-gray-900">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </span>
                      </div>
                    </div>
                    {user.agentInfo && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Agent Info</label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <FaShieldAlt className="text-gray-400" />
                            <span className="text-gray-900">License: {user.agentInfo.licenseNumber}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaBuilding className="text-gray-400" />
                            <span className="text-gray-900">Company: {user.agentInfo.companyName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaChartLine className="text-gray-400" />
                            <span className="text-gray-900">Experience: {user.agentInfo.experience} years</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Related Data */}
            {relatedData && Object.keys(relatedData).length > 0 && (
              <div className="space-y-6">
                {/* Properties */}
                {relatedData.properties && relatedData.properties.length > 0 && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <FaBuilding />
                      <span>Properties ({relatedData.properties.length})</span>
                    </h3>
                    <div className="space-y-3">
                      {relatedData.properties.map((property) => (
                        <div key={property._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{property.title}</h4>
                              <p className="text-sm text-gray-600">{property.location?.area}, {property.location?.city}</p>
                              <p className="text-sm text-gray-600">PKR {property.rent?.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                property.status === 'available' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                              }`}>
                                {property.status}
                              </span>
                              <Link
                                to={`/properties/${property._id}`}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <FaEye />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inquiries */}
                {relatedData.inquiries && relatedData.inquiries.length > 0 && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <FaEnvelopeOpen />
                      <span>Inquiries ({relatedData.inquiries.length})</span>
                    </h3>
                    <div className="space-y-3">
                      {relatedData.inquiries.map((inquiry) => (
                        <div key={inquiry._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{inquiry.property?.title}</h4>
                              <p className="text-sm text-gray-600">
                                {inquiry.tenant?.firstName} {inquiry.tenant?.lastName}
                              </p>
                              <p className="text-sm text-gray-600">{inquiry.message}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                inquiry.status === 'pending' ? 'text-yellow-600 bg-yellow-100' : 'text-green-600 bg-green-100'
                              }`}>
                                {inquiry.status}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(inquiry.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Saved Properties */}
                {relatedData.savedProperties && relatedData.savedProperties.length > 0 && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <FaStar />
                      <span>Saved Properties ({relatedData.savedProperties.length})</span>
                    </h3>
                    <div className="space-y-3">
                      {relatedData.savedProperties.map((property) => (
                        <div key={property._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{property.title}</h4>
                              <p className="text-sm text-gray-600">{property.location?.area}, {property.location?.city}</p>
                              <p className="text-sm text-gray-600">PKR {property.rent?.toLocaleString()}</p>
                            </div>
                            <Link
                              to={`/properties/${property._id}`}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <FaEye />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleEdit}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <FaUserEdit />
                  <span>Edit User</span>
                </button>
                <button
                  onClick={() => navigate(`/admin/users/${id}/properties`)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <FaBuilding />
                  <span>View Properties</span>
                </button>
                <button
                  onClick={() => navigate(`/admin/users/${id}/inquiries`)}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <FaEnvelopeOpen />
                  <span>View Inquiries</span>
                </button>
              </div>
            </div>

            {/* User Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Properties</span>
                  <span className="font-medium">{relatedData?.properties?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Inquiries</span>
                  <span className="font-medium">{relatedData?.inquiries?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saved Properties</span>
                  <span className="font-medium">{relatedData?.savedProperties?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage; 