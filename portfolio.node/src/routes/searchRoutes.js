const express = require("express");
const { searchQdrant } = require("../services/qdrantService");
const { generateEmbeddings } = require("../services/embeddingService");
const collections = require("../utils/collections");
const collectionServices = require("../utils/collectionServices");

const router = express.Router();


router.post("/", async (req, res) => {

  const { query } = req.body;

  if (!query) return res.status(400).json({ message: "Query is required" });

  const embedding = await generateEmbeddings(query);
  if (!embedding) return res.status(500).json({ message: "Failed to generate query embedding" });


  const searchResults = await Promise.allSettled(
    collections.map(async collection => {
      try {
        console.log(`searching collection ${collection.Name}`);
        const results = await searchQdrant(embedding, collection.Name);
        return results.map(result => ({
          collection: collection.Name,
          score: result.score,
          vectorId: result.id
        }));
      }
      catch (err) {
        console.err("Could not search qdrant", err);
      }
    })
  );

  const successfulResults = searchResults
    .filter(res => res.status === "fulfilled")
    .map(res => res.value)
    .sort((a, b) => b.score - a.score)
    .flat();

  const results = await Promise.allSettled(
    successfulResults.map(async result => {
      const item = await collectionServices[result.collection].getSearchResultByVectorId({ vectorId: result.vectorId });
      item.score = result.score;
      return item;
    })
  );  // link - title - excerpt - type  

  const finalizedResults = results
    .filter(res => res.status === "fulfilled")
    .map(res => res.value)
    .flat(); 
    
    res.json(finalizedResults);
});


router.post("/:collection", async (req, res) => {
  const { query } = req.body;
  const { collection } = req.params;

  if (!query) return res.status(400).json({ message: "Query is required" });

  const embedding = await generateEmbeddings(query);
  if (!embedding) return res.status(500).json({ message: "Failed to generate query embedding" });

  const results = await searchQdrant(embedding, collection);
  res.json(results);
});

module.exports = router;
