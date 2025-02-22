// portfolio.node/__tests__/blogService.test.js
const mongoose = require("mongoose");
const BlogEntry = require("../src/models/BlogEntry");
const blogService = require("../src/services/blogService");

// Set up a test database connection (mock or use an in-memory MongoDB instance)
beforeAll(async () => {
  // For example, connect to a test MongoDB instance
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
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
