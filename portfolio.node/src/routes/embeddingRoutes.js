const express = require("express");
const {
    parseLocalDirectory,
    updateEmbeddingMetadata,
    listEmbeddings
} = require("../services/embeddingService");  //
const isAdmin = require("../middlewares/admin");

const router = express.Router();

/**
 * @route POST /api/embeddings/local-directory
 * @desc Parse a local directory and generate embeddings
 * @access Admin
 */
router.post("/local-directory", isAdmin, async (req, res) => {
    try {
        const { directoryPath, includeExtensions, metadata } = req.body;
        const result = await parseLocalDirectory(directoryPath, includeExtensions, metadata);
        res.status(200).json(result);
    } catch (error) {
        console.error("❌ Error in embedding route:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route PUT /api/embeddings/:id/metadata
 * @desc Update metadata for a specific embedding
 * @access Admin
 */
router.put("/:id/metadata", isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { metadata } = req.body;
        const result = await updateEmbeddingMetadata(id, metadata);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/embeddings/list
 * @desc Retrieve a list of all embeddings
 * @access Admin
 */
router.get("/list", isAdmin, async (req, res) => {
    try {
        const embeddings = await listEmbeddings();
        res.status(200).json(embeddings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
