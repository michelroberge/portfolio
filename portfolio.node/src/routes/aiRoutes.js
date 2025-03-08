const express = require("express");
const isAuth = require("../middlewares/auth");
const isAdmin = require("../middlewares/admin");
const embeddingService = require("../services/embeddingService");

const router = express.Router();

/**
 * 📌 Initialize Embeddings (Deletes & Rebuilds All Collections)
 */
router.post("/initialize", isAuth, isAdmin, async (req, res) => {
  try {
    await embeddingService.initializeEmbeddings();
    res.json({ message: "Embeddings initialized successfully." });
  } catch (error) {
    console.error("Error initializing embeddings:", error);
    res.status(500).json({ error: "Failed to initialize embeddings" });
  }
});

module.exports = router;
