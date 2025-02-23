// portfolio.node/__tests__/commentRoutes.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { createApp } = require("../src/app");

let app;
let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;
  app = await createApp();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Comment Routes", () => {
  let createdCommentId;
  // Create a dummy blog ID for testing
  const blogId = new mongoose.Types.ObjectId();

  test("POST /api/comments creates a new comment", async () => {
    const res = await request(app)
      .post("/api/comments")
      .send({
        author: "Test Author",
        text: "This is a test comment",
        blog: blogId.toString(),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.author).toBe("Test Author");
    createdCommentId = res.body._id;
  });

  test("GET /api/comments/blog/:blogId retrieves comments with nested replies", async () => {
    const res = await request(app)
      .get(`/api/comments/blog/${blogId.toString()}`)
      .send();
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // We should retrieve at least the comment we just created
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test("PUT /api/comments/:id updates a comment (auth required)", async () => {
    const res = await request(app)
      .put(`/api/comments/${createdCommentId}`)
      .set("Cookie", "session=dummy") // Set dummy cookie to bypass auth middleware
      .send({ text: "Updated comment text" });
    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe("Updated comment text");
  });

  test("DELETE /api/comments/:id redacts a comment (auth required)", async () => {
    const res = await request(app)
      .delete(`/api/comments/${createdCommentId}`)
      .set("Cookie", "session=dummy") // Set dummy cookie to bypass auth middleware
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.comment.redacted).toBe(true);
  });
});
