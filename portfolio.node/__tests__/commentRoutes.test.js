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

  test("Nested replies retrieval returns full tree", async () => {
    // Create a root comment.
    const rootRes = await request(app)
      .post("/api/comments")
      .send({
        author: "Root Author",
        text: "Root comment",
        blog: blogId.toString()
      });
    const rootId = rootRes.body._id;
  
    // Create first-level reply.
    const reply1Res = await request(app)
      .post("/api/comments")
      .send({
        author: "Reply1",
        text: "First reply",
        blog: blogId.toString(),
        parent: rootId
      });
    const reply1Id = reply1Res.body._id;
  
    // Create second-level reply (reply to first-level reply).
    await request(app)
      .post("/api/comments")
      .send({
        author: "Reply2",
        text: "Second level reply",
        blog: blogId.toString(),
        parent: reply1Id
      });
  
    // Fetch comments and verify nested structure.
    const res = await request(app).get(`/api/comments/blog/${blogId.toString()}`).send();
    expect(res.statusCode).toBe(200);
    const rootComment = res.body.find((c) => c._id === rootId);
    expect(rootComment).toBeDefined();
    expect(rootComment.replies).toHaveLength(1);
    expect(rootComment.replies[0]._id).toBe(reply1Id);
    expect(rootComment.replies[0].replies).toHaveLength(1);
  });
  
  test("POST /api/comments returns error for non-existent parent", async () => {
    const fakeParentId = "000000000000000000000000"; // Valid ObjectId format but non-existent.
    const res = await request(app)
      .post("/api/comments")
      .send({
        author: "Test",
        text: "Should fail",
        blog: blogId.toString(),
        parent: fakeParentId
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Parent comment not found/);
  });
  
});
