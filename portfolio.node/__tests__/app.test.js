// portfolio.node/__tests__/app.test.js
jest.setTimeout(30000); // Increase timeout for database operations

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { createApp } = require("../src/app");

let mongoServer;
let app;

beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  // Set the environment variable so that connectDB uses the in-memory DB URI.
  process.env.MONGO_URI = uri;
  
  // Create our app; createApp() will call connectDB() using process.env.MONGO_URI.
  app = await createApp();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Express App", () => {
  it("should respond to GET /api/auth/check without token", async () => {
    const res = await request(app).get("/api/auth/check");
    // Since no token is provided, expect a 401 response.
    expect(res.statusCode).toBe(401);
  });
});
