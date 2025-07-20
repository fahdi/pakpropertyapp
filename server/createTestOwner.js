const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./server/models/User');
const Property = require('./server/models/Property');
const connectDB = require('./server/config/database');

async function createTestOwner() {
  try {
    await connectDB();
    
    // Check if test owner already exists
    const existingOwner = await User.findOne({ email: 'owner@test.com' });
    if (existingOwner) {
      console.log('Test owner already exists');
      
      // Check if test property exists
      const existingProperty = await Property.findOne({ owner: existingOwner._id });
      if (existingProperty) {
        console.log('Test property already exists');
        console.log('✅ Test setup complete!');
        console.log('📧 Owner Email: owner@test.com');
        console.log('🔑 Password: password123');
        console.log('🏠 Property ID:', existingProperty._id);
        process.exit(0);
      }
    }

    // Create test owner user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const ownerUser = await User.create({
      firstName: 'Test',
      lastName: 'Owner',
      email: 'owner@test.com',
      password: hashedPassword,
      phone: '03001111111',
      gender: 'male',
      role: 'owner',
      isVerified: true,
      isActive: true,
      address: {
        city: 'Karachi',
        street: 'DHA Phase 6',
        area: 'Block 4'
      }
    });

    console.log('✅ Test owner created successfully!');

    // Create a test property
    const testProperty = await Property.create({
      title: 'Test Property for Rent',
      description: 'This is a test property to verify the mark as rented functionality.',
      propertyType: 'apartment',
      category: 'residential',
      rent: 50000,
      rentType: 'monthly',
      securityDeposit: 100000,
      advanceRent: 50000,
      availableFrom: new Date(),
      location: {
        city: 'Karachi',
        area: 'DHA Phase 6',
        address: 'Block 4, Street 1'
      },
      specifications: {
        bedrooms: 3,
        bathrooms: 2,
        parkingSpaces: 1
      },
      area: {
        size: 1200,
        unit: 'sqft'
      },
      features: {
        furnishing: 'semi-furnished',
        condition: 'good',
        age: 5
      },
      amenities: {
        electricity: true,
        gas: true,
        water: true,
        internet: true,
        airConditioning: true
      },
      terms: {
        petsAllowed: false,
        smokingAllowed: false,
        familyOnly: true,
        bachelorAllowed: true,
        minimumLease: 12
      },
      status: 'available',
      owner: ownerUser._id,
      contactInfo: {
        name: 'Test Owner',
        phone: '03001111111',
        email: 'owner@test.com'
      }
    });

    console.log('✅ Test property created successfully!');
    console.log('📧 Owner Email: owner@test.com');
    console.log('🔑 Password: password123');
    console.log('🏠 Property ID:', testProperty._id);
    console.log('🏠 Property Status:', testProperty.status);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test owner:', error);
    process.exit(1);
  }
}

createTestOwner(); 