import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from 'react-query';
import api from '../../utils/axios';
import { 
  FaHome, 
  FaBuilding, 
  FaEnvelope, 
  FaHeart, 
  FaEye, 
  FaPhone,
  FaWhatsapp,
  FaChartLine,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendar,
  FaMapMarkerAlt,
  FaUser,
  FaShieldAlt,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaSearch
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery(
    'dashboardData',
    async () => {
      const response = await api.get('/users/dashboard');
      return response.data.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
    }
  );

  const stats = [
    {
      title: 'My Properties',
      value: dashboardData?.propertiesCount || 0,
      icon: FaBuilding,
      color: 'bg-blue-500',
      link: '/dashboard/my-properties'
    },
    {
      title: 'Inquiries',
      value: dashboardData?.inquiriesCount || 0,
      icon: FaEnvelope,
      color: 'bg-green-500',
      link: '/dashboard/inquiries'
    },
    {
      title: 'Saved Properties',
      value: dashboardData?.savedCount || 0,
      icon: FaHeart,
      color: 'bg-red-500',
      link: '/dashboard/saved-properties'
    },
    {
      title: 'Profile Views',
      value: dashboardData?.profileViews || 0,
      icon: FaEye,
      color: 'bg-purple-500',
      link: '/dashboard/profile'
    }
  ];

  const quickActions = [
    {
      title: 'Add Property',
      description: 'List a new property for rent',
      icon: FaPlus,
      color: 'bg-blue-600',
      link: '/dashboard/add-property',
      roles: ['owner', 'agent']
    },
    {
      title: 'Browse Properties',
      description: 'Search for rental properties',
      icon: FaHome,
      color: 'bg-green-600',
      link: '/properties'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our team',
      icon: FaPhone,
      color: 'bg-purple-600',
      link: '/contact'
    },
    {
      title: 'Account Settings',
      description: 'Manage your account',
      icon: FaCog,
      color: 'bg-gray-600',
      link: '/dashboard/profile'
    },
    // Admin actions
    {
      title: 'User Management',
      description: 'Manage all users and permissions',
      icon: FaUser,
      color: 'bg-red-600',
      link: '/admin/users',
      roles: ['admin']
    },
    {
      title: 'Agent Management',
      description: 'Verify and manage agents',
      icon: FaShieldAlt,
      color: 'bg-orange-600',
      link: '/admin/agents',
      roles: ['admin']
    },
    {
      title: 'Analytics',
      description: 'View platform analytics',
      icon: FaChartLine,
      color: 'bg-indigo-600',
      link: '/admin/analytics',
      roles: ['admin']
    }
  ];

  const recentActivities = [
    {
      type: 'property_viewed',
      title: 'Property Viewed',
      description: 'Someone viewed your property in Karachi',
      time: '2 hours ago',
      icon: FaEye,
      color: 'text-blue-600'
    },
    {
      type: 'inquiry_received',
      title: 'New Inquiry',
      description: 'You received an inquiry for your apartment',
      time: '1 day ago',
      icon: FaEnvelope,
      color: 'text-green-600'
    },
    {
      type: 'property_saved',
      title: 'Property Saved',
      description: 'You saved a property in Lahore',
      time: '2 days ago',
      icon: FaHeart,
      color: 'text-red-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-responsive py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
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
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {user?.firstName}!
                </h1>
                <p className="text-gray-600">
                  Here's what's happening with your account today.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaUser className="text-blue-600" />
                  <span className="capitalize">{user?.role}</span>
                </div>
                {user?.isVerified && (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <FaShieldAlt />
                    <span>Verified</span>
                  </div>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <FaShieldAlt />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={stat.link}>
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="text-white text-xl" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => {
                  // Check if user has permission for this action
                  if (action.roles && !action.roles.includes(user?.role)) {
                    return null;
                  }
                  
                  return (
                    <Link
                      key={index}
                      to={action.link}
                      className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                        <action.icon className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
                <Link to="/activities" className="text-blue-600 hover:text-blue-700 text-sm">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 ${activity.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                      <activity.icon className={activity.color} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{activity.title}</h3>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Sections based on user role */}
        {user?.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin Panel</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Link
                  to="/admin/users"
                  className="text-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
                >
                  <FaUser className="text-3xl text-red-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">User Management</h3>
                  <p className="text-sm text-gray-600">Manage all users and permissions</p>
                </Link>
                <Link
                  to="/admin/agents"
                  className="text-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                >
                  <FaShieldAlt className="text-3xl text-orange-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Agent Management</h3>
                  <p className="text-sm text-gray-600">Verify and manage agents</p>
                </Link>
                <Link
                  to="/admin/analytics"
                  className="text-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  <FaChartLine className="text-3xl text-indigo-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
                  <p className="text-sm text-gray-600">View platform analytics</p>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {user?.role === 'owner' || user?.role === 'agent' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Management</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <FaChartLine className="text-3xl text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
                  <p className="text-sm text-gray-600">View property performance and insights</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <FaEnvelope className="text-3xl text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Inquiries</h3>
                  <p className="text-sm text-gray-600">Manage tenant inquiries and responses</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <FaCalendar className="text-3xl text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Viewings</h3>
                  <p className="text-sm text-gray-600">Schedule and manage property viewings</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Tenant Tools</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <FaSearch className="text-3xl text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Search</h3>
                  <p className="text-sm text-gray-600">Find your perfect rental property</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <FaHeart className="text-3xl text-red-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Saved</h3>
                  <p className="text-sm text-gray-600">View your saved properties</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <FaWhatsapp className="text-3xl text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                  <p className="text-sm text-gray-600">Contact property owners directly</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Account Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Status</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email Verification</span>
                  <div className="flex items-center space-x-2">
                    {user?.isVerified ? (
                      <div className="flex items-center text-green-600">
                        <FaShieldAlt className="mr-1" />
                        <span className="text-sm">Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-600">
                        <FaBell className="mr-1" />
                        <span className="text-sm">Pending</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <div className="flex items-center space-x-2">
                    {user?.isActive ? (
                      <div className="flex items-center text-green-600">
                        <FaShieldAlt className="mr-1" />
                        <span className="text-sm">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <FaSignOutAlt className="mr-1" />
                        <span className="text-sm">Inactive</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="text-sm text-gray-900">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <span className="text-sm text-gray-900">{user?.address?.city}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Login</span>
                  <span className="text-sm text-gray-900">
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Notifications</span>
                  <div className="flex items-center space-x-2">
                    <FaBell className="text-blue-600" />
                    <span className="text-sm text-gray-900">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage; 