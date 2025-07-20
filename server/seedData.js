const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Property = require('./models/Property');

const connectDB = require('./config/database');

// Multiple Agents with different specializations
const sampleUsers = [
  // Agent 1 - Karachi Specialist
  {
    firstName: "Ahmed",
    lastName: "Khan",
    email: "ahmed@khanproperties.com",
    password: "password123",
    phone: "03001234567",
    gender: "male",
    role: "agent",
    isVerified: true,
    address: {
      city: "Karachi",
      street: "DHA Phase 6",
      area: "Block 4"
    },
    agentInfo: {
      licenseNumber: "AG123456",
      companyName: "Khan Properties",
      experience: 8,
      specializations: ["residential", "commercial", "luxury"],
      isVerified: true
    }
  },
  
  // Agent 2 - Lahore Specialist
  {
    firstName: "Fatima",
    lastName: "Hassan",
    email: "fatima@capitalproperties.com",
    password: "password123",
    phone: "03002345678",
    gender: "female",
    role: "agent",
    isVerified: true,
    address: {
      city: "Lahore",
      street: "Gulberg III",
      area: "Block A"
    },
    agentInfo: {
      licenseNumber: "AG789012",
      companyName: "Capital Properties",
      experience: 12,
      specializations: ["residential", "luxury", "villa"],
      isVerified: true
    }
  },
  
  // Agent 3 - Islamabad Specialist
  {
    firstName: "Usman",
    lastName: "Ali",
    email: "usman@islamabadproperties.com",
    password: "password123",
    phone: "03003456789",
    gender: "male",
    role: "agent",
    isVerified: true,
    address: {
      city: "Islamabad",
      street: "F-7/1",
      area: "Street 12"
    },
    agentInfo: {
      licenseNumber: "AG345678",
      companyName: "Islamabad Properties",
      experience: 6,
      specializations: ["residential", "commercial"],
      isVerified: true
    }
  },
  
  // Agent 4 - Multi-city Specialist
  {
    firstName: "Ayesha",
    lastName: "Raza",
    email: "ayesha@multiproperties.com",
    password: "password123",
    phone: "03004567890",
    gender: "female",
    role: "agent",
    isVerified: true,
    address: {
      city: "Karachi",
      street: "Clifton",
      area: "Block 4"
    },
    agentInfo: {
      licenseNumber: "AG901234",
      companyName: "Multi Properties",
      experience: 15,
      specializations: ["residential", "commercial", "luxury", "villa"],
      isVerified: true
    }
  },
  
  // Agent 5 - Commercial Specialist
  {
    firstName: "Bilal",
    lastName: "Ahmed",
    email: "bilal@commercialproperties.com",
    password: "password123",
    phone: "03005678901",
    gender: "male",
    role: "agent",
    isVerified: true,
    address: {
      city: "Lahore",
      street: "Gulberg III",
      area: "Commercial Area"
    },
    agentInfo: {
      licenseNumber: "AG567890",
      companyName: "Commercial Properties Ltd",
      experience: 10,
      specializations: ["commercial", "office", "shop"],
      isVerified: true
    }
  },
  
  // Agent 6 - Student Housing Specialist
  {
    firstName: "Sana",
    lastName: "Khan",
    email: "sana@studenthousing.com",
    password: "password123",
    phone: "03006789012",
    gender: "female",
    role: "agent",
    isVerified: true,
    address: {
      city: "Karachi",
      street: "Gulshan-e-Iqbal",
      area: "Block 6"
    },
    agentInfo: {
      licenseNumber: "AG234567",
      companyName: "Student Housing Solutions",
      experience: 5,
      specializations: ["residential", "student-housing"],
      isVerified: true
    }
  },
  
  // Regular Users/Tenants
  {
    firstName: "Sarah",
    lastName: "Ahmed",
    email: "sarah@example.com", 
    password: "password123",
    phone: "03007890123",
    gender: "female",
    role: "tenant",
    isVerified: true,
    address: {
      city: "Lahore",
      street: "Gulberg III",
      area: "Block A"
    }
  },
  {
    firstName: "Ali",
    lastName: "Raza",
    email: "ali@example.com",
    password: "password123",
    phone: "03008901234",
    gender: "male",
    role: "tenant",
    isVerified: true,
    address: {
      city: "Karachi",
      street: "Clifton",
      area: "Block 4"
    }
  },
  {
    firstName: "Zara",
    lastName: "Hassan",
    email: "zara@example.com",
    password: "password123",
    phone: "03009012345",
    gender: "female",
    role: "tenant",
    isVerified: true,
    address: {
      city: "Islamabad",
      street: "F-7/1",
      area: "Street 12"
    }
  },
  
  // Admin User
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@pakproperty.com",
    password: "Admin123!",
    phone: "03009999999",
    gender: "male",
    role: "admin",
    isVerified: true,
    address: {
      city: "Islamabad",
      street: "F-7/1",
      area: "Street 1"
    }
  }
];

const sampleProperties = [
  // KARACHI PROPERTIES - Ahmed Khan (Agent 1)
  {
    title: "Modern Apartment in DHA Phase 6",
    description: "Beautiful 2-bedroom apartment with modern amenities, located in the heart of DHA Phase 6. Features include a fully equipped kitchen, spacious living room, and balcony with city views.",
    propertyType: "apartment",
    category: "residential",
    status: "available",
    rent: 45000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "Block 4, DHA Phase 6",
      city: "Karachi",
      area: "DHA Phase 6",
      block: "4",
      coordinates: {
        latitude: 24.8607,
        longitude: 67.0011
      }
    },
    specifications: {
      bedrooms: 2,
      bathrooms: 2,
      kitchens: 1,
      drawingRooms: 1,
      parkingSpaces: 1
    },
    area: {
      size: 1200,
      unit: "sqft",
      coveredArea: 1000,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "semi-furnished",
      condition: "excellent",
      age: 2,
      floor: 3,
      totalFloors: 8
    },
    amenities: {
      electricity: true,
      gas: true,
      water: true,
      internet: true,
      generator: true,
      backup: true,
      airConditioning: true,
      elevator: true,
      security: true,
      cctv: true,
      guard: true,
      balcony: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        caption: "Living Room",
        isPrimary: true,
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800",
        caption: "Kitchen",
        isPrimary: false,
        order: 2
      }
    ],
    contactInfo: {
      name: "Ahmed Khan",
      phone: "03001234567",
      email: "ahmed@khanproperties.com",
      preferredContact: "phone"
    },
    isFeatured: true,
    isVerified: true
  },
  {
    title: "Luxury Penthouse in Clifton",
    description: "Exclusive 3-bedroom penthouse with panoramic sea views. Located in the prestigious Clifton area with premium amenities and 24/7 security.",
    propertyType: "apartment",
    category: "residential",
    status: "available",
    rent: 180000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "Clifton Block 4",
      city: "Karachi",
      area: "Clifton",
      block: "4",
      coordinates: {
        latitude: 24.8138,
        longitude: 67.0222
      }
    },
    specifications: {
      bedrooms: 3,
      bathrooms: 3,
      kitchens: 1,
      drawingRooms: 2,
      parkingSpaces: 2
    },
    area: {
      size: 2500,
      unit: "sqft",
      coveredArea: 2200,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "fully-furnished",
      condition: "excellent",
      age: 1,
      floor: 15,
      totalFloors: 20
    },
    amenities: {
      electricity: true,
      gas: true,
      water: true,
      internet: true,
      generator: true,
      backup: true,
      airConditioning: true,
      elevator: true,
      security: true,
      cctv: true,
      guard: true,
      balcony: true,
      swimmingPool: true,
      gym: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        caption: "Penthouse View",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Ahmed Khan",
      phone: "03001234567",
      email: "ahmed@khanproperties.com",
      preferredContact: "phone"
    },
    isFeatured: true,
    isVerified: true
  },
  {
    title: "Commercial Office Space in DHA",
    description: "Prime commercial office space in DHA Phase 8. Perfect for businesses looking for a prestigious address with modern facilities.",
    propertyType: "office",
    category: "commercial",
    status: "available",
    rent: 85000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "DHA Phase 8, Commercial Area",
      city: "Karachi",
      area: "DHA Phase 8",
      coordinates: {
        latitude: 24.8607,
        longitude: 67.0011
      }
    },
    specifications: {
      bedrooms: 0,
      bathrooms: 2,
      kitchens: 0,
      drawingRooms: 0,
      parkingSpaces: 5
    },
    area: {
      size: 2000,
      unit: "sqft",
      coveredArea: 1800,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "unfurnished",
      condition: "excellent",
      age: 3,
      floor: 2,
      totalFloors: 8
    },
    amenities: {
      electricity: true,
      gas: true,
      water: true,
      internet: true,
      generator: true,
      backup: true,
      airConditioning: true,
      elevator: true,
      security: true,
      cctv: true,
      guard: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        caption: "Office Space",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Ahmed Khan",
      phone: "03001234567",
      email: "ahmed@khanproperties.com",
      preferredContact: "phone"
    },
    isFeatured: false,
    isVerified: true
  },

  // KARACHI PROPERTIES - Sana Khan (Agent 6 - Student Housing)
  {
    title: "Student Studio Apartment in Gulshan-e-Iqbal",
    description: "Compact studio apartment perfect for students or young professionals. Located near universities and shopping centers.",
    propertyType: "apartment",
    category: "residential",
    status: "available",
    rent: 22000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "Gulshan-e-Iqbal Block 6",
      city: "Karachi",
      area: "Gulshan-e-Iqbal",
      block: "6",
      coordinates: {
        latitude: 24.9207,
        longitude: 67.0981
      }
    },
    specifications: {
      bedrooms: 1,
      bathrooms: 1,
      kitchens: 1,
      drawingRooms: 1,
      parkingSpaces: 0
    },
    area: {
      size: 400,
      unit: "sqft",
      coveredArea: 350,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "semi-furnished",
      condition: "good",
      age: 8,
      floor: 2,
      totalFloors: 5
    },
    amenities: {
      electricity: true,
      gas: true,
      water: true,
      internet: true,
      airConditioning: true,
      security: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        caption: "Studio View",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Sana Khan",
      phone: "03006789012",
      email: "sana@studenthousing.com",
      preferredContact: "phone"
    },
    isFeatured: false,
    isVerified: true
  },
  {
    title: "Shared Student Accommodation near KU",
    description: "Shared accommodation for students near Karachi University. Individual rooms with shared kitchen and living area.",
    propertyType: "room",
    category: "residential",
    status: "available",
    rent: 15000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "Near Karachi University",
      city: "Karachi",
      area: "Gulshan-e-Iqbal",
      coordinates: {
        latitude: 24.9207,
        longitude: 67.0981
      }
    },
    specifications: {
      bedrooms: 1,
      bathrooms: 1,
      kitchens: 0,
      drawingRooms: 0,
      parkingSpaces: 0
    },
    area: {
      size: 200,
      unit: "sqft",
      coveredArea: 180,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "semi-furnished",
      condition: "good",
      age: 5,
      floor: 1,
      totalFloors: 3
    },
    amenities: {
      electricity: true,
      gas: true,
      water: true,
      internet: true,
      airConditioning: true,
      security: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        caption: "Student Room",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Sana Khan",
      phone: "03006789012",
      email: "sana@studenthousing.com",
      preferredContact: "whatsapp"
    },
    isFeatured: false,
    isVerified: true
  },

  // LAHORE PROPERTIES - Fatima Hassan (Agent 2)
  {
    title: "Luxury Villa in Bahria Town",
    description: "Stunning 4-bedroom villa with private garden and swimming pool. Located in the prestigious Bahria Town community with 24/7 security and modern amenities.",
    propertyType: "villa",
    category: "residential",
    status: "available",
    rent: 150000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "Block 12, Bahria Town",
      city: "Lahore",
      area: "Bahria Town",
      block: "12",
      coordinates: {
        latitude: 31.5204,
        longitude: 74.3587
      }
    },
    specifications: {
      bedrooms: 4,
      bathrooms: 4,
      kitchens: 1,
      drawingRooms: 2,
      servantQuarters: 1,
      parkingSpaces: 3
    },
    area: {
      size: 5000,
      unit: "sqft",
      coveredArea: 4000,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "fully-furnished",
      condition: "excellent",
      age: 2,
      floor: 1,
      totalFloors: 2
    },
    amenities: {
      electricity: true,
      gas: true,
      water: true,
      internet: true,
      generator: true,
      backup: true,
      airConditioning: true,
      security: true,
      cctv: true,
      guard: true,
      garden: true,
      swimmingPool: true,
      servantQuarter: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        caption: "Villa Exterior",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Fatima Hassan",
      phone: "03002345678",
      email: "fatima@capitalproperties.com",
      preferredContact: "phone"
    },
    isFeatured: true,
    isVerified: true
  },
  {
    title: "Modern Apartment in Gulberg III",
    description: "Spacious 3-bedroom apartment in the heart of Gulberg III. Close to shopping centers, restaurants, and public transport.",
    propertyType: "apartment",
    category: "residential",
    status: "available",
    rent: 65000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "Gulberg III, Main Boulevard",
      city: "Lahore",
      area: "Gulberg III",
      coordinates: {
        latitude: 31.5204,
        longitude: 74.3587
      }
    },
    specifications: {
      bedrooms: 3,
      bathrooms: 2,
      kitchens: 1,
      drawingRooms: 1,
      parkingSpaces: 2
    },
    area: {
      size: 1800,
      unit: "sqft",
      coveredArea: 1600,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "semi-furnished",
      condition: "excellent",
      age: 3,
      floor: 5,
      totalFloors: 12
    },
    amenities: {
      electricity: true,
      gas: true,
      water: true,
      internet: true,
      generator: true,
      backup: true,
      airConditioning: true,
      elevator: true,
      security: true,
      cctv: true,
      guard: true,
      balcony: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        caption: "Living Room",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Fatima Hassan",
      phone: "03002345678",
      email: "fatima@capitalproperties.com",
      preferredContact: "phone"
    },
    isFeatured: false,
    isVerified: true
  },

  // LAHORE PROPERTIES - Bilal Ahmed (Agent 5 - Commercial)
  {
    title: "Commercial Shop in Gulberg III",
    description: "Prime commercial shop space in Gulberg III. High foot traffic area perfect for retail businesses.",
    propertyType: "shop",
    category: "commercial",
    status: "available",
    rent: 75000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "Gulberg III, Commercial Area",
      city: "Lahore",
      area: "Gulberg III",
      coordinates: {
        latitude: 31.5204,
        longitude: 74.3587
      }
    },
    specifications: {
      bedrooms: 0,
      bathrooms: 1,
      kitchens: 0,
      drawingRooms: 0,
      parkingSpaces: 2
    },
    area: {
      size: 800,
      unit: "sqft",
      coveredArea: 750,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "unfurnished",
      condition: "excellent",
      age: 2,
      floor: 1,
      totalFloors: 3
    },
    amenities: {
      electricity: true,
      gas: true,
      water: true,
      internet: true,
      generator: true,
      backup: true,
      airConditioning: true,
      security: true,
      cctv: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        caption: "Commercial Shop",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Bilal Ahmed",
      phone: "03005678901",
      email: "bilal@commercialproperties.com",
      preferredContact: "phone"
    },
    isFeatured: false,
    isVerified: true
  },

  // ISLAMABAD PROPERTIES - Usman Ali (Agent 3)
  {
    title: "Luxury Apartment in F-7",
    description: "Premium 3-bedroom apartment in the prestigious F-7 sector. Close to diplomatic enclave and major landmarks.",
    propertyType: "apartment",
    category: "residential",
    status: "available",
    rent: 95000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "F-7/1, Street 12",
      city: "Islamabad",
      area: "F-7",
      sector: "F-7",
      coordinates: {
        latitude: 33.7294,
        longitude: 73.0931
      }
    },
    specifications: {
      bedrooms: 3,
      bathrooms: 3,
      kitchens: 1,
      drawingRooms: 2,
      parkingSpaces: 2
    },
    area: {
      size: 2200,
      unit: "sqft",
      coveredArea: 2000,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "fully-furnished",
      condition: "excellent",
      age: 1,
      floor: 8,
      totalFloors: 15
    },
    amenities: {
      electricity: true,
      gas: true,
      water: true,
      internet: true,
      generator: true,
      backup: true,
      airConditioning: true,
      elevator: true,
      security: true,
      cctv: true,
      guard: true,
      balcony: true,
      gym: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        caption: "Luxury Apartment",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Usman Ali",
      phone: "03003456789",
      email: "usman@islamabadproperties.com",
      preferredContact: "phone"
    },
    isFeatured: true,
    isVerified: true
  },
  {
    title: "Commercial Office in Blue Area",
    description: "Professional office space in Blue Area, Islamabad's main commercial district. Perfect for corporate offices.",
    propertyType: "office",
    category: "commercial",
    status: "available",
    rent: 120000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "Blue Area, Jinnah Avenue",
      city: "Islamabad",
      area: "Blue Area",
      coordinates: {
        latitude: 33.7294,
        longitude: 73.0931
      }
    },
    specifications: {
      bedrooms: 0,
      bathrooms: 3,
      kitchens: 0,
      drawingRooms: 0,
      parkingSpaces: 8
    },
    area: {
      size: 3000,
      unit: "sqft",
      coveredArea: 2800,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "unfurnished",
      condition: "excellent",
      age: 3,
      floor: 5,
      totalFloors: 12
    },
    amenities: {
      electricity: true,
      gas: true,
      water: true,
      internet: true,
      generator: true,
      backup: true,
      airConditioning: true,
      elevator: true,
      security: true,
      cctv: true,
      guard: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        caption: "Office Space",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Usman Ali",
      phone: "03003456789",
      email: "usman@islamabadproperties.com",
      preferredContact: "phone"
    },
    isFeatured: false,
    isVerified: true
  },

  // MULTI-CITY PROPERTIES - Ayesha Raza (Agent 4)
  {
    title: "Luxury Villa in DHA Karachi",
    description: "Exclusive 5-bedroom villa with private pool and garden. Located in the most prestigious area of DHA.",
    propertyType: "villa",
    category: "residential",
    status: "available",
    rent: 250000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "DHA Phase 8, Block 15",
      city: "Karachi",
      area: "DHA Phase 8",
      block: "15",
      coordinates: {
        latitude: 24.8607,
        longitude: 67.0011
      }
    },
    specifications: {
      bedrooms: 5,
      bathrooms: 5,
      kitchens: 2,
      drawingRooms: 3,
      servantQuarters: 2,
      parkingSpaces: 4
    },
    area: {
      size: 8000,
      unit: "sqft",
      coveredArea: 6500,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "fully-furnished",
      condition: "excellent",
      age: 1,
      floor: 1,
      totalFloors: 2
    },
    amenities: {
      electricity: true,
      gas: true,
      water: true,
      internet: true,
      generator: true,
      backup: true,
      airConditioning: true,
      security: true,
      cctv: true,
      guard: true,
      garden: true,
      swimmingPool: true,
      servantQuarter: true,
      gym: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        caption: "Luxury Villa",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Ayesha Raza",
      phone: "03004567890",
      email: "ayesha@multiproperties.com",
      preferredContact: "phone"
    },
    isFeatured: true,
    isVerified: true
  },
  {
    title: "Premium Apartment in Gulberg Lahore",
    description: "High-end 4-bedroom apartment with panoramic city views. Located in the most sought-after area of Gulberg.",
    propertyType: "apartment",
    category: "residential",
    status: "available",
    rent: 180000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "Gulberg III, Premium Block",
      city: "Lahore",
      area: "Gulberg III",
      coordinates: {
        latitude: 31.5204,
        longitude: 74.3587
      }
    },
    specifications: {
      bedrooms: 4,
      bathrooms: 4,
      kitchens: 1,
      drawingRooms: 2,
      parkingSpaces: 3
    },
    area: {
      size: 3000,
      unit: "sqft",
      coveredArea: 2800,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "fully-furnished",
      condition: "excellent",
      age: 2,
      floor: 12,
      totalFloors: 20
    },
    amenities: {
      electricity: true,
      gas: true,
      water: true,
      internet: true,
      generator: true,
      backup: true,
      airConditioning: true,
      elevator: true,
      security: true,
      cctv: true,
      guard: true,
      balcony: true,
      gym: true,
      swimmingPool: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        caption: "Premium Apartment",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Ayesha Raza",
      phone: "03004567890",
      email: "ayesha@multiproperties.com",
      preferredContact: "phone"
    },
    isFeatured: true,
    isVerified: true
  },
  {
    title: "Executive Office in F-8 Islamabad",
    description: "Executive office space in F-8 sector. Perfect for high-profile businesses and diplomatic missions.",
    propertyType: "office",
    category: "commercial",
    status: "available",
    rent: 150000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "F-8/1, Street 15",
      city: "Islamabad",
      area: "F-8",
      sector: "F-8",
      coordinates: {
        latitude: 33.7294,
        longitude: 73.0931
      }
    },
    specifications: {
      bedrooms: 0,
      bathrooms: 4,
      kitchens: 0,
      drawingRooms: 0,
      parkingSpaces: 10
    },
    area: {
      size: 4000,
      unit: "sqft",
      coveredArea: 3800,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "unfurnished",
      condition: "excellent",
      age: 2,
      floor: 3,
      totalFloors: 8
    },
    amenities: {
      electricity: true,
      gas: true,
      water: true,
      internet: true,
      generator: true,
      backup: true,
      airConditioning: true,
      elevator: true,
      security: true,
      cctv: true,
      guard: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        caption: "Executive Office",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Ayesha Raza",
      phone: "03004567890",
      email: "ayesha@multiproperties.com",
      preferredContact: "phone"
    },
    isFeatured: false,
    isVerified: true
  }
];

async function seedData() {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    
    console.log('🗑️  Cleared existing data');
    
    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
      console.log(`👤 Created user: ${user.firstName} ${user.lastName} (${user.role})`);
    }
    
    // Get agent users
    const agents = users.filter(user => user.role === 'agent');
    console.log(`🏢 Found ${agents.length} agents`);
    
    // Create properties and assign to different agents
    let propertyIndex = 0;
    for (const propertyData of sampleProperties) {
      // Distribute properties among agents
      const agentIndex = propertyIndex % agents.length;
      const assignedAgent = agents[agentIndex];
      
      const property = await Property.create({
        ...propertyData,
        owner: assignedAgent._id,
        agent: assignedAgent._id
      });
      
      console.log(`🏠 Created property: ${property.title} (Agent: ${assignedAgent.firstName} ${assignedAgent.lastName})`);
      propertyIndex++;
    }
    
    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created ${users.length} users and ${sampleProperties.length} properties`);
    console.log(`🏢 Properties distributed among ${agents.length} agents`);
    
    // Display agent statistics
    for (const agent of agents) {
      const agentProperties = await Property.countDocuments({ agent: agent._id });
      console.log(`📈 ${agent.firstName} ${agent.lastName}: ${agentProperties} properties`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = seedData; 