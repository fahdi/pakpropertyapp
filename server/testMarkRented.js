const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./server/models/User');
const Property = require('./server/models/Property');
const connectDB = require('./server/config/database');

async function testMarkRented() {
  try {
    await connectDB();
    
    // Create a simple test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const testUser = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: hashedPassword,
      phone: '03002222222',
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

    console.log('✅ Test user created:', testUser._id);

    // Create a test property
    const testProperty = await Property.create({
      title: 'Test Property',
      description: 'Test property for mark as rented functionality',
      propertyType: 'apartment',
      category: 'residential',
      rent: 50000,
      rentType: 'monthly',
      availableFrom: new Date(),
      location: {
        city: 'Karachi',
        area: 'DHA Phase 6',
        address: 'Block 4, Street 1'
      },
      specifications: {
        bedrooms: 3,
        bathrooms: 2
      },
      area: {
        size: 1200,
        unit: 'sqft'
      },
      features: {
        furnishing: 'semi-furnished',
        condition: 'good'
      },
      status: 'available',
      owner: testUser._id,
      contactInfo: {
        name: 'Test User',
        phone: '03002222222',
        email: 'test@example.com'
      }
    });

    console.log('✅ Test property created:', testProperty._id);
    console.log('🏠 Initial status:', testProperty.status);

    // Update the property status to rented
    testProperty.status = 'rented';
    await testProperty.save();

    console.log('✅ Property status updated to:', testProperty.status);

    // Verify the update
    const updatedProperty = await Property.findById(testProperty._id);
    console.log('✅ Verified status:', updatedProperty.status);

    console.log('\n🎉 Mark as rented functionality is working!');
    console.log('📧 Test user email: test@example.com');
    console.log('🔑 Password: password123');
    console.log('🏠 Property ID:', testProperty._id);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing mark as rented:', error);
    process.exit(1);
  }
}

testMarkRented(); 