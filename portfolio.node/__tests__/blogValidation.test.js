// portfolio.node/__tests__/blogValidation.test.js
const request = require("supertest");
const express = require("express");
const bodyParser = require("express").json;
const validate = require("../src/middlewares/validate");
const { createBlogSchema } = require("../src/validators/blogValidator");

const app = express();
app.use(bodyParser());
// Set up a dummy endpoint that uses the validation middleware.
app.post("/test", validate(createBlogSchema), (req, res) => {
  res.status(200).json({ success: true });
});

describe("Blog Validation Middleware", () => {
  it("should pass validation for valid data", async () => {
    const validData = {
      title: "A Valid Blog Title",
      publishAt: "2025-02-22T00:00:00.000Z",
      excerpt: "This is a valid excerpt.",
      body: "This is the body of the blog.",
    };

    const res = await request(app).post("/test").send(validData);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should fail validation for invalid data", async () => {
    const invalidData = {
      title: "No", // Too short
      publishAt: "invalid-date",
      excerpt: "x".repeat(600), // Too long
      body: "", // Empty body
    };

    const res = await request(app).post("/test").send(invalidData);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
