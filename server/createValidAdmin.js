const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const connectDB = require('./config/database');

async function createValidAdmin() {
  try {
    await connectDB();
    
    // Delete existing admin if exists
    await User.deleteOne({ email: 'admin@pakproperty.com' });
    
    // Create admin with password that meets all requirements
    const validPassword = 'Admin123'; // Has uppercase, lowercase, and number
    const hashedPassword = await bcrypt.hash(validPassword, 10);
    
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

    console.log('✅ Valid Admin user created successfully!');
    console.log('📧 Email: admin@pakproperty.com');
    console.log('🔑 Password: Admin123');
    console.log('👤 Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createValidAdmin(); 