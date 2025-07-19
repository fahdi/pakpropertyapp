const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const connectDB = require('./config/database');

async function createNewAdmin() {
  try {
    await connectDB();
    
    // Delete any existing admin users
    await User.deleteMany({ email: { $in: ['admin@pakproperty.com', 'newadmin@pakproperty.com'] } });
    
    // Create new admin with simple password
    const password = 'admin123'; // Simple password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const adminUser = await User.create({
      firstName: 'New',
      lastName: 'Admin',
      email: 'newadmin@pakproperty.com',
      password: hashedPassword,
      phone: '03008888888',
      role: 'admin',
      isVerified: true,
      isActive: true,
      address: {
        city: 'Islamabad',
        street: 'F-7/1',
        area: 'Street 1'
      }
    });

    console.log('✅ New Admin user created successfully!');
    console.log('📧 Email: newadmin@pakproperty.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('');
    console.log('🎯 Login at: http://localhost:3000/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createNewAdmin(); 