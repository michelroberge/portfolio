// portfolio.node/__tests__/authService.test.js
jest.setTimeout(30000); // Extend timeout for database operations

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const authService = require('../src/services/authService');
const User = require('../src/models/User');

let mongoServer;

beforeAll(async () => {
  // Start an in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  // Drop the database and disconnect
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth Service', () => {
  it('should register a new user', async () => {
    const user = await authService.registerUser({ username: 'testuser', password: 'testpass' });
    expect(user.username).toBe('testuser');
  });

  it('should not allow duplicate user registration', async () => {
    // Register a user first
    await authService.registerUser({ username: 'dupuser', password: 'testpass' });
    // Attempt duplicate registration should throw an error
    await expect(
      authService.registerUser({ username: 'dupuser', password: 'testpass' })
    ).rejects.toThrow('User already exists');
  });

  it('should login a user and return a token', async () => {
    await authService.registerUser({ username: 'loginuser', password: 'testpass' });
    const token = await authService.loginUser({ username: 'loginuser', password: 'testpass' });
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should throw an error for invalid login credentials', async () => {
    await expect(
      authService.loginUser({ username: 'nonexistent', password: 'testpass' })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should verify a valid token', async () => {
    await authService.registerUser({ username: 'verifyuser', password: 'testpass' });
    const token = await authService.loginUser({ username: 'verifyuser', password: 'testpass' });
    const decoded = authService.verifyToken(token);
    expect(decoded.username).toBe('verifyuser');
  });

  it('should throw an error for an invalid token', () => {
    expect(() => authService.verifyToken('invalidtoken')).toThrow('Invalid token');
  });
});
