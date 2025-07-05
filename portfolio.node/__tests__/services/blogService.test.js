// portfolio.node/__tests__/blogService.test.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const BlogEntry = require("../../src/models/BlogEntry");
const blogService = require("../../src/services/blogService");

beforeAll(async () => {
    // Create an in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    await mongoose.connect(uri);
  });
  
afterAll(async () => {
    try {
        // Drop the test database and disconnect
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
        await mongoServer.stop();
    } catch (err) {
        // Optionally log or ignore
    }
});
  
describe("Blog Service", () => {
  it("should create a new blog entry", async () => {
    const data = {
      title: "Test Blog",
      date: "2025-02-22",
      excerpt: "Test excerpt",
      body: "Test body content",
    };
    const blogEntry = await blogService.createBlog(data);
    expect(blogEntry.title).toBe("Test Blog");
    expect(blogEntry.excerpt).toBe("Test excerpt");
  });

  // Additional tests for getAllBlogEntries, getBlogEntryById, etc.
});
