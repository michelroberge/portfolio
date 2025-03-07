const express = require("express");
const CareerTimeline = require("../models/CareerTimeline");
const router = express.Router();
const isAuth = require("../middlewares/auth");
const isAdmin = require("../middlewares/admin");

// GET all career timeline entries
router.get("/timeline", async (req, res) => {
  try {
    const entries = await CareerTimeline.find().sort({ startDate: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching career timeline entries." });
  }
});

// GET a single timeline entry
router.get("/timeline/:id", async (req, res) => {
  try {
    const entry = await CareerTimeline.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: "Entry not found." });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

// CREATE a new career timeline entry
router.post("/timeline", isAuth, isAdmin, async (req, res) => {
  try {
    const newEntry = new CareerTimeline(req.body);
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(400).json({ error: "Invalid data." });
  }
});

// UPDATE an existing entry
router.put("/timeline/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const updatedEntry = await CareerTimeline.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEntry) return res.status(404).json({ error: "Entry not found." });
    res.json(updatedEntry);
  } catch (error) {
    res.status(400).json({ error: "Invalid update request." });
  }
});

// DELETE an entry
router.delete("/timeline/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const deletedEntry = await CareerTimeline.findByIdAndDelete(req.params.id);
    if (!deletedEntry) return res.status(404).json({ error: "Entry not found." });
    res.json({ message: "Entry deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Server error while deleting entry." });
  }
});

module.exports = router;
