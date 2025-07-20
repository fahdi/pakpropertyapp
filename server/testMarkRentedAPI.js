const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./server/models/User');
const Property = require('./server/models/Property');
const connectDB = require('./server/config/database');

async function testMarkRentedAPI() {
  try {
    await connectDB();
    
    // Find the working user
    const user = await User.findOne({ email: 'working@test.com' });
    if (!user) {
      console.log('❌ Working user not found. Please run createWorkingUser.js first.');
      process.exit(1);
    }

    // Find the test property
    const property = await Property.findOne({ owner: user._id });
    if (!property) {
      console.log('❌ Test property not found.');
      process.exit(1);
    }

    console.log('✅ Found user:', user.email);
    console.log('✅ Found property:', property._id);
    console.log('🏠 Current status:', property.status);

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('✅ Generated JWT token');

    // Test the API endpoint
    const axios = require('axios');
    
    const response = await axios.patch(
      `http://localhost:5001/api/properties/${property._id}/status`,
      { status: 'rented' },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ API call successful!');
    console.log('📊 Response:', response.data);

    // Verify the change in database
    const updatedProperty = await Property.findById(property._id);
    console.log('🏠 Updated status:', updatedProperty.status);

    if (updatedProperty.status === 'rented') {
      console.log('\n🎉 Mark as rented functionality is working perfectly!');
    } else {
      console.log('\n❌ Status was not updated correctly');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing mark as rented API:', error.response?.data || error.message);
    process.exit(1);
  }
}

testMarkRentedAPI(); 