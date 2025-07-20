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

// @desc    Get all users (admin) - Enhanced with better filtering and sorting
// @route   GET /api/admin/users
// @access  Private (Admin)
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      role, 
      status, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      city,
      verified
    } = req.query;

    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.isActive = status === 'active';
    if (verified !== undefined) filter.isVerified = verified === 'true';
    if (city) filter['address.city'] = city;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    // Get additional statistics
    const userStats = await User.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
          active: { $sum: { $cond: ['$isActive', 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      stats: userStats,
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

// @desc    Get single user (admin) - Enhanced with related data
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

    // Get related data based on user role
    let relatedData = {};
    
    if (user.role === 'agent') {
      const properties = await Property.find({ agent: user._id })
        .select('title status rent location createdAt')
        .sort({ createdAt: -1 })
        .limit(10);
      
      const inquiries = await Inquiry.find({ property: { $in: properties.map(p => p._id) } })
        .populate('property', 'title')
        .populate('tenant', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(10);
      
      relatedData = { properties, inquiries };
    } else if (user.role === 'owner') {
      const properties = await Property.find({ owner: user._id })
        .select('title status rent location createdAt')
        .sort({ createdAt: -1 })
        .limit(10);
      
      relatedData = { properties };
    } else if (user.role === 'tenant') {
      const inquiries = await Inquiry.find({ tenant: user._id })
        .populate('property', 'title')
        .sort({ createdAt: -1 })
        .limit(10);
      
      const savedProperties = await Property.find({ _id: { $in: user.savedProperties || [] } })
        .select('title status rent location')
        .limit(10);
      
      relatedData = { inquiries, savedProperties };
    }

    res.json({
      success: true,
      data: {
        user,
        relatedData
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
});

// @desc    Create new user (admin)
// @route   POST /api/admin/users
// @access  Private (Admin)
router.post('/users', protect, isAdmin, [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^(\+92|0)?[0-9]{10}$/).withMessage('Valid Pakistani phone number is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(['owner', 'agent', 'tenant', 'admin']).withMessage('Invalid role'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('address.city').optional().isIn(['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Other']).withMessage('Invalid city'),
  body('agentInfo.licenseNumber').optional().notEmpty().withMessage('License number is required for agents'),
  body('agentInfo.companyName').optional().notEmpty().withMessage('Company name is required for agents'),
  body('agentInfo.experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('agentInfo.specializations').optional().isArray().withMessage('Specializations must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone: req.body.phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered'
      });
    }

    // Set default values
    const userData = {
      ...req.body,
      email: req.body.email.toLowerCase(),
      isVerified: req.body.role === 'admin' ? true : req.body.isVerified || false,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const user = new User(userData);
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user'
    });
  }
});

// @desc    Update user (admin) - Enhanced with better validation
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
    .withMessage('isActive must be boolean'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required'),
  body('phone')
    .optional()
    .matches(/^(\+92|0)?[0-9]{10}$/)
    .withMessage('Valid Pakistani phone number is required'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender'),
  body('address.city')
    .optional()
    .isIn(['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Other'])
    .withMessage('Invalid city'),
  body('agentInfo.licenseNumber')
    .optional()
    .notEmpty()
    .withMessage('License number is required for agents'),
  body('agentInfo.companyName')
    .optional()
    .notEmpty()
    .withMessage('Company name is required for agents'),
  body('agentInfo.experience')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Experience must be a positive number'),
  body('agentInfo.specializations')
    .optional()
    .isArray()
    .withMessage('Specializations must be an array')
], async (req, res) => {
  try {
    console.log('Update user request body:', req.body);
    console.log('Update user ID:', req.params.id);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if email is being changed and if it already exists
    if (req.body.email) {
      const existingUser = await User.findOne({ 
        email: req.body.email.toLowerCase(),
        _id: { $ne: req.params.id }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }
      req.body.email = req.body.email.toLowerCase();
    }

    // Check if phone is being changed and if it already exists
    if (req.body.phone) {
      const existingPhone = await User.findOne({ 
        phone: req.body.phone,
        _id: { $ne: req.params.id }
      });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already registered'
        });
      }
    }

    console.log('Updating user with data:', req.body);
    
    // Ensure address object exists if address fields are provided
    if (req.body.address && typeof req.body.address === 'object') {
      // Remove empty address fields
      Object.keys(req.body.address).forEach(key => {
        if (req.body.address[key] === '' || req.body.address[key] === null) {
          delete req.body.address[key];
        }
      });
      
      // If address object is empty, remove it
      if (Object.keys(req.body.address).length === 0) {
        delete req.body.address;
      }
    }
    
    console.log('Processed update data:', req.body);
    
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

    console.log('Updated user:', user);

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

// @desc    Bulk update users (admin)
// @route   PUT /api/admin/users/bulk
// @access  Private (Admin)
router.put('/users/bulk', protect, isAdmin, [
  body('userIds').isArray().withMessage('User IDs must be an array'),
  body('updates').isObject().withMessage('Updates must be an object'),
  body('updates.isVerified').optional().isBoolean().withMessage('isVerified must be boolean'),
  body('updates.isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  body('updates.role').optional().isIn(['owner', 'agent', 'tenant', 'admin']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { userIds, updates } = req.body;

    // Prevent updating admin users to non-admin roles
    if (updates.role && updates.role !== 'admin') {
      const adminUsers = await User.find({ 
        _id: { $in: userIds },
        role: 'admin'
      });
      
      if (adminUsers.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot change admin users to non-admin roles'
        });
      }
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      updates
    );

    res.json({
      success: true,
      message: `Updated ${result.modifiedCount} users`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk update users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating users'
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

    // Check if user has associated properties
    const userProperties = await Property.countDocuments({ 
      $or: [{ owner: user._id }, { agent: user._id }] 
    });

    if (userProperties > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete user with ${userProperties} associated properties`
      });
    }

    // Check if user has inquiries
    const userInquiries = await Inquiry.countDocuments({ tenant: user._id });
    if (userInquiries > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete user with ${userInquiries} associated inquiries`
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

// @desc    Get agent management data
// @route   GET /api/admin/agents
// @access  Private (Admin)
router.get('/agents', protect, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, verified, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const filter = { role: 'agent' };
    if (verified !== undefined) filter.isVerified = verified === 'true';
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'agentInfo.companyName': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const agents = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    // Get agent statistics
    const agentStats = await User.aggregate([
      { $match: { role: 'agent' } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
          avgExperience: { $avg: '$agentInfo.experience' }
        }
      }
    ]);

    // Get properties per agent
    const agentsWithProperties = await Promise.all(
      agents.map(async (agent) => {
        const properties = await Property.countDocuments({ agent: agent._id });
        const inquiries = await Inquiry.countDocuments({ 
          property: { $in: await Property.find({ agent: agent._id }).distinct('_id') }
        });
        
        return {
          ...agent.toObject(),
          propertyCount: properties,
          inquiryCount: inquiries
        };
      })
    );

    res.json({
      success: true,
      count: agents.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      stats: agentStats[0] || { total: 0, verified: 0, active: 0, avgExperience: 0 },
      data: agentsWithProperties
    });
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching agents'
    });
  }
});

// @desc    Verify agent (admin)
// @route   PUT /api/admin/agents/:id/verify
// @access  Private (Admin)
router.put('/agents/:id/verify', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'agent') {
      return res.status(400).json({
        success: false,
        message: 'User is not an agent'
      });
    }

    user.isVerified = true;
    user.agentInfo.isVerified = true;
    await user.save();

    res.json({
      success: true,
      message: 'Agent verified successfully',
      data: user
    });
  } catch (error) {
    console.error('Verify agent error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying agent'
    });
  }
});

// @desc    Get user analytics
// @route   GET /api/admin/users/analytics
// @access  Private (Admin)
router.get('/users/analytics', protect, isAdmin, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

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

    // User registration by role
    const userByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
          active: { $sum: { $cond: ['$isActive', 1, 0] } }
        }
      }
    ]);

    // User registration by city
    const userByCity = await User.aggregate([
      {
        $group: {
          _id: '$address.city',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Agent performance
    const agentPerformance = await User.aggregate([
      { $match: { role: 'agent' } },
      {
        $lookup: {
          from: 'properties',
          localField: '_id',
          foreignField: 'agent',
          as: 'properties'
        }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          isVerified: 1,
          propertyCount: { $size: '$properties' },
          experience: '$agentInfo.experience'
        }
      },
      { $sort: { propertyCount: -1 } },
      { $limit: 10 }
    ]);

    // User activity
    const userActivity = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$lastLogin' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]);

    const analytics = {
      userGrowth,
      userByRole,
      userByCity,
      agentPerformance,
      userActivity,
      period: days
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user analytics'
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