const express = require("express");
const Page = require("../models/Page");
const router = express.Router();
const isAdmin = require("../middlewares/admin");
const isAuth = require("../middlewares/auth");

// Fetch all pages
router.get("/", async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: "Failed to load pages" });
  }
});

// Fetch a single page by slug
router.get("/:slug", async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch page" });
  }
});

// Create a new page (Admin only)
router.post("/", isAuth, isAdmin, async (req, res) => {
  try {
    const { title, slug, content, tags } = req.body;
    const newPage = await Page.create({ title, slug, content, tags });
    res.status(201).json(newPage);
  } catch (error) {
    res.status(500).json({ error: "Failed to create page" });
  }
});

// Update a page (Admin only)
router.put("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const { title, slug, content, tags } = req.body;
    const updatedPage = await Page.findByIdAndUpdate(
      req.params.id,
      { title, slug, content, tags },
      { new: true }
    );
    res.json(updatedPage);
  } catch (error) {
    res.status(500).json({ error: "Failed to update page" });
  }
});

// Delete a page (Admin only)
router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    await Page.findByIdAndDelete(req.params.id);
    res.json({ message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete page" });
  }
});

module.exports = router;
