const request = require('supertest');
const app = require('../index');
const User = require('../models/User');
const Property = require('../models/Property');
const { generateToken } = require('../middleware/auth');

describe('Properties API', () => {
  let ownerUser;
  let tenantUser;
  let adminUser;
  let testProperty;
  let ownerToken;
  let tenantToken;
  let adminToken;

  beforeEach(async () => {
    // Create test users
    ownerUser = new User({
      email: 'owner@example.com',
      password: 'OwnerPassword123',
      firstName: 'Property',
      lastName: 'Owner',
      role: 'owner',
      phone: '+923001234569',
      gender: 'male',
      address: {
        street: '789 Owner Street',
        city: 'Islamabad',
        state: 'Federal',
        zipCode: '44000'
      },
      isVerified: true,
      isActive: true
    });
    await ownerUser.save();

    tenantUser = new User({
      email: 'tenant@example.com',
      password: 'TenantPassword123',
      firstName: 'Test',
      lastName: 'Tenant',
      role: 'tenant',
      phone: '+923001234570',
      gender: 'female',
      address: {
        street: '321 Tenant Street',
        city: 'Faisalabad',
        state: 'Punjab',
        zipCode: '38000'
      },
      isVerified: true,
      isActive: true
    });
    await tenantUser.save();

    adminUser = new User({
      email: 'admin@example.com',
      password: 'AdminPassword123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      phone: '+923001234571',
      gender: 'male',
      address: {
        street: '654 Admin Street',
        city: 'Multan',
        state: 'Punjab',
        zipCode: '60000'
      },
      isVerified: true,
      isActive: true
    });
    await adminUser.save();

    // Create test property
    testProperty = new Property({
      title: 'Test Property',
      description: 'A test property for testing',
      price: 50000,
      type: 'house',
      status: 'for-sale',
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      address: {
        street: '123 Test Street',
        city: 'Karachi',
        state: 'Sindh',
        zipCode: '75000'
      },
      features: ['parking', 'garden'],
      images: ['image1.jpg', 'image2.jpg'],
      owner: ownerUser._id,
      isActive: true
    });
    await testProperty.save();

    // Generate tokens
    ownerToken = generateToken(ownerUser._id);
    tenantToken = generateToken(tenantUser._id);
    adminToken = generateToken(adminUser._id);
  });

  describe('GET /api/properties', () => {
    it('should get all properties with pagination', async () => {
      const response = await request(app)
        .get('/api/properties')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter properties by type', async () => {
      const response = await request(app)
        .get('/api/properties?type=house')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(prop => prop.type === 'house')).toBe(true);
    });

    it('should filter properties by price range', async () => {
      const response = await request(app)
        .get('/api/properties?minPrice=40000&maxPrice=60000')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(prop => 
        prop.price >= 40000 && prop.price <= 60000
      )).toBe(true);
    });

    it('should search properties by title', async () => {
      const response = await request(app)
        .get('/api/properties?search=Test')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.some(prop => 
        prop.title.toLowerCase().includes('test')
      )).toBe(true);
    });
  });

  describe('GET /api/properties/:id', () => {
    it('should get property by ID', async () => {
      const response = await request(app)
        .get(`/api/properties/${testProperty._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testProperty._id.toString());
      expect(response.body.data.title).toBe(testProperty.title);
    });

    it('should return 404 for non-existent property', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/properties/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/properties', () => {
    it('should create property successfully (owner)', async () => {
      const propertyData = {
        title: 'New Property',
        description: 'A new property',
        price: 75000,
        type: 'apartment',
        status: 'for-rent',
        bedrooms: 2,
        bathrooms: 1,
        area: 1000,
        address: {
          street: '456 New Street',
          city: 'Lahore',
          state: 'Punjab',
          zipCode: '54000'
        },
        features: ['balcony', 'elevator'],
        images: ['new1.jpg', 'new2.jpg']
      };

      const response = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(propertyData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(propertyData.title);
      expect(response.body.data.owner).toBe(ownerUser._id.toString());
    });

    it('should fail for non-owner users', async () => {
      const propertyData = {
        title: 'New Property',
        description: 'A new property',
        price: 75000,
        type: 'apartment'
      };

      const response = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send(propertyData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      const propertyData = {
        title: 'New Property',
        description: 'A new property',
        price: 75000
      };

      const response = await request(app)
        .post('/api/properties')
        .send(propertyData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid data', async () => {
      const propertyData = {
        title: '', // Invalid empty title
        price: -1000 // Invalid negative price
      };

      const response = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(propertyData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/properties/:id', () => {
    it('should update property successfully (owner)', async () => {
      const updateData = {
        title: 'Updated Property',
        price: 60000,
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/properties/${testProperty._id}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.price).toBe(updateData.price);
    });

    it('should fail for non-owner users', async () => {
      const updateData = {
        title: 'Updated Property'
      };

      const response = await request(app)
        .put(`/api/properties/${testProperty._id}`)
        .set('Authorization', `Bearer ${tenantToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail for non-existent property', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const updateData = {
        title: 'Updated Property'
      };

      const response = await request(app)
        .put(`/api/properties/${fakeId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/properties/:id', () => {
    it('should delete property successfully (owner)', async () => {
      const response = await request(app)
        .delete(`/api/properties/${testProperty._id}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify property is deleted
      const deletedProperty = await Property.findById(testProperty._id);
      expect(deletedProperty).toBeNull();
    });

    it('should fail for non-owner users', async () => {
      const response = await request(app)
        .delete(`/api/properties/${testProperty._id}`)
        .set('Authorization', `Bearer ${tenantToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail for non-existent property', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/properties/${fakeId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/properties/my-properties', () => {
    it('should get user\'s properties', async () => {
      const response = await request(app)
        .get('/api/properties/my-properties')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(prop => 
        prop.owner === ownerUser._id.toString()
      )).toBe(true);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/properties/my-properties')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
}); 