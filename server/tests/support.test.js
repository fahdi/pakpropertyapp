const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');

describe('Support and Help Routes', () => {
  let testUser;
  let testProperty;
  let authToken;

  beforeAll(async () => {
    // Create test user
    testUser = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@support.com',
      password: 'password123',
      phone: '03001111111',
      gender: 'male',
      role: 'tenant',
      isVerified: true,
      isActive: true
    });

    // Create test property
    testProperty = await Property.create({
      title: 'Test Property for Support',
      description: 'A test property for support testing',
      propertyType: 'apartment',
      category: 'rent',
      rent: 50000,
      rentType: 'monthly',
      location: {
        city: 'Karachi',
        area: 'DHA Phase 6'
      },
      owner: testUser._id,
      status: 'available'
    });

    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@support.com',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({ email: 'test@support.com' });
    await Property.deleteMany({ title: 'Test Property for Support' });
    await Inquiry.deleteMany({ user: testUser._id });
    await mongoose.connection.close();
  });

  describe('GET /api/support/help', () => {
    test('should return help categories and articles', async () => {
      const response = await request(app)
        .get('/api/support/help')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data.categories)).toBe(true);
      expect(response.body.data.categories.length).toBeGreaterThan(0);
    });

    test('should return help articles for specific category', async () => {
      const response = await request(app)
        .get('/api/support/help?category=getting-started')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data.articles)).toBe(true);
    });

    test('should search help articles', async () => {
      const response = await request(app)
        .get('/api/support/help?search=account')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data.results)).toBe(true);
    });
  });

  describe('GET /api/support/faqs', () => {
    test('should return FAQ categories', async () => {
      const response = await request(app)
        .get('/api/support/faqs')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data.categories)).toBe(true);
    });

    test('should return FAQs for specific category', async () => {
      const response = await request(app)
        .get('/api/support/faqs?category=general')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data.faqs)).toBe(true);
    });

    test('should search FAQs', async () => {
      const response = await request(app)
        .get('/api/support/faqs?search=property')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data.results)).toBe(true);
    });
  });

  describe('POST /api/support/report-issue', () => {
    test('should create a new support ticket', async () => {
      const issueData = {
        name: 'Test User',
        email: 'test@support.com',
        phone: '03001111111',
        issueType: 'bug',
        subject: 'Test Issue Report',
        description: 'This is a test issue report for testing purposes.',
        browser: 'Chrome',
        device: 'Desktop'
      };

      const response = await request(app)
        .post('/api/support/report-issue')
        .send(issueData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.name).toBe(issueData.name);
      expect(response.body.data.email).toBe(issueData.email);
      expect(response.body.data.issueType).toBe(issueData.issueType);
    });

    test('should require all required fields', async () => {
      const incompleteData = {
        name: 'Test User',
        email: 'test@support.com'
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/support/report-issue')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    test('should validate email format', async () => {
      const invalidEmailData = {
        name: 'Test User',
        email: 'invalid-email',
        phone: '03001111111',
        issueType: 'bug',
        subject: 'Test Issue',
        description: 'Test description'
      };

      const response = await request(app)
        .post('/api/support/report-issue')
        .send(invalidEmailData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    test('should validate issue type', async () => {
      const invalidIssueTypeData = {
        name: 'Test User',
        email: 'test@support.com',
        phone: '03001111111',
        issueType: 'invalid-type',
        subject: 'Test Issue',
        description: 'Test description'
      };

      const response = await request(app)
        .post('/api/support/report-issue')
        .send(invalidIssueTypeData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/support/issues', () => {
    test('should return user\'s support tickets when authenticated', async () => {
      const response = await request(app)
        .get('/api/support/issues')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/support/issues')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/support/issues/:id', () => {
    test('should return specific support ticket when authenticated', async () => {
      // First create a ticket
      const issueData = {
        name: 'Test User',
        email: 'test@support.com',
        phone: '03001111111',
        issueType: 'bug',
        subject: 'Test Issue for Details',
        description: 'Test description for details',
        browser: 'Chrome',
        device: 'Desktop'
      };

      const createResponse = await request(app)
        .post('/api/support/report-issue')
        .send(issueData);

      const ticketId = createResponse.body.data._id;

      const response = await request(app)
        .get(`/api/support/issues/${ticketId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data._id).toBe(ticketId);
    });

    test('should return 404 for non-existent ticket', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/support/issues/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /api/support/issues/:id', () => {
    test('should update support ticket status', async () => {
      // First create a ticket
      const issueData = {
        name: 'Test User',
        email: 'test@support.com',
        phone: '03001111111',
        issueType: 'bug',
        subject: 'Test Issue for Update',
        description: 'Test description for update',
        browser: 'Chrome',
        device: 'Desktop'
      };

      const createResponse = await request(app)
        .post('/api/support/report-issue')
        .send(issueData);

      const ticketId = createResponse.body.data._id;

      const updateData = {
        status: 'in-progress',
        adminNotes: 'Working on this issue'
      };

      const response = await request(app)
        .put(`/api/support/issues/${ticketId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.status).toBe(updateData.status);
    });
  });

  describe('GET /api/support/contact', () => {
    test('should return contact information', async () => {
      const response = await request(app)
        .get('/api/support/contact')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('phone');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('address');
    });
  });

  describe('POST /api/support/contact', () => {
    test('should send contact message', async () => {
      const contactData = {
        name: 'Test User',
        email: 'test@support.com',
        subject: 'Test Contact',
        message: 'This is a test contact message'
      };

      const response = await request(app)
        .post('/api/support/contact')
        .send(contactData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
    });

    test('should require all required fields', async () => {
      const incompleteData = {
        name: 'Test User',
        email: 'test@support.com'
        // Missing subject and message
      };

      const response = await request(app)
        .post('/api/support/contact')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });
}); 