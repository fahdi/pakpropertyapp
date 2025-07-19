const bcrypt = require('bcryptjs');

async function testPassword() {
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 12);
  
  console.log('Original password:', password);
  console.log('Hashed password:', hashedPassword);
  
  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log('Password match:', isMatch);
  
  // Test with the admin user's password
  const adminPassword = '$2a$12$AmNIJ52tsv5eEAz80mW0euQE253XyFo6znwmGdjq/gkjMYJR77VwK';
  const adminMatch = await bcrypt.compare(password, adminPassword);
  console.log('Admin password match:', adminMatch);
}

testPassword(); 