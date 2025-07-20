const request = require('supertest');
const app = require('../index');
const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const { generateToken } = require('../middleware/auth');

describe('Inquiries API', () => {
  let tenantUser;
  let ownerUser;
  let agentUser;
  let testProperty;
  let testInquiry;
  let tenantToken;
  let ownerToken;
  let agentToken;

  beforeEach(async () => {
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
        isVerified: true
      },
      isVerified: true,
      isActive: true
    });
    await agentUser.save();

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

    // Generate tokens
    tenantToken = generateToken(tenantUser._id);
    ownerToken = generateToken(ownerUser._id);
    agentToken = generateToken(agentUser._id);
  });

  describe('POST /api/inquiries', () => {
    it('should create a new inquiry successfully', async () => {
      const inquiryData = {
        property: testProperty._id,
        name: 'New Inquiry',
        email: 'newinquiry@example.com',
        phone: '+923001234572',
        message: 'I am very interested in this property',
        preferredContact: 'email',
        scheduleViewing: true,
        viewingDate: '2024-01-15',
        viewingTime: '14:00'
      };

      const response = await request(app)
        .post('/api/inquiries')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send(inquiryData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.property).toBe(testProperty._id.toString());
      expect(response.body.data.name).toBe(inquiryData.name);
      expect(response.body.data.email).toBe(inquiryData.email);
      expect(response.body.data.phone).toBe(inquiryData.phone);
      expect(response.body.data.message).toBe(inquiryData.message);
      expect(response.body.data.preferredContact).toBe(inquiryData.preferredContact);
      expect(response.body.data.scheduleViewing).toBe(inquiryData.scheduleViewing);
      expect(response.body.data.viewingDate).toBe(inquiryData.viewingDate);
      expect(response.body.data.viewingTime).toBe(inquiryData.viewingTime);
      expect(response.body.data.status).toBe('pending');
    });

    it('should fail without authentication', async () => {
      const inquiryData = {
        property: testProperty._id,
        name: 'New Inquiry',
        email: 'newinquiry@example.com',
        phone: '+923001234572',
        message: 'I am interested in this property'
      };

      const response = await request(app)
        .post('/api/inquiries')
        .send(inquiryData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid property ID', async () => {
      const inquiryData = {
        property: 'invalid-property-id',
        name: 'New Inquiry',
        email: 'newinquiry@example.com',
        phone: '+923001234572',
        message: 'I am interested in this property'
      };

      const response = await request(app)
        .post('/api/inquiries')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send(inquiryData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with missing required fields', async () => {
      const inquiryData = {
        property: testProperty._id,
        // Missing name, email, phone
        message: 'I am interested in this property'
      };

      const response = await request(app)
        .post('/api/inquiries')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send(inquiryData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid email format', async () => {
      const inquiryData = {
        property: testProperty._id,
        name: 'New Inquiry',
        email: 'invalid-email',
        phone: '+923001234572',
        message: 'I am interested in this property'
      };

      const response = await request(app)
        .post('/api/inquiries')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send(inquiryData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/inquiries', () => {
    it('should get user inquiries', async () => {
      const response = await request(app)
        .get('/api/inquiries')
        .set('Authorization', `Bearer ${tenantToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].user).toBe(tenantUser._id.toString());
    });

    it('should filter inquiries by status', async () => {
      const response = await request(app)
        .get('/api/inquiries?status=pending')
        .set('Authorization', `Bearer ${tenantToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(inquiry => inquiry.status === 'pending')).toBe(true);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/inquiries')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/inquiries/:id', () => {
    it('should get inquiry by ID', async () => {
      const response = await request(app)
        .get(`/api/inquiries/${testInquiry._id}`)
        .set('Authorization', `Bearer ${tenantToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testInquiry._id.toString());
      expect(response.body.data.name).toBe(testInquiry.name);
      expect(response.body.data.email).toBe(testInquiry.email);
      expect(response.body.data.message).toBe(testInquiry.message);
    });

    it('should fail with invalid inquiry ID', async () => {
      const response = await request(app)
        .get('/api/inquiries/invalid-id')
        .set('Authorization', `Bearer ${tenantToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with non-existent inquiry ID', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/inquiries/${fakeId}`)
        .set('Authorization', `Bearer ${tenantToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get(`/api/inquiries/${testInquiry._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/inquiries/:id', () => {
    it('should update inquiry status', async () => {
      const updateData = {
        status: 'responded',
        response: 'Thank you for your inquiry. We will contact you soon.'
      };

      const response = await request(app)
        .put(`/api/inquiries/${testInquiry._id}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(updateData.status);
      expect(response.body.data.response).toBe(updateData.response);
    });

    it('should update inquiry with viewing details', async () => {
      const updateData = {
        status: 'viewing-scheduled',
        viewingDate: '2024-01-20',
        viewingTime: '15:00',
        response: 'Viewing scheduled for the requested time.'
      };

      const response = await request(app)
        .put(`/api/inquiries/${testInquiry._id}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(updateData.status);
      expect(response.body.data.viewingDate).toBe(updateData.viewingDate);
      expect(response.body.data.viewingTime).toBe(updateData.viewingTime);
    });

    it('should fail with invalid status', async () => {
      const updateData = {
        status: 'invalid-status'
      };

      const response = await request(app)
        .put(`/api/inquiries/${testInquiry._id}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid inquiry ID', async () => {
      const updateData = {
        status: 'responded'
      };

      const response = await request(app)
        .put('/api/inquiries/invalid-id')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/inquiries/:id', () => {
    it('should delete inquiry successfully', async () => {
      const response = await request(app)
        .delete(`/api/inquiries/${testInquiry._id}`)
        .set('Authorization', `Bearer ${tenantToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Verify inquiry is deleted
      const deletedInquiry = await Inquiry.findById(testInquiry._id);
      expect(deletedInquiry).toBeNull();
    });

    it('should fail with invalid inquiry ID', async () => {
      const response = await request(app)
        .delete('/api/inquiries/invalid-id')
        .set('Authorization', `Bearer ${tenantToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .delete(`/api/inquiries/${testInquiry._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/inquiries/property/:propertyId', () => {
    it('should get inquiries for a specific property', async () => {
      const response = await request(app)
        .get(`/api/inquiries/property/${testProperty._id}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.every(inquiry => 
        inquiry.property === testProperty._id.toString()
      )).toBe(true);
    });

    it('should fail with invalid property ID', async () => {
      const response = await request(app)
        .get('/api/inquiries/property/invalid-id')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get(`/api/inquiries/property/${testProperty._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/inquiries/stats', () => {
    it('should get inquiry statistics', async () => {
      const response = await request(app)
        .get('/api/inquiries/stats')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.totalInquiries).toBeDefined();
      expect(response.body.data.pendingInquiries).toBeDefined();
      expect(response.body.data.respondedInquiries).toBeDefined();
      expect(response.body.data.completedInquiries).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/inquiries/stats')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
}); 