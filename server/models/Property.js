const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },

  // Property Type and Category
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'commercial', 'office', 'shop', 'warehouse', 'plot', 'room', 'portion'],
    required: true
  },
  category: {
    type: String,
    enum: ['residential', 'commercial', 'industrial', 'agricultural'],
    required: true
  },

  // Pricing Information
  rent: {
    type: Number,
    required: [true, 'Rent amount is required'],
    min: [0, 'Rent cannot be negative']
  },
  rentType: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  currency: {
    type: String,
    enum: ['PKR', 'USD'],
    default: 'PKR'
  },
  securityDeposit: {
    type: Number,
    min: [0, 'Security deposit cannot be negative']
  },
  advanceRent: {
    type: Number,
    min: [0, 'Advance rent cannot be negative']
  },

  // Location Information
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      enum: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Other'],
      required: true
    },
    area: {
      type: String,
      required: [true, 'Area is required']
    },
    sector: String, // For Islamabad
    town: String,   // For Lahore
    block: String,  // For various cities
    street: String,
    postalCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },

  // Property Specifications
  specifications: {
    bedrooms: {
      type: Number,
      min: [0, 'Bedrooms cannot be negative'],
      required: function() { return this.category === 'residential'; }
    },
    bathrooms: {
      type: Number,
      min: [0, 'Bathrooms cannot be negative'],
      required: function() { return this.category === 'residential'; }
    },
    kitchens: {
      type: Number,
      min: [0, 'Kitchens cannot be negative'],
      default: 1
    },
    drawingRooms: {
      type: Number,
      min: [0, 'Drawing rooms cannot be negative'],
      default: 1
    },
    servantQuarters: {
      type: Number,
      min: [0, 'Servant quarters cannot be negative'],
      default: 0
    },
    parkingSpaces: {
      type: Number,
      min: [0, 'Parking spaces cannot be negative'],
      default: 0
    }
  },

  // Area Information (Pakistani Units)
  area: {
    size: {
      type: Number,
      required: [true, 'Property size is required'],
      min: [0, 'Size cannot be negative']
    },
    unit: {
      type: String,
      enum: ['marla', 'kanal', 'sqft', 'sqyard', 'acre'],
      required: true
    },
    coveredArea: {
      type: Number,
      min: [0, 'Covered area cannot be negative']
    },
    coveredAreaUnit: {
      type: String,
      enum: ['sqft', 'sqyard'],
      default: 'sqft'
    }
  },

  // Property Features
  features: {
    furnishing: {
      type: String,
      enum: ['unfurnished', 'semi-furnished', 'fully-furnished'],
      default: 'unfurnished'
    },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'average', 'needs-renovation'],
      default: 'good'
    },
    age: {
      type: Number,
      min: [0, 'Age cannot be negative']
    },
    floor: {
      type: Number,
      min: [0, 'Floor cannot be negative']
    },
    totalFloors: {
      type: Number,
      min: [1, 'Total floors must be at least 1']
    }
  },

  // Amenities
  amenities: {
    electricity: { type: Boolean, default: true },
    gas: { type: Boolean, default: true },
    water: { type: Boolean, default: true },
    internet: { type: Boolean, default: false },
    generator: { type: Boolean, default: false },
    backup: { type: Boolean, default: false },
    airConditioning: { type: Boolean, default: false },
    heating: { type: Boolean, default: false },
    elevator: { type: Boolean, default: false },
    security: { type: Boolean, default: false },
    cctv: { type: Boolean, default: false },
    guard: { type: Boolean, default: false },
    garden: { type: Boolean, default: false },
    balcony: { type: Boolean, default: false },
    terrace: { type: Boolean, default: false },
    basement: { type: Boolean, default: false },
    store: { type: Boolean, default: false },
    servantQuarter: { type: Boolean, default: false },
    mosque: { type: Boolean, default: false },
    school: { type: Boolean, default: false },
    hospital: { type: Boolean, default: false },
    market: { type: Boolean, default: false },
    transport: { type: Boolean, default: false }
  },

  // Media
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  videos: [{
    url: String,
    caption: String
  }],
  virtualTour: String,

  // Availability and Status
  status: {
    type: String,
    enum: ['available', 'rented', 'under-maintenance', 'reserved'],
    default: 'available'
  },
  availableFrom: {
    type: Date,
    default: Date.now
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },

  // Owner Information
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Contact Information
  contactInfo: {
    name: String,
    phone: String,
    email: String,
    whatsapp: String,
    preferredContact: {
      type: String,
      enum: ['phone', 'email', 'whatsapp'],
      default: 'phone'
    }
  },

  // Terms and Conditions
  terms: {
    minimumLease: {
      type: Number,
      min: [1, 'Minimum lease must be at least 1 month'],
      default: 6
    },
    petsAllowed: {
      type: Boolean,
      default: false
    },
    smokingAllowed: {
      type: Boolean,
      default: false
    },
    familyOnly: {
      type: Boolean,
      default: false
    },
    bachelorAllowed: {
      type: Boolean,
      default: true
    }
  },

  // Analytics
  views: {
    type: Number,
    default: 0
  },
  inquiries: {
    type: Number,
    default: 0
  },
  savedCount: {
    type: Number,
    default: 0
  },

  // SEO
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  metaTitle: String,
  metaDescription: String,

  // Timestamps
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full address
propertySchema.virtual('fullAddress').get(function() {
  const parts = [
    this.location.address,
    this.location.area,
    this.location.city
  ].filter(Boolean);
  return parts.join(', ');
});

// Virtual for rent per month
propertySchema.virtual('monthlyRent').get(function() {
  if (this.rentType === 'monthly') {
    return this.rent;
  }
  return Math.round(this.rent / 12);
});

// Virtual for price per sqft
propertySchema.virtual('pricePerSqft').get(function() {
  if (this.area.coveredArea && this.area.coveredArea > 0) {
    return Math.round(this.monthlyRent / this.area.coveredArea);
  }
  return null;
});

// Indexes
propertySchema.index({ 'location.city': 1, status: 1 });
propertySchema.index({ 'location.coordinates': '2dsphere' });
propertySchema.index({ rent: 1 });
propertySchema.index({ 'specifications.bedrooms': 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ isFeatured: 1, createdAt: -1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ agent: 1 });
propertySchema.index({ status: 1, availableFrom: 1 });

// Pre-save middleware to generate slug
propertySchema.pre('save', function(next) {
  if (this.isModified('title') || this.isModified('location.city') || this.isModified('location.area')) {
    this.slug = this.generateSlug();
  }
  next();
});

// Instance method to generate slug
propertySchema.methods.generateSlug = function() {
  const title = this.title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
  
  const location = `${this.location.city}-${this.location.area}`.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
  
  return `${title}-${location}-${this._id.toString().slice(-6)}`;
};

// Static method to find available properties
propertySchema.statics.findAvailable = function() {
  return this.find({ status: 'available' });
};

// Static method to find by city
propertySchema.statics.findByCity = function(city) {
  return this.find({ 'location.city': city, status: 'available' });
};

// Static method to find featured properties
propertySchema.statics.findFeatured = function() {
  return this.find({ isFeatured: true, status: 'available' });
};

module.exports = mongoose.model('Property', propertySchema); 