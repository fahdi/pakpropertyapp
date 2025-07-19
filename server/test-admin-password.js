require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const foundUser = await User.findOne({email: 'admin@pakproperty.com'}).select('+password');
  if (!foundUser) {
    console.log('Admin user not found');
    process.exit(1);
  }
  console.log('User found:', foundUser.email);
  console.log('Password hash:', foundUser.password);
  const passwords = ['Admin123!', 'admin123', 'password123', 'Admin123', 'admin@pakproperty.com', 'pakproperty'];
  for (const pw of passwords) {
    const isMatch = await foundUser.comparePassword(pw);
    console.log(`Password match (${pw}):`, isMatch);
  }
  process.exit(0);
}

test().catch(console.error); 