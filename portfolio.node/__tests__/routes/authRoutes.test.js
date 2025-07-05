const authRoutes = require('../../src/routes/authRoutes');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const User = require('../../src/models/User');
const authService = require('../../src/services/authService');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

jest.mock('../../src/middlewares/auth', () => (req, res, next) => next());
jest.mock('../../src/middlewares/admin', () => (req, res, next) => next());

describe('routes/authRoutes.js', () => {
    test('should be defined', () => {
        expect(authRoutes).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof authRoutes).toBe('object' || 'function');
    });

    if (typeof authRoutes === 'object' && authRoutes !== null) {
        Object.keys(authRoutes).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof authRoutes[method]).toBe('function');
            });
        });
    }
});

describe('OIDC Authentication', () => {
  it('should authenticate new OIDC user', async () => {
    const oidcData = {
      email: 'test@example.com',
      name: 'Test User',
      sub: 'oidc_123456',
      provider: 'oidc'
    };

    const response = await request(app)
      .post('/api/auth/oidc')
      .send(oidcData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe(oidcData.email);
    expect(response.body.user.name).toBe(oidcData.name);

    // Check that user was created in database
    const user = await User.findOne({ username: oidcData.email });
    expect(user).toBeDefined();
    expect(user.oidcProvider).toBe(oidcData.provider);
    expect(user.oidcSub).toBe(oidcData.sub);
  });

  it('should authenticate existing OIDC user', async () => {
    // Create existing user
    const existingUser = new User({
      username: 'test@example.com',
      passwordHash: 'hashed_password',
      isAdmin: false,
      name: 'Old Name'
    });
    await existingUser.save();

    const oidcData = {
      email: 'test@example.com',
      name: 'New Name',
      sub: 'oidc_123456',
      provider: 'oidc'
    };

    const response = await request(app)
      .post('/api/auth/oidc')
      .send(oidcData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();

    // Check that user was updated
    const user = await User.findOne({ username: oidcData.email });
    expect(user.name).toBe(oidcData.name);
    expect(user.oidcProvider).toBe(oidcData.provider);
    expect(user.oidcSub).toBe(oidcData.sub);
  });

  it('should require email for OIDC authentication', async () => {
    const oidcData = {
      name: 'Test User',
      sub: 'oidc_123456',
      provider: 'oidc'
    };

    const response = await request(app)
      .post('/api/auth/oidc')
      .send(oidcData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Email is required');
  });

  it('should handle OIDC authentication errors', async () => {
    // Mock authService.registerUser to throw an error
    const originalRegisterUser = authService.registerUser;
    authService.registerUser = jest.fn().mockRejectedValue(new Error('Registration failed'));

    const oidcData = {
      email: 'test@example.com',
      name: 'Test User',
      sub: 'oidc_123456',
      provider: 'oidc'
    };

    const response = await request(app)
      .post('/api/auth/oidc')
      .send(oidcData)
      .expect(500);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('OIDC authentication failed');

    // Restore original function
    authService.registerUser = originalRegisterUser;
  });

  it('should create admin user if no admin exists', async () => {
    const oidcData = {
      email: 'admin@example.com',
      name: 'Admin User',
      sub: 'oidc_admin_123',
      provider: 'oidc'
    };

    const response = await request(app)
      .post('/api/auth/oidc')
      .send(oidcData)
      .expect(200);

    expect(response.body.success).toBe(true);

    // Check that user was created as admin (first user)
    const user = await User.findOne({ username: oidcData.email });
    expect(user.isAdmin).toBe(true);
  });

  it('should not create admin user if admin already exists', async () => {
    // Create existing admin user
    const existingAdmin = new User({
      username: 'existing@example.com',
      passwordHash: 'hashed_password',
      isAdmin: true
    });
    await existingAdmin.save();

    const oidcData = {
      email: 'newuser@example.com',
      name: 'New User',
      sub: 'oidc_new_123',
      provider: 'oidc'
    };

    const response = await request(app)
      .post('/api/auth/oidc')
      .send(oidcData)
      .expect(200);

    expect(response.body.success).toBe(true);

    // Check that new user was not created as admin
    const user = await User.findOne({ username: oidcData.email });
    expect(user.isAdmin).toBe(false);
  });
});
