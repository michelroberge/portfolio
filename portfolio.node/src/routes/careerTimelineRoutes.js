const express = require("express");
const CareerTimeline = require("../models/CareerTimeline");
const router = express.Router();
const isAuth = require("../middlewares/auth");
const isAdmin = require("../middlewares/admin");
const cheerio = require("cheerio");

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

module.exports = router;
