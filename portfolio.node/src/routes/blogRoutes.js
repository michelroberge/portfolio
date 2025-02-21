const mongoose = require("mongoose");
const  express = require( "express");
const BlogEntry = require( "../models/BlogEntry.js");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// Create a new blog entry
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newEntry = new BlogEntry(req.body);
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all blog entries
router.get("/", async (req, res) => {
  try {
    const entries = await BlogEntry.find();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single blog entry by ID
router.get("/:id", async (req, res) => {
  try {
    console.log("received id", req.params.id);

    const id = new mongoose.Types.ObjectId(req.params.id);
    const entry = await BlogEntry.findById(id);
    if (!entry) return res.status(404).json({ error: "Entry not found" });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a blog entry by ID
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedEntry = await BlogEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEntry) return res.status(404).json({ error: "Entry not found" });
    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a blog entry by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedEntry = await BlogEntry.findByIdAndDelete(req.params.id);
    if (!deletedEntry) return res.status(404).json({ error: "Entry not found" });
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;