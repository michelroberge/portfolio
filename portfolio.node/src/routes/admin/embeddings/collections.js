const express = require("express");
const router = express.Router();
const collectionMap = require("../../../utils/collections");
const {getProjected2DVectors} = require("../../../services/vectorDimensionReductionService");
const { generateEmbeddings } = require("../../../services/embeddingService");
const { storeEmbedding, initCollection } = require("../../../services/qdrantService");

router.get("/", async (req, res) => {
    try {
        const collections = await collectionMap.getCollectionsWithStats();
        res.json(collections);
    }
    catch(error){
        console.error("Error fetching collections:", error);
        res.status(500).json({ message: "error", error: error.message }); 
    }
});

router.get("/:collection", async (req, res) => {
    try {
        const collectionName = req.params.collection;
        const collections = await collectionMap.getCollectionsWithStatsAsMap();
        const collection = collections[collectionName];
        // to do - add collection data
        res.json(collection);
    }
    catch(error){
        console.error(`Error fetching collection ${collectionName}:`, error);
        res.status(500).json({ message: "error", error: error.message }); 
    }
});

router.get("/:collectionName/vectors", async (req, res) => {
    const collectionName = req.params.collectionName;
    try {
      const projectedVectors = await getProjected2DVectors(collectionName);
      res.json(projectedVectors);
    }
    catch(error){
      console.error(`Error fetching collection ${collectionName}:`, error);
      res.status(500).json({ message: "error", error: error.message });
    }
});

router.post("/:collectionName/search-test", async (req, res) => {
    res.json([]);
});

router.post("/:collectionName/regenerate", async (req, res) => {
    const collectionName = req.params.collectionName;

    // 1. Init Qdrant collection (optionally drop or clear first)
    await initCollection(collectionName);
    
    // 2. Get MongoDB collection
    const collection = await collectionMap.getCollectionByName(collectionName);
    
    if (!collection) {
        return res.status(404).json({ message: "Collection not found." });
    }
    
    // 3. Get all documents from the Mongo collection
    const documents = await collection.find({});
    console.log(`documents count`, documents.length);

    // 4. Loop through each document
    for (const doc of documents) {
        try {
            const text = doc.text || doc.content || doc.body || JSON.stringify(doc); // Adjust based on your schema
            const embedding = await generateEmbeddings(text);
    
            const metadata = {
                ...doc,
                source: collectionName,
            };
    
            await storeEmbedding(collectionName, doc.vectorId, embedding, metadata);
        } catch (err) {
            console.error(`❌ Failed to process document ${doc._id}:`, err.message);
        }
    }
    
    return res.json({ message: "Embeddings regenerated", count: documents.length })
});

module.exports = router;