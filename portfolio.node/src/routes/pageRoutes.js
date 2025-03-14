const express = require("express");
const authMiddleware = require("../middlewares/auth");
const adminAuth = require("../middlewares/admin");
const pageService = require("../services/pageService");
const Page = require("../models/Page"); // For dynamic search
const { searchEntitiesHybrid } = require("../services/searchService");

const router = express.Router();

/**
 * @route GET /api/pages/:slug
 * @desc Retrieve a single page by slug
 * @access Public
 */
router.get("/:slug", async (req, res) => {
    try {
        const page = await pageService.getPageBySlug(req.params.slug);
        if (!page) return res.status(404).json({ error: "Page not found" });
        res.json(page);
    } catch (error) {
        console.error("❌ Error fetching page by slug:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route POST /api/pages/search
 * @desc Perform a hybrid search (full-text + vector)
 * @access Public
 */
router.post("/search", async (req, res) => {
    try {
        const { query, limit, minScore } = req.body;
        if (!query) return res.status(400).json({ error: "Query is required" });

        const results = await searchEntitiesHybrid(Page, query, limit, minScore);
        res.json(results);
    } catch (error) {
        console.error("❌ Error searching pages:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
