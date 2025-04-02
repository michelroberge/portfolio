const express = require("express");
const { generateEmbeddings } = require("../../../services/embeddingService");
const {
    storeEmbedding,
    deleteEmbedding,
    searchQdrant,
    dropCollection
} = require("../../../services/qdrantService");

const router = express.Router();

/**
 * @route POST /api/embeddings/generate
 * @desc Generate embeddings for a given text (without storing)
 * @access Admin
 */
router.post("/generate", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "Text is required" });

        const embedding = await generateEmbeddings(text);
        res.status(200).json({ embedding });
    } catch (error) {
        console.error("❌ Error generating embedding:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route POST /api/embeddings/store
 * @desc Generate embeddings and store them in Qdrant
 * @access Admin
 */
router.post("/", async (req, res) => {
    try {
        const { collection, id, text, metadata } = req.body;
        if (!collection || !id || !text) {
            return res.status(400).json({ error: "Collection, ID, and text are required" });
        }

        const embedding = await generateEmbeddings(text);
        if (!embedding) throw new Error("Failed to generate embedding");

        await storeEmbedding(collection, id, embedding, metadata);
        res.status(201).json({ message: "Embedding stored successfully" });
    } catch (error) {
        console.error("❌ Error storing embedding:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route POST /api/embeddings/search
 * @desc Perform a vector search in Qdrant
 * @access Public
 */
router.post("/search", async (req, res) => {
    try {
        const { query, collection, limit = 5, minScore = 0.5 } = req.body;
        if (!query || !collection) return res.status(400).json({ error: "Query and collection are required" });

        const queryVector = await generateEmbeddings(query);
        if (!queryVector) return res.status(500).json({ error: "Failed to generate query embedding" });

        const results = await searchQdrant(queryVector, collection, limit, minScore);
        res.status(200).json(results);
    } catch (error) {
        console.error("❌ Error performing embedding search:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route DELETE /api/embeddings/:collection/:id
 * @desc Delete an embedding by ID
 * @access Admin
 */
router.delete("/:collection/:id", async (req, res) => {
    try {
        const { collection, id } = req.params;
        const success = await deleteEmbedding(collection, id);
        if (!success) return res.status(404).json({ error: "Embedding not found" });

        res.status(200).json({ message: "Embedding deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting embedding:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route DELETE /api/embeddings/collection/:collection
 * @desc Drop an entire Qdrant collection
 * @access Admin
 */
router.delete("/collection/:collection", async (req, res) => {
    try {
        const { collection } = req.params;
        await dropCollection(collection);
        res.status(200).json({ message: `Collection "${collection}" dropped successfully.` });
    } catch (error) {
        console.error("❌ Error dropping collection:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
