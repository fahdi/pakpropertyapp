const request = require('supertest');
const app = require('../index');
const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const { generateToken } = require('../middleware/auth');

describe('Admin API', () => {
  let adminUser;
  let agentUser;
  let tenantUser;
  let ownerUser;
  let testProperty;
  let testInquiry;
  let adminToken;

  beforeEach(async () => {
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

    // Create tenant user
    tenantUser = new User({
      email: 'tenant@example.com',
      password: 'TenantPassword123',
      firstName: 'Test',
      lastName: 'Tenant',
      role: 'tenant',
      phone: '+923001234570',
      gender: 'male',
      address: {
        street: '321 Tenant Street',
        city: 'Karachi',
        area: 'DHA Phase 6'
      },
      isVerified: true,
      isActive: true
    });
    await tenantUser.save();

    // Create owner user
    ownerUser = new User({
      email: 'owner@example.com',
      password: 'OwnerPassword123',
      firstName: 'Property',
      lastName: 'Owner',
      role: 'owner',
      phone: '+923001234571',
      gender: 'female',
      address: {
        street: '654 Owner Street',
        city: 'Lahore',
        area: 'Bahria Town'
      },
      isVerified: true,
      isActive: true
    });
    await ownerUser.save();

    // Create test property
    testProperty = new Property({
      title: 'Test Property',
      description: 'A test property for testing',
      propertyType: 'house',
      category: 'residential',
      status: 'available',
      rent: 50000,
      rentType: 'monthly',
      currency: 'PKR',
      location: {
        address: '123 Test Street',
        city: 'Karachi',
        area: 'DHA Phase 6'
      },
      specifications: {
        bedrooms: 3,
        bathrooms: 2,
        kitchens: 1,
        drawingRooms: 1,
        parkingSpaces: 1
      },
      area: {
        size: 1500,
        unit: 'sqft',
        coveredArea: 1200,
        coveredAreaUnit: 'sqft'
      },
      features: {
        furnishing: 'semi-furnished',
        condition: 'good',
        age: 5,
        floor: 2,
        totalFloors: 3
      },
      amenities: {
        electricity: true,
        gas: true,
        water: true,
        internet: true,
        generator: false,
        backup: false,
        airConditioning: true,
        security: true,
        guard: true
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
          caption: 'Test Property',
          isPrimary: true,
          order: 1
        }
      ],
      contactInfo: {
        name: 'Test Owner',
        phone: '03001234567',
        email: 'owner@example.com',
        preferredContact: 'phone'
      },
      owner: ownerUser._id,
      isActive: true,
      isVerified: true
    });
    await testProperty.save();

    // Create test inquiry
    testInquiry = new Inquiry({
      property: testProperty._id,
      user: tenantUser._id,
      name: 'Test Inquiry',
      email: 'tenant@example.com',
      phone: '+923001234570',
      message: 'I am interested in this property',
      preferredContact: 'phone',
      status: 'pending',
      scheduleViewing: false
    });
    await testInquiry.save();

    // Generate admin token
    adminToken = generateToken(adminUser._id);
  });

  describe('GET /api/admin/dashboard', () => {
    it('should get dashboard statistics', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.totalUsers).toBeDefined();
      expect(response.body.data.totalProperties).toBeDefined();
      expect(response.body.data.totalInquiries).toBeDefined();
      expect(response.body.data.recentUsers).toBeDefined();
      expect(response.body.data.recentProperties).toBeDefined();
      expect(response.body.data.recentInquiries).toBeDefined();
    });

    it('should fail without admin token', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with non-admin token', async () => {
      const tenantToken = generateToken(tenantUser._id);

      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${tenantToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/users', () => {
    it('should get all users with pagination', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should filter users by role', async () => {
      const response = await request(app)
        .get('/api/admin/users?role=agent')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(user => user.role === 'agent')).toBe(true);
    });

    it('should search users by name or email', async () => {
      const response = await request(app)
        .get('/api/admin/users?search=agent')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.some(user => 
        user.email.includes('agent') || 
        user.firstName.includes('Agent') || 
        user.lastName.includes('User')
      )).toBe(true);
    });

    it('should filter users by verification status', async () => {
      const response = await request(app)
        .get('/api/admin/users?isVerified=true')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(user => user.isVerified === true)).toBe(true);
    });
  });

  describe('POST /api/admin/users', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        password: 'NewPassword123',
        role: 'tenant',
        phone: '+923001234572',
        gender: 'male',
        address: {
          street: 'New Street',
          city: 'Karachi',
          area: 'Clifton'
        }
      };

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.firstName).toBe(userData.firstName);
      expect(response.body.data.lastName).toBe(userData.lastName);
      expect(response.body.data.role).toBe(userData.role);
    });

    it('should create a new agent with agent info', async () => {
      const userData = {
        firstName: 'New',
        lastName: 'Agent',
        email: 'newagent@example.com',
        password: 'NewPassword123',
        role: 'agent',
        phone: '+923001234573',
        gender: 'female',
        address: {
          street: 'Agent Street',
          city: 'Lahore',
          area: 'Gulberg III'
        },
        agentInfo: {
          licenseNumber: 'AG789012',
          companyName: 'New Properties Ltd',
          experience: 3,
          specializations: ['residential']
        }
      };

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.role).toBe('agent');
      expect(response.body.data.agentInfo.licenseNumber).toBe(userData.agentInfo.licenseNumber);
      expect(response.body.data.agentInfo.companyName).toBe(userData.agentInfo.companyName);
    });

    it('should fail with duplicate email', async () => {
      const userData = {
        firstName: 'New',
        lastName: 'User',
        email: 'tenant@example.com', // Already exists
        password: 'NewPassword123',
        role: 'tenant'
      };

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should fail with invalid role', async () => {
      const userData = {
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        password: 'NewPassword123',
        role: 'invalid-role'
      };

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/users/:id', () => {
    it('should get user details by ID', async () => {
      const response = await request(app)
        .get(`/api/admin/users/${tenantUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(tenantUser._id.toString());
      expect(response.body.data.email).toBe(tenantUser.email);
      expect(response.body.data.firstName).toBe(tenantUser.firstName);
      expect(response.body.data.lastName).toBe(tenantUser.lastName);
    });

    it('should fail with invalid user ID', async () => {
      const response = await request(app)
        .get('/api/admin/users/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with non-existent user ID', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/admin/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/admin/users/:id', () => {
    it('should update user successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        phone: '+923001234574',
        isVerified: true,
        isActive: true
      };

      const response = await request(app)
        .put(`/api/admin/users/${tenantUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe(updateData.firstName);
      expect(response.body.data.lastName).toBe(updateData.lastName);
      expect(response.body.data.phone).toBe(updateData.phone);
      expect(response.body.data.isVerified).toBe(updateData.isVerified);
      expect(response.body.data.isActive).toBe(updateData.isActive);
    });

    it('should update agent verification status', async () => {
      const updateData = {
        agentInfo: {
          isVerified: true
        }
      };

      const response = await request(app)
        .put(`/api/admin/users/${agentUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.agentInfo.isVerified).toBe(true);
    });

    it('should fail with invalid user ID', async () => {
      const updateData = {
        firstName: 'Updated'
      };

      const response = await request(app)
        .put('/api/admin/users/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/admin/users/:id', () => {
    it('should delete user successfully', async () => {
      const response = await request(app)
        .delete(`/api/admin/users/${tenantUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Verify user is deleted
      const deletedUser = await User.findById(tenantUser._id);
      expect(deletedUser).toBeNull();
    });

    it('should fail when user has associated properties', async () => {
      // Create a property for the owner
      const property = new Property({
        title: 'Test Property for Owner',
        owner: ownerUser._id,
        // ... other required fields
      });
      await property.save();

      const response = await request(app)
        .delete(`/api/admin/users/${ownerUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('associated properties');
    });

    it('should fail with invalid user ID', async () => {
      const response = await request(app)
        .delete('/api/admin/users/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/admin/users/bulk', () => {
    it('should bulk update users successfully', async () => {
      const bulkData = {
        userIds: [tenantUser._id.toString(), ownerUser._id.toString()],
        updates: {
          isVerified: true,
          isActive: true
        }
      };

      const response = await request(app)
        .put('/api/admin/users/bulk')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(bulkData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('updated');

      // Verify updates
      const updatedTenant = await User.findById(tenantUser._id);
      const updatedOwner = await User.findById(ownerUser._id);
      expect(updatedTenant.isVerified).toBe(true);
      expect(updatedTenant.isActive).toBe(true);
      expect(updatedOwner.isVerified).toBe(true);
      expect(updatedOwner.isActive).toBe(true);
    });

    it('should fail with invalid user IDs', async () => {
      const bulkData = {
        userIds: ['invalid-id'],
        updates: {
          isVerified: true
        }
      };

      const response = await request(app)
        .put('/api/admin/users/bulk')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(bulkData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/agents', () => {
    it('should get all agents', async () => {
      const response = await request(app)
        .get('/api/admin/agents')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.every(user => user.role === 'agent')).toBe(true);
    });

    it('should filter agents by verification status', async () => {
      const response = await request(app)
        .get('/api/admin/agents?isVerified=false')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(agent => 
        agent.role === 'agent' && agent.agentInfo.isVerified === false
      )).toBe(true);
    });
  });

  describe('PUT /api/admin/agents/:id/verify', () => {
    it('should verify agent successfully', async () => {
      const response = await request(app)
        .put(`/api/admin/agents/${agentUser._id}/verify`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('verified');

      // Verify the agent is now verified
      const updatedAgent = await User.findById(agentUser._id);
      expect(updatedAgent.agentInfo.isVerified).toBe(true);
    });

    it('should fail with invalid agent ID', async () => {
      const response = await request(app)
        .put('/api/admin/agents/invalid-id/verify')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail when user is not an agent', async () => {
      const response = await request(app)
        .put(`/api/admin/agents/${tenantUser._id}/verify`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not an agent');
    });
  });

  describe('GET /api/admin/analytics', () => {
    it('should get analytics data', async () => {
      const response = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.userGrowth).toBeDefined();
      expect(response.body.data.propertyStats).toBeDefined();
      expect(response.body.data.inquiryStats).toBeDefined();
      expect(response.body.data.agentStats).toBeDefined();
    });

    it('should get analytics with date range', async () => {
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      const endDate = new Date();

      const response = await request(app)
        .get(`/api/admin/analytics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });
}); 