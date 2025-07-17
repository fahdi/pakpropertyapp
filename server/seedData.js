const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Property = require('./models/Property');

const connectDB = require('./config/database');

const sampleProperties = [
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
      },
      {
        url: "https://images.unsplash.com/photo-1560448204-5c3f6b6b8b8b?w=800",
        caption: "Bedroom",
        isPrimary: false,
        order: 3
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
      },
      {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        caption: "Living Area",
        isPrimary: false,
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        caption: "Garden",
        isPrimary: false,
        order: 3
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
    isFeatured: false,
    isVerified: true
  },
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
      },
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        caption: "Reception Area",
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
      },
      {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        caption: "Living Room",
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
      console.log(`👤 Created user: ${user.name}`);
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