const express = require("express");
const {
    parseLocalDirectory,
    updateEmbedding,
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
        const result = await updateEmbeddingMetadata({id, metadata});
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

/**
 * @route POST /api/embeddings
 * @desc Store a new embedding for a document
 * @access Admin
 */
router.post("/", isAdmin, async (req, res) => {
    try {
        const { filePath, content, metadata } = req.body;
        const result = await storeEmbedding(filePath, content, metadata);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route DELETE /api/embeddings/:id
 * @desc Delete an embedding by ID
 * @access Admin
 */
router.delete("/:id", isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const success = await deleteEmbedding(id);
        if (success) {
            res.status(200).json({ message: "Embedding deleted successfully." });
        } else {
            res.status(404).json({ error: "Embedding not found." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route POST /api/embeddings/search
 * @desc Perform a similarity search in Qdrant
 * @access Public
 */
router.post("/search", async (req, res) => {
    try {
        const { queryVector, topK, minScore } = req.body;
        const results = await searchQdrant(queryVector, COLLECTION_NAME, topK, minScore);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
