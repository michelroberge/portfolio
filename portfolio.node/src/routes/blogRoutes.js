const express = require("express");
const blogService = require("../services/blogService");
const BlogEntry = require("../models/BlogEntry");
const { searchEntitiesHybrid } = require("../services/searchService");

const router = express.Router();

/**
 * Sanitize blog data for public consumption
 * @param {Object} blog - The blog entry to sanitize
 * @returns {Object} - Sanitized blog entry
 */
function sanitizeBlogForPublic(blog) {
    if (!blog) return null;

    // Remove sensitive or admin-only fields
    const {
        isDraft,
        publishAt,
        createdBy,
        updatedBy,
        __v,
        embedding,
        ...publicBlog
    } = blog.toObject();

    // Only include publishAt if it's in the past
    if (publishAt && publishAt <= new Date()) {
        publicBlog.publishAt = publishAt;
    }

    return publicBlog;
}

/**
 * @route GET /api/blogs
 * @desc Retrieve all published blog posts
 * @access Public
 */
router.get("/", async (req, res) => {
    try {
        // Always filter for public posts
        const filter = { 
            isDraft: false, 
            publishAt: { $lte: new Date() }
        };

        const blogs = await blogService.getAllBlogs(filter);
        
        // Sanitize each blog for public consumption
        const sanitizedBlogs = blogs.map(blog => sanitizeBlogForPublic(blog))
            .filter(blog => blog !== null)
            .sort((a, b) => new Date(b.publishAt) - new Date(a.publishAt));

        res.json(sanitizedBlogs);
    } catch (error) {
        console.error("❌ Error fetching blogs:", error.message);
        res.status(500).json({ error: "Failed to fetch blogs" }); // Generic error for public
    }
});

/**
 * @route GET /api/blogs/search
 * @desc Search published blog posts
 * @access Public
 */
router.get("/search", async (req, res) => {
    try {
        const { q: query, limit = 10, minScore = 0.7 } = req.query;
        if (!query) return res.status(400).json({ error: "Search query is required" });

        // Only search public posts
        const filter = {
            isDraft: false,
            publishAt: { $lte: new Date() }
        };

        const results = await searchEntitiesHybrid(BlogEntry, query, limit, minScore, filter);
        
        // Sanitize search results
        const sanitizedResults = results.map(result => ({
            ...result,
            document: sanitizeBlogForPublic(result.document)
        })).filter(result => result.document !== null);

        res.json(sanitizedResults);
    } catch (error) {
        console.error("❌ Error searching blogs:", error.message);
        res.status(500).json({ error: "Search failed" }); // Generic error for public
    }
});

/**
 * @route GET /api/blogs/:id
 * @desc Retrieve a single published blog post by ID
 * @access Public
 */
router.get("/:id", async (req, res) => {
    try {
        const blog = await blogService.getBlogById(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        // Check if blog is published
        if (blog.isDraft || (blog.publishAt && blog.publishAt > new Date())) {
            return res.status(404).json({ error: "Blog not found" });
        }

        // Sanitize blog for public consumption
        const sanitizedBlog = sanitizeBlogForPublic(blog);
        if (!sanitizedBlog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        res.json(sanitizedBlog);
    } catch (error) {
        console.error("❌ Error fetching blog:", error.message);
        res.status(500).json({ error: "Failed to fetch blog" }); // Generic error for public
    }
});

module.exports = router;
