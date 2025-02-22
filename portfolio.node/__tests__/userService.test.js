jest.setTimeout(30000); // Increase timeout for database operations

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const userService = require("../src/services/userService");
const User = require("../src/models/User");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Service", () => {
  it("should create a new user", async () => {
    const userData = { username: "testuser", password: "testpass" };
    const user = await userService.createUser(userData);
    expect(user.username).toBe("testuser");
  });

  it("should throw an error if username or password is missing", async () => {
    await expect(userService.createUser({ username: "", password: "testpass" }))
      .rejects.toThrow("Username and password are required");
  });

  it("should throw an error if the user already exists", async () => {
    const userData = { username: "duplicateUser", password: "testpass" };
    // Create the user the first time.
    await userService.createUser(userData);
    // Try creating the same user again.
    await expect(userService.createUser(userData))
      .rejects.toThrow("User already exists");
  });
});
