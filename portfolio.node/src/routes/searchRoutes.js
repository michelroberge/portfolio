const express = require("express");
const {searchQdrant} = require("../services/qdrantService");
const { generateEmbeddings } = require("../services/embeddingService");
const Page = require("../models/Page");
const BlogEntry = require("../models/BlogEntry");
const Project = require("../models/Project");
const BookChapter = require("../models/BookChapter");
const CareerTimeline = require("../models/CareerTimeline");

const router = express.Router();


router.post("/", async (req, res) => {
  const { query } = req.body;

  if (!query) return res.status(400).json({ message: "Query is required" });

  const embedding = await generateEmbeddings(query);
  if (!embedding) return res.status(500).json({ message: "Failed to generate query embedding" });

  const collections = [
    Page.collection.collectionName, 
    BlogEntry.collection.collectionName, 
    Project.collection.collectionName,
    BookChapter.collection.collectionName];

    const searchResults = await Promise.allSettled(
      collections.map(async collection => {
          const results = await searchQdrant(embedding, collection);
          return results.map(result => ({
              collection,
              score: result.score,
              vectorId: result.id
          }));
      })
  );

    const successfulResults = searchResults
        .filter(res => res.status === "fulfilled")
        .map(res => res.value)
        .flat();
      
  // Flatten results if needed
  console.log('search result', successfulResults);
  res.json(successfulResults);

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
