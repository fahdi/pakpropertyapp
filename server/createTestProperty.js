const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Property = require('./models/Property');
const connectDB = require('./config/database');

async function createTestProperty() {
  try {
    await connectDB();
    
    // Find the test owner
    const owner = await User.findOne({ email: 'owner@test.com' });
    if (!owner) {
      console.log('❌ Test owner not found. Please run createTestOwner.js first.');
      process.exit(1);
    }

    // Check if test property already exists
    const existingProperty = await Property.findOne({ owner: owner._id });
    if (existingProperty) {
      console.log('✅ Test property already exists!');
      console.log('🏠 Property ID:', existingProperty._id);
      console.log('🏠 Property Status:', existingProperty.status);
      process.exit(0);
    }

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
      owner: owner._id,
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
    console.error('❌ Error creating test property:', error);
    process.exit(1);
  }
}

createTestProperty(); 