const express = require('express');
const { body, query, validationResult } = require('express-validator');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const Property = require('../models/Property');
const User = require('../models/User');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { sendPropertyUpdateEmail } = require('../services/emailService');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @desc    Get all properties (with search and filters)
// @route   GET /api/properties
// @access  Public
router.get('/', optionalAuth, [
  query('city').optional().isString(),
  query('area').optional().isString(),
  query('propertyType').optional().isIn(['apartment', 'house', 'villa', 'commercial', 'office', 'shop', 'warehouse', 'plot', 'room', 'portion']),
  query('category').optional().isIn(['residential', 'commercial', 'industrial', 'agricultural']),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric(),
  query('bedrooms').optional().isNumeric(),
  query('bathrooms').optional().isNumeric(),
  query('furnishing').optional().isIn(['unfurnished', 'semi-furnished', 'fully-furnished']),
  query('sort').optional().isIn(['price-asc', 'price-desc', 'date-desc', 'date-asc', 'size-asc', 'size-desc', 'newest']),
  query('page').optional().isNumeric(),
  query('limit').optional().isNumeric(),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      city,
      area,
      propertyType,
      category,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      furnishing,
      sort = 'date-desc',
      page = 1,
      limit = 12,
      search
    } = req.query;

    // Build filter object
    const filter = { status: 'available' };

    if (city) filter['location.city'] = city;
    if (area) filter['location.area'] = { $regex: area, $options: 'i' };
    if (propertyType) filter.propertyType = propertyType;
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.rent = {};
      if (minPrice) filter.rent.$gte = parseInt(minPrice);
      if (maxPrice) filter.rent.$lte = parseInt(maxPrice);
    }
    if (bedrooms) filter['specifications.bedrooms'] = { $gte: parseInt(bedrooms) };
    if (bathrooms) filter['specifications.bathrooms'] = { $gte: parseInt(bathrooms) };
    if (furnishing) filter['features.furnishing'] = furnishing;

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.area': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'price-asc':
        sortObj = { rent: 1 };
        break;
      case 'price-desc':
        sortObj = { rent: -1 };
        break;
      case 'date-asc':
        sortObj = { createdAt: 1 };
        break;
      case 'date-desc':
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'size-asc':
        sortObj = { 'area.size': 1 };
        break;
      case 'size-desc':
        sortObj = { 'area.size': -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const properties = await Property.find(filter)
      .populate('owner', 'firstName lastName email phone')
      .populate('agent', 'firstName lastName email phone')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Property.countDocuments(filter);

    // Update view count for each property
    if (req.user) {
      properties.forEach(async (property) => {
        await Property.findByIdAndUpdate(property._id, { $inc: { views: 1 } });
      });
    }

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

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const properties = await Property.find({ 
      isFeatured: true, 
      status: 'available' 
    })
    .populate('owner', 'firstName lastName email phone')
    .populate('agent', 'firstName lastName email phone')
    .sort({ createdAt: -1 })
    .limit(6);

    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error('Get featured properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured properties'
    });
  }
});

// @desc    Get user's properties
// @route   GET /api/properties/my-properties
// @access  Private (Owner/Agent)
router.get('/my-properties', protect, authorize('owner', 'agent', 'admin'), async (req, res) => {
  try {
    const properties = await Property.find({
      $or: [
        { owner: req.user.id },
        { agent: req.user.id }
      ]
    })
    .populate('owner', 'firstName lastName email phone')
    .populate('agent', 'firstName lastName email phone')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error('Get my properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your properties'
    });
  }
});

// @desc    Update property status
// @route   PATCH /api/properties/:id/status
// @access  Private (Owner/Agent)
router.patch('/:id/status', protect, authorize('owner', 'agent', 'admin'), [
  body('status')
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

    const { status } = req.body;

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && property.agent?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    property.status = status;
    await property.save();

    res.json({
      success: true,
      message: 'Property status updated successfully',
      data: property
    });
  } catch (error) {
    console.error('Update property status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating property status'
    });
  }
});

// @desc    Update property featured status
// @route   PATCH /api/properties/:id/featured
// @access  Private (Owner/Agent)
router.patch('/:id/featured', protect, authorize('owner', 'agent', 'admin'), [
  body('isFeatured')
    .isBoolean()
    .withMessage('isFeatured must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { isFeatured } = req.body;

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && property.agent?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    property.isFeatured = isFeatured;
    await property.save();

    res.json({
      success: true,
      message: 'Property featured status updated successfully',
      data: property
    });
  } catch (error) {
    console.error('Update property featured status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating property featured status'
    });
  }
});

// @desc    Get property analytics
// @route   GET /api/properties/:id/analytics
// @access  Private (Owner/Agent)
router.get('/:id/analytics', protect, authorize('owner', 'agent', 'admin'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && property.agent?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view analytics for this property'
      });
    }

    // Get analytics data
    const analytics = {
      views: property.views,
      inquiries: property.inquiries,
      savedCount: property.savedCount,
      daysListed: Math.floor((Date.now() - property.createdAt) / (1000 * 60 * 60 * 24)),
      averageViewsPerDay: property.views > 0 ? (property.inquiries / property.views * 100).toFixed(2) : 0
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get property analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching property analytics'
    });
  }
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone')
      .populate('agent', 'firstName lastName email phone');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Increment view count
    await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching property'
    });
  }
});

// @desc    Create property
// @route   POST /api/properties
// @access  Private (Owner/Agent)
router.post('/', protect, authorize('owner', 'agent', 'admin'), upload.array('images', 10), [
  body('title')
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage('Title must be between 10 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Description must be between 50 and 2000 characters'),
  body('propertyType')
    .isIn(['apartment', 'house', 'villa', 'commercial', 'office', 'shop', 'warehouse', 'plot', 'room', 'portion'])
    .withMessage('Invalid property type'),
  body('category')
    .isIn(['residential', 'commercial', 'industrial', 'agricultural'])
    .withMessage('Invalid category'),
  body('rent')
    .isNumeric()
    .withMessage('Rent must be a number'),
  body('location.city')
    .isIn(['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Other'])
    .withMessage('Please select a valid city'),
  body('location.area')
    .trim()
    .notEmpty()
    .withMessage('Area is required'),
  body('area.size')
    .isNumeric()
    .withMessage('Property size must be a number'),
  body('area.unit')
    .isIn(['marla', 'kanal', 'sqft', 'sqyard', 'acre'])
    .withMessage('Invalid area unit')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const propertyData = req.body;
    propertyData.owner = req.user.id;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file, index) => {
        const result = await cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'pakproperty',
            transformation: [
              { width: 800, height: 600, crop: 'fill' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) throw error;
            return result;
          }
        );

        const stream = cloudinary.uploader.upload_stream(result, (error, result) => {
          if (error) throw error;
          return result;
        });

        stream.end(file.buffer);
      });

      const uploadResults = await Promise.all(uploadPromises);
      propertyData.images = uploadResults.map((result, index) => ({
        url: result.secure_url,
        caption: req.body[`imageCaption${index}`] || '',
        isPrimary: index === 0,
        order: index
      }));
    }

    const property = await Property.create(propertyData);

    // Send notification email
    try {
      await sendPropertyUpdateEmail(req.user, property);
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    res.status(201).json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating property'
    });
  }
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner/Agent)
router.put('/:id', protect, authorize('owner', 'agent', 'admin'), upload.array('images', 10), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && property.agent?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    const updateData = req.body;

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file, index) => {
        const result = await cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'pakproperty',
            transformation: [
              { width: 800, height: 600, crop: 'fill' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) throw error;
            return result;
          }
        );

        const stream = cloudinary.uploader.upload_stream(result, (error, result) => {
          if (error) throw error;
          return result;
        });

        stream.end(file.buffer);
      });

      const uploadResults = await Promise.all(uploadPromises);
      const newImages = uploadResults.map((result, index) => ({
        url: result.secure_url,
        caption: req.body[`imageCaption${index}`] || '',
        isPrimary: false,
        order: property.images.length + index
      }));

      updateData.images = [...property.images, ...newImages];
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedProperty
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating property'
    });
  }
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner/Agent)
router.delete('/:id', protect, authorize('owner', 'agent', 'admin'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && property.agent?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
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

module.exports = router; 