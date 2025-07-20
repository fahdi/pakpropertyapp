import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaBuilding, 
  FaEnvelope, 
  FaCheckCircle, 
  FaTimesCircle,
  FaUserPlus,
  FaUserEdit,
  FaUserShield,
  FaChartLine,
  FaCog,
  FaEye,
  FaTrash,
  FaSearch,
  FaFilter,
  FaDownload,
  FaPrint,
  FaArrowLeft
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const navigate = useNavigate();

  // Fetch dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery(
    'adminDashboard',
    async () => {
      const response = await api.get('/admin/dashboard');
      return response.data.data;
    },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 5 * 60 * 1000
    }
  );

  // Fetch users
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useQuery(
    ['adminUsers', searchTerm, selectedRole, selectedStatus],
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedRole) params.append('role', selectedRole);
      if (selectedStatus) params.append('status', selectedStatus);
      
      const response = await api.get(`/admin/users?${params.toString()}`);
      return response.data;
    },
    {
      staleTime: 2 * 60 * 1000
    }
  );

  // Fetch analytics
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery(
    'adminAnalytics',
    async () => {
      const response = await api.get('/admin/analytics');
      return response.data.data;
    },
    {
      staleTime: 5 * 60 * 1000
    }
  );

  const handleUserAction = async (action, userId) => {
    try {
      switch (action) {
        case 'verify':
          await api.put(`/admin/users/${userId}`, { isVerified: true });
          toast.success('User verified successfully');
          break;
        case 'activate':
          await api.put(`/admin/users/${userId}`, { isActive: true });
          toast.success('User activated successfully');
          break;
        case 'deactivate':
          await api.put(`/admin/users/${userId}`, { isActive: false });
          toast.success('User deactivated successfully');
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this user?')) {
            await api.delete(`/admin/users/${userId}`);
            toast.success('User deleted successfully');
          }
          break;
      }
      refetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
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

  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-responsive pt-24 lg:pt-28 pb-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-responsive pt-24 lg:pt-28 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage users, properties, and platform analytics</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/admin/users')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <FaUsers />
                <span>Manage Users</span>
              </button>
              <Link
                to="/dashboard"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <FaArrowLeft />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Navigation Bar */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Navigation</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/admin/users')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <FaUsers />
              <span>User Management</span>
            </button>
            <button
              onClick={() => navigate('/admin/agents')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <FaUserShield />
              <span>Agent Management</span>
            </button>
            <button
              onClick={() => navigate('/admin/analytics')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <FaChartLine />
              <span>Analytics</span>
            </button>
            <Link
              to="/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <FaArrowLeft />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaUsers className="text-2xl text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.stats?.totalUsers || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaBuilding className="text-2xl text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Properties</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.stats?.totalProperties || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaEnvelope className="text-2xl text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.stats?.totalInquiries || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaCheckCircle className="text-2xl text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.stats?.verifiedUsers || 0}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Action Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-blue-200"
              onClick={() => navigate('/admin/users')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaUsers className="text-2xl text-blue-600" />
                </div>
                <FaArrowLeft className="text-gray-400 transform rotate-180" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600 mb-4">Manage all users, verify agents, and control user permissions</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Users: {dashboardData?.stats?.totalUsers || 0}</span>
                <span className="text-blue-600 font-medium">Click to Manage →</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-green-200"
              onClick={() => navigate('/admin/agents')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaUserShield className="text-2xl text-green-600" />
                </div>
                <FaArrowLeft className="text-gray-400 transform rotate-180" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Agent Management</h3>
              <p className="text-gray-600 mb-4">Verify agents, view performance metrics, and manage licenses</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Active Agents: {dashboardData?.userStats?.find(s => s._id === 'agent')?.count || 0}</span>
                <span className="text-green-600 font-medium">Click to Manage →</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-purple-200"
              onClick={() => navigate('/admin/analytics')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaChartLine className="text-2xl text-purple-600" />
                </div>
                <FaArrowLeft className="text-gray-400 transform rotate-180" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 mb-4">View detailed analytics, user growth, and platform insights</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">30 Day Period</span>
                <span className="text-purple-600 font-medium">Click to View →</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: FaChartLine },
                { id: 'users', label: 'User Management', icon: FaUsers },
                { id: 'agents', label: 'Agent Management', icon: FaUserShield },
                { id: 'analytics', label: 'Analytics', icon: FaCog }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="text-lg" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* User Statistics */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
                    <div className="space-y-3">
                      {dashboardData?.userStats?.map((stat) => (
                        <div key={stat._id} className="flex justify-between items-center">
                          <span className="text-gray-600 capitalize">{stat._id}</span>
                          <span className="font-semibold">{stat.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Property Statistics */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Statistics</h3>
                    <div className="space-y-3">
                      {dashboardData?.propertyStats?.map((stat) => (
                        <div key={stat._id} className="flex justify-between items-center">
                          <span className="text-gray-600">{stat._id}</span>
                          <span className="font-semibold">{stat.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
                    <div className="space-y-3">
                      {dashboardData?.recentActivities?.users?.map((user) => (
                        <div key={user._id} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaUsers className="text-blue-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Properties</h3>
                    <div className="space-y-3">
                      {dashboardData?.recentActivities?.properties?.map((property) => (
                        <div key={property._id} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <FaBuilding className="text-green-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-sm font-medium truncate">{property.title}</p>
                            <p className="text-xs text-gray-500">{property.owner?.firstName} {property.owner?.lastName}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Inquiries</h3>
                    <div className="space-y-3">
                      {dashboardData?.recentActivities?.inquiries?.map((inquiry) => (
                        <div key={inquiry._id} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <FaEnvelope className="text-purple-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{inquiry.property?.title}</p>
                            <p className="text-xs text-gray-500">{inquiry.tenant?.firstName} {inquiry.tenant?.lastName}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="agent">Agent</option>
                    <option value="owner">Owner</option>
                    <option value="tenant">Tenant</option>
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {usersData?.data?.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-700">
                                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="space-y-1">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isActive ? 'active' : 'inactive')}`}>
                                  {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <br />
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isVerified ? 'verified' : 'unverified')}`}>
                                  {user.isVerified ? 'Verified' : 'Unverified'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.address?.city || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <Link
                                  to={`/admin/users/${user._id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <FaEye />
                                </Link>
                                <Link
                                  to={`/admin/users/${user._id}/edit`}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <FaUserEdit />
                                </Link>
                                {!user.isVerified && (
                                  <button
                                    onClick={() => handleUserAction('verify', user._id)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <FaCheckCircle />
                                  </button>
                                )}
                                {!user.isActive ? (
                                  <button
                                    onClick={() => handleUserAction('activate', user._id)}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    <FaCheckCircle />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUserAction('deactivate', user._id)}
                                    className="text-yellow-600 hover:text-yellow-900"
                                  >
                                    <FaTimesCircle />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleUserAction('delete', user._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {usersData?.pagination && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((usersData.pagination.page - 1) * usersData.pagination.limit) + 1} to{' '}
                      {Math.min(usersData.pagination.page * usersData.pagination.limit, usersData.total)} of{' '}
                      {usersData.total} results
                    </div>
                    <div className="flex space-x-2">
                      {Array.from({ length: usersData.pagination.pages }, (_, i) => (
                        <button
                          key={i + 1}
                          className={`px-3 py-1 text-sm rounded ${
                            usersData.pagination.page === i + 1
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Agents Tab */}
            {activeTab === 'agents' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Agent Management</h3>
                  <Link
                    to="/admin/agents"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View All Agents
                  </Link>
                </div>
                
                {/* Agent Statistics */}
                {usersData?.stats && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {usersData.stats.map((stat) => (
                      <div key={stat._id} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-600 capitalize">{stat._id}</h4>
                        <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          Verified: {stat.verified} | Active: {stat.active}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Platform Analytics</h3>
                  <div className="flex space-x-2">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                      <FaDownload />
                      <span>Export</span>
                    </button>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
                      <FaPrint />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                {analyticsData && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h4>
                      <div className="space-y-2">
                        {analyticsData.userGrowth?.slice(-7).map((item) => (
                          <div key={item._id} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{item._id}</span>
                            <span className="font-semibold">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Cities</h4>
                      <div className="space-y-2">
                        {analyticsData.topCities?.slice(0, 5).map((city) => (
                          <div key={city._id} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{city._id}</span>
                            <span className="font-semibold">{city.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 