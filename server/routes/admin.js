const express = require('express');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
router.get('/dashboard', protect, isAdmin, async (req, res) => {
  try {
    // Get platform statistics
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalInquiries = await Inquiry.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const availableProperties = await Property.countDocuments({ status: 'available' });

    // Get user statistics by role
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get property statistics by city
    const propertyStats = await Property.aggregate([
      {
        $group: {
          _id: '$location.city',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get recent activities
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email role createdAt');

    const recentProperties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('owner', 'firstName lastName');

    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('property', 'title')
      .populate('tenant', 'firstName lastName');

    const dashboardData = {
      stats: {
        totalUsers,
        totalProperties,
        totalInquiries,
        activeUsers,
        verifiedUsers,
        availableProperties
      },
      userStats,
      propertyStats,
      recentActivities: {
        users: recentUsers,
        properties: recentProperties,
        inquiries: recentInquiries
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin dashboard'
    });
  }
});

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private (Admin)
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;

    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.isActive = status === 'active';
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// @desc    Get single user (admin)
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
router.get('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
});

// @desc    Update user (admin)
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
router.put('/users/:id', protect, isAdmin, [
  body('role')
    .optional()
    .isIn(['owner', 'agent', 'tenant', 'admin'])
    .withMessage('Invalid role'),
  body('isVerified')
    .optional()
    .isBoolean()
    .withMessage('isVerified must be boolean'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
});

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
router.delete('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is trying to delete themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
});

// @desc    Get all properties (admin)
// @route   GET /api/admin/properties
// @access  Private (Admin)
router.get('/properties', protect, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, city, propertyType, search } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (city) filter['location.city'] = city;
    if (propertyType) filter.propertyType = propertyType;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const properties = await Property.find(filter)
      .populate('owner', 'firstName lastName email')
      .populate('agent', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Property.countDocuments(filter);

    res.json({
      success: true,
      count: properties.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: properties
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties'
    });
  }
});

// @desc    Update property (admin)
// @route   PUT /api/admin/properties/:id
// @access  Private (Admin)
router.put('/properties/:id', protect, isAdmin, [
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be boolean'),
  body('isVerified')
    .optional()
    .isBoolean()
    .withMessage('isVerified must be boolean'),
  body('status')
    .optional()
    .isIn(['available', 'rented', 'under-maintenance', 'reserved'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'firstName lastName email');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating property'
    });
  }
});

// @desc    Delete property (admin)
// @route   DELETE /api/admin/properties/:id
// @access  Private (Admin)
router.delete('/properties/:id', protect, isAdmin, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting property'
    });
  }
});

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
router.get('/analytics', protect, isAdmin, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // User analytics
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({ createdAt: { $gte: startDate } });
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    // Property analytics
    const totalProperties = await Property.countDocuments();
    const newProperties = await Property.countDocuments({ createdAt: { $gte: startDate } });
    const availableProperties = await Property.countDocuments({ status: 'available' });
    const rentedProperties = await Property.countDocuments({ status: 'rented' });

    // Inquiry analytics
    const totalInquiries = await Inquiry.countDocuments();
    const newInquiries = await Inquiry.countDocuments({ createdAt: { $gte: startDate } });
    const pendingInquiries = await Inquiry.countDocuments({ status: 'pending' });
    const respondedInquiries = await Inquiry.countDocuments({ status: 'responded' });

    // User growth over time
    const userGrowth = await User.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Property growth over time
    const propertyGrowth = await Property.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top cities
    const topCities = await Property.aggregate([
      {
        $group: {
          _id: '$location.city',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Property types distribution
    const propertyTypes = await Property.aggregate([
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const analytics = {
      overview: {
        totalUsers,
        newUsers,
        activeUsers,
        verifiedUsers,
        totalProperties,
        newProperties,
        availableProperties,
        rentedProperties,
        totalInquiries,
        newInquiries,
        pendingInquiries,
        respondedInquiries
      },
      growth: {
        users: userGrowth,
        properties: propertyGrowth
      },
      topCities,
      propertyTypes,
      period: days
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics'
    });
  }
});

// @desc    Get system health
// @route   GET /api/admin/health
// @access  Private (Admin)
router.get('/health', protect, isAdmin, async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: 'connected'
    };

    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('Get health error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system health'
    });
  }
});

module.exports = router; 