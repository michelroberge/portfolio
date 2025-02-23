// portfolio.node/src/routes/blogRoutes.js
const express = require("express");
const authMiddleware = require("../middlewares/auth");
const blogService = require("../services/blogService");
const router = express.Router();
const validate = require("../middlewares/validate");
const { createBlogSchema } = require("../validators/blogValidator");


// Create a new blog entry using the service module
router.post("/", authMiddleware, validate(createBlogSchema), async (req, res) => {
  try {
    const newEntry = await blogService.createBlogEntry(req.body);
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all blog entries using the service module
router.get("/", async (req, res) => {
  try {
    let filter = {};
    // If no auth token, assume a public request.
    if (!req.cookies["auth-token"]) {
      filter = { 
        isDraft: false, 
        publishAt: { $lte: new Date() } // only posts scheduled for now or earlier
      };
    }
    const blogs = await blogService.getAllBlogEntries(filter);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get a single blog entry by ID using the service module
router.get("/:id", async (req, res) => {
  try {
    const blog = await blogService.getBlogEntryById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Entry not found" });
    
    // For public requests, ensure the post is published.
    if (!req.cookies["auth-token"] && (blog.isDraft || (blog.publishAt && blog.publishAt > new Date()))) {
      return res.status(404).json({ error: "Entry not found" });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Update a blog entry by ID using the service module
router.put("/:id", authMiddleware, validate(createBlogSchema), async (req, res) => {
  try {
    const updatedEntry = await blogService.updateBlogEntry(req.params.id, req.body);
    if (!updatedEntry) return res.status(404).json({ error: "Entry not found" });
    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a blog entry by ID using the service module
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedEntry = await blogService.deleteBlogEntry(req.params.id);
    if (!deletedEntry) return res.status(404).json({ error: "Entry not found" });
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
