const express = require("express");
const isAuth = require("../middlewares/auth");
const isAdmin = require("../middlewares/admin");

const { initializeProjectEmbeddings } = require("../services/projectService");
const { initializeBlogEmbeddings } = require("../services/blogService");
const { initializePageEmbeddings } = require("../services/pageService");
const { initializeFileEmbeddings } = require("../services/fileService");

const router = express.Router();

/**
 * 📌 Initialize All Embeddings (Calls Each Service)
 */
router.post("/initialize", isAuth, isAdmin, async (req, res) => {
    try {
        console.log("🔄 Starting global embedding initialization...");
        await initializeProjectEmbeddings();
        await initializeBlogEmbeddings();
        await initializePageEmbeddings();
        await initializeFileEmbeddings();
        console.log("✅ All embeddings initialized successfully!");
        res.json({ message: "Embeddings initialization complete." });
    } catch (error) {
        console.error("❌ Error initializing embeddings:", error);
        res.status(500).json({ error: "Failed to initialize embeddings" });
    }
});

module.exports = router;
