const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./server/models/User');
const Property = require('./server/models/Property');
const connectDB = require('./server/config/database');

async function createWorkingUser() {
  try {
    await connectDB();
    
    // Delete existing test user if exists
    await User.deleteOne({ email: 'working@test.com' });
    
    // Create a working test user
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const workingUser = await User.create({
      firstName: 'Working',
      lastName: 'User',
      email: 'working@test.com',
      password: hashedPassword,
      phone: '03003333333',
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

    console.log('✅ Working user created:', workingUser._id);

    // Create a test property
    const testProperty = await Property.create({
      title: 'Working Test Property',
      description: 'This property can be used to test mark as rented functionality.',
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
      owner: workingUser._id,
      contactInfo: {
        name: 'Working User',
        phone: '03003333333',
        email: 'working@test.com'
      }
    });

    console.log('✅ Test property created:', testProperty._id);
    console.log('\n🎉 Setup complete!');
    console.log('📧 Email: working@test.com');
    console.log('🔑 Password: password123');
    console.log('🏠 Property ID:', testProperty._id);
    console.log('🏠 Property Status:', testProperty.status);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating working user:', error);
    process.exit(1);
  }
}

createWorkingUser(); 