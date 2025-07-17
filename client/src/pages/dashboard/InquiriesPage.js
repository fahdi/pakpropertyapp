import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import { 
  FaEnvelope, 
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaBuilding,
  FaEye,
  FaReply,
  FaCheck,
  FaFilter,
  FaSearch,
  FaSort
} from 'react-icons/fa';

const InquiriesPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  // Fetch inquiries based on user role
  const { data: inquiries, isLoading, error } = useQuery(
    ['inquiries', user?.role],
    async () => {
      const endpoint = user?.role === 'tenant' ? '/inquiries/my-inquiries' : '/inquiries/received';
      const response = await api.get(endpoint);
      return response.data.data;
    },
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false
    }
  );

  // Reply to inquiry mutation
  const replyMutation = useMutation(
    async ({ inquiryId, message }) => {
      await api.post(`/inquiries/${inquiryId}/reply`, { message });
    },
    {
      onSuccess: () => {
        toast.success('Reply sent successfully');
        queryClient.invalidateQueries(['inquiries', user?.role]);
        setShowReplyModal(false);
        setReplyMessage('');
        setSelectedInquiry(null);
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to send reply';
        toast.error(message);
      }
    }
  );

  // Mark inquiry as read mutation
  const markAsReadMutation = useMutation(
    async (inquiryId) => {
      await api.patch(`/inquiries/${inquiryId}/read`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['inquiries', user?.role]);
      },
      onError: (error) => {
        console.error('Failed to mark as read:', error);
      }
    }
  );

  // Schedule viewing mutation
  const scheduleViewingMutation = useMutation(
    async ({ inquiryId, viewingData }) => {
      await api.post(`/inquiries/${inquiryId}/schedule-viewing`, viewingData);
    },
    {
      onSuccess: () => {
        toast.success('Viewing scheduled successfully');
        queryClient.invalidateQueries(['inquiries', user?.role]);
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to schedule viewing';
        toast.error(message);
      }
    }
  );

  // Handle reply submission
  const handleReply = () => {
    if (selectedInquiry && replyMessage.trim()) {
      replyMutation.mutate({
        inquiryId: selectedInquiry._id,
        message: replyMessage.trim()
      });
    }
  };

  // Handle viewing scheduling
  const handleScheduleViewing = (inquiry) => {
    const viewingData = {
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      location: inquiry.property.location.address
    };
    
    scheduleViewingMutation.mutate({
      inquiryId: inquiry._id,
      viewingData
    });
  };

  // Filter and sort inquiries
  const filteredAndSortedInquiries = inquiries
    ?.filter(inquiry => {
      // Filter by status
      if (filter === 'all') return true;
      if (filter === 'unread') return !inquiry.isRead;
      if (filter === 'replied') return inquiry.replies && inquiry.replies.length > 0;
      if (filter === 'scheduled') return inquiry.viewingScheduled;
      return true;
    })
    ?.filter(inquiry => {
      // Filter by search query
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        inquiry.property?.title?.toLowerCase().includes(query) ||
        inquiry.message?.toLowerCase().includes(query) ||
        inquiry.user?.firstName?.toLowerCase().includes(query) ||
        inquiry.user?.lastName?.toLowerCase().includes(query)
      );
    })
    ?.sort((a, b) => {
      // Sort inquiries
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'property':
          return (a.property?.title || '').localeCompare(b.property?.title || '');
        case 'user':
          return (a.user?.firstName || '').localeCompare(b.user?.firstName || '');
        case 'status':
          return (a.isRead ? 1 : 0) - (b.isRead ? 1 : 0);
        default:
          return 0;
      }
    }) || [];

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusColor = (inquiry) => {
    if (!inquiry.isRead) return 'bg-red-100 text-red-800';
    if (inquiry.replies && inquiry.replies.length > 0) return 'bg-green-100 text-green-800';
    if (inquiry.viewingScheduled) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
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
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="animate-pulse">
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Inquiries</h2>
              <p className="text-gray-600 mb-4">Failed to load inquiries. Please try again.</p>
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
                  {user?.role === 'tenant' ? 'My Inquiries' : 'Property Inquiries'}
                </h1>
                <p className="text-gray-600">
                  {user?.role === 'tenant' 
                    ? 'Track your property inquiries and responses'
                    : 'Manage inquiries from potential tenants'
                  }
                </p>
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
                  placeholder="Search inquiries..."
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
                    <option value="all">All Inquiries</option>
                    <option value="unread">Unread</option>
                    <option value="replied">Replied</option>
                    <option value="scheduled">Scheduled Viewing</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <FaSort className="text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Date</option>
                    <option value="property">Property</option>
                    <option value="user">User</option>
                    <option value="status">Status</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiries List */}
          {filteredAndSortedInquiries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FaEnvelope className="text-6xl mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Inquiries Found
              </h3>
              <p className="text-gray-600">
                {user?.role === 'tenant' 
                  ? 'You haven\'t made any inquiries yet. Browse properties and start inquiring!'
                  : 'No inquiries received yet. Promote your properties to attract tenants.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAndSortedInquiries.map((inquiry) => (
                <div 
                  key={inquiry._id} 
                  className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${
                    !inquiry.isRead ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <FaUser className="text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {inquiry.user?.firstName} {inquiry.user?.lastName}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <FaBuilding className="text-gray-400" />
                            <Link 
                              to={`/properties/${inquiry.property?._id}`}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {inquiry.property?.title}
                            </Link>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry)}`}>
                            {!inquiry.isRead ? 'New' : 
                             inquiry.replies && inquiry.replies.length > 0 ? 'Replied' :
                             inquiry.viewingScheduled ? 'Viewing Scheduled' : 'Read'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(inquiry.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="mb-4">
                        <p className="text-gray-700">{inquiry.message}</p>
                      </div>

                      {/* Property Details */}
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          <span>{inquiry.property?.location?.area}, {inquiry.property?.location?.city}</span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          <span>Inquired on {formatDate(inquiry.createdAt)}</span>
                        </div>
                      </div>

                      {/* Replies */}
                      {inquiry.replies && inquiry.replies.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Replies:</h4>
                          <div className="space-y-2">
                            {inquiry.replies.map((reply, index) => (
                              <div key={index} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-900">
                                    {reply.user?.firstName} {reply.user?.lastName}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(reply.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">{reply.message}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Viewing Schedule */}
                      {inquiry.viewingScheduled && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-1">Viewing Scheduled</h4>
                          <p className="text-sm text-blue-700">
                            Date: {formatDate(inquiry.viewingDate)} | 
                            Time: {inquiry.viewingTime} | 
                            Location: {inquiry.viewingLocation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/properties/${inquiry.property?._id}`}
                        className="btn btn-outline btn-sm"
                      >
                        <FaEye className="mr-1" />
                        View Property
                      </Link>
                      
                      {user?.role !== 'tenant' && (
                        <button
                          onClick={() => {
                            setSelectedInquiry(inquiry);
                            setShowReplyModal(true);
                          }}
                          className="btn btn-outline btn-sm"
                        >
                          <FaReply className="mr-1" />
                          Reply
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {user?.role !== 'tenant' && !inquiry.viewingScheduled && (
                        <button
                          onClick={() => handleScheduleViewing(inquiry)}
                          className="btn btn-primary btn-sm"
                        >
                          <FaCalendarAlt className="mr-1" />
                          Schedule Viewing
                        </button>
                      )}
                      
                      {!inquiry.isRead && (
                        <button
                          onClick={() => markAsReadMutation.mutate(inquiry._id)}
                          className="btn btn-outline btn-sm"
                        >
                          <FaCheck className="mr-1" />
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reply to Inquiry
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Original Message:</p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-700">{selectedInquiry.message}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Reply
              </label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your reply here..."
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyMessage('');
                  setSelectedInquiry(null);
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={replyMutation.isLoading || !replyMessage.trim()}
                className="btn btn-primary"
              >
                {replyMutation.isLoading ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesPage; 