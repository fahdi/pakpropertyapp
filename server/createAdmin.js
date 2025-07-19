const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const connectDB = require('./config/database');

async function createAdmin() {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@pakproperty.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
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

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@pakproperty.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin(); 