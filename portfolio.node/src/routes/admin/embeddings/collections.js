const express = require("express");
const router = express.Router();
const collectionMap = require("../../../utils/collections");
const {getProjected2DVectors} = require("../../../services/vectorDimensionReductionService");

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
    try {
        const collectionName = req.params.collectionName;
        const updateData = {
            lastUpdated: new Date(),
        };

        const collection = await CollectionEmbeddingSchema.findOneAndUpdate(
            { collectionName: collectionName }, 
            updateData, 
            { 
                new: true, 
                upsert: true, 
            }
        );

        res.json({ message: "success", collection: collection }); 

    } catch (error) {
        console.error("Error regenerating collection:", error);
        res.status(500).json({ message: "error", error: error.message }); 
    }
});

module.exports = router;