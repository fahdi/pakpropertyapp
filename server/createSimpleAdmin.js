const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const connectDB = require('./config/database');

async function createSimpleAdmin() {
  try {
    await connectDB();
    
    // Delete existing admin if exists
    await User.deleteOne({ email: 'admin@pakproperty.com' });
    
    // Create simple admin with basic password
    const simplePassword = '12345678'; // 8 characters minimum
    const hashedPassword = await bcrypt.hash(simplePassword, 10);
    
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@pakproperty.com',
      password: hashedPassword,
      phone: '03009999999',
      role: 'admin',
      isVerified: true,
      isActive: true,
      address: {
        city: 'Islamabad',
        street: 'F-7/1',
        area: 'Street 1'
      }
    });

    console.log('✅ Simple Admin user created successfully!');
    console.log('📧 Email: admin@pakproperty.com');
    console.log('🔑 Password: 12345678');
    console.log('👤 Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createSimpleAdmin(); 