// portfolio.node/__tests__/blogService.test.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const BlogEntry = require("../src/models/BlogEntry");
const blogService = require("../src/services/blogService");

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
  
describe("Blog Service", () => {
  it("should create a new blog entry", async () => {
    const data = {
      title: "Test Blog",
      date: "2025-02-22",
      excerpt: "Test excerpt",
      body: "Test body content",
    };
    const blogEntry = await blogService.createBlogEntry(data);
    expect(blogEntry.title).toBe("Test Blog");
    expect(blogEntry.excerpt).toBe("Test excerpt");
  });

  // Additional tests for getAllBlogEntries, getBlogEntryById, etc.
});
