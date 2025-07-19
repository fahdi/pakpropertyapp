const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const User = require('../models/User');
const Property = require('../models/Property');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for profile picture uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, upload.single('profilePicture'), [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^(\+92|0)?[0-9]{10}$/)
    .withMessage('Please provide a valid Pakistani phone number'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Invalid date of birth'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender'),
  body('address.city')
    .optional()
    .isIn(['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Other'])
    .withMessage('Please select a valid city'),
  body('preferences.language')
    .optional()
    .isIn(['en', 'ur'])
    .withMessage('Invalid language preference'),
  body('preferences.currency')
    .optional()
    .isIn(['PKR', 'USD'])
    .withMessage('Invalid currency preference')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const updateData = req.body;

    // Handle profile picture upload
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'pakproperty/profiles',
              transformation: [
                { width: 300, height: 300, crop: 'fill' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });

        updateData.profilePicture = result.secure_url;
      } catch (uploadError) {
        console.error('Profile picture upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Error uploading profile picture'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// @desc    Get saved properties
// @route   GET /api/users/saved-properties
// @access  Private
router.get('/saved-properties', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedProperties');
    
    res.json({
      success: true,
      count: user.savedProperties?.length || 0,
      data: user.savedProperties || []
    });
  } catch (error) {
    console.error('Get saved properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching saved properties'
    });
  }
});

// @desc    Save property
// @route   POST /api/users/saved-properties/:propertyId
// @access  Private
router.post('/saved-properties/:propertyId', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const user = await User.findById(req.user.id);
    
    // Check if property is already saved
    if (user.savedProperties?.includes(property._id)) {
      return res.status(400).json({
        success: false,
        message: 'Property is already saved'
      });
    }

    // Add property to saved properties
    user.savedProperties = user.savedProperties || [];
    user.savedProperties.push(property._id);
    await user.save();

    // Increment saved count on property
    await Property.findByIdAndUpdate(property._id, { $inc: { savedCount: 1 } });

    res.json({
      success: true,
      message: 'Property saved successfully'
    });
  } catch (error) {
    console.error('Save property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving property'
    });
  }
});

// @desc    Remove saved property
// @route   DELETE /api/users/saved-properties/:propertyId
// @access  Private
router.delete('/saved-properties/:propertyId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.savedProperties?.includes(req.params.propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Property is not saved'
      });
    }

    // Remove property from saved properties
    user.savedProperties = user.savedProperties.filter(
      id => id.toString() !== req.params.propertyId
    );
    await user.save();

    // Decrement saved count on property
    await Property.findByIdAndUpdate(req.params.propertyId, { $inc: { savedCount: -1 } });

    res.json({
      success: true,
      message: 'Property removed from saved list'
    });
  } catch (error) {
    console.error('Remove saved property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing saved property'
    });
  }
});

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    let dashboardData = {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture
      },
      // Count fields for frontend
      propertiesCount: 0,
      inquiriesCount: 0,
      savedCount: 0,
      profileViews: 0,
      // Detailed data
      savedProperties: [],
      recentInquiries: [],
      properties: []
    };

    // Get saved properties count
    if (user.savedProperties?.length > 0) {
      dashboardData.savedProperties = await Property.find({
        _id: { $in: user.savedProperties },
        status: 'available'
      })
      .populate('owner', 'firstName lastName')
      .limit(6);
      dashboardData.savedCount = user.savedProperties.length;
    }

    // Get user's properties count (if owner/agent/admin)
    if (['owner', 'agent', 'admin'].includes(user.role)) {
      dashboardData.properties = await Property.find({
        $or: [
          { owner: user._id },
          { agent: user._id }
        ]
      })
      .populate('owner', 'firstName lastName')
      .populate('agent', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(6);
      dashboardData.propertiesCount = await Property.countDocuments({
        $or: [
          { owner: user._id },
          { agent: user._id }
        ]
      });
    }

    // Get recent inquiries and count
    const Inquiry = require('../models/Inquiry');
    if (user.role === 'tenant') {
      dashboardData.recentInquiries = await Inquiry.find({ tenant: user._id })
        .populate('property', 'title location rent')
        .populate('owner', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(5);
      dashboardData.inquiriesCount = await Inquiry.countDocuments({ tenant: user._id });
    } else if (['owner', 'agent', 'admin'].includes(user.role)) {
      dashboardData.recentInquiries = await Inquiry.find({ owner: user._id })
        .populate('property', 'title location rent')
        .populate('tenant', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(5);
      dashboardData.inquiriesCount = await Inquiry.countDocuments({ owner: user._id });
    }

    // Profile views (placeholder for now)
    dashboardData.profileViews = user.profileViews || 0;

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    let stats = {
      savedProperties: user.savedProperties?.length || 0,
      totalInquiries: 0,
      properties: 0
    };

    // Get inquiry stats
    const Inquiry = require('../models/Inquiry');
    if (user.role === 'tenant') {
      stats.totalInquiries = await Inquiry.countDocuments({ tenant: user._id });
    } else if (['owner', 'agent', 'admin'].includes(user.role)) {
      stats.totalInquiries = await Inquiry.countDocuments({ owner: user._id });
      stats.properties = await Property.countDocuments({
        $or: [
          { owner: user._id },
          { agent: user._id }
        ]
      });
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics'
    });
  }
});

// @desc    Update notification preferences
// @route   PUT /api/users/notifications
// @access  Private
router.put('/notifications', protect, [
  body('notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notification preference must be boolean'),
  body('notifications.sms')
    .optional()
    .isBoolean()
    .withMessage('SMS notification preference must be boolean'),
  body('notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notification preference must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { notifications } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 'preferences.notifications': notifications },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user.preferences.notifications
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notification preferences'
    });
  }
});

// @desc    Deactivate account
// @route   PUT /api/users/deactivate
// @access  Private
router.put('/deactivate', protect, [
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { reason } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        isActive: false,
        deactivationReason: reason,
        deactivatedAt: new Date()
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating account'
    });
  }
});

// @desc    Reactivate account
// @route   PUT /api/users/reactivate
// @access  Private
router.put('/reactivate', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        isActive: true,
        deactivationReason: undefined,
        deactivatedAt: undefined
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Account reactivated successfully',
      data: user
    });
  } catch (error) {
    console.error('Reactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reactivating account'
    });
  }
});

module.exports = router; 