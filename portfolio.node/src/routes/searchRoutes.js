const express = require("express");
const {searchQdrant, generateEmbedding} = require("../services/qdrantService");
const router = express.Router();


router.post("/:collection", async (req, res) => {
    const { query } = req.body;
    const { collection } = req.params;
  
    if (!query) return res.status(400).json({ message: "Query is required" });
  
    const embedding = await generateEmbedding(query);
    if (!embedding) return res.status(500).json({ message: "Failed to generate query embedding" });
  
    const results = await searchQdrant(embedding, collection);
    res.json(results);
  });
  
  module.exports = router;
