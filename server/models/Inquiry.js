const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  // Property Information
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },

  // Tenant Information
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Owner/Agent Information
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Inquiry Details
  type: {
    type: String,
    enum: ['general', 'viewing', 'rental', 'question'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'viewing-scheduled', 'rented', 'rejected', 'expired'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  // Contact Information
  contactInfo: {
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^(\+92|0)?[0-9]{10}$/, 'Please enter a valid Pakistani phone number']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    whatsapp: String,
    preferredContact: {
      type: String,
      enum: ['phone', 'email', 'whatsapp'],
      default: 'phone'
    }
  },

  // Inquiry Message
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },

  // Tenant Requirements
  requirements: {
    moveInDate: Date,
    leaseDuration: {
      type: Number,
      min: [1, 'Lease duration must be at least 1 month'],
      max: [60, 'Lease duration cannot exceed 60 months']
    },
    budget: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        enum: ['PKR', 'USD'],
        default: 'PKR'
      }
    },
    occupants: {
      adults: {
        type: Number,
        min: [1, 'At least 1 adult is required'],
        default: 1
      },
      children: {
        type: Number,
        min: [0, 'Children cannot be negative'],
        default: 0
      },
      pets: {
        type: Boolean,
        default: false
      }
    },
    employment: {
      type: String,
      enum: ['employed', 'self-employed', 'student', 'retired', 'other']
    },
    income: {
      type: Number,
      min: [0, 'Income cannot be negative']
    }
  },

  // Viewing Details
  viewing: {
    requestedDate: Date,
    scheduledDate: Date,
    completedDate: Date,
    notes: String,
    feedback: {
      rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
      },
      comments: String
    }
  },

  // Communication History
  communication: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'whatsapp', 'call', 'in-app'],
      required: true
    },
    direction: {
      type: String,
      enum: ['inbound', 'outbound'],
      required: true
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'failed'],
      default: 'sent'
    }
  }],

  // Response Information
  response: {
    message: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    nextAction: {
      type: String,
      enum: ['schedule-viewing', 'send-documents', 'negotiate-price', 'reject', 'accept']
    }
  },

  // Follow-up
  followUp: {
    scheduledDate: Date,
    completedDate: Date,
    notes: String,
    nextAction: String
  },

  // Analytics
  readAt: Date,
  respondedAt: Date,
  totalInteractions: {
    type: Number,
    default: 0
  },

  // Metadata
  source: {
    type: String,
    enum: ['website', 'mobile-app', 'phone', 'email', 'whatsapp'],
    default: 'website'
  },
  ipAddress: String,
  userAgent: String,

  // Timestamps
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for isExpired
inquirySchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

// Virtual for responseTime
inquirySchema.virtual('responseTime').get(function() {
  if (this.response && this.response.respondedAt) {
    return this.response.respondedAt - this.createdAt;
  }
  return null;
});

// Virtual for daysSinceInquiry
inquirySchema.virtual('daysSinceInquiry').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Indexes
inquirySchema.index({ property: 1, tenant: 1 });
inquirySchema.index({ owner: 1, status: 1 });
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ priority: 1, createdAt: -1 });
inquirySchema.index({ expiresAt: 1 });
inquirySchema.index({ 'viewing.scheduledDate': 1 });
inquirySchema.index({ tenant: 1, createdAt: -1 });

// Pre-save middleware
inquirySchema.pre('save', function(next) {
  // Set expiration date if not set
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }
  
  // Update property inquiry count
  if (this.isNew) {
    this.constructor.updatePropertyInquiryCount(this.property, 1);
  }
  
  next();
});

// Pre-remove middleware
inquirySchema.pre('remove', function(next) {
  this.constructor.updatePropertyInquiryCount(this.property, -1);
  next();
});

// Static method to update property inquiry count
inquirySchema.statics.updatePropertyInquiryCount = async function(propertyId, increment) {
  const Property = mongoose.model('Property');
  await Property.findByIdAndUpdate(propertyId, {
    $inc: { inquiries: increment }
  });
};

// Static method to find pending inquiries
inquirySchema.statics.findPending = function() {
  return this.find({ status: 'pending' });
};

// Static method to find inquiries by owner
inquirySchema.statics.findByOwner = function(ownerId) {
  return this.find({ owner: ownerId }).populate('property tenant');
};

// Static method to find inquiries by tenant
inquirySchema.statics.findByTenant = function(tenantId) {
  return this.find({ tenant: tenantId }).populate('property owner');
};

// Static method to find expired inquiries
inquirySchema.statics.findExpired = function() {
  return this.find({ expiresAt: { $lt: new Date() }, status: 'pending' });
};

// Instance method to mark as read
inquirySchema.methods.markAsRead = function() {
  this.readAt = new Date();
  return this.save();
};

// Instance method to respond to inquiry
inquirySchema.methods.respond = function(message, respondedBy, nextAction) {
  this.response = {
    message,
    respondedAt: new Date(),
    respondedBy,
    nextAction
  };
  this.status = 'responded';
  return this.save();
};

// Instance method to schedule viewing
inquirySchema.methods.scheduleViewing = function(scheduledDate, notes) {
  this.viewing.scheduledDate = scheduledDate;
  this.viewing.notes = notes;
  this.status = 'viewing-scheduled';
  return this.save();
};

// Instance method to add communication record
inquirySchema.methods.addCommunication = function(type, direction, message) {
  this.communication.push({
    type,
    direction,
    message,
    timestamp: new Date()
  });
  this.totalInteractions += 1;
  return this.save();
};

module.exports = mongoose.model('Inquiry', inquirySchema); 