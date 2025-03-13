const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const adminAuth = require("../../middlewares/admin");
const blogService = require("../../services/blogService");

const router = express.Router();

/**
 * @route POST /api/admin/blogs
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
 * @route PUT /api/admin/blogs/:id
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
 * @route DELETE /api/admin/blogs/:id
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
 * @route POST /api/admin/blogs/generate-embeddings
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

module.exports = router;
