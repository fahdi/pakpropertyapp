const express = require('express');
const { body, validationResult } = require('express-validator');

const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { sendInquiryNotification } = require('../services/emailService');

const router = express.Router();

// @desc    Create inquiry
// @route   POST /api/inquiries
// @access  Private
router.post('/', protect, [
  body('propertyId')
    .isMongoId()
    .withMessage('Valid property ID is required'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  body('type')
    .optional()
    .isIn(['general', 'viewing', 'rental', 'question'])
    .withMessage('Invalid inquiry type'),
  body('requirements.moveInDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid move-in date'),
  body('requirements.leaseDuration')
    .optional()
    .isInt({ min: 1, max: 60 })
    .withMessage('Lease duration must be between 1 and 60 months'),
  body('requirements.budget.min')
    .optional()
    .isNumeric()
    .withMessage('Minimum budget must be a number'),
  body('requirements.budget.max')
    .optional()
    .isNumeric()
    .withMessage('Maximum budget must be a number'),
  body('requirements.occupants.adults')
    .optional()
    .isInt({ min: 1 })
    .withMessage('At least 1 adult is required'),
  body('requirements.occupants.children')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Children count cannot be negative'),
  body('contactInfo.name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('contactInfo.phone')
    .matches(/^(\+92|0)?[0-9]{10}$/)
    .withMessage('Please provide a valid Pakistani phone number'),
  body('contactInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { propertyId, message, type, requirements, contactInfo } = req.body;

    // Check if property exists and is available
    const property = await Property.findById(propertyId)
      .populate('owner', 'firstName lastName email phone')
      .populate('agent', 'firstName lastName email phone');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for inquiry'
      });
    }

    // Check if user has already inquired about this property
    const existingInquiry = await Inquiry.findOne({
      property: propertyId,
      tenant: req.user.id,
      status: { $in: ['pending', 'responded', 'viewing-scheduled'] }
    });

    if (existingInquiry) {
      return res.status(400).json({
        success: false,
        message: 'You have already inquired about this property'
      });
    }

    // Create inquiry
    const inquiryData = {
      property: propertyId,
      tenant: req.user.id,
      owner: property.owner._id,
      type: type || 'general',
      message,
      requirements,
      contactInfo: {
        ...contactInfo,
        name: req.user.fullName,
        phone: req.user.phone,
        email: req.user.email
      },
      source: 'website',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    const inquiry = await Inquiry.create(inquiryData);

    // Populate references for response
    await inquiry.populate('property tenant owner');

    // Send notification email to property owner
    try {
      await sendInquiryNotification(inquiry, property, req.user);
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry sent successfully',
      data: inquiry
    });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending inquiry'
    });
  }
});

// @desc    Get user's inquiries (as tenant)
// @route   GET /api/inquiries/my-inquiries
// @access  Private
router.get('/my-inquiries', protect, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ tenant: req.user.id })
      .populate('property', 'title location rent images')
      .populate('owner', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    console.error('Get my inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your inquiries'
    });
  }
});

// @desc    Get received inquiries (as owner/agent)
// @route   GET /api/inquiries/received
// @access  Private (Owner/Agent)
router.get('/received', protect, authorize('owner', 'agent', 'admin'), async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ owner: req.user.id })
      .populate('property', 'title location rent images')
      .populate('tenant', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    console.error('Get received inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching received inquiries'
    });
  }
});

// @desc    Get single inquiry
// @route   GET /api/inquiries/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('property', 'title location rent images')
      .populate('tenant', 'firstName lastName email phone')
      .populate('owner', 'firstName lastName email phone');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Check if user has access to this inquiry
    if (inquiry.tenant.toString() !== req.user.id && inquiry.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this inquiry'
      });
    }

    // Mark as read if owner is viewing
    if (inquiry.owner.toString() === req.user.id && !inquiry.readAt) {
      await inquiry.markAsRead();
    }

    res.json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Get inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inquiry'
    });
  }
});

// @desc    Respond to inquiry
// @route   PUT /api/inquiries/:id/respond
// @access  Private (Owner/Agent)
router.put('/:id/respond', protect, authorize('owner', 'agent', 'admin'), [
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Response message must be between 10 and 1000 characters'),
  body('nextAction')
    .optional()
    .isIn(['schedule-viewing', 'send-documents', 'negotiate-price', 'reject', 'accept'])
    .withMessage('Invalid next action')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { message, nextAction } = req.body;

    const inquiry = await Inquiry.findById(req.params.id)
      .populate('property tenant');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Check if user is the owner of the property
    if (inquiry.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this inquiry'
      });
    }

    // Update inquiry with response
    await inquiry.respond(message, req.user.id, nextAction);

    // Add communication record
    await inquiry.addCommunication('email', 'outbound', message);

    res.json({
      success: true,
      message: 'Response sent successfully',
      data: inquiry
    });
  } catch (error) {
    console.error('Respond to inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error responding to inquiry'
    });
  }
});

// @desc    Schedule viewing
// @route   PUT /api/inquiries/:id/schedule-viewing
// @access  Private (Owner/Agent)
router.put('/:id/schedule-viewing', protect, authorize('owner', 'agent', 'admin'), [
  body('scheduledDate')
    .isISO8601()
    .withMessage('Valid scheduled date is required'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { scheduledDate, notes } = req.body;

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Check if user is the owner of the property
    if (inquiry.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to schedule viewing for this inquiry'
      });
    }

    // Schedule viewing
    await inquiry.scheduleViewing(new Date(scheduledDate), notes);

    res.json({
      success: true,
      message: 'Viewing scheduled successfully',
      data: inquiry
    });
  } catch (error) {
    console.error('Schedule viewing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling viewing'
    });
  }
});

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id/status
// @access  Private (Owner/Agent)
router.put('/:id/status', protect, authorize('owner', 'agent', 'admin'), [
  body('status')
    .isIn(['pending', 'responded', 'viewing-scheduled', 'rented', 'rejected', 'expired'])
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

    const { status } = req.body;

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Check if user is the owner of the property
    if (inquiry.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this inquiry'
      });
    }

    inquiry.status = status;
    await inquiry.save();

    res.json({
      success: true,
      message: 'Inquiry status updated successfully',
      data: inquiry
    });
  } catch (error) {
    console.error('Update inquiry status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating inquiry status'
    });
  }
});

// @desc    Get inquiry statistics
// @route   GET /api/inquiries/stats
// @access  Private (Owner/Agent)
router.get('/stats', protect, authorize('owner', 'agent', 'admin'), async (req, res) => {
  try {
    const stats = await Inquiry.aggregate([
      { $match: { owner: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalInquiries = await Inquiry.countDocuments({ owner: req.user._id });
    const pendingInquiries = await Inquiry.countDocuments({ 
      owner: req.user._id, 
      status: 'pending' 
    });
    const respondedInquiries = await Inquiry.countDocuments({ 
      owner: req.user._id, 
      status: 'responded' 
    });

    const responseRate = totalInquiries > 0 ? (respondedInquiries / totalInquiries * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        total: totalInquiries,
        pending: pendingInquiries,
        responded: respondedInquiries,
        responseRate: parseFloat(responseRate),
        statusBreakdown: stats
      }
    });
  } catch (error) {
    console.error('Get inquiry stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inquiry statistics'
    });
  }
});

module.exports = router; 