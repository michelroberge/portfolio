const express = require("express");
const authMiddleware = require("../middlewares/auth");
const adminAuth = require("../middlewares/admin");
const pageService = require("../services/pageService");
const Page = require("../models/Page"); // For dynamic search
const { searchEntitiesHybrid } = require("../services/searchService");

const router = express.Router();

/**
 * @route POST /api/pages
 * @desc Create a new page
 * @access Admin
 */
router.post("/", authMiddleware, adminAuth, async (req, res) => {
    try {
        const newPage = await pageService.createPage(req.body);
        res.status(201).json(newPage);
    } catch (error) {
        console.error("❌ Error creating page:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/pages
 * @desc Retrieve all pages
 * @access Public
 */
router.get("/", async (req, res) => {
    try {
        const pages = await pageService.getAllPages();
        res.json(pages);
    } catch (error) {
        console.error("❌ Error fetching pages:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/pages/:id
 * @desc Retrieve a single page by ID
 * @access Public
 */
router.get("/:id", async (req, res) => {
    try {
        const page = await pageService.getPageById(req.params.id);
        if (!page) return res.status(404).json({ error: "Page not found" });
        res.json(page);
    } catch (error) {
        console.error("❌ Error fetching page:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/pages/slug/:slug
 * @desc Retrieve a single page by slug
 * @access Public
 */
router.get("/slug/:slug", async (req, res) => {
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
 * @route PUT /api/pages/:id
 * @desc Update a page by ID
 * @access Admin
 */
router.put("/:id", authMiddleware, adminAuth, async (req, res) => {
    try {
        const updatedPage = await pageService.updatePage(req.params.id, req.body);
        if (!updatedPage) return res.status(404).json({ error: "Page not found" });
        res.json(updatedPage);
    } catch (error) {
        console.error("❌ Error updating page:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route DELETE /api/pages/:id
 * @desc Delete a page by ID
 * @access Admin
 */
router.delete("/:id", authMiddleware, adminAuth, async (req, res) => {
    try {
        const deleted = await pageService.deletePage(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Page not found" });
        res.json({ message: "Page deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting page:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route POST /api/pages/generate-embeddings
 * @desc Refresh page embeddings (delta or full)
 * @access Admin
 */
router.post("/generate-embeddings", authMiddleware, adminAuth, async (req, res) => {
    try {
        const { fullRefresh = false } = req.body;
        const result = await pageService.refreshPageEmbeddings(fullRefresh);
        res.json(result);
    } catch (error) {
        console.error("❌ Error generating page embeddings:", error.message);
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
