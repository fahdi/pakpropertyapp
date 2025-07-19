const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const connectDB = require('./config/database');

async function createFinalAdmin() {
  try {
    await connectDB();
    
    // Delete any existing admin users
    await User.deleteMany({ email: { $in: ['admin@pakproperty.com', 'newadmin@pakproperty.com', 'finaladmin@pakproperty.com'] } });
    
    // Create admin with password that meets all requirements
    const password = 'Admin123'; // Has uppercase, lowercase, and number
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const adminUser = await User.create({
      firstName: 'Final',
      lastName: 'Admin',
      email: 'finaladmin@pakproperty.com',
      password: hashedPassword,
      phone: '03007777777',
      role: 'admin',
      isVerified: true,
      isActive: true,
      address: {
        city: 'Islamabad',
        street: 'F-7/1',
        area: 'Street 1'
      }
    });

    console.log('✅ Final Admin user created successfully!');
    console.log('📧 Email: finaladmin@pakproperty.com');
    console.log('🔑 Password: Admin123');
    console.log('👤 Role: admin');
    console.log('');
    console.log('🎯 Login at: http://localhost:3000/login');
    console.log('');
    console.log('📋 Admin Features Available:');
    console.log('   - User Management');
    console.log('   - Property Management');
    console.log('   - Analytics Dashboard');
    console.log('   - System Health Monitoring');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createFinalAdmin(); 