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
        .get('/api/properties?propertyType=house')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(prop => prop.propertyType === 'house')).toBe(true);
    });

    it('should filter properties by price range', async () => {
      const response = await request(app)
        .get('/api/properties?minPrice=40000&maxPrice=60000')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(prop => 
        prop.rent >= 40000 && prop.rent <= 60000
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
        title: 'New Property for Testing',
        description: 'A new property for testing purposes with detailed description',
        propertyType: 'apartment',
        category: 'residential',
        status: 'available',
        rent: 75000,
        rentType: 'monthly',
        currency: 'PKR',
        location: {
          address: '456 New Street',
          city: 'Lahore',
          area: 'Gulberg III'
        },
        specifications: {
          bedrooms: 2,
          bathrooms: 1,
          kitchens: 1,
          drawingRooms: 1,
          parkingSpaces: 1
        },
        area: {
          size: 1000,
          unit: 'sqft',
          coveredArea: 800,
          coveredAreaUnit: 'sqft'
        },
        features: {
          furnishing: 'semi-furnished',
          condition: 'good',
          age: 3,
          floor: 1,
          totalFloors: 5
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
        contactInfo: {
          name: 'Test Owner',
          phone: '03001234567',
          email: 'owner@example.com',
          preferredContact: 'phone'
        }
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
        propertyType: 'apartment',
        category: 'residential',
        rent: 75000
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
        propertyType: 'apartment',
        category: 'residential',
        rent: 75000
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
        rent: -1000 // Invalid negative price
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
        rent: 60000,
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/properties/${testProperty._id}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.rent).toBe(updateData.rent);
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
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      // Check that at least one property belongs to the owner
      expect(response.body.data.some(prop => 
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