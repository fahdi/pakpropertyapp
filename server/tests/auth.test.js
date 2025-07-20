const request = require('supertest');
const app = require('../index');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

describe('Authentication API', () => {
  let testUser;
  let adminUser;
  let agentUser;

  beforeEach(async () => {
    // Create test user
    testUser = new User({
      email: 'test@example.com',
      password: 'TestPassword123',
      firstName: 'Test',
      lastName: 'User',
      role: 'tenant',
      phone: '+923001234567',
      gender: 'male',
      address: {
        street: '123 Test Street',
        city: 'Karachi',
        area: 'DHA Phase 6'
      },
      isVerified: true,
      isActive: true
    });
    await testUser.save();

    // Create admin user
    adminUser = new User({
      email: 'admin@example.com',
      password: 'AdminPassword123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      phone: '+923001234568',
      gender: 'male',
      address: {
        street: '456 Admin Street',
        city: 'Lahore',
        area: 'Gulberg III'
      },
      isVerified: true,
      isActive: true
    });
    await adminUser.save();

    // Create agent user
    agentUser = new User({
      email: 'agent@example.com',
      password: 'AgentPassword123',
      firstName: 'Agent',
      lastName: 'User',
      role: 'agent',
      phone: '+923001234569',
      gender: 'female',
      address: {
        street: '789 Agent Street',
        city: 'Islamabad',
        area: 'F-7'
      },
      agentInfo: {
        licenseNumber: 'AG123456',
        companyName: 'Test Properties',
        experience: 5,
        specializations: ['residential', 'commercial'],
        isVerified: false
      },
      isVerified: true,
      isActive: true
    });
    await agentUser.save();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new tenant successfully', async () => {
      const userData = {
        email: 'newtenant@example.com',
        password: 'NewPassword123',
        firstName: 'New',
        lastName: 'Tenant',
        role: 'tenant',
        phone: '+923001234570',
        gender: 'male',
        address: {
          street: '321 New Street',
          city: 'Karachi',
          area: 'Clifton'
        }
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.firstName).toBe(userData.firstName);
      expect(response.body.user.lastName).toBe(userData.lastName);
      expect(response.body.user.role).toBe(userData.role);
      expect(response.body.user.isVerified).toBe(false);
      expect(response.body.user.isActive).toBe(true);
    });

    it('should register a new agent successfully', async () => {
      const userData = {
        email: 'newagent@example.com',
        password: 'NewPassword123',
        firstName: 'New',
        lastName: 'Agent',
        role: 'agent',
        phone: '+923001234571',
        gender: 'female',
        address: {
          street: '654 Agent Street',
          city: 'Lahore',
          area: 'Bahria Town'
        },
        agentInfo: {
          licenseNumber: 'AG789012',
          companyName: 'New Properties Ltd',
          experience: 3,
          specializations: ['residential']
        }
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.role).toBe(userData.role);
      expect(response.body.user.agentInfo.licenseNumber).toBe(userData.agentInfo.licenseNumber);
      expect(response.body.user.agentInfo.isVerified).toBe(false);
    });

    it('should fail with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'NewPassword123',
        firstName: 'New',
        lastName: 'User',
        role: 'tenant'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('should fail with weak password', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'weak',
        firstName: 'New',
        lastName: 'User',
        role: 'tenant'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('password');
    });

    it('should fail with duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'NewPassword123',
        firstName: 'New',
        lastName: 'User',
        role: 'tenant'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should fail with invalid role', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'NewPassword123',
        firstName: 'New',
        lastName: 'User',
        role: 'invalid-role'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'TestPassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(loginData.email);
      expect(response.body.user.firstName).toBe('Test');
      expect(response.body.user.lastName).toBe('User');
      expect(response.body.user.role).toBe('tenant');
    });

    it('should fail with invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'TestPassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should fail with invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should fail with inactive user', async () => {
      // Deactivate the user
      testUser.isActive = false;
      await testUser.save();

      const loginData = {
        email: 'test@example.com',
        password: 'TestPassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('account is inactive');
    });

    it('should lock account after multiple failed attempts', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword123'
      };

      // Attempt login multiple times
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/login')
          .send(loginData)
          .expect(401);
      }

      // Next attempt should be locked
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(423);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('locked');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user with valid token', async () => {
      const token = generateToken(testUser._id);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.firstName).toBe(testUser.firstName);
      expect(response.body.data.lastName).toBe(testUser.lastName);
      expect(response.body.data.role).toBe(testUser.role);
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No token');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid token');
    });
  });

  describe('PUT /api/auth/profile', () => {
    it('should update user profile successfully', async () => {
      const token = generateToken(testUser._id);
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        phone: '+923001234572',
        address: {
          street: 'Updated Street',
          city: 'Lahore',
          area: 'Gulberg III'
        }
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe(updateData.firstName);
      expect(response.body.data.lastName).toBe(updateData.lastName);
      expect(response.body.data.phone).toBe(updateData.phone);
      expect(response.body.data.address.street).toBe(updateData.address.street);
    });

    it('should fail without token', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name'
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/change-password', () => {
    it('should change password successfully', async () => {
      const token = generateToken(testUser._id);
      const passwordData = {
        currentPassword: 'TestPassword123',
        newPassword: 'NewPassword123'
      };

      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(passwordData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Password changed');
    });

    it('should fail with incorrect current password', async () => {
      const token = generateToken(testUser._id);
      const passwordData = {
        currentPassword: 'WrongPassword123',
        newPassword: 'NewPassword123'
      };

      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('current password');
    });

    it('should fail with weak new password', async () => {
      const token = generateToken(testUser._id);
      const passwordData = {
        currentPassword: 'TestPassword123',
        newPassword: 'weak'
      };

      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('password');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should send reset email for existing user', async () => {
      const emailData = {
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send(emailData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('reset email');
    });

    it('should not reveal if email exists', async () => {
      const emailData = {
        email: 'nonexistent@example.com'
      };

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send(emailData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('reset email');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should reset password with valid token', async () => {
      // First, generate a reset token (in real app, this would be sent via email)
      testUser.resetPasswordToken = 'valid-reset-token';
      testUser.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
      await testUser.save();

      const resetData = {
        token: 'valid-reset-token',
        newPassword: 'NewPassword123'
      };

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send(resetData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Password reset');
    });

    it('should fail with invalid token', async () => {
      const resetData = {
        token: 'invalid-reset-token',
        newPassword: 'NewPassword123'
      };

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send(resetData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid or expired token');
    });

    it('should fail with expired token', async () => {
      // Set expired token
      testUser.resetPasswordToken = 'expired-reset-token';
      testUser.resetPasswordExpires = new Date(Date.now() - 3600000); // 1 hour ago
      await testUser.save();

      const resetData = {
        token: 'expired-reset-token',
        newPassword: 'NewPassword123'
      };

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send(resetData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid or expired token');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const token = generateToken(testUser._id);

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('logged out');
    });

    it('should handle logout without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('logged out');
    });
  });
}); 