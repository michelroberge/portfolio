const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../src/models/User");
const authService = require("../src/services/authService");

beforeAll(async () => {
    // Create an in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });
  
afterAll(async () => {
    // Drop the test database and disconnect
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Auth Service", () => {
  it("should register a new user", async () => {
    const user = await authService.registerUser({ username: "testuser", password: "testpass" });
    expect(user.username).toBe("testuser");
  });

  it("should not register an existing user", async () => {
    await expect(authService.registerUser({ username: "testuser", password: "testpass" }))
      .rejects.toThrow("User already exists");
  });

  it("should login a user and return a token", async () => {
    const token = await authService.loginUser({ username: "testuser", password: "testpass" });
    expect(token).toBeDefined();
  });
});
