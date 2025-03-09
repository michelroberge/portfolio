const express = require("express");
const authMiddleware = require("../middlewares/auth");
const adminAuth = require("../middlewares/admin");
const blogService = require("../services/blogService");
const BlogEntry = require("../models/BlogEntry"); // For dynamic search
const { searchEntitiesHybrid } = require("../services/searchService");

const router = express.Router();

/**
 * @route POST /api/blogs
 * @desc Create a new blog post
 * @access Admin
 */
router.post("/", authMiddleware, adminAuth, async (req, res) => {
    try {
        const newBlog = await blogService.createBlog(req.body);
        res.status(201).json(newBlog);
    } catch (error) {
        console.error("❌ Error creating blog:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/blogs
 * @desc Retrieve all blog posts
 * @access Public
 */
router.get("/", async (req, res) => {
    try {
      let filter = {};
      try{
        const token = req.cookies["auth-token"];
        const decoded = authService.verifyToken(token);
        req.user = decoded; // Attach user info to the request object
      }
      catch (err){
        // swallow error, user  is just not authenticated.
      }
  
      // If no auth token, assume a public request.
      if (!req.user?.isAdmin === true) {
        filter = { 
          isDraft: false, 
          publishAt: { $lte: new Date() } // only posts scheduled for now or earlier
        };
      }
      const blogs = await blogService.getAllBlogs(filter);
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

/**
 * @route GET /api/blogs/:id
 * @desc Retrieve a single blog post by ID
 * @access Public
 */
router.get("/:id", async (req, res) => {
    try {
        const blog = await blogService.getBlogById(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.json(blog);
    } catch (error) {
        console.error("❌ Error fetching blog:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route PUT /api/blogs/:id
 * @desc Update a blog post by ID
 * @access Admin
 */
router.put("/:id", authMiddleware, adminAuth, async (req, res) => {
    try {
        const updatedBlog = await blogService.updateBlog(req.params.id, req.body);
        if (!updatedBlog) return res.status(404).json({ error: "Blog not found" });
        res.json(updatedBlog);
    } catch (error) {
        console.error("❌ Error updating blog:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route DELETE /api/blogs/:id
 * @desc Delete a blog post by ID
 * @access Admin
 */
router.delete("/:id", authMiddleware, adminAuth, async (req, res) => {
    try {
        const deleted = await blogService.deleteBlog(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Blog not found" });
        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting blog:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route POST /api/blogs/generate-embeddings
 * @desc Refresh blog embeddings (delta or full)
 * @access Admin
 */
router.post("/generate-embeddings", authMiddleware, adminAuth, async (req, res) => {
    try {
        const { fullRefresh = false } = req.body;
        const result = await blogService.refreshBlogEmbeddings(fullRefresh);
        res.json(result);
    } catch (error) {
        console.error("❌ Error generating blog embeddings:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route POST /api/blogs/search
 * @desc Perform a hybrid search (full-text + vector)
 * @access Public
 */
router.post("/search", async (req, res) => {
    try {
        const { query, limit, minScore } = req.body;
        if (!query) return res.status(400).json({ error: "Query is required" });

        const results = await searchEntitiesHybrid(BlogEntry, query, limit, minScore);
        res.json(results);
    } catch (error) {
        console.error("❌ Error searching blogs:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
