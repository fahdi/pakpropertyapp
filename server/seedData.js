const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Property = require('./models/Property');

const connectDB = require('./config/database');

const sampleProperties = [
  // KARACHI PROPERTIES
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
      email: "ahmed@example.com",
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
      email: "ahmed@example.com",
      preferredContact: "phone"
    },
    isFeatured: true,
    isVerified: true
  },
  {
    title: "Studio Apartment in Gulshan-e-Iqbal",
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
      name: "Ahmed Khan",
      phone: "03001234567",
      email: "ahmed@example.com",
      preferredContact: "phone"
    },
    isFeatured: false,
    isVerified: true
  },

  // LAHORE PROPERTIES
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
      parkingSpaces: 2
    },
    area: {
      size: 10,
      unit: "marla",
      coveredArea: 3500,
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
      terrace: true,
      servantQuarter: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        caption: "Exterior View",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Ahmed Khan",
      phone: "03001234567",
      email: "ahmed@example.com",
      preferredContact: "phone"
    },
    isFeatured: true,
    isVerified: true
  },
  {
    title: "Cozy Studio in Gulberg",
    description: "Perfect studio apartment for young professionals. Located in the vibrant Gulberg area with easy access to shopping centers and restaurants.",
    propertyType: "apartment",
    category: "residential",
    status: "available",
    rent: 25000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "Gulberg III, Block A",
      city: "Lahore",
      area: "Gulberg III",
      block: "A",
      coordinates: {
        latitude: 31.5204,
        longitude: 74.3587
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
      size: 500,
      unit: "sqft",
      coveredArea: 450,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "semi-furnished",
      condition: "good",
      age: 5,
      floor: 2,
      totalFloors: 6
    },
    amenities: {
      electricity: true,
      gas: true,
      water: true,
      internet: true,
      airConditioning: true,
      elevator: true,
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
      name: "Ahmed Khan",
      phone: "03001234567",
      email: "ahmed@example.com",
      preferredContact: "phone"
    },
    isFeatured: false,
    isVerified: true
  },
  {
    title: "Family House in DHA Phase 5",
    description: "Spacious 3-bedroom house in DHA Phase 5. Large backyard, modern kitchen, and peaceful neighborhood with excellent security.",
    propertyType: "house",
    category: "residential",
    status: "available",
    rent: 85000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "DHA Phase 5, Block C",
      city: "Lahore",
      area: "DHA Phase 5",
      block: "C",
      coordinates: {
        latitude: 31.5204,
        longitude: 74.3587
      }
    },
    specifications: {
      bedrooms: 3,
      bathrooms: 3,
      kitchens: 1,
      drawingRooms: 1,
      servantQuarters: 1,
      parkingSpaces: 2
    },
    area: {
      size: 8,
      unit: "marla",
      coveredArea: 2800,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "semi-furnished",
      condition: "good",
      age: 6,
      floor: 1,
      totalFloors: 1
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
      guard: true,
      garden: true,
      servantQuarter: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        caption: "House Exterior",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Ahmed Khan",
      phone: "03001234567",
      email: "ahmed@example.com",
      preferredContact: "phone"
    },
    isFeatured: false,
    isVerified: true
  },

  // ISLAMABAD PROPERTIES
  {
    title: "Commercial Space in Blue Area",
    description: "Prime commercial space in Islamabad's Blue Area. Perfect for offices, retail, or restaurants. High foot traffic and excellent visibility.",
    propertyType: "commercial",
    category: "commercial",
    status: "available",
    rent: 150000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "Blue Area, Sector F-7",
      city: "Islamabad",
      area: "Blue Area",
      sector: "F-7",
      coordinates: {
        latitude: 33.6844,
        longitude: 73.0479
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
      age: 1,
      floor: 1,
      totalFloors: 5
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
      email: "ahmed@example.com",
      preferredContact: "phone"
    },
    isFeatured: true,
    isVerified: true
  },
  {
    title: "Family House in F-7",
    description: "Spacious 3-bedroom house in the prestigious F-7 sector of Islamabad. Large backyard, modern kitchen, and peaceful neighborhood.",
    propertyType: "house",
    category: "residential",
    status: "available",
    rent: 80000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "F-7/1, Street 12",
      city: "Islamabad",
      area: "F-7/1",
      sector: "F-7",
      coordinates: {
        latitude: 33.6844,
        longitude: 73.0479
      }
    },
    specifications: {
      bedrooms: 3,
      bathrooms: 3,
      kitchens: 1,
      drawingRooms: 1,
      servantQuarters: 1,
      parkingSpaces: 2
    },
    area: {
      size: 8,
      unit: "marla",
      coveredArea: 2500,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "semi-furnished",
      condition: "good",
      age: 8,
      floor: 1,
      totalFloors: 1
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
      guard: true,
      garden: true,
      servantQuarter: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        caption: "House Exterior",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Ahmed Khan",
      phone: "03001234567",
      email: "ahmed@example.com",
      preferredContact: "phone"
    },
    isFeatured: false,
    isVerified: true
  },
  {
    title: "Luxury Apartment in F-8",
    description: "Modern 2-bedroom apartment in F-8 sector. High-end amenities, beautiful views, and excellent location near diplomatic enclave.",
    propertyType: "apartment",
    category: "residential",
    status: "available",
    rent: 95000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "F-8/1, Street 15",
      city: "Islamabad",
      area: "F-8/1",
      sector: "F-8",
      coordinates: {
        latitude: 33.6844,
        longitude: 73.0479
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
      size: 1500,
      unit: "sqft",
      coveredArea: 1300,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "fully-furnished",
      condition: "excellent",
      age: 2,
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
      balcony: true,
      swimmingPool: true,
      gym: true
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
      name: "Ahmed Khan",
      phone: "03001234567",
      email: "ahmed@example.com",
      preferredContact: "phone"
    },
    isFeatured: true,
    isVerified: true
  },

  // RAWALPINDI PROPERTIES
  {
    title: "Affordable Studio in Saddar",
    description: "Budget-friendly studio apartment in Rawalpindi Saddar. Perfect for students or young professionals starting their careers.",
    propertyType: "apartment",
    category: "residential",
    status: "available",
    rent: 18000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "Saddar, Main Street",
      city: "Rawalpindi",
      area: "Saddar",
      coordinates: {
        latitude: 33.5651,
        longitude: 73.0169
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
      size: 350,
      unit: "sqft",
      coveredArea: 300,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "semi-furnished",
      condition: "average",
      age: 12,
      floor: 1,
      totalFloors: 3
    },
    amenities: {
      electricity: true,
      gas: true,
      water: true,
      internet: true,
      airConditioning: false,
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
      name: "Ahmed Khan",
      phone: "03001234567",
      email: "ahmed@example.com",
      preferredContact: "phone"
    },
    isFeatured: false,
    isVerified: true
  },

  // PESHAWAR PROPERTIES
  {
    title: "Traditional House in University Town",
    description: "Beautiful traditional 2-bedroom house in University Town. Large courtyard, traditional architecture, and peaceful environment.",
    propertyType: "house",
    category: "residential",
    status: "available",
    rent: 35000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "University Town, Street 5",
      city: "Peshawar",
      area: "University Town",
      coordinates: {
        latitude: 34.0150,
        longitude: 71.5249
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
      size: 5,
      unit: "marla",
      coveredArea: 1800,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "semi-furnished",
      condition: "good",
      age: 15,
      floor: 1,
      totalFloors: 1
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
      guard: true,
      garden: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        caption: "House Exterior",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Ahmed Khan",
      phone: "03001234567",
      email: "ahmed@example.com",
      preferredContact: "phone"
    },
    isFeatured: false,
    isVerified: true
  },

  // MULTAN PROPERTIES
  {
    title: "Modern Apartment in Cantt",
    description: "Contemporary 2-bedroom apartment in Multan Cantt. Modern amenities, excellent location, and peaceful surroundings.",
    propertyType: "apartment",
    category: "residential",
    status: "available",
    rent: 28000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "Cantt Area, Block A",
      city: "Multan",
      area: "Cantt",
      coordinates: {
        latitude: 30.1575,
        longitude: 71.5249
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
      size: 1000,
      unit: "sqft",
      coveredArea: 850,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "semi-furnished",
      condition: "good",
      age: 4,
      floor: 2,
      totalFloors: 6
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
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        caption: "Living Room",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Ahmed Khan",
      phone: "03001234567",
      email: "ahmed@example.com",
      preferredContact: "phone"
    },
    isFeatured: false,
    isVerified: true
  },

  // QUETTA PROPERTIES
  {
    title: "Cozy House in Satellite Town",
    description: "Charming 2-bedroom house in Quetta's Satellite Town. Beautiful garden, traditional design, and excellent security.",
    propertyType: "house",
    category: "residential",
    status: "available",
    rent: 25000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "Satellite Town, Street 8",
      city: "Quetta",
      area: "Satellite Town",
      coordinates: {
        latitude: 30.1798,
        longitude: 66.9750
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
      size: 4,
      unit: "marla",
      coveredArea: 1500,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "semi-furnished",
      condition: "good",
      age: 10,
      floor: 1,
      totalFloors: 1
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
      guard: true,
      garden: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        caption: "House Exterior",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Ahmed Khan",
      phone: "03001234567",
      email: "ahmed@example.com",
      preferredContact: "phone"
    },
    isFeatured: false,
    isVerified: true
  },

  // COMMERCIAL PROPERTIES
  {
    title: "Retail Space in Saddar Karachi",
    description: "Prime retail space in Karachi Saddar. High foot traffic, excellent visibility, perfect for retail businesses.",
    propertyType: "commercial",
    category: "commercial",
    status: "available",
    rent: 120000,
    rentType: "monthly",
    currency: "PKR",
    location: {
      address: "Saddar, Main Street",
      city: "Karachi",
      area: "Saddar",
      coordinates: {
        latitude: 24.8607,
        longitude: 67.0011
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
      size: 1500,
      unit: "sqft",
      coveredArea: 1300,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "unfurnished",
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
      generator: true,
      backup: true,
      airConditioning: true,
      security: true,
      cctv: true,
      guard: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        caption: "Retail Space",
        isPrimary: true,
        order: 1
      }
    ],
    contactInfo: {
      name: "Ahmed Khan",
      phone: "03001234567",
      email: "ahmed@example.com",
      preferredContact: "phone"
    },
    isFeatured: true,
    isVerified: true
  },
  {
    title: "Office Space in Gulberg Lahore",
    description: "Professional office space in Gulberg Lahore. Modern facilities, excellent location, perfect for corporate offices.",
    propertyType: "commercial",
    category: "commercial",
    status: "available",
    rent: 95000,
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
      bathrooms: 2,
      kitchens: 0,
      drawingRooms: 0,
      parkingSpaces: 3
    },
    area: {
      size: 1800,
      unit: "sqft",
      coveredArea: 1600,
      coveredAreaUnit: "sqft"
    },
    features: {
      furnishing: "unfurnished",
      condition: "excellent",
      age: 2,
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
      email: "ahmed@example.com",
      preferredContact: "phone"
    },
    isFeatured: false,
    isVerified: true
  }
];

const sampleUsers = [
  {
    firstName: "Ahmed",
    lastName: "Khan",
    email: "ahmed@example.com",
    password: "password123",
    phone: "03001234567",
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
      experience: 5,
      specializations: ["residential", "commercial"],
      isVerified: true
    }
  },
  {
    firstName: "Sarah",
    lastName: "Ahmed",
    email: "sarah@example.com", 
    password: "password123",
    phone: "03002345678",
    role: "tenant",
    isVerified: true,
    address: {
      city: "Lahore",
      street: "Gulberg III",
      area: "Block A"
    }
  },
  {
    firstName: "Fatima",
    lastName: "Hassan",
    email: "fatima@example.com",
    password: "password123",
    phone: "03003456789",
    role: "agent",
    isVerified: true,
    address: {
      city: "Islamabad",
      street: "F-7/1",
      area: "Street 12"
    },
    agentInfo: {
      licenseNumber: "AG789012",
      companyName: "Capital Properties",
      experience: 8,
      specializations: ["residential", "luxury"],
      isVerified: true
    }
  },
  {
    firstName: "Ali",
    lastName: "Raza",
    email: "ali@example.com",
    password: "password123",
    phone: "03004567890",
    role: "tenant",
    isVerified: true,
    address: {
      city: "Karachi",
      street: "Clifton",
      area: "Block 4"
    }
  },
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@pakproperty.com",
    password: "admin123",
    phone: "03009999999",
    role: "admin",
    isVerified: true,
    address: {
      city: "Islamabad",
      street: "F-7/1",
      area: "Street 1"
    }
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
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      users.push(user);
      console.log(`👤 Created user: ${user.firstName} ${user.lastName}`);
    }
    
    // Create properties
    for (const propertyData of sampleProperties) {
      const property = await Property.create({
        ...propertyData,
        owner: users[0]._id // Assign to first user (agent)
      });
      console.log(`🏠 Created property: ${property.title}`);
    }
    
    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created ${users.length} users and ${sampleProperties.length} properties`);
    
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